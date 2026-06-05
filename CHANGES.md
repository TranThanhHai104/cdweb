# Danh sách sửa lỗi & cải tiến

## ✅ Lỗi 1: Chỉ nhập được 1 từ ở ô địa chỉ giao hàng
**File:** `react/src/customer/Components/Checkout/AddAddress.jsx`
**Nguyên nhân:** Component `F` và `EF` được định nghĩa bên trong hàm render → mỗi lần gõ tạo component mới → mất focus.
**Sửa:** Chuyển handler `onChange` ra ngoài dùng `handleFormChange(name)` pattern ổn định, TextField không bị unmount khi gõ.

## ✅ Lỗi 2: Thêm nút Back quay lại bước trước
**File:** `react/src/customer/Components/Checkout/Checkout.jsx`
- Bước 2 (địa chỉ): nút "← Quay lại giỏ hàng"
- Bước 3 (thanh toán): nút "← Quay lại địa chỉ"

## ✅ Lỗi 3: Giao diện chuyển khoản ngân hàng & trạng thái đơn hàng
**File:** `react/src/customer/Components/Checkout/OrderSummary.jsx`
- Thiết kế lại giao diện bank transfer có 2 tab: Quét QR và Chuyển khoản thủ công
- Logo Vietcombank, thanh timer màu đổi theo thời gian, hướng dẫn từng bước
- Nút copy với feedback visual
- **Sau khi xác nhận chuyển khoản → đơn hàng ở trạng thái "Chờ xử lý" (PENDING)**

**File:** `ecommerce-server/.../PaymentController.java`
- Đổi `OrderStatus.PLACED` → `OrderStatus.PENDING` sau khi xác nhận QR

## ✅ Lỗi 4: Chỉ viết đánh giá khi đơn hàng đã giao
**File:** `react/src/customer/Components/ReviewProduct/RateProduct.jsx`
- Kiểm tra lịch sử đơn hàng: chỉ hiện form đánh giá nếu có đơn DELIVERED chứa sản phẩm đó
- Hiển thị thông báo khóa nếu chưa có đơn hàng được giao

**File:** `react/src/customer/Components/orders/OrderCard.jsx`
- Nút "Đánh giá sản phẩm" chỉ hiện khi `status === "DELIVERED"`

## ✅ Lỗi 5: Người dùng có thể hủy đơn hàng
**File:** `react/src/customer/Components/orders/OrderCard.jsx`
- Thêm nút "Hủy đơn hàng" khi trạng thái là PENDING/PLACED/CONFIRMED
- Dialog xác nhận trước khi hủy
- Tự động refresh danh sách sau khi hủy

**File:** `react/src/Redux/Customers/Order/Action.jsx` - Thêm `cancelOrder` action
**File:** `ecommerce-server/.../OrderController.java` - Thêm `PUT /api/orders/{orderId}/cancel`

## ✅ Cải tiến 6: Giao diện trang chủ đẹp hơn
**File:** `react/src/Pages/Homepage.jsx`
- Hero slider 2 slide tự động xoay với indicator
- Promo strip thông báo ưu đãi
- Flash Sale banner (khi có sản phẩm giảm giá)
- Grid 4 danh mục nổi bật với badge (Bestseller/Hot/Sale)
- Section "Sản phẩm tiêu biểu" + "Hàng mới về"
- 2 banner quảng cáo (Mua 2 tặng 1 & Giảm 30%)
- Section "Tại sao chọn chúng tôi" (4 điểm nổi bật)
- Thương hiệu đối tác
- Testimonials (3 đánh giá khách hàng)
- Newsletter signup
