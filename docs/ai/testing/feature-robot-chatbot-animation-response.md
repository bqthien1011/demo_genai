---
title: "Feature Testing Template"
feature: "robot-chatbot-animation-response"
status: "in-progress"
---

# Unit Tests

## RobotChatbot Component Tests

- Renders correctly when `isVisible` is true
- Does not render when `isVisible` is false
- Displays correct message in Vietnamese and English
- Calls `onAgree` when Agree button is clicked
- Calls `onClose` when Close button is clicked
- Has correct positioning (bottom-left fixed)
- Applies responsive classes for mobile devices

## RobotAvatar Component Tests

- Renders robot SVG/icon correctly
- Applies entrance animation on mount
- Handles hover states appropriately
- Optimizes image loading and performance

## SpeechBubble Component Tests

- Displays message text correctly
- Implements typewriter animation effect
- Supports multiline text wrapping
- Applies correct styling (borders, shadows, pointer)

## Action Buttons Tests

- Agree button triggers correct callback
- Close button triggers correct callback
- Buttons are accessible (ARIA labels, keyboard navigation)
- Hover and focus states work correctly

## Context Tests

- ProductContext includes chatbot state properties
- `showChatbot()` sets `isVisible` to true
- `hideChatbot()` sets `isVisible` to false
- Language state affects message content

# Integration Tests

## Carousel to Chatbot Flow

## Carousel to Chatbot Flow

- When user swipes to end of ProductSuggestionCarousel, chatbot becomes visible
- Chatbot only triggers once per carousel session
- Agree button triggers custom sample creation (placeholder implemented)
- **Close button collapses chatbot instead of hiding it completely**
- **Collapsed robot avatar shows gray color and "?" indicator**
- **Clicking collapsed avatar expands chatbot message again**
- Chatbot state resets when product list changes

## Full User Journey

- User views product suggestions
- Swipes through all products
- Chatbot appears with animation
- User can interact with Agree/Close options
- Actions complete successfully (navigation or dismissal)

## Responsive Integration

- Chatbot appears correctly on mobile devices
- Positioning adjusts for different screen sizes
- Touch interactions work on mobile
- No overlap with existing UI elements

## Language Integration

- Chatbot displays correct language based on app settings
- Message content matches requirements
- Fallback to English if language not supported

# Manual Testing Steps

## Basic Functionality

1. Navigate to product suggestion page
2. Swipe through all suggested products until reaching the end
3. Verify robot chatbot appears at bottom-left with animation
4. Check that message displays: "Nếu chưa tìm thấy sản phẩm phù hợp, bạn có thể để Gen AI tạo mẫu riêng cho bạn!"
5. Click "Đồng ý" button - verify it triggers placeholder action
6. **Click "Đóng" button - verify chatbot collapses (message disappears, robot stays with gray color and "?" badge)**
7. **Click collapsed robot avatar - verify message expands again**
8. Repeat steps 1-3 - verify chatbot does not appear again in same session

## Animation and UX

1. Observe robot entrance animation (smooth scale + bounce)
2. Watch speech bubble typewriter effect
3. Test hover states on robot and buttons
4. Verify smooth transitions when showing/hiding

## Responsive Testing

1. Test on mobile device (iPhone/Android)
2. Test on tablet in portrait/landscape
3. Test on desktop with different window sizes
4. Verify chatbot positioning remains appropriate

## Edge Cases

1. Navigate away from page and return - verify chatbot can trigger again
2. Test with empty product list (if possible)
3. Test rapid swiping through carousel
4. Test with slow network connection
5. Test accessibility with keyboard navigation only

## Cross-browser Testing

1. Test on Chrome, Firefox, Safari, Edge
2. Verify animations work consistently
3. Check for any layout issues

# Test Code

## Example Unit Test (Jest + React Testing Library)

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { RobotChatbot } from "@/components/RobotChatbot";

describe("RobotChatbot", () => {
  const mockOnAgree = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isVisible: true,
    message: "Test message",
    onAgree: mockOnAgree,
    onClose: mockOnClose,
    language: "en" as const,
  };

  it("renders when visible", () => {
    render(<RobotChatbot {...defaultProps} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(<RobotChatbot {...defaultProps} isVisible={false} />);
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("calls onAgree when agree button is clicked", () => {
    render(<RobotChatbot {...defaultProps} />);
    const agreeButton = screen.getByRole("button", { name: /agree/i });
    fireEvent.click(agreeButton);
    expect(mockOnAgree).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    render(<RobotChatbot {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
```

## Example Integration Test

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductSuggestionCarousel } from "@/components/ProductSuggestionCarousel";
import { ProductProvider } from "@/lib/context/ProductContext";

describe("Carousel to Chatbot Integration", () => {
  it("shows chatbot when carousel reaches end", async () => {
    const user = userEvent.setup();

    render(
      <ProductProvider>
        <ProductSuggestionCarousel />
      </ProductProvider>
    );

    // Simulate swiping through all products
    const carousel = screen.getByRole("region", {
      name: /product suggestions/i,
    });

    // Assuming carousel has next buttons or swipe gestures
    // This would need to be adapted based on actual carousel implementation
    const nextButtons = screen.getAllByRole("button", { name: /next/i });

    // Click next until end
    for (let i = 0; i < nextButtons.length; i++) {
      await user.click(nextButtons[i]);
    }

    // Wait for chatbot to appear
    await waitFor(() => {
      expect(screen.getByText(/Gen AI tạo mẫu/)).toBeInTheDocument();
    });
  });
});
```

## Performance Test Considerations

- Measure animation frame rates (should be 60fps)
- Test memory usage during animations
- Verify bundle size impact
- Test on low-end devices/simulators
