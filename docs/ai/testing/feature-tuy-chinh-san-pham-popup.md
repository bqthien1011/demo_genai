---
title: "Feature Testing Template"
feature: "tuy-chinh-san-pham-popup"
status: "draft"
---

# Unit Tests

## Component Tests

- `CustomizationView` renders all selectors correctly
- `CustomizationView` handles API loading states
- `CustomizationView` displays error messages on API failure
- `ProductList` shows carousel in default mode
- `ProductList` shows customization view when `customizationMode` is true
- Button click handlers trigger correct state changes

## Context Integration Tests

- Customization selections persist in ProductContext
- Context updates trigger re-renders in dependent components
- State initialization works correctly on first customization

# Integration Tests

## User Flow Tests

- Click "Tùy chỉnh" → switches to customization view
- Select customization options → updates context state
- Click "Tạo lại ảnh" → calls API and updates preview
- Click "Quay lại" → returns to product list
- Click "Đặt trước sản phẩm" → navigates to `/preorder/[productId]`
- Chat remains visible throughout flow

## API Integration Tests

- `customizeProduct` service called with correct parameters
- Success response updates product image
- Error response displays appropriate message
- Loading states shown during API calls

# Manual Testing Steps

## Basic Functionality

1. Navigate to AI-generated products section
2. Click "Tùy chỉnh" on any product card
3. Verify customization view replaces product list
4. Verify chat interface remains visible
5. Test all three selectors (material, stone, color)
6. Click "Tạo lại ảnh" and verify image updates
7. Click "Quay lại" and verify return to product list
8. Click "Đặt trước sản phẩm" and verify navigation to pre-order page

## Edge Cases

1. Test with different screen sizes (mobile, tablet, desktop)
2. Test rapid clicking of "Tùy chỉnh" buttons
3. Test API failure scenarios (network errors)
4. Test with products that have missing image data
5. Test browser back/forward navigation

## Performance Testing

1. Verify smooth transitions between views
2. Check for memory leaks during repeated customization
3. Test with slow network conditions
4. Verify no console errors or warnings

# Test Code

## Example Test Case

```typescript
describe("CustomizationView", () => {
  it("should update customization selection in context", () => {
    // Test implementation
  });

  it("should call API on regenerate button click", () => {
    // Test implementation
  });
});
```
