/* MATE's small built-in web server and account API. No third-party packages needed. */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { promisify } = require("node:util");

const scrypt = promisify(crypto.scrypt);
const APP_DIR = __dirname;
const MAX_BODY_BYTES = 1024 * 1024;
const SESSION_LIFETIME = 30 * 24 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 30;

function loadEnvironmentFile() {
  const envFile = path.join(APP_DIR, ".env");
  if (!fs.existsSync(envFile)) return;
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
}

loadEnvironmentFile();

// On hosted services, point MATE_DATA_DIR at a persistent disk mount such as /var/data.
const DATA_DIR = path.resolve(process.env.MATE_DATA_DIR || path.join(APP_DIR, "data"));
const DATABASE_FILE = path.join(DATA_DIR, "mate-server-data.json");
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const ADMIN_TOKEN = process.env.MATE_ADMIN_TOKEN || "";
const GOOGLE_MAPS_API_KEY = process.env.MATE_GOOGLE_MAPS_API_KEY || "";
const GOOGLE_MAPS_EMBED_KEY = process.env.MATE_GOOGLE_MAPS_EMBED_KEY || "";
const sessions = new Map();
const authAttempts = new Map();
const placesRateLimits = new Map();

function nowIso() {
  return new Date().toISOString();
}

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATABASE_FILE)) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify({ version: 1, users: [], events: [] }, null, 2));
  }
}

function readDatabase() {
  ensureStorage();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
    return {
      version: 1,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return { version: 1, users: [], events: [] };
  }
}

function writeDatabase(database) {
  ensureStorage();
  const temporaryFile = `${DATABASE_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(database, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, DATABASE_FILE);
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  response.end(body);
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { error: message });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;
    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large."), { statusCode: 413 }));
        request.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });
    request.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Invalid JSON body."), { statusCode: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function checkPlacesRateLimit(request) {
  const key = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = placesRateLimits.get(key);
  if (!current || now - current.startedAt >= 60_000) {
    placesRateLimits.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= 15) return false;
  current.count += 1;
  if (placesRateLimits.size > 500) {
    for (const [address, bucket] of placesRateLimits) {
      if (now - bucket.startedAt >= 60_000) placesRateLimits.delete(address);
    }
  }
  return true;
}

function cleanText(value, maximum = 300) {
  return String(value || "").trim().slice(0, maximum);
}

function cleanEmail(value) {
  return cleanText(value, 254).toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    profile: user.profile || {}
  };
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_LIFETIME });
  return token;
}

function authenticatedUser(request, database) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return { token, user: null };
  }
  const user = database.users.find((candidate) => candidate.id === session.userId);
  return { token, user: user || null };
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = await scrypt(password, salt, 64);
  return { salt, hash: derived.toString("hex") };
}

async function passwordMatches(password, user) {
  const candidate = await hashPassword(password, user.passwordSalt);
  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = Buffer.from(candidate.hash, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function rateLimitKey(request) {
  return request.socket.remoteAddress || "unknown";
}

function checkAuthRateLimit(request) {
  const key = rateLimitKey(request);
  const current = authAttempts.get(key) || { startedAt: Date.now(), count: 0 };
  if (Date.now() - current.startedAt > LOGIN_WINDOW_MS) {
    current.startedAt = Date.now();
    current.count = 0;
  }
  current.count += 1;
  authAttempts.set(key, current);
  return current.count <= LOGIN_MAX_ATTEMPTS;
}

function safeProfile(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const allowedKeys = ["preferences", "pantry", "plan", "availability", "expenses", "drawHistory", "appearance", "lastActiveAt"];
  const result = {};
  for (const key of allowedKeys) {
    if (Object.hasOwn(value, key)) result[key] = value[key];
  }
  result.lastActiveAt = nowIso();
  return result;
}

async function handleApi(request, response, url) {
  const database = readDatabase();
  const route = url.pathname;

  if (route === "/api/health" && request.method === "GET") {
    return sendJson(response, 200, { ok: true, app: "MATE", serverTime: nowIso() });
  }

  if (route === "/api/config" && request.method === "GET") {
    // This browser key is public by design; restrict it to the deployed website and Maps Embed API.
    return sendJson(response, 200, { mapsEmbedKey: GOOGLE_MAPS_EMBED_KEY });
  }

  if (route === "/api/places/search" && request.method === "GET") {
    if (!GOOGLE_MAPS_API_KEY) return sendJson(response, 200, { enabled: false, places: [] });
    const query = cleanText(url.searchParams.get("q"), 180);
    if (query.length < 2) return sendError(response, 400, "Nhập khu vực hoặc loại cửa hàng cần tìm.");
    if (!checkPlacesRateLimit(request)) return sendError(response, 429, "Bạn tìm địa điểm hơi nhanh. Hãy thử lại sau một phút nhé.");

    const languageCode = url.searchParams.get("lang") === "en" ? "en" : "vi";
    const payload = { textQuery: query, maxResultCount: 8, languageCode };
    const latitude = Number(url.searchParams.get("lat"));
    const longitude = Number(url.searchParams.get("lng"));
    if (Number.isFinite(latitude) && Number.isFinite(longitude)
      && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      payload.locationBias = { circle: { center: { latitude, longitude }, radius: 5000 } };
    }

    const placesResponse = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.googleMapsUri"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(9000)
    });
    if (!placesResponse.ok) {
      console.error(`[MATE] Google Places returned HTTP ${placesResponse.status}.`);
      return sendError(response, 502, "Không thể lấy địa điểm lúc này. Hãy thử lại hoặc mở Google Maps.");
    }
    const result = await placesResponse.json();
    const safeMapUrl = (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === "https:" && (parsed.hostname === "google.com" || parsed.hostname.endsWith(".google.com")) ? parsed.href : "";
      } catch { return ""; }
    };
    const foundPlaces = (Array.isArray(result.places) ? result.places : []).map((place) => ({
      name: cleanText(place.displayName?.text, 140),
      address: cleanText(place.formattedAddress, 220),
      mapsUrl: safeMapUrl(place.googleMapsUri)
    })).filter((place) => place.name && place.mapsUrl);
    return sendJson(response, 200, { enabled: true, provider: "Google Maps", fetchedAt: nowIso(), places: foundPlaces });
  }

  if (route === "/api/auth/register" && request.method === "POST") {
    if (!checkAuthRateLimit(request)) return sendError(response, 429, "Thử lại sau ít phút nhé.");
    const body = await readJsonBody(request);
    const name = cleanText(body.name, 80);
    const email = cleanEmail(body.email);
    const password = String(body.password || "");
    if (name.length < 2) return sendError(response, 400, "Vui lòng nhập tên có ít nhất 2 ký tự.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendError(response, 400, "Email chưa đúng định dạng.");
    if (password.length < 8) return sendError(response, 400, "Mật khẩu cần có ít nhất 8 ký tự.");
    if (body.dataConsent !== true) return sendError(response, 400, "Vui lòng xác nhận việc lưu dữ liệu tài khoản trên máy chủ MATE.");
    if (database.users.some((user) => user.email === email)) return sendError(response, 409, "Email này đã có tài khoản. Hãy đăng nhập nhé.");

    const credentials = await hashPassword(password);
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      dataConsentAt: nowIso(),
      profile: safeProfile(body.profile)
    };
    database.users.push(user);
    writeDatabase(database);
    const token = createSession(user.id);
    return sendJson(response, 201, { user: publicUser(user), token });
  }

  if (route === "/api/auth/login" && request.method === "POST") {
    if (!checkAuthRateLimit(request)) return sendError(response, 429, "Có quá nhiều lần thử. Vui lòng đợi vài phút rồi thử lại.");
    const body = await readJsonBody(request);
    const email = cleanEmail(body.email);
    const password = String(body.password || "");
    const user = database.users.find((candidate) => candidate.email === email);
    if (!user || !(await passwordMatches(password, user))) return sendError(response, 401, "Email hoặc mật khẩu chưa đúng.");
    user.updatedAt = nowIso();
    writeDatabase(database);
    return sendJson(response, 200, { user: publicUser(user), token: createSession(user.id) });
  }

  const auth = authenticatedUser(request, database);

  if (route === "/api/auth/me" && request.method === "GET") {
    if (!auth.user) return sendError(response, 401, "Bạn chưa đăng nhập.");
    return sendJson(response, 200, { user: publicUser(auth.user) });
  }

  if (route === "/api/auth/logout" && request.method === "POST") {
    if (auth.token) sessions.delete(auth.token);
    return sendJson(response, 200, { ok: true });
  }

  if (route === "/api/profile" && request.method === "PUT") {
    if (!auth.user) return sendError(response, 401, "Bạn cần đăng nhập để đồng bộ hồ sơ.");
    const body = await readJsonBody(request);
    auth.user.profile = safeProfile(body.profile);
    auth.user.updatedAt = nowIso();
    writeDatabase(database);
    return sendJson(response, 200, { user: publicUser(auth.user), savedAt: nowIso() });
  }

  if (route === "/api/account" && request.method === "DELETE") {
    if (!auth.user) return sendError(response, 401, "Bạn cần đăng nhập để xóa tài khoản.");
    const body = await readJsonBody(request);
    if (!(await passwordMatches(String(body.password || ""), auth.user))) return sendError(response, 401, "Mật khẩu chưa đúng.");
    database.users = database.users.filter((user) => user.id !== auth.user.id);
    database.events = database.events.filter((event) => event.userId !== auth.user.id);
    writeDatabase(database);
    sessions.delete(auth.token);
    return sendJson(response, 200, { ok: true });
  }

  if (route === "/api/admin/summary" && request.method === "GET") {
    if (!ADMIN_TOKEN) return sendError(response, 503, "Quản trị viên chưa đặt MATE_ADMIN_TOKEN.");
    if (!adminAuthorized(request)) return sendError(response, 401, "Mã quản trị không đúng.");
    const activeSince = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return sendJson(response, 200, {
      userCount: database.users.length,
      accountsCreatedThisMonth: database.users.filter((user) => Date.parse(user.createdAt) >= activeSince).length,
      dataEvents: database.events.length,
      lastUpdatedAt: nowIso()
    });
  }

  if (route === "/api/admin/export" && request.method === "GET") {
    if (!ADMIN_TOKEN) return sendError(response, 503, "Quản trị viên chưa đặt MATE_ADMIN_TOKEN.");
    if (!adminAuthorized(request)) return sendError(response, 401, "Mã quản trị không đúng.");
    const safeUsers = database.users.map((user) => ({
      ...publicUser(user),
      dataConsentAt: user.dataConsentAt,
      updatedAt: user.updatedAt
    }));
    return sendJson(response, 200, { exportedAt: nowIso(), users: safeUsers, events: database.events });
  }

  return sendError(response, 404, "Không tìm thấy chức năng này.");
}

function adminAuthorized(request) {
  const header = request.headers.authorization || "";
  const suppliedToken = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expected = Buffer.from(ADMIN_TOKEN);
  const supplied = Buffer.from(suppliedToken);
  return expected.length === supplied.length && expected.length > 0 && crypto.timingSafeEqual(expected, supplied);
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendStaticFile(request, response, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const fullPath = path.resolve(APP_DIR, `.${pathname}`);
  if (!fullPath.startsWith(`${APP_DIR}${path.sep}`) && fullPath !== APP_DIR) {
    return sendError(response, 403, "Không thể truy cập tệp này.");
  }
  const allowedFiles = new Set(["index.html", "styles.css", "data.js", "expanded-recipes.js", "recipe-images.js", "app.js", "assets/mate-logo.png"]);
  const relativePath = path.relative(APP_DIR, fullPath).split(path.sep).join("/").toLowerCase();
  const isRecipeImage = /^assets\/recipes\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/.test(relativePath);
  if (!allowedFiles.has(relativePath) && !isRecipeImage) {
    return sendError(response, 404, "Không tìm thấy trang.");
  }
  fs.readFile(fullPath, (error, contents) => {
    if (error) return sendError(response, 404, "Không tìm thấy tệp.");
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(fullPath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": path.extname(fullPath) === ".html" ? "no-cache" : "public, max-age=3600"
    });
    if (request.method === "HEAD") return response.end();
    response.end(contents);
  });
}

function applySecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "geolocation=(self)");
  response.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' https://images.unsplash.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-src https://www.google.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
}

const server = http.createServer(async (request, response) => {
  applySecurityHeaders(response);
  const requestUrl = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);
  try {
    if (requestUrl.pathname.startsWith("/api/")) {
      return await handleApi(request, response, requestUrl);
    }
    if (request.method !== "GET" && request.method !== "HEAD") return sendError(response, 405, "Phương thức này không được hỗ trợ.");
    return sendStaticFile(request, response, requestUrl);
  } catch (error) {
    console.error(`[MATE] ${request.method} ${requestUrl.pathname}: ${error.message}`);
    if (!response.headersSent) sendError(response, error.statusCode || 500, error.statusCode ? error.message : "Máy chủ MATE gặp lỗi.");
    else response.destroy();
  }
});

server.listen(PORT, HOST, () => {
  ensureStorage();
  console.log(`MATE đang chạy tại http://${HOST}:${PORT}`);
  console.log(`Tài khoản người dùng được lưu trong máy chủ tại ${DATABASE_FILE}`);
  if (!ADMIN_TOKEN) console.log("Chưa đặt MATE_ADMIN_TOKEN; chức năng xuất dữ liệu dành cho quản trị viên đang khóa.");
});

function closeServer() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
