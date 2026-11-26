# Changelog

## 2026-11-27 — Dọn trang chủ và khung ảnh trước khi lên production
- Bỏ mục "Lantern Study, taken apart" khỏi trang chủ (giữ component). Hiệu ứng tiêu đề hero còn 400 ms, giãn cách 60 ms.
- "The Corner" chuyển sang Archived, bỏ nổi bật, ẩn khỏi bảng phát hành (seed:product làm việc này). Sản phẩm Archived không còn trang công khai.
- Ảnh: hero 2:1 tràn viền trên mobile; ảnh mặt trước 2:1 của gallery tách riêng ở đầu, các ảnh dọc còn lại vuốt ngang theo đúng tỷ lệ gốc (không viền trống); dải chi tiết trang chủ dùng tỷ lệ gốc, lưới 5/4/3. Chất lượng ảnh 85 (90 cho gallery và lightbox) để nét trên màn hình 2x.

## 2026-11-26 — Sản phẩm đầu tiên: Saint Vincent Mini (SM-01 + SM-02)
- Migration `product_page_fields` cho các trường mới: photoNote, cardImage, planImage, detailImages, layout (modules/notes), specs.extra; Homepage: heroLayout, heroLabel, heroNote, heroProduct, detailStrip.
- Seed riêng `npm run seed:product -- <thư mục ảnh>` (`src/seed/products/supercar-street-food.ts`): chạy lại được, ảnh đã có (theo tên file) thì dùng lại; alt EN/VI mô tả đúng cảnh trong ảnh; 11 hotspot trên ảnh mặt bằng; chỉ thông số công khai (không giá, tồn kho, ngày, tỷ lệ, vật liệu, cân nặng, chiều cao quầy). Ảnh không commit vào git.
- Trang chủ: hero dạng rộng (ảnh 2:1 giữ nguyên khung, không cắt nhãn SM-01/SM-02, tiêu đề và lede bên dưới), khối thiết kế nổi bật dùng ảnh mặt bằng + hotspot + nút "View the piece", dải chi tiết 3 ảnh (lưới 7/5 trên desktop, vuốt ngang scroll-snap trên mobile). Chú thích hero lấy từ caption ảnh thay vì "Fig. 01 — Lantern Study" cố định.
- Trang sản phẩm: gallery cột 1–7 cuộn tự nhiên, thông tin cột 8–12 sticky; ảnh giữ tỷ lệ gốc. Mobile: vuốt ngang có bộ đếm "1 / 9", thông tin nằm ngay dưới gallery, câu chuyện sau. Lightbox bằng `<dialog>` (Esc đóng, giữ focus bên trong, không khoá cuộn trang, phím ←/→). Dòng ghi chú prototype dưới gallery. Thêm mục Mặt bằng (hotspot), Chi tiết, sơ đồ "Two bases, one street" vẽ bằng SVG từ layout.modules/notes. Bảng thông số hiển thị specs.extra và danh sách "Trong hộp".
- Thẻ sản phẩm và ảnh chia sẻ dùng cardImage khi có.
- Hiệu năng: logo có `sizes` (trước đây tải bản 3840px), font hiển thị chỉ một độ đậm tĩnh (font tải xuống giảm ~190→108 KB trang EN, ~410→210 KB trang VI), font mono không preload, ảnh gallery ngoài màn hình trên mobile không tải sớm (9→3 ảnh lúc tải trang).
- Ảnh media local được chuyển thành đường dẫn tương đối cho next/image; cho phép host Vercel Blob.
- `check:brand` trước đây không chạy trên Windows (so sánh đường dẫn sai); đã sửa.

## 2026-11-26 — Phase 4: bán hàng (bản đầu)
- Chủ dự án chọn payOS (VietQR) làm cổng thanh toán online đầu tiên.
- Collection **Orders** (nhóm Shop): khách, địa chỉ, dòng sản phẩm chụp lại giá lúc đặt, tổng tiền, trạng thái, thông tin payOS. Huỷ/hoàn đơn tự trả tồn kho.
- Site settings → Checkout: bật/tắt payOS, chuyển khoản thủ công (kèm số tài khoản), COD; phí vận chuyển cố định và mức miễn phí (để trống = studio xác nhận sau).
- Giỏ hàng trên trình duyệt, nút "Thêm vào giỏ" trên trang sản phẩm (chỉ khi Commerce + Available + có giá), trang /cart, /checkout, /order/[mã].
- Máy chủ luôn tính lại giá, kiểm tra tồn kho và tổng tiền khách đã thấy trước khi tạo đơn.
- payOS: tạo link thanh toán có chữ ký, webhook `/api/payos/webhook` kiểm tra chữ ký rồi hỏi lại payOS trước khi đánh dấu Paid.
- Migration `orders_checkout`. Hướng dẫn: docs/PAYOS.md. Thêm 6 test cho giá giỏ hàng và chữ ký payOS.

## 2026-11-26 — Chuẩn bị deploy Vercel
- Ảnh lưu ở Vercel Blob (`@payloadcms/storage-vercel-blob`), có migration cho cột mới của Media.
- `vercel.json` + script `build:vercel` (migration qua kết nối trực tiếp, vùng Singapore).
- Mặc định `noindex` cho tới khi bật `NEXT_PUBLIC_ALLOW_INDEXING`; địa chỉ site lấy từ Vercel nếu chưa có tên miền.
- Admin cho phép cookie đăng nhập từ các địa chỉ Vercel của dự án.
- Nút nạp nội dung mẫu trong admin (chủ, chỉ khi trống); seed tách thành `src/seed/content.ts` + `run.ts`.
- Hướng dẫn: docs/DEPLOY_VERCEL.md.

## 2026-11-26 — Phase 3: nền tảng website
- Chủ dự án chọn hướng lai: khung A Atelier, trang sản phẩm/modular theo B Objects, cơ chế sưu tầm của C Collector (số catalogue, danh sách lưu, bảng phát hành không đếm ngược).
- Dựng Next.js 16.4 App Router + TypeScript + Tailwind v4 + token riêng; Payload CMS 3.93 nhúng trong app (`/admin`, REST `/api`) trên PostgreSQL.
- Song ngữ EN (mặc định) / VI bằng next-intl, có tiền tố `/en` `/vi`; nội dung CMS bản địa hoá theo trường.
- Collections: Products (biến thể, thông số, hotspot, drafts), Product Collections, Releases, Journal, Pages, Media, Subscribers, Inquiries, Users (vai trò owner/editor/fulfilment).
- Globals: Homepage, Site Settings (chế độ prelaunch/commerce và cờ tính năng).
- Font hiển thị đổi sang Noto Serif Display vì Bodoni Moda không có bộ ký tự tiếng Việt.
- SEO: canonical, hreflang, JSON-LD Organization/Breadcrumb/Article; schema Product chỉ bật khi đang bán thật và có giá. Sitemap và robots động.
- Form đăng ký nhận tin và liên hệ: server action, zod, honeypot, giới hạn tần suất; lưu vào CMS.
- Trang pháp lý/hỗ trợ được seed ở dạng bản nháp, chờ nội dung thật từ chủ dự án.
- Kiểm thử: lint, typecheck, vitest, kiểm tra từ ngữ thương hiệu, production build; chụp 1440px và 390px.
- Ghi chú `npm audit`: còn cảnh báo ở happy-dom (phụ thuộc của lexical headless, chờ upstream) và esbuild/drizzle-kit (chỉ dùng khi phát triển).

## 2026-11-25 — Phase 1 & 2 (bản đầu)
- Kiểm tra thư mục dự án: chưa có source code hay repository. Khởi tạo cấu trúc tài liệu.
- Lưu logo chính thức vào `assets/brand/` (bản gốc 1254×1254 PNG, cùng các bản resize WebP/PNG 1024/512/256/128, giữ nguyên tỷ lệ và màu).
- Nghiên cứu xu hướng và công nghệ (xem docs/RESEARCH.md, ghi rõ nguồn truy cập được và không được).
- Viết định vị thương hiệu, sitemap, kế hoạch kiến trúc và stack.
- Dựng 3 preview tương tác (A Atelier, B Objects, C Collector), song ngữ EN/VI, kiểm tra ở 1440px và 390px: không tràn ngang, không lỗi console.
