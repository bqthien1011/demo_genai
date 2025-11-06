---
title: "Feature Planning Template"
feature: "hien-thi-anh-do-gen-ai-tao-ra"
status: "draft"
---

# Task Breakdown

## 1. Update Product Types

- Add `isAIGenerated` and `aiDescription` fields to Product interface
- Create `AIGeneratedProduct` type

## 2. Create AI Product Data

- Create `lib/data/aiProducts.ts` with sample AI-generated product data
- Include the 2 provided image files as static assets

## 3. Enhance Product Context

- Add `isAIMode` state to ProductContext
- Add `aiProducts` state array
- Add functions to toggle AI mode and set AI products

## 4. Update Robot Chatbot Logic

- Modify RobotChatbot to detect "agree" response to AI generation prompt
- Trigger context to switch to AI mode when agreed

## 5. Create AI Product Card Component

- Create `AIGeneratedProductCard.tsx` based on existing ProductCard
- Add "AI Generated" badge and different styling

## 6. Modify Product Suggestion Carousel

- Update ProductSuggestionCarousel to conditionally render AI products when in AI mode
- Handle empty states and loading

## 7. Add Revert Functionality

- Add "Back to Regular Suggestions" button in AI mode
- Connect to context function to revert to regular mode

## 8. Update Styling and UI Polish

- Ensure responsive design for AI product cards
- Test visual consistency with existing UI

# Dependencies

- Existing ProductContext and product data structure
- RobotChatbot component logic
- UI components (Carousel, ProductCard)
- Static image assets (Copilot_20251104_171820.png, Copilot_20251104_171817.png)

# Effort Estimates

- Task 1: 1 hour (type updates)
- Task 2: 1 hour (data creation)
- Task 3: 2 hours (context enhancements)
- Task 4: 2 hours (chatbot logic)
- Task 5: 2 hours (new component)
- Task 6: 2 hours (carousel modifications)
- Task 7: 1 hour (revert button)
- Task 8: 1 hour (styling)
- **Total: ~12 hours** (spread over 2-3 days)

# Implementation Order

1. Start with data models and types (foundation)
2. Create AI product data
3. Enhance ProductContext
4. Update RobotChatbot logic
5. Create AI Product Card component
6. Modify Product Suggestion Carousel
7. Add revert functionality
8. Final styling and testing

# Risks and Mitigation

- **State Management Complexity**: Risk of bugs in mode switching. Mitigation: Thorough testing of context state changes.
- **UI Inconsistencies**: AI cards may not match design. Mitigation: Use existing components as base and review with design team.
- **Chatbot Integration**: Difficulty detecting "agree" response. Mitigation: Review existing chatbot code and add clear logging.
- **Performance**: Loading multiple images. Mitigation: Limit to 2-3 AI products and optimize image sizes.
- **Future API Integration**: Static approach may not align with future API. Mitigation: Design types to be extensible for API data.
