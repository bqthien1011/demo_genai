---
title: "Feature Implementation Template"
feature: "enhance-header"
status: "draft"
---

# Implementation Notes

- Sử dụng React/Next.js để xây dựng lại header.
- Tách các thành phần header thành các component riêng biệt: Logo, Navigation, Search, Account, Cart, Hotline.
- Áp dụng style theo thiết kế: màu sắc, font chữ, icon, bố cục.
- Thêm animation cho các thành phần (hover/click) bằng CSS hoặc thư viện animation nhẹ.
- Không cần xử lý responsive cho mobile/tablet.

# Code Structure

- src/components/Header.tsx: Component chính cho header
- src/components/Logo.tsx: Logo
- src/components/Navigation.tsx: Menu điều hướng
- src/components/SearchBox.tsx: Ô tìm kiếm
- src/components/Account.tsx: Tài khoản
- src/components/Cart.tsx: Giỏ hàng
- src/components/Hotline.tsx: Số hotline
- Sử dụng CSS modules hoặc styled-components cho từng component

# Error Handling

- Kiểm tra trạng thái đăng nhập để hiển thị đúng thông tin tài khoản
- Hiển thị thông báo khi giỏ hàng rỗng
- Xử lý lỗi khi không lấy được dữ liệu user/cart

# Edge Cases

- Người dùng chưa đăng nhập: chỉ hiển thị nút đăng nhập
- Giỏ hàng rỗng: hiển thị icon và số lượng là 0
- Dữ liệu navigation bị thiếu: hiển thị mặc định các mục chính
