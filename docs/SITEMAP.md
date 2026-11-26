# Sitemap & Feature flags

URL có tiền tố ngôn ngữ: `/en/...` (mặc định) và `/vi/...`. Slug được dịch theo từng ngôn ngữ khi hợp lý.

## Public website
| Trang | URL (EN) | Pre-launch | Commerce |
|---|---|---|---|
| Home | `/en` | ✓ | ✓ |
| Collections (index) | `/en/collections` | ✓ | ✓ |
| Collection | `/en/collections/[slug]` | ✓ | ✓ |
| Shop (lọc toàn bộ sản phẩm) | `/en/shop` | flag `shop` | ✓ |
| Product Details | `/en/objects/[slug]` | ✓ (không giá, không nút mua) | ✓ |
| The Studio | `/en/studio` | ✓ | ✓ |
| Design Process | `/en/studio/process` | ✓ | ✓ |
| Design Journal | `/en/journal`, `/en/journal/[slug]` | flag `journal` (bật khi có ≥3 bài) | ✓ |
| Upcoming Releases | `/en/upcoming` | ✓ | ✓ |
| Contact | `/en/contact` | ✓ | ✓ |
| FAQ | `/en/faq` | ✓ | ✓ |

## Customer features
| Tính năng | URL | Flag |
|---|---|---|
| Search | `/en/search` | `search` |
| Wishlist | `/en/wishlist` (lưu cục bộ, đồng bộ khi đăng nhập) | `wishlist` |
| Cart | drawer + `/en/cart` | chỉ ở Commerce mode |
| Checkout | `/en/checkout` | chỉ ở Commerce mode |
| Account / Orders / Tracking | `/en/account`, `/en/account/orders`, `/en/track` | `accounts` |

## Legal & support
Privacy Policy, Terms & Conditions, Shipping & Delivery, Returns & Exchanges, Product Care, Assembly Instructions
(`/en/legal/[slug]`, `/en/support/[slug]`, `/en/assembly/[product]`).

## Admin
`/admin` (Payload admin, không public, không có trong navigation, `noindex`).

## Quy tắc
- Trang có flag tắt: không xuất hiện trong navigation, sitemap.xml, và trả về 404.
- Không hiển thị trang trống. Journal chỉ bật khi đã có nội dung thật.
- Navigation chính (pre-launch): Collections · The Studio · Journal (khi bật) · Upcoming · Contact.
