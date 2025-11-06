---
title: "Feature Testing Template"
feature: "enhance-header"
status: "draft"
---

# Unit Tests

- Kiểm tra render đúng các component: Logo, Navigation, SearchBox, Account, Cart, Hotline
- Kiểm tra hiển thị đúng icon, màu sắc, font chữ theo thiết kế
- Kiểm tra animation khi hover/click trên các thành phần
- Kiểm tra trạng thái giỏ hàng rỗng và đã có sản phẩm
- Kiểm tra trạng thái tài khoản (đăng nhập/chưa đăng nhập)

# Integration Tests

- Kiểm tra tương tác giữa các component header (ví dụ: click vào navigation chuyển trang đúng)
- Kiểm tra lấy dữ liệu user/account và cart từ API
- Kiểm tra hiển thị đúng khi thay đổi trạng thái đăng nhập hoặc giỏ hàng

# Manual Testing Steps

1. So sánh UI header với thiết kế gốc về màu sắc, font chữ, icon, bố cục
2. Kiểm tra animation khi hover/click trên các thành phần
3. Kiểm tra thao tác tìm kiếm, truy cập tài khoản, giỏ hàng, navigation
4. Kiểm tra hiển thị đúng các trạng thái (giỏ hàng rỗng, đã đăng nhập/chưa đăng nhập)
5. Kiểm thử trên các trình duyệt phổ biến (Chrome, Firefox, Edge)

# Test Code

- Sử dụng Jest và React Testing Library cho unit test các component
- Sử dụng mock API cho integration test
- Đảm bảo tất cả tiêu chí thành công đều được kiểm thử
