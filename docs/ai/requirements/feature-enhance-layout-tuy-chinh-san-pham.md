---
title: "Feature Requirements: Enhance layout tùy chỉnh sản phẩm"
feature: "enhance-layout-tuy-chinh-san-pham"
status: "draft"
---

# Problem Statement

When users click to customize a product, the customization form (including image, material selection, color, stone, etc.) opens, but the ChatBox on the right occupies valuable screen space. During this step, users are focused solely on product customization and are not interested in the ChatBox, leading to a cluttered and inefficient layout.

# Goals

- Automatically minimize the ChatBox when entering the product customization step to free up space for the customization form.
- Allow users to toggle the ChatBox (minimize/expand) as needed.
- Display the "Try on hand" feature in the space previously occupied by the minimized ChatBox to enhance the customization experience.

# Non-Goals

- Completely removing the ChatBox from the interface.
- Altering the core functionality of the ChatBox outside of customization mode.

# User Stories

- As a user, when I start customizing a product, I want the ChatBox to automatically minimize so I can focus on the customization options without distraction.
- As a user, I want a toggle button to expand or minimize the ChatBox during customization, giving me control over the layout.
- As a user, I want the "Try on hand" feature to appear in the freed-up space from the minimized ChatBox, allowing me to preview the customized product virtually.

# Success Criteria

- The ChatBox minimizes automatically when the customization form is active.
- A visible toggle (e.g., button or icon) allows users to expand/minimize the ChatBox.
- The "Try on hand" feature renders in the right-side space when the ChatBox is minimized.
- No layout conflicts or overlapping elements during customization.
- Users can seamlessly switch between customization and ChatBox interaction.

# Constraints

- The layout must remain responsive across different screen sizes (desktop, tablet, mobile).
- The customization form should not be affected by the ChatBox changes.
- Ensure accessibility (e.g., keyboard navigation for toggles).

# Assumptions

- The customization form is positioned on the left side of the screen.
- The ChatBox is currently fixed on the right side.
- The "Try on hand" feature is already implemented or can be integrated as a component.

# Open Questions

- What is the exact behavior of the "Try on hand" feature (e.g., is it a 3D preview, image overlay, or interactive simulation)?
- Are there any existing UI components (e.g., buttons, animations) that can be reused for the toggle functionality?
- How should the layout handle cases where the screen is too small to accommodate both minimized ChatBox and "Try on hand"?
