---
title: "Feature Design Template"
feature: "tuy-chinh-san-pham-popup"
status: "draft"
---

# System Architecture

## Current Architecture

- Trang customize/[productId] là một page riêng biệt trong Next.js App Router
- Sử dụng ProductContext để quản lý state của sản phẩm AI-generated
- CustomizationService xử lý API calls để regenerate ảnh sản phẩm

## Proposed Architecture Changes

Chuyển logic tùy chỉnh từ page thành một inline component được render conditionally trong ProductList. Khi user click "Tùy chỉnh", ProductList sẽ thay thế carousel sản phẩm bằng giao diện tùy chỉnh trực tiếp. Sử dụng React state để control việc hiển thị chế độ tùy chỉnh.

## Component Hierarchy

```
ProductList
├── Header ("Mẫu sản phẩm do AI tạo")
├── Conditional Content
│   ├── Product Carousel (default view)
│   │   ├── AIGeneratedProductCard
│   │   │   ├── Product Image
│   │   │   ├── Customize Button (triggers inline customization)
│   │   │   └── ...
│   └── CustomizationView (when customizing)
│       ├── Product Preview
│       ├── MaterialSelector
│       ├── StoneSelector
│       ├── ColorSelector
│       ├── Action Buttons (Regenerate, Back)
│       └── ...
└── Navigation Buttons
```

# Data Models

Không có thay đổi data models. Sử dụng existing types:

- `AIGeneratedProduct`
- `CustomizationSelection`
- `Material`, `Stone`, `Color` options

# API Endpoints

Không có API endpoints mới. Sử dụng existing:

- `customizeProduct(productId, customization)` - để regenerate ảnh

# Components

## New Components

- `CustomizationView` - Inline component cho việc tùy chỉnh sản phẩm
  - Props: `product`, `onBack`, `onCustomize`
  - State: local customization selections
  - Renders: MaterialSelector, StoneSelector, ColorSelector, preview, buttons

## Modified Components

- `ProductList` - Thêm state và conditional rendering
  - Thêm state: `customizationMode`, `selectedProduct`
  - Thêm conditional rendering: show carousel hoặc customization view
  - Handle "Tùy chỉnh" button click để switch to customization mode
  - Add "Quay lại" button trong customization view

## Existing Components (Unchanged)

- `MaterialSelector`, `StoneSelector`, `ColorSelector`
- `ProductContext` và hooks

## Existing Components (Unchanged)

- `MaterialSelector`, `StoneSelector`, `ColorSelector`
- `ProductContext` và hooks

# Design Decisions

## State Management

**Decision**: Local state trong ProductList + existing ProductContext
**Rationale**:

- `customizationMode` và `selectedProduct` state local để control UI
- Customization selections sử dụng existing ProductContext
- Minimal changes to existing architecture

## UI Transition

**Decision**: Simple conditional rendering với optional fade transition
**Rationale**:

- Keep it simple and performant
- Focus on functionality over complex animations
- Tailwind CSS transitions for smooth UX

## Back Navigation

**Decision**: "Quay lại" button trong customization view
**Rationale**:

- Clear user expectation
- Preserve customization selections in context
- Easy to implement and understand

## Responsive Design

**Decision**: Modal width adaptive, max-width constraints
**Rationale**:

- Mobile: full width với padding
- Tablet: fixed width ~500px
- Desktop: fixed width ~600px

# Security Considerations

- Không có security concerns mới vì không thêm API endpoints
- Reusing existing authentication/authorization logic
- Input validation sử dụng existing validation trong selectors

# Performance Considerations

- Modal chỉ render khi cần thiết (conditional rendering)
- Image regeneration chỉ trigger khi user clicks "Tạo lại ảnh"
- Không preload modal content
- Lazy load modal component nếu cần (future optimization)
