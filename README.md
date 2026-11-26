# Saint Vincent Studio — saintvincent.studio

Website và nền tảng thương mại cho **Saint Vincent Studio**, một *Independent Design & Manufacturing Studio*.

## Trạng thái hiện tại (25/11/2026)

**Phase 1 (Discovery & Art Direction) và Phase 2 (Interactive Design Prototype) đã có bản đầu.**
Đang chờ chủ thương hiệu chọn visual direction trước khi bắt đầu Phase 3 (website foundation).

| Hạng mục | Vị trí |
|---|---|
| Kế hoạch dự án theo phase | [PROJECT_PLAN.md](PROJECT_PLAN.md) |
| 3 creative direction (chi tiết) | [docs/CREATIVE_DIRECTIONS.md](docs/CREATIVE_DIRECTIONS.md) |
| Nghiên cứu và giới hạn nghiên cứu | [docs/RESEARCH.md](docs/RESEARCH.md) |
| Sitemap và feature flags | [docs/SITEMAP.md](docs/SITEMAP.md) |
| Kiến trúc kỹ thuật | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Quy tắc thương hiệu | [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md) |
| Design system (khung token) | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) |
| Lịch sử thay đổi | [CHANGELOG.md](CHANGELOG.md) |
| Hướng dẫn cho AI coding assistant | [CLAUDE.md](CLAUDE.md) |

## Preview trực tiếp (Phase 2)

- Direction A — The Creative Atelier: https://claude.ai/artifact/32rHC2ua77xbAZnR3GQ2UK
- Direction B — The Future of Objects: https://claude.ai/artifact/C28WXB68Dm15hNGarni8sF
- Direction C — The Collector's World: https://claude.ai/artifact/Uzsrs9j7CzSGVwv6gUWqT5

Mã nguồn preview: `previews/src/*.html` (logo được nhúng khi build bằng `python3 previews/build.py`).
Các preview là bản thiết kế tĩnh có tương tác, không phải website production.

## Cấu trúc thư mục

```
assets/brand/        Logo chính thức (bản gốc + bản resize, không chỉnh sửa nội dung)
docs/                Nghiên cứu, creative directions, sitemap
previews/            Mã nguồn 3 preview tương tác
*.md                 Tài liệu dự án
.env.example         Danh sách biến môi trường dự kiến (không chứa bí mật)
```

## Chưa có

- Chưa có repository GitHub. Khi có, toàn bộ thư mục này sẽ là commit đầu tiên.
- Chưa có ứng dụng Next.js (bắt đầu ở Phase 3, sau khi chọn direction).
- Chưa có dịch vụ trả phí nào được đăng ký.
