# Bán hàng và thanh toán PayOS

Cập nhật: 26/11/2026.

## Cách hoạt động
- Giỏ hàng lưu trên trình duyệt của khách. Mỗi lần xem giỏ, thanh toán và đặt đơn, máy chủ tính lại giá và kiểm tra tồn kho từ CMS.
  Khách không thể tự sửa giá.
- Khi đặt đơn, tồn kho được trừ ngay (giữ hàng). Đổi trạng thái đơn sang **Cancelled** hoặc **Refunded** thì hàng tự trả về kho.
- Có 3 cách thanh toán. Mỗi cách chỉ hiện khi được bật trong **Site settings → Checkout** và đã cấu hình đủ:
  - **payOS (VietQR)**: cần 3 khoá PAYOS_* trên máy chủ và phải đặt phí vận chuyển (để biết tổng tiền chính xác).
    Khách được chuyển sang trang payOS để quét QR. Đơn chỉ thành "Paid" khi webhook có chữ ký hợp lệ **và** máy chủ hỏi lại payOS thấy đã trả đủ tiền.
  - **Chuyển khoản thủ công**: cần điền số tài khoản. Khách thấy thông tin chuyển khoản và nội dung là mã đơn (ví dụ SV1234567).
    Studio tự đổi trạng thái sang Paid khi nhận tiền.
  - **COD**: trả tiền khi nhận hàng.
- Khách xem đơn qua đường link riêng `/order/<mã đơn>?t=<khoá ngẫu nhiên>`. Không có khoá thì trang báo không tìm thấy.
- Nếu không tạo được link payOS, đơn tự huỷ và hàng trả về kho. Khách chưa bị trừ tiền.
- Không có số liệu giả: phí vận chuyển để trống thì website ghi "Studio xác nhận với bạn sau khi đặt".

## Việc chủ dự án cần làm để bật PayOS
1. Đăng ký tại https://my.payos.vn và xác minh danh tính.
2. Tạo **kênh thanh toán**, liên kết tài khoản ngân hàng nhận tiền.
3. Trong kênh thanh toán, lấy **Client ID**, **API Key**, **Checksum Key**. Không gửi các khoá này qua chat.
   Đặt chúng vào Vercel → Settings → Environment Variables: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, rồi deploy lại.
4. Đặt **Webhook URL** của kênh là `https://<tên miền>/api/payos/webhook` (hiện tại: https://saint-vincent-studio.vercel.app/api/payos/webhook).
   payOS gửi một sự kiện thử khi lưu; website trả lời thành công.
5. Trong admin → Site settings: điền phí vận chuyển, bật payOS, chuyển **Mode** sang **Commerce**.
6. Thử bằng một đơn nhỏ thật: payOS không có môi trường sandbox riêng, nên thử bằng cách chuyển một khoản nhỏ vào chính tài khoản của studio.
   Sau đó đổi đơn thử sang Refunded để trả hàng về kho.

## Trước khi bán thật
- Vercel Hobby không cho dùng thương mại: cần chuyển sang Vercel Pro (trả phí, chủ dự án duyệt).
- Viết và xuất bản các trang Vận chuyển, Đổi trả, Bảo mật, Điều khoản (hiện là bản nháp).
- Email xác nhận đơn tự động chưa có (cần dịch vụ email, ví dụ Resend). Hiện tại khách lưu link đơn, studio xem đơn trong admin → Shop → Orders.
- Bộ giới hạn tần suất đặt đơn đang lưu trong bộ nhớ một máy chủ; khi lượng truy cập lớn nên chuyển sang Redis.
