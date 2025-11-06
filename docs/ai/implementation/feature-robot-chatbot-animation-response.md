---
title: "Feature Implementation Template"
feature: "robot-chatbot-animation-response"
status: "in-progress"
---

# Implementation Notes

## Completed Components

- **RobotChatbot**: Main container with Framer Motion animations, conditional rendering, and positioning
- **RobotAvatar**: Animated robot icon with gradient background, hover effects, and pulsing ring animation
- **SpeechBubble**: Message display with typewriter effect, speech bubble pointer, and proper styling
- **ChatbotButtons**: Action buttons (Đồng ý/Đóng) with hover states and accessibility

## Context Integration

- Extended ProductContext with chatbot state (visibility, collapsed state, message, language)
- Added showChatbot(), hideChatbot(), collapseChatbot(), and expandChatbot() methods
- Integrated with existing product state management

## Carousel Integration

- Modified ProductSuggestionCarousel to detect end-of-carousel state
- Added Embla carousel API integration with scroll event listeners
- Implemented one-time chatbot trigger per product session
- Added proper cleanup for event listeners

## Layout Integration

- Added RobotChatbot component to main page layout
- Positioned as fixed element at bottom-left with proper z-index
- Integrated with existing ProductProvider context

## Collapsed State Enhancement

- **New Feature**: Chatbot now collapses instead of disappearing when "Đóng" is clicked
- **Visual Indicator**: Robot avatar changes color and shows "?" badge when collapsed
- **Interactive**: Clicking collapsed robot avatar expands the message again
- **Smooth Animations**: Expand/collapse transitions with spring animations
- **Persistent**: Chatbot stays available for re-interaction without full dismissal

## Current Status

- All core components implemented and compiling successfully
- Development server running without errors
- Basic functionality working (carousel detection, chatbot display, collapse/expand)
- Enhanced UX with persistent chatbot availability
- Need to complete styling polish and testing

# Code Structure

```
src/components/
├── RobotChatbot.tsx          # Main container component
├── RobotAvatar.tsx           # Animated robot character
├── SpeechBubble.tsx          # Message bubble with typewriter effect
├── ChatbotButtons.tsx        # Action buttons
└── ProductSuggestionCarousel.tsx # Modified for end detection

src/lib/context/
└── ProductContext.tsx        # Extended with chatbot state

src/app/
└── page.tsx                  # Added RobotChatbot to layout
```

# Error Handling

## Potential Issues

- Carousel API not available on component mount
- Animation library not loaded
- Context not properly initialized

## Mitigations

- Added null checks for carousel API
- Used optional chaining for context methods
- Graceful fallbacks for missing dependencies

## Edge Cases Handled

- Empty product list (carousel doesn't trigger)
- Multiple rapid scrolls (one-time trigger protection)
- Component unmount during animation (cleanup effects)

# Edge Cases

## User Experience

- **Multiple Sessions**: Chatbot resets when product list changes
- **Rapid Navigation**: Protected against multiple triggers
- **Mobile Responsiveness**: Fixed positioning adapts to screen size
- **Language Fallback**: Currently hardcoded to Vietnamese, can be extended

## Technical Edge Cases

- **Carousel API Delay**: Event listeners set up after API is available
- **Memory Leaks**: Proper cleanup of event listeners on unmount
- **Animation Conflicts**: Z-index management to prevent overlap issues
- **Performance**: Lightweight animations using CSS transforms
