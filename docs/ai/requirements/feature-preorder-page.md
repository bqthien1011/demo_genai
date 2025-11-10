---
title: "Feature Requirements Template"
feature: "preorder-page"
status: "draft"
---

# Problem Statement

Hiện tại người dùng sau khi tạo mẫu thiết kế mới Gen Ai xong k có nút đặt hàng. Vì thế chúng ta cần 1 preorder-page để user có thể đặt hàng trước

# Goals

- Tạo trang preorder cho phép người dùng đặt hàng trước sản phẩm được tạo bằng Gen AI
- Thu thập thông tin khách hàng cần thiết cho việc đặt hàng
- Cung cấp các tùy chọn giao hàng và thanh toán phù hợp
- Đảm bảo trải nghiệm người dùng mượt mà từ việc tạo sản phẩm đến đặt hàng

# Non-Goals

- Không xử lý thanh toán thực tế (chỉ thu thập thông tin)
- Không tích hợp với hệ thống kho hàng hiện tại
- Không xử lý đơn hàng thông thường (chỉ dành cho pre-order)

# User Stories

Là người dùng, sau khi chọn mẫu và chỉnh sửa/ tạo sản phẩm với Gen AI tôi cần một nơi để thực hiện preorder sản phẩm đó.

# Success Criteria

- Người dùng có thể truy cập trang preorder từ trang customize sản phẩm
- Form thu thập đầy đủ thông tin cần thiết (khách hàng, giao hàng, thanh toán)
- Validation form hoạt động chính xác
- Gửi thông tin preorder thành công và hiển thị xác nhận
- Trang responsive trên mobile và desktop

# Constraints

- Phải tích hợp với hệ thống Gen AI hiện tại
- Sử dụng Next.js và TypeScript
- Tuân thủ design system hiện tại

# Assumptions

- Sản phẩm Gen AI có ID duy nhất để reference
- Hệ thống backend có thể xử lý preorder data
- Email và phone là bắt buộc cho việc liên hệ

# Open Questions

- Thời gian phát hành dự kiến của sản phẩm?
- Chính sách hoàn tiền cho preorder?
- Có tích hợp thanh toán online không?
