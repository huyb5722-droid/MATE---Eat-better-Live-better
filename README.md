# MATE — app ăn uống thông minh cho sinh viên

MATE là ứng dụng web tiếng Việt và tiếng Anh giúp sinh viên lên thực đơn, dùng hết đồ trong tủ lạnh, theo dõi ngân sách và tìm nơi mua đồ ăn gần đó.

## Mở MATE trên máy tính

1. Cài **Node.js 18 trở lên** nếu máy chưa có. Trang tải chính thức: [nodejs.org](https://nodejs.org/).
2. Mở Visual Studio Code và chọn **File → Open Folder…**.
3. Chọn đúng thư mục `outputs/MATE`.
4. Cách đơn giản nhất: mở thư mục trong File Explorer rồi nhấp đúp `Run-MATE.bat`. Tệp sẽ mở máy chủ và trình duyệt cho bạn.
5. Hoặc trong VS Code, chọn **Terminal → New Terminal**, nhập `npm start` rồi nhấn Enter.
6. Khi Terminal hiện `MATE đang chạy tại http://127.0.0.1:4173`, mở địa chỉ đó trong trình duyệt.

Không cần cài thêm thư viện bằng npm. MATE dùng Node.js tích hợp sẵn để chạy máy chủ. Tệp `.env` và mã quản trị **không bắt buộc** để mở app, đăng ký tài khoản, lên thực đơn hoặc ghi chi tiêu.

## Có gì trong app

- Trang tổng quan với ngân sách, món hôm nay, gợi ý tiết kiệm và lối tắt.
- Lịch thực đơn tuần; đánh dấu ngày bận/rảnh để ưu tiên món nhanh hoặc món nấu trước.
- 203 công thức song ngữ, có định lượng, các bước nấu và ảnh món ăn được lưu sẵn trong ứng dụng.
- Tủ hơn 50 nguyên liệu và gia vị, tìm món từ nguyên liệu có sẵn, xem món còn thiếu gì và chi phí dự kiến.
- Túi mù flashcard để rút nguyên liệu và nhận gợi ý món ăn.
- Theo dõi khoản chi, ngân sách tháng và cảnh báo khi gần hoặc vượt mức.
- Tìm chợ, cửa hàng thực phẩm, siêu thị, quán ăn qua Google Maps; cho phép chia sẻ vị trí hoặc nhập khu vực.
- Có thể hiển thị danh sách địa điểm gần đó ngay trong app khi quản trị viên cấu hình Google Places API; nếu chưa cấu hình, MATE vẫn mở tìm kiếm Google Maps.
- Hồ sơ khẩu vị, số người ăn, dị ứng/nguyên liệu cần tránh, điều kiện nấu nướng và cỡ chữ.
- Mascot có thể kéo đến chỗ thuận tay; chạm mascot để mở nhanh các trang.
- Tạo tài khoản, đăng nhập, đồng bộ hồ sơ; hỗ trợ giao diện tiếng Việt và tiếng Anh.

## Tài khoản và dữ liệu

Khi đăng ký, tên, email và hồ sơ trong app được gửi về máy chủ đang chạy MATE. Mật khẩu được băm bằng `scrypt` trước khi lưu; máy chủ không lưu mật khẩu dạng đọc được. Dữ liệu máy chủ được ghi trong `data/mate-server-data.json` (hoặc thư mục do `MATE_DATA_DIR` chỉ định) và không được phục vụ công khai bởi web server.

Khi chạy trên máy cá nhân, máy tính của bạn đang là máy chủ và chỉ trình duyệt trên máy đó kết nối được theo cấu hình mặc định. Muốn người khác dùng qua Internet, quản trị viên cần triển khai Node.js lên máy chủ có HTTPS và ổ đĩa lưu trữ bền vững. Không đưa tệp `.env` hoặc mã quản trị lên GitHub.

## Đưa MATE lên Internet bằng Render

Các bước dưới đây tạo một website có đường dẫn công khai dạng `mate-...onrender.com`. Render là một lựa chọn dễ bắt đầu; bạn cũng có thể dùng dịch vụ lưu trữ Node.js khác nếu dịch vụ đó hỗ trợ máy chủ Node và ổ lưu trữ bền vững.

1. Tạo tài khoản GitHub và một repository mới. Tải **các tệp bên trong thư mục `outputs/MATE`** lên repository (trong đó phải thấy `package.json`, `server.js`, `index.html` ở cấp đầu tiên). Để repository ở chế độ riêng tư nếu bạn muốn.
2. Tạo tài khoản Render, kết nối GitHub, chọn **New → Web Service**, rồi chọn repository MATE.
3. Điền cấu hình: **Build Command** là `npm install`; **Start Command** là `npm start`. Nếu Render hỏi thư mục gốc, để trống khi repository chứa trực tiếp các tệp MATE.
4. Trong **Advanced → Environment Variables**, tự tạo hai biến `HOST` với giá trị `0.0.0.0` và `MATE_ADMIN_TOKEN` với một chuỗi bí mật dài, khó đoán. Hai biến này **không có sẵn trong README hoặc trong danh sách tệp**; bạn nhập chúng ở Render Dashboard. Nếu dịch vụ đã tạo rồi: mở dịch vụ MATE → **Environment** ở thanh bên → **+ Add Environment Variable**. Thêm mỗi biến thành một dòng riêng. `MATE_ADMIN_TOKEN` là mã riêng cho API quản trị, không phải mật khẩu tài khoản người dùng. Không đăng mã này lên GitHub hay gửi cho người dùng. Render tự cung cấp biến `PORT`, bạn không cần thêm.
5. Trong phần thêm ổ lưu trữ (**Persistent Disk**), đặt **Mount Path** là `/var/data`. Sau đó thêm biến `MATE_DATA_DIR` với giá trị `/var/data`. Máy chủ sẽ ghi dữ liệu tài khoản vào ổ này.
6. Tạo dịch vụ và chờ Render báo **Live**. Mở đường dẫn `onrender.com` mà Render cấp để xem website.

**Bật danh sách cửa hàng gần đó:** Trong Google Cloud, bật Places API và tạo khóa API. Thêm khóa ở Render Dashboard → dịch vụ MATE → **Environment** với tên `MATE_GOOGLE_MAPS_API_KEY`. Giới hạn khóa chỉ dùng Places API và đặt giới hạn sử dụng/ngân sách. MATE giữ khóa ở máy chủ, không đưa khóa vào JavaScript phía trình duyệt. Google yêu cầu website có Điều khoản sử dụng và Chính sách quyền riêng tư công khai khi dùng Places API.

**Chi phí và dữ liệu:** Render cấp đường dẫn `onrender.com` và HTTPS cho dịch vụ web. Tuy nhiên, ổ lưu trữ bền vững chỉ dùng được với máy chủ trả phí; gói miễn phí không giữ được tệp dữ liệu qua lần khởi động/triển khai lại. Render tính phí ổ đĩa theo dung lượng và tính riêng máy chủ, vì vậy hãy xem giá đang hiển thị trong tài khoản trước khi xác nhận. Ổ đĩa gắn với một máy chủ đơn; bản MATE hiện tại phù hợp làm bản trình diễn/nhóm nhỏ, chưa phải cấu hình cơ sở dữ liệu để mở rộng lượng người dùng lớn.

Bạn có thể dùng địa chỉ `onrender.com` trước. Nếu muốn tên miền riêng như `mateapp.vn`, cần mua tên miền, thêm tên miền đó trong phần **Custom Domains** của Render và làm theo hướng dẫn cấu hình DNS trên màn hình.

Trước khi mời người dùng thật đăng ký, hãy bổ sung trang Chính sách quyền riêng tư và thông tin liên hệ của nhóm phát triển, vì tên, email và hồ sơ người dùng được gửi đến máy chủ MATE.

### Tạo mã quản trị (không bắt buộc)

Mã này chỉ để gọi API thống kê/xuất dữ liệu quản trị, không phải mã đăng nhập cho người dùng.

1. Trong VS Code Explorer, sao chép `.env.example` và đổi tên bản sao thành `.env`.
2. Mở `.env` và điền một chuỗi riêng vào `MATE_ADMIN_TOKEN=`.
3. Lưu tệp, dừng máy chủ bằng `Ctrl+C`, rồi chạy lại `npm start`.

Các đường dẫn quản trị là `GET /api/admin/summary` và `GET /api/admin/export`; gửi mã trong header `Authorization: Bearer <mã-quản-trị>`. Đừng chia sẻ mã này trong form, ảnh chụp màn hình hoặc tin nhắn công khai.

## Lưu ý về Maps, giá và sức khỏe

- Bản đồ tương tác trong trang “Quanh bạn” cần bật **Maps Embed API** và đặt `MATE_GOOGLE_MAPS_EMBED_KEY` trong biến môi trường của máy chủ (Render: **Environment**). Nếu chưa có khóa này, MATE giữ bản đồ minh họa và vẫn mở được Google Maps qua nút tìm kiếm.
- Khóa nhúng bản đồ được gửi đến trình duyệt để tải iframe. Hãy tạo khóa riêng chỉ dùng cho Maps Embed API, giới hạn API key vào Maps Embed API và đặt website restrictions cho tên miền triển khai của bạn. Không dùng khóa quản trị hoặc khóa Places phía máy chủ làm khóa nhúng.
- Khi chạy local, cho phép referrer `http://localhost:4173/*`; trên Render, thêm hostname HTTPS chính xác của dịch vụ. Sau khi thêm biến môi trường, khởi động lại dịch vụ để MATE tải cấu hình mới.
- Nếu chưa cấu hình Places API, nút Google Maps mở kết quả tìm kiếm theo khu vực. Khi đã cấu hình `MATE_GOOGLE_MAPS_API_KEY`, MATE có thể truy vấn tên và địa chỉ địa điểm gần đó. Google Places không cung cấp giá từng mặt hàng tạp hóa; muốn có giá thật theo cửa hàng cần được cửa hàng/nhà cung cấp cấp API hoặc dữ liệu sản phẩm của họ.
- Giá trong danh mục nguyên liệu và món ăn hiện là ước tính để lập kế hoạch, không phải báo giá trực tiếp. Google Places có thể cung cấp mức giá tổng quát cho một số địa điểm, thường là quán ăn, chứ không phải giá của từng nguyên liệu.
- Cảnh báo tránh nguyên liệu dựa trên nhãn công thức mẫu. Người bị dị ứng nặng cần kiểm tra nhãn sản phẩm và xác nhận thành phần với nơi bán.
- Ảnh món ăn được lưu trong ứng dụng, có thêm bộ ảnh minh họa riêng theo nhóm món và đã chỉnh lại việc ghép ảnh để hạn chế dùng chung một ảnh; ảnh không tải được sẽ hiện biểu tượng món ăn thay vì khung ảnh hỏng.

### Ảnh món ăn

Ảnh được lưu cục bộ trong `assets/recipes` để hiển thị ổn định khi mất mạng. Những món có ảnh chụp phù hợp dùng ảnh thật; món chưa tìm được ảnh đáng tin cậy tiếp tục dùng minh họa theo nhóm. Ảnh Commons có tên tác giả, giấy phép và liên kết nguồn trong giao diện. Ảnh chỉ được ghép với món cùng loại sau khi kiểm tra nội dung, tránh tự động dùng kết quả chỉ vì tên gần giống.

## Cấu trúc tệp

- `index.html` — bố cục các trang và biểu mẫu.
- `styles.css` — màu sắc, chữ, responsive và mascot.
- `data.js` — danh mục nguyên liệu và công thức mẫu.
- `app.js` — điều hướng, tìm kiếm, lên lịch, tính toán và song ngữ.
- `server.js` — máy chủ web, tài khoản và lưu dữ liệu.
- `data/` — tự tạo khi máy chủ chạy lần đầu; chứa dữ liệu tài khoản và hồ sơ.
