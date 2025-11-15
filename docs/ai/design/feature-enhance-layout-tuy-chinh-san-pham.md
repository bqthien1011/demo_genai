---
title: "Feature Design: Enhance layout tùy chỉnh sản phẩm"
feature: "enhance-layout-tuy-chinh-san-pham"
status: "draft"
---

# System Architecture

No major changes needed. The feature will rely on existing React state management (likely via hooks like `useState` or context) to toggle the ChatBox visibility and conditionally render the "Try on hand" section. The layout will use CSS Grid or Flexbox for responsive adjustments. Integration with existing components (`CustomizationView`, `ChatBox`, `TryOnSection`) will be done via props or shared state.

# Data Models

No new data models required. Existing product customization data (materials, colors, stones) will be passed to the "Try on hand" feature if it needs to display previews.

# API Endpoints

None required, as this is a UI-only enhancement.

# Components

- Modify `ChatBox.tsx`: Add a `minimized` prop/state to control visibility and size (e.g., reduce to a small icon or collapse entirely).
- Modify the main layout component (likely `app/layout.tsx` or a parent component): Add logic to detect when customization is active (e.g., via a state flag) and conditionally render `TryOnSection` in the right panel instead of `ChatBox`.
- Reuse `TryOnSection.tsx`: Ensure it can be positioned in the right-side space and receives customization data for previews.
- Add a toggle button (new or existing): Place it near the minimized ChatBox to allow expansion.

# Design Decisions

- Auto-minimize trigger: When the customization popup/modal opens, set a global state (e.g., `isCustomizing: true`) to hide the ChatBox and show "Try on hand".
- Toggle mechanism: A small floating button or icon in the bottom-right corner when minimized, allowing users to expand the ChatBox.
- Responsive design: On mobile, the ChatBox could stack below or be hidden entirely, with "Try on hand" taking full width.
- Animation: Use CSS transitions for smooth minimize/expand to improve UX.

# Security Considerations

No sensitive data is involved; this is purely UI. Ensure any user inputs in customization don't expose data unintentionally.

# Performance Considerations

Minimal impact—conditional rendering is lightweight. Avoid re-rendering the entire layout on state changes by using React.memo or optimizing state updates.
