---
title: "Feature Design Template"
feature: "robot-chatbot-animation-response"
status: "draft"
---

# System Architecture

## Current Architecture

The application follows a Next.js architecture with:

- React components for UI
- Context API for state management (ProductContext)
- Service layer for data operations (productService)
- Component-based structure with reusable UI components

## Proposed Changes

- Add a new `RobotChatbot` component to handle the animated chatbot interaction
- Extend `ProductSuggestionCarousel` to emit an event when user reaches the end
- Add chatbot visibility state to the existing ProductContext or create a new ChatbotContext
- Integrate animation library (Framer Motion) for smooth transitions

## Component Hierarchy

```
App
├── Header
├── ProductSuggestionCarousel (modified)
├── RobotChatbot (new)
│   ├── RobotAvatar (animated)
│   ├── SpeechBubble
│   └── ActionButtons (Agree/Close)
└── ChatBox (existing)
```

# Data Models

## New State Properties

```typescript
interface ChatbotState {
  isVisible: boolean;
  message: string;
  language: "vi" | "en";
}

interface ProductContext {
  // existing properties...
  chatbot: ChatbotState;
  showChatbot: () => void;
  hideChatbot: () => void;
}
```

## Event Flow

1. User swipes to end of ProductSuggestionCarousel
2. Carousel emits 'carouselEnd' event
3. ProductContext updates chatbot.isVisible = true
4. RobotChatbot component renders with animation
5. User interacts with Agree/Close buttons
6. Context handles the action and hides chatbot

# API Endpoints

No new API endpoints required. The feature uses existing Gen AI custom sample creation functionality.

# Components

## New Components

- `RobotChatbot.tsx` - Main container component
- `RobotAvatar.tsx` - Animated robot character
- `SpeechBubble.tsx` - Message display with typing animation
- `ChatbotButton.tsx` - Agree/Close action buttons

## Modified Components

- `ProductSuggestionCarousel.tsx` - Add callback for carousel end detection
- `ProductContext.tsx` - Add chatbot state management

## Component Props

```typescript
interface RobotChatbotProps {
  isVisible: boolean;
  message: string;
  onAgree: () => void;
  onClose: () => void;
  language: "vi" | "en";
}
```

# Design Decisions

## Animation Approach

- Use Framer Motion for smooth, performant animations
- Robot avatar: Scale and bounce entrance animation
- Speech bubble: Typewriter effect for message appearance
- Position: Fixed bottom-left with responsive adjustments

## Styling

- Consistent with existing Tailwind CSS design system
- Robot avatar: Friendly, approachable design matching jewelry theme
- Speech bubble: Rounded corners, drop shadow, pointer to robot
- Colors: Match existing chat interface colors

## State Management

- Extend existing ProductContext rather than creating new context
- Keep chatbot state separate from product data
- Use React hooks for local component state

## Language Support

- Support both Vietnamese and English messages
- Language detection based on existing app language setting
- Fallback to English if language not supported

## Trigger Logic

- Trigger only when user reaches the actual end of carousel (not just any swipe)
- One-time trigger per session to avoid spam
- Reset trigger when user navigates away and returns

# Security Considerations

- No sensitive data handling in chatbot component
- Existing Gen AI integration security measures apply
- No new user input validation required beyond existing patterns
- XSS protection through React's built-in sanitization

# Performance Considerations

- Lazy load animation library if not already included
- Optimize robot avatar image/assets for web
- Use CSS transforms for smooth animations (GPU accelerated)
- Minimize re-renders with proper React memoization
- Animation should not block main thread - use requestAnimationFrame
- Bundle size impact: ~5-10KB for Framer Motion if not already included
