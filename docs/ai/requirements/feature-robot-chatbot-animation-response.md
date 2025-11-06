---
title: "Feature Requirements Template"
feature: "robot-chatbot-animation-response"
status: "draft"
---

# Problem Statement

Currently, when users finish swiping through all suggested jewelry products and haven't found a suitable one, the system displays a popup dialog with the message "Didn't find a suitable product? If you haven't found a suitable product yet, you can let Gen AI create a custom sample for you!" along with Close and Confirm buttons. This popup-based interaction feels intrusive and less engaging compared to a more interactive chatbot experience.

# Goals

- Replace the static popup with an animated robot chatbot that appears at the bottom left of the interface
- Provide a more engaging and user-friendly way to offer the Gen AI custom sample creation option
- Maintain the same functionality (offer to create custom sample, allow user to agree or dismiss)
- Improve user experience by making the interaction feel more conversational and less interruptive

# Non-Goals

- Changing the underlying Gen AI custom sample creation functionality
- Modifying the product suggestion carousel behavior
- Adding new chatbot features beyond this specific interaction
- Implementing full chatbot conversation capabilities

# User Stories

## Primary User Story

As a jewelry shopper, after I finish swiping through all the suggested products and haven't found what I'm looking for, I want to see an animated robot chatbot appear at the bottom left with a friendly message offering to let Gen AI create a custom sample for me, so that I can choose to proceed or dismiss the offer in a more engaging way.

## Acceptance Criteria

- The robot chatbot animation appears after the user reaches the end of the product carousel
- The chatbot displays the message: "Nếu chưa tìm thấy sản phẩm phù hợp, bạn có thể để Gen AI tạo mẫu riêng cho bạn!" (Vietnamese) or "If you haven't found a suitable product yet, you can let Gen AI create a custom sample for you!" (English)
- The chatbot provides options to "Agree" (proceed with custom sample creation) or "Close" (dismiss)
- The animation is smooth and visually appealing
- The chatbot position is fixed at bottom left of the interface

# Success Criteria

- Users can successfully trigger the robot chatbot animation by swiping through all suggested products
- The chatbot message is clear and actionable
- User interactions (agree/close) work as expected
- The feature maintains existing functionality while improving UX
- No performance degradation compared to the popup approach
- Accessibility standards are maintained (keyboard navigation, screen reader support)

# Constraints

- Must work within the existing Next.js/React architecture
- Should not break existing product suggestion flow
- Animation should be lightweight and not impact page load performance
- Must support both Vietnamese and English languages (based on existing UI)
- Should be responsive and work on mobile devices

# Assumptions

- The Gen AI custom sample creation functionality already exists and works
- Users understand what "Gen AI create custom sample" means
- The product carousel has a defined "end" state that can be detected
- Animation libraries (like Framer Motion) are available or can be added

# Open Questions

- What animation library should be used for the robot chatbot?
- Should the chatbot have different animation states (idle, speaking, etc.)?
- How should the chatbot handle multiple languages - dynamic switching or separate components?
- What should happen if the user dismisses the chatbot - can it be triggered again?
- Are there specific design assets (robot avatar, speech bubble styling) to use?
