"use strict";

// Imports reusable recipe photos only when file titles match the dish; otherwise keeps the safe category photo.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appDir = __dirname;
const assetDir = path.join(appDir, "assets", "recipes");
const manifestPath = path.join(appDir, "recipe-images.js");
const userAgent = "MATE-StudentMealPlanner/1.0 (recipe photo and attribution importer)";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const blockedTitleTerms = /\b(?:book|guide|document|receipt|report|manual|catalog|newsletter|diagram|chart|map|poster|logo|screenshot|scan|cover|worksheet|collage|illustration|drawing|painting|cartoon|anime|horror|blood|corpse|medical|surgical|pathology|anatomy)\b/i;
const ignoredTitleTerms = new Set(["and", "with", "from", "the", "for", "of", "in", "on", "a", "an", "to", "at", "style", "quick", "easy", "homemade", "vietnamese"]);

function titleTokens(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !ignoredTitleTerms.has(word));
}

function titleMatchesRecipe(title, recipe) {
  if (blockedTitleTerms.test(title)) return false;
  const expected = new Set([...titleTokens(recipe.en), ...titleTokens(recipe.vi)]);
  const actual = new Set(titleTokens(title));
  const titleText = String(title).toLowerCase();
  const expectedText = (recipe.en + " " + recipe.vi).toLowerCase();

  // Reject obvious dish-type mismatches even when common words such as “tomato” match.
  if (/\b(?:soup|stew|broth|porridge)\b/.test(titleText)
      && /\b(?:pasta|spaghetti|sandwich|wrap|stir[- ]?fry)\b/.test(expectedText)) return false;
  if (/\b(?:cake|cookie|mooncake|pastry|dessert)\b/.test(titleText)
      && /\b(?:sandwich|baguette|bread|banh mi)\b/.test(expectedText)) return false;
  if (recipe.tags?.includes("vegetarian")
      && /\b(?:beef|pork|chicken|fish|shrimp|seafood|meat)\b/.test(titleText)) return false;
  if (/\b(?:statue|church|temple|jesus|landscape|building|monument)\b/.test(titleText)) return false;

  const shared = [...expected].filter((word) => actual.has(word)).length;
  // A two-word overlap often returns a different recipe with a common ingredient;
  // uncertain matches should stay illustrated until a person confirms them.
  return shared >= Math.min(3, expected.size);
}

function loadRecipes() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(appDir, "data.js"), "utf8"), context);
  vm.runInNewContext(fs.readFileSync(path.join(appDir, "expanded-recipes.js"), "utf8"), context);
  return context.window.MATE_DATA.recipes.map((recipe) => ({
    id: recipe.id,
    vi: recipe.name?.vi || "",
    en: recipe.name?.en || "",
    tags: [...(recipe.tags || [])],
  }));
}

function allowedLicense(label) {
  return /^(?:CC0|PDM|Public domain)/i.test(label)
    || /^CC BY(?:-SA)?\s+\d+(?:\.\d+)?$/i.test(label);
}

function htmlToText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidImage(bytes, extension, contentType = "") {
  if (!contentType.toLowerCase().startsWith("image/")) return false;
  if (extension === ".jpg" || extension === ".jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (extension === ".png") {
    return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (extension === ".webp") {
    return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

async function search(query, recipe) {
  const titleQuery = titleTokens(query).slice(0, 6).map((word) => `intitle:${word}`).join(" ");
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: titleQuery || `${query} food`,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: "480",
    format: "json",
  });
  let payload;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok) {
      payload = await response.json();
      break;
    }
    if (![429, 503].includes(response.status) || attempt === 4) {
      throw new Error(`Image search returned HTTP ${response.status}`);
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000 + 1000
      : 15000 * (attempt + 1);
    console.warn(`Image search is rate-limited; retrying in ${Math.ceil(waitMs / 1000)} seconds.`);
    await sleep(waitMs);
  }
  return Object.values(payload.query?.pages || []).flatMap((page) => {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl || !titleMatchesRecipe(page.title || "", recipe)) return [];
    const license = htmlToText(info.extmetadata?.LicenseShortName?.value || "");
    const extension = path.extname(new URL(info.thumburl).pathname).toLowerCase();
    if (!allowedLicense(license) || ![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) return [];
    return [{
      title: page.title || "",
      thumbnail: info.thumburl,
      sourceUrl: info.descriptionurl || "",
      creator: htmlToText(info.extmetadata?.Artist?.value || "") || "Creator not listed",
      license,
      licenseUrl: info.extmetadata?.LicenseUrl?.value || "",
      extension,
    }];
  });
}

async function searchRecipe(recipe) {
  const targetedQueries = {
    "x033": ["Vietnamese sour fish soup", "fish pineapple tomato soup"],
    "x040": ["chicken shiitake glass noodle soup", "glass noodles chicken mushroom soup"],
    "x052": ["Vietnamese braised basa fish pepper", "braised fish black pepper"],
    "x065": ["enoki mushroom cabbage rolls", "cabbage rolls with enoki", "enoki mushrooms", "cabbage rolls", "enoki mushroom dish"],
    "x130": ["Vietnamese baguette skillet pizza", "baguette pizza"],
  };
  const queries = [...new Set([recipe.en, recipe.vi, ...(targetedQueries[recipe.id] || [])].filter(Boolean))];
  for (const query of queries) {
    try {
      const results = await search(query, recipe);
      if (results.length) return results;
    } catch (error) {
      console.warn(`Search warning for ${recipe.id}: ${error.message}`);
    }
    await sleep(6500);
  }
  return [];
}

function loadExistingManifest() {
  if (!fs.existsSync(manifestPath)) return {};
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(manifestPath, "utf8"), context);
  return context.window.MATE_RECIPE_IMAGES || {};
}

async function main() {
  const recipes = loadRecipes();
  if (recipes.length !== 203) throw new Error(`Expected 203 recipes, found ${recipes.length}.`);
  fs.mkdirSync(assetDir, { recursive: true });
  console.log(`Finding separate images for ${recipes.length} dishes...`);

  const manifest = loadExistingManifest();
  const replaceFlagIndex = process.argv.indexOf("--replace-fallback");
  const replaceFallbackIds = replaceFlagIndex >= 0
    ? new Set(process.argv.slice(replaceFlagIndex + 1).filter((value) => !value.startsWith("--")))
    : new Set();
  if (replaceFlagIndex >= 0 && replaceFallbackIds.size === 0) {
    throw new Error("Usage: node download-recipe-images.js --replace-fallback <recipe-id> [recipe-id ...]");
  }
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  for (const id of replaceFallbackIds) {
    if (!recipesById.has(id)) throw new Error(`Unknown recipe id: ${id}`);
    if (!manifest[id]?.fallback) throw new Error(`Recipe ${id} does not currently use an illustrative fallback image.`);
  }
  const usedSourcePages = new Set(Object.values(manifest).map((item) => item.sourceUrl).filter(Boolean));
  const recipesToSearch = recipes.filter((recipe) => replaceFallbackIds.has(recipe.id)
    || !manifest[recipe.id]
    || !fs.existsSync(path.join(assetDir, path.basename(manifest[recipe.id].src || ""))));
  const candidateLists = new Map();
  console.log(`Searching for photos for ${recipesToSearch.length} remaining dishes (one request at a time).`);
  for (const [index, recipe] of recipesToSearch.entries()) {
    candidateLists.set(recipe.id, await searchRecipe(recipe));
    if ((index + 1) % 10 === 0 || index + 1 === recipesToSearch.length) {
      console.log(`Searched ${index + 1}/${recipesToSearch.length} remaining dishes.`);
    }
  }

  const misses = [];
  for (const [index, recipe] of recipes.entries()) {
    const existing = manifest[recipe.id];
    if (existing && fs.existsSync(path.join(assetDir, path.basename(existing.src || ""))) && !replaceFallbackIds.has(recipe.id)) continue;
    const candidates = candidateLists.get(recipe.id) || [];
    for (const candidate of candidates) {
      if (candidate.sourceUrl && usedSourcePages.has(candidate.sourceUrl)) continue;
      if (candidate.sourceUrl) usedSourcePages.add(candidate.sourceUrl);
      try {
        const response = await fetch(candidate.thumbnail, {
          headers: { "User-Agent": userAgent },
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw new Error(`Image returned HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length < 4000 || !isValidImage(bytes, candidate.extension, response.headers.get("content-type") || "")) {
          throw new Error("Downloaded file is not a valid image");
        }
        const fileName = `${recipe.id}${candidate.extension}`;
        fs.writeFileSync(path.join(assetDir, fileName), bytes);
        manifest[recipe.id] = {
          src: `/assets/recipes/${fileName}`,
          title: candidate.title,
          creator: candidate.creator,
          license: candidate.license,
          licenseUrl: candidate.licenseUrl,
          sourceUrl: candidate.sourceUrl,
        };
        break;
      } catch (error) {
        if (candidate.sourceUrl) usedSourcePages.delete(candidate.sourceUrl);
      }
    }
    if (!manifest[recipe.id] || (replaceFallbackIds.has(recipe.id) && manifest[recipe.id].fallback)) {
      misses.push(`${recipe.id} | ${recipe.vi} | ${recipe.en}`);
    }
    if ((index + 1) % 10 === 0 || index + 1 === recipes.length) {
      console.log(`Downloaded ${Object.keys(manifest).length}/${recipes.length} images.`);
    }
    await sleep(350);
  }

  if (Object.keys(manifest).length === 0) {
    throw new Error("No images could be downloaded. Check the internet connection and run this file again.");
  }
  fs.writeFileSync(manifestPath, `window.MATE_RECIPE_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`, "utf8");
  const missesPath = path.join(appDir, "recipe-image-misses.txt");
  if (misses.length) fs.writeFileSync(missesPath, `${misses.join("\n")}\n`, "utf8");
  else if (fs.existsSync(missesPath)) fs.unlinkSync(missesPath);
  console.log(`Saved ${Object.keys(manifest).length} images and their credits. ${misses.length} dishes need a later retry.`);
}

main().catch((error) => {
  console.error(`Image import stopped: ${error.message}`);
  process.exitCode = 1;
});
