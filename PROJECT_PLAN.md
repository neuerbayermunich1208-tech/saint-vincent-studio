# Project Plan — Saint Vincent Studio

Cập nhật: 26/11/2026

## Tiến độ
| Phase | Nội dung | Trạng thái |
|---|---|---|
| 1 — Discovery & Art Direction | Kiểm tra thư mục, nghiên cứu, định vị, 3 direction, sitemap, stack, kiến trúc | ✅ Bản đầu xong |
| 2 — Interactive Design Prototype | 3 preview homepage tương tác, navigation, typography, product card, mobile, motion | ✅ Xong, đã chọn hướng lai A + B + C |
| 3 — Website Foundation | Next.js + Payload, design system, layout, core pages, i18n, DB, auth admin, CMS | ✅ Bản đầu xong (nhánh phase-3-foundation) |
| 4 — Product & Commerce | Collections, product detail, variants, tồn kho, giỏ, tài khoản, checkout, đơn hàng | ⏳ Chờ |
| 5 — Creative Enhancement | Storytelling sản phẩm, scroll animations, hotspot, page transitions, tinh chỉnh mobile | ⏳ Chờ |
| 6 — Testing & Deployment | Test chức năng, responsive, cross-browser, a11y, Lighthouse, SEO, security, chuẩn bị deploy | ⏳ Chờ |

## Quyết định đang chờ chủ thương hiệu
1. ~~Chọn visual direction~~: đã chọn hướng lai A + B + C (26/11/2026).
2. **File logo:** đã có bản ngang, đứng và biểu tượng (PNG nền trong suốt). Vẫn cần SVG/vector nếu có.
3. ~~Repository GitHub~~: đã có `saint-vincent-studio`. Nội dung trang pháp lý (bảo hành, đổi trả, vận chuyển, bảo mật) cần chủ dự án cung cấp.
4. Phase 3 trở đi cần duyệt chi phí trước khi lên production (hosting, database, email). Phát triển và preview có thể làm không tốn phí.

## Phase 3 — phạm vi dự kiến
- Khởi tạo Next.js 16 + TypeScript + Tailwind v4 + Payload 3 + Postgres (local trước).
- Token và component theo direction đã chọn; layout responsive; Home, Collections, Product Detail (pre-launch), Studio, Process, Upcoming, Contact, FAQ, legal.
- i18n EN/VI với ghi nhớ lựa chọn; VND, kiến trúc sẵn cho USD.
- Admin: sản phẩm, collection, media, homepage blocks, upcoming, journal, SEO, drafts + preview, site mode + feature flags, phân quyền.
- Newsletter (double opt-in) và form liên hệ hoạt động thật.
- Lint, typecheck, unit test, Playwright smoke test, kiểm tra cụm từ cấm, production build.

## Rủi ro
- Chưa có ảnh sản phẩm thật: website sẽ dựa nhiều vào concept. Nên lên lịch chụp ảnh trước khi ra mắt.
- Cổng thanh toán Việt Nam cần hồ sơ doanh nghiệp; nên bắt đầu đăng ký sớm (song song Phase 3).
- Logo hiện chỉ có dạng PNG vuông; ở header nhỏ wordmark khó đọc.
