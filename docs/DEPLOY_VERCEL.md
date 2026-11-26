# Đưa website lên Vercel

Cập nhật: 26/11/2026. Tất cả các bước dưới đây dùng gói **miễn phí** (Vercel Hobby, Neon Free, Vercel Blob trong hạn mức Hobby).

> Lưu ý: gói Hobby của Vercel chỉ dành cho mục đích phi thương mại. Dùng được cho giai đoạn xem thử (prelaunch).
> Trước khi bật bán hàng cần chuyển sang Vercel Pro (trả phí, cần chủ dự án duyệt).

## Mã nguồn đã chuẩn bị sẵn
- `vercel.json`: build bằng `npm run build:vercel` (chạy migration rồi `next build`), vùng chạy `sin1` (Singapore, gần Việt Nam).
- Migration dùng kết nối trực tiếp `DATABASE_URL_UNPOOLED` nếu có; website dùng `DATABASE_URL` (pooled). Cũng nhận `POSTGRES_URL`.
- Ảnh tải lên lưu ở Vercel Blob khi có `BLOB_READ_WRITE_TOKEN`; tải thẳng từ trình duyệt nên không vướng giới hạn 4,5 MB.
- Mọi trang mặc định `noindex` và `robots.txt` chặn toàn bộ, cho tới khi đặt `NEXT_PUBLIC_ALLOW_INDEXING=true` (chỉ làm khi tên miền thật đã chạy).
- Admin chấp nhận đăng nhập trên địa chỉ `*.vercel.app` của dự án (production, nhánh và từng deployment).
- Trang admin có nút **Load starter content** (chỉ chủ, chỉ khi chưa có sản phẩm) để nạp nội dung mẫu cho cơ sở dữ liệu mới.

## Các bước trên Vercel (chủ dự án bấm)
1. Mở https://vercel.com/new, đăng nhập bằng GitHub, chọn **Import** repo `saint-vincent-studio`.
2. Ở mục **Environment Variables** thêm `PAYLOAD_SECRET` = một chuỗi ngẫu nhiên dài (ít nhất 32 ký tự). Bấm **Deploy**.
   Lần build đầu sẽ báo lỗi vì chưa có cơ sở dữ liệu, như vậy là bình thường.
3. Vào dự án → tab **Storage** → **Create Database** → chọn **Neon** (Postgres, gói Free), vùng **Singapore** → **Connect** vào dự án.
4. Tab **Storage** → **Create** → **Blob** → **Connect** vào dự án.
5. Tab **Deployments** → bản mới nhất → **Redeploy**.
6. Mở `https://<tên-dự-án>.vercel.app/admin`, tạo tài khoản đầu tiên (thành chủ), rồi bấm **Load starter content**.

Không đặt `NEXT_PUBLIC_SITE_URL` cho tới khi gắn tên miền saintvincent.studio; khi đó đặt `NEXT_PUBLIC_SITE_URL=https://saintvincent.studio`.

## Biến môi trường trên Vercel
| Tên | Ai đặt | Ghi chú |
|---|---|---|
| `PAYLOAD_SECRET` | Chủ dự án | Bắt buộc, giữ bí mật |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon tự đặt | |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob tự đặt | |
| `NEXT_PUBLIC_SITE_URL` | Chủ dự án | Chỉ khi có tên miền thật |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Chủ dự án | `true` khi mở cho Google |
