---
title: "Feature Implementation: Enhance layout tùy chỉnh sản phẩm"
feature: "enhance-layout-tuy-chinh-san-pham"
status: "draft"
---

# Implementation Notes

- Added `isCustomizing` state in `page.tsx` to manage layout switching.
- Modified `ProductList.tsx` to notify parent when customization starts/ends.
- Updated `ChatBox.tsx` to accept `minimized` prop and show toggle when minimized (though now minimized logic is handled at layout level).
- Changed layout in `page.tsx` to conditionally render `TryOnSection` or `ChatBox` based on `isCustomizing`.
- Added responsive classes (flex-col on mobile) and transitions for smooth UX.

# Code Structure

- State management: Lifted to `page.tsx` for global layout control.
- Components: `page.tsx` (layout), `ProductList.tsx` (trigger), `ChatBox.tsx` (conditional), `TryOnSection.tsx` (replacement).
- Props: `setIsCustomizing` passed to `ProductList`, `minimized` to `ChatBox`.

# Error Handling

- No specific errors handled yet; relies on existing component error handling.

# Edge Cases

- Mobile layout stacks vertically.
- Toggle button allows manual expansion from minimized state.
- Dummy product used for `TryOnSection` when no real product selected (needs refinement).
