# Design System (khung — chốt sau khi chọn direction)

Phần **dùng chung** dưới đây áp dụng cho mọi direction. Màu và font cụ thể nằm trong docs/CREATIVE_DIRECTIONS.md và sẽ được
chốt vào file này khi bạn chọn hướng. Token sống trong `src/styles/tokens.css` (Phase 3) và Tailwind đọc từ đó.

## Color tokens (vai trò, không phải giá trị)
`--bg` nền chính · `--bg-2` nền phụ / ô ảnh · `--fg` chữ chính · `--fg-soft` chữ phụ · `--rule` đường kẻ ·
`--accent` một màu nhấn duy nhất (trạng thái, focus, chú thích) · `--plate` `#FDF5EA` chỉ dùng sau logo ·
Ngữ nghĩa (tách khỏi accent): `--ok`, `--warn`, `--error` cho form, đơn hàng.

## Typography
3 vai trò: `--f-display` (tiêu đề, dùng tiết chế), `--f-body` (nội dung, UI), `--f-mono` (nhãn, SKU, thông số).
Thang chữ (fluid, `clamp`): display-xl 3.4→12.5rem · display-l 2.4→5.6rem · display-m 1.7→3.1rem · h3 1.6→2rem · body 1.0625rem ·
small .875rem · label .72rem (uppercase, letter-spacing .04–.08em). Văn bản dài ≤ 65 ký tự/dòng. Tiêu đề `text-wrap: balance`.
Font tải bằng `next/font` (self-host, subset latin + vietnamese, `display: swap`). Phase 3: font hiển thị là Noto Serif Display (Bodoni Moda không có subset tiếng Việt), chữ thân Hanken Grotesk, nhãn IBM Plex Mono; đã kiểm tra dấu tiếng Việt.

## Spacing
`--s-1` .5rem · `--s-2` 1rem · `--s-3` 1.5rem · `--s-4` 2.5rem · `--s-5` 4rem · `--s-6` 7rem. Gutter ngang tối thiểu 16px (mobile), 32–40px (desktop),
cộng `env(safe-area-inset-*)`.

## Grid & breakpoints
12 cột desktop, 4 cột mobile. Breakpoints: `sm` 480 · `md` 760 · `lg` 900 · `xl` 1200 · `2xl` 1440 (max-width nội dung 1440–1480px).

## Radius
Mặc định `0`. Bo góc chỉ dùng có vai trò (pill cho nút ở C, `999px`). Không bo góc mọi card.

## Iconography
Một bộ duy nhất, nét 1.5px, góc vuông (đề xuất Lucide được tinh chỉnh hoặc bộ icon riêng). Không emoji trong UI.
Mũi tên dùng ký tự typographic (→ ↘) ở CTA.

## Buttons
Primary (đặc), Secondary (viền), Link (gạch chân). Trạng thái: default, hover, focus-visible (outline 2px accent, offset 3px),
active, disabled (opacity .4, không pointer), loading (giữ kích thước, không nhảy layout). Vùng chạm tối thiểu 44×44px.

## Motion tokens
`--dur-1` 160–180ms (hover, màu) · `--dur-2` 360–420ms (panel, menu) · `--dur-3` 800–900ms (reveal tiêu đề).
Easing: `--ease-out` cubic-bezier(.2,.7,.1,1) cho vào; `--ease` cubic-bezier(.65,0,.35,1) cho chuyển trạng thái; spring chỉ ở direction C.
Quy tắc: animate `transform`, `opacity`, `clip-path`; không animate layout. `prefers-reduced-motion` tắt mọi chuyển động.
Nội dung luôn hiển thị được khi không có animation (progressive enhancement).
