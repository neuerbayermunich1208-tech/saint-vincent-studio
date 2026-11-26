# Architecture (kế hoạch — Phase 1)

Trạng thái: **đề xuất**, chưa cài đặt. Phiên bản thư viện sẽ được kiểm tra lại với tài liệu chính thức lúc bắt đầu Phase 3.

## Stack đề xuất

| Lớp | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Next.js 16 (App Router)**, React 19, TypeScript | Bản mới nhất đọc được: Next.js 16.4 (06/10/2026), Turbopack mặc định, Cache Components, `proxy.ts` thay `middleware.ts`, View Transitions ổn định qua React 19.3. SSR/SSG tốt cho SEO. |
| Styling | Tailwind CSS v4 + CSS custom properties làm design tokens | Token sống trong CSS, Tailwind chỉ đọc token; không thêm UI kit. |
| Animation | **Motion** (`motion/react`) + CSS scroll-driven animations + View Transitions | Một thư viện duy nhất. Chỉ thêm GSAP nếu một cảnh cụ thể thật sự cần. Không dùng thư viện smooth-scroll khoá cuộn. |
| 3D | React Three Fiber — **chỉ** khi có model sản phẩm thật, tải động | Không tải Three.js cho trang không cần. |
| CMS + Admin | **Payload CMS 3**, chạy trong cùng app Next.js tại `/admin` | Có sẵn: drafts, versions, live preview, localization EN/VI, RBAC, upload media, SEO fields, admin responsive. Mã nguồn mở (MIT), không phí license, dữ liệu nằm trong Postgres của bạn. |
| Database | **PostgreSQL** (Supabase hoặc Neon) | Payload hỗ trợ Postgres chính thức. Backup theo ngày + point-in-time ở gói trả phí. |
| Media | Object storage S3-compatible (Supabase Storage hoặc Cloudflare R2) + `next/image` (AVIF/WebP) | R2 không tính phí băng thông ra. |
| i18n | Localization field-level của Payload cho nội dung + `next-intl` cho chuỗi giao diện | Thêm ngôn ngữ mới = thêm locale, không sửa cấu trúc. |
| Email | Resend (hoặc tương đương) | Xác nhận đăng ký, liên hệ, đơn hàng. |
| Hosting | Vercel (cần gói Pro cho website thương mại) hoặc nền tảng Node tương đương | **Cần bạn đồng ý trước khi đăng ký gói trả phí.** |

### Vì sao không chọn
- **Shopify headless:** phí giao dịch và hạn chế với cổng thanh toán Việt Nam; admin không kiểm soát được trải nghiệm nội dung như Payload.
- **Medusa:** cần server riêng, nặng cho giai đoạn đầu (over-engineering).
- **Supabase + admin tự viết:** linh hoạt nhưng phải tự làm drafts, preview, versions, phân quyền, localization. Tốn nhiều tháng hơn.

### Rủi ro đã biết
- Plugin Ecommerce của Payload đang **Beta** và chỉ có adapter Stripe tích hợp sẵn. Stripe hiện không hỗ trợ doanh nghiệp đăng ký tại
  Việt Nam (cần xác minh lại ở Phase 4). Vì vậy giỏ hàng, đơn hàng, thanh toán sẽ được thiết kế như collections riêng của dự án, với lớp
  `PaymentProvider` để cắm VNPay / MoMo / PayOS (VietQR). Chọn cổng cụ thể ở Phase 4, kiểm thử sandbox trước.

## Mô hình dữ liệu (Payload collections & globals)

**Globals:** `SiteSettings` (mode: `prelaunch` | `commerce`, feature flags, liên hệ, mạng xã hội, tiền tệ mặc định),
`Homepage` (các section dạng blocks: hero, intro, featuredCollections, featuredDesign, process, modular, journal, upcoming, closing),
`Navigation`, `Footer`.

**Collections:**
- `Products`: name*, slug*, collection(s), productType (`model_kit` | `diorama` | `lighting` | `object` | `edition` | ...), story (rich text)*,
  gallery (ordered media), video, status (`concept` | `in_development` | `available` | `archived`), visibility, SEO*. (*: localized)
  - Khối thông số theo loại (blocks, tất cả tuỳ chọn, không tự điền): `dimensions`, `scale`, `materials`, `finish`, `includedComponents`,
    `assembly` (độ khó, thời gian, file hướng dẫn), `compatibility` (liên kết module), `lighting` (nguồn sáng, công suất, nguồn điện, nhiệt độ màu, chứng nhận an toàn),
    `care`, `packaging`.
- `Variants`: product, SKU (unique), options (màu, kích thước...), price (số nguyên + mã tiền tệ; VND không có phần lẻ), compareAt, inventory, weight.
- `Collections`: tên, slug, parent (cây danh mục), mô tả, ảnh bìa, theme, thứ tự, ẩn/hiện. Thêm/sửa/ẩn mà không sửa code.
- `Releases` (Upcoming): product/collection, giai đoạn, ngày ra mắt (để trống = "To be announced"), bật đăng ký nhận tin.
- `JournalPosts`: tiêu đề, chuyên mục, nội dung, tác giả, sản phẩm liên quan, SEO.
- `AssemblyGuides`: các bước, ảnh, file PDF tải về.
- `Media`: ảnh/video, alt text bắt buộc (localized), focal point.
- `Subscribers` (newsletter, double opt-in), `Inquiries` (form liên hệ).
- Phase 4: `Customers`, `Carts`, `Orders`, `Discounts`, `Shipments`.
- `Users` (admin) với roles: `owner` (toàn quyền), `editor` (nội dung, sản phẩm), `fulfilment` (đơn hàng, tồn kho).

## Pre-launch ↔ Commerce
`SiteSettings.mode` được đọc ở server. Ở `prelaunch`: ẩn giá, giỏ, checkout, route commerce trả 404, Product Detail hiển thị nút
"Notify me". Chuyển sang `commerce` trong admin, không cần deploy lại (cache được revalidate theo tag).
Không bao giờ hiển thị "còn hàng" hay "đặt hàng thành công" khi chưa có backend thanh toán thật.

## SEO
`generateMetadata` theo từng trang từ CMS; canonical + `hreflang` en/vi/x-default; `sitemap.ts` và `robots.ts` động (bỏ qua trang bị tắt);
JSON-LD: Organization, BreadcrumbList, Article, Product (chỉ khi có giá/tình trạng thật); OG image động theo template thương hiệu.
Kiểm tra tự động: một test quét toàn bộ nội dung public và metadata để chặn các cụm từ cấm (xem BRAND_GUIDELINES.md).

## Bảo mật
Auth của Payload (HTTP-only cookies, CSRF), RBAC ở cấp collection và field, validation server-side (Zod/Payload validators),
rate limit cho form public, chống spam (Turnstile), giới hạn loại/kích thước file upload, CSP headers, không đưa secret ra client,
`npm audit` + Dependabot, log lỗi tập trung, backup DB hằng ngày.

## Hiệu năng (mục tiêu, sẽ đo — chưa đo)
Lighthouse Performance ≥ 90; LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Font qua `next/font` (subset, swap), ảnh AVIF/WebP có kích thước,
dynamic import cho phần nặng (3D, configurator), `prefers-reduced-motion`, không autoplay video có tiếng, không intro loader.

## Chi phí cần bạn duyệt (ước tính, kiểm tra lại giá trước khi đăng ký)
Hosting (Vercel Pro), Postgres (Supabase Pro hoặc Neon), email (Resend), tên miền. Giai đoạn phát triển có thể chạy hoàn toàn miễn phí
ở local và preview; chỉ cần trả phí khi đưa lên production.
