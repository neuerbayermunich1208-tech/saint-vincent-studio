# Nghiên cứu — Phase 1

Ngày thực hiện: 25/11/2026.

## Phạm vi truy cập (minh bạch)

Phiên làm việc có công cụ tìm kiếm web và công cụ đọc trang. Kết quả thực tế:

| Nguồn | Truy cập được? | Ghi chú |
|---|---|---|
| Webflow — *8 web design trends to watch in 2026* (cập nhật 23/12/2025) | Có, đã đọc | Danh sách xu hướng bên dưới |
| Figma — *Top web design trends for 2026* | Có, đã đọc | Danh sách xu hướng bên dưới |
| Awwwards — trang e-commerce winners | Có, nhưng là snapshot cũ | Chỉ thấy các site 11/2023–06/2024; không xem được Site of the Day hiện tại |
| Next.js blog (16, 16.4) | Có, đã đọc | Dùng cho quyết định stack |
| Payload CMS docs (Ecommerce plugin) | Có, đã đọc | Dùng cho quyết định CMS |
| SiteInspire, Behance, Dribbble, Godly, Land-book, CSS Design Awards, Minimal Gallery | **Không** | Chưa truy cập trong phiên này |
| Instagram web design showcases | **Không** | Instagram yêu cầu đăng nhập, không truy cập được |
| Website Teenage Engineering, Nothing, LEGO, Kith, Porsche Design, FLOS, Buster + Punch | **Không truy cập trực tiếp** | Phân tích bên dưới dựa trên kiến thức nền đến thời điểm huấn luyện, **không phải** từ việc xem website hiện tại. Giao diện thực tế có thể đã thay đổi. |

## Xu hướng 2026 đọc được

**Webflow:** proprietary effects & styles; art converging with advanced UI; minimalism in copy; the TL;DR experience;
explosion of color; dynamic text treatments; guided scrolling; the infinite canvas.

**Figma:** 3D & immersive elements; experimental navigation; vibrant palettes; bold typography; dark mode; motion design;
gamified design; neumorphism; retrofuturism; maximalism; collage; neo-brutalism / anti-design; sustainable web design.

**Awwwards e-commerce (snapshot cũ):** các tag lặp lại là typography, fullscreen, horizontal layout, storytelling,
transitions, video. Các site thấy được: Daylight, Bored Cow, Raymond Weil × Basquiat, Hopaal, KidSuper World, Mason Garments.

### Điều rút ra cho Saint Vincent
- **Nên dùng:** typography khổ lớn có cá tính (dynamic text), guided scrolling có chủ đích (sticky storytelling, exploded view),
  copy ngắn, chuyển động riêng của thương hiệu thay vì hiệu ứng thư viện có sẵn.
- **Dùng có chọn lọc:** 3D/immersive chỉ khi có asset sản phẩm thật (Phase 5); infinite canvas phù hợp cho configurator module sau này.
- **Tránh:** neumorphism, maximalism và anti-design (dễ làm thương hiệu trông nghiệp dư hoặc mau lỗi thời);
  "explosion of color" (đi ngược tính timeless của logo đen–kem).
- **Sustainable web design** trùng với yêu cầu hiệu năng: ít JS, ảnh tối ưu, không video nặng tự phát.

## Phân tích thương hiệu tham khảo (từ kiến thức nền, chưa xác minh trên site hiện tại)

| Thương hiệu | Điều đáng học | Áp dụng |
|---|---|---|
| Teenage Engineering | Ngôn ngữ kỹ thuật vui, sản phẩm trên nền trơn, thông số trình bày như một phần của thiết kế | Direction B: spec rows, mã sản phẩm |
| Nothing | Hệ thống nhận diện chặt (dot-matrix, đơn sắc + 1 màu nhấn), nhất quán trên mọi điểm chạm | Kỷ luật token, một màu nhấn duy nhất |
| LEGO | Hệ thống module, hướng dẫn lắp ráp, cộng đồng và "set number" | Modular Universe, catalogue number, assembly guides |
| Kith | Drop culture, editorial lookbook, tạo mong đợi trước ngày ra mắt | Upcoming drops (không countdown giả) |
| Porsche Design | Tỷ lệ, khoảng trắng, chất liệu được kể như kỹ thuật | Trang sản phẩm như "tác phẩm" |
| FLOS | Đèn được kể bằng nhà thiết kế, ánh sáng và không gian | Lighting Objects: story + thông số ánh sáng thật |
| Buster + Punch | Chi tiết cận cảnh, kim loại, cá tính mạnh, phụ kiện có hệ thống | Close-up, hotspot chi tiết |

Không sao chép giao diện, mã nguồn, hình ảnh hay nhận diện của bất kỳ thương hiệu nào ở trên.

## Việc nên làm tiếp
Khi có thời gian, chủ thương hiệu hoặc một phiên có trình duyệt nên lưu 10–15 ảnh chụp từ Godly, SiteInspire và Instagram
vào `docs/references/` để moodboard có nguồn thật.
