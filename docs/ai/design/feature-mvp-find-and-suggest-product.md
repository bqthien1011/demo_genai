---
title: "MVP - Find and suggest product Design"
feature: "mvp-find-and-suggest-product"
status: "draft"
---

# System Architecture

The feature extends the existing chat interface with a product suggestion workflow:

```
User Input → AI Processing → Question Flow → Product Search → Carousel Display
```

- **ChatBox Component**: Entry point, handles user messages and AI responses
- **AI Logic**: Determines when to ask questions vs suggest products
- **Product Service**: Mock data layer for jewelry products
- **ProductSuggestionCarousel**: Displays suggested products inline in chat

# Data Models

## Product Interface

```typescript
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  tags: string[]; // e.g., ['gold', 'necklace', 'wedding']
  category: string;
}
```

## User Preferences

```typescript
interface UserPreferences {
  style?: string;
  material?: string;
  budget?: number;
  occasion?: string;
  gemstones?: string[];
  size?: string;
}
```

# API Endpoints

For MVP, use local mock data. Future: REST API for product search.

```typescript
// Mock product service
const getSuggestedProducts = (preferences: UserPreferences): Product[] => {
  // Filter products based on preferences
};
```

# Components

## ProductSuggestionCarousel

- Extends existing Carousel component
- Displays Product cards with image, name, price
- Clickable for product details (future)
- Integrated into MessageBubble for AI responses

## Enhanced ChatBox

- Detects product suggestion intent from user input
- Manages question flow state
- Triggers product suggestions when ready

# Design Decisions

- **Integration**: Products appear as special message bubbles in chat
- **UI Consistency**: Use existing chat theme (glassmorphism, gradients)
- **Mobile First**: Carousel responsive on all devices
- **Progressive Enhancement**: Works without JS for basic chat

# Security Considerations

- No user data collection for MVP
- Sanitize user input for chat messages
- Mock data only - no external API calls

# Performance Considerations

- Lazy load product images
- Limit carousel to 5-10 products initially
- Debounce AI processing to prevent spam
- Cache product data in memory
