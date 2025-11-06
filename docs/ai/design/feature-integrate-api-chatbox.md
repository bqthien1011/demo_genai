---
title: "Feature Design: Integrate API Chatbox"
feature: "integrate-api-chatbox"
status: "draft"
---

# System Architecture

## Current Architecture

- React-based chatbox component with mockup data
- Messages displayed in chat interface
- No backend integration

## Proposed Changes

- Add API service layer for HTTP requests to `/api/v1/conversations` and `/api/v1/chat`
- Implement conversation state management in ChatBox component
- Add conversation persistence using localStorage for `conversation_id`
- Integrate API responses into existing chat message display logic

## Data Flow

1. User opens chatbox → Check for existing conversation_id in localStorage
2. If no conversation_id → Call `/api/v1/conversations` to initialize
3. Store conversation_id in localStorage
4. User sends message → Call `/api/v1/chat` with conversation_id and message data
5. Receive response → Extract `assistant_message.content` and display in chat

# Data Models

## Conversation

```typescript
interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
```

## Message

```typescript
interface Message {
  id: string;
  conversation_id: string;
  created_at: string;
  role: "user" | "assistant";
  content: string;
  images: string[];
  tool_calls: any[];
  artifact?: Artifact;
  meta?: any;
}

interface Artifact {
  id: string;
  type: string;
  design?: Design;
}

interface Design {
  id: string;
  name: string;
  description: string;
  properties: Record<string, any>;
  images: string[];
  three_d_model: string;
  reference_images: string[];
}
```

## API Request/Response Types

```typescript
// /api/v1/conversations request
interface CreateConversationRequest {
  title: string;
}

// /api/v1/chat request
interface SendMessageRequest {
  conversation_id: string;
  message: string;
  images?: string[];
  artifact?: Artifact;
}

// API response
interface ChatResponse {
  conversation_id: string;
  user_message: Message;
  assistant_message: Message;
}
```

# API Endpoints

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: To be determined (environment variable)

## POST /api/v1/conversations

- **Full URL**: `http://localhost:8000/api/v1/conversations`
- **Purpose**: Initialize new conversation
- **Request**: `{ "title": "New jewelry design consultation" }`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {access_token}`
- **Response**: Conversation object with id, timestamps, etc.
- **Error Handling**: Retry on failure, fallback to cached conversation_id

## POST /api/v1/chat

- **Full URL**: `http://localhost:8000/api/v1/chat`
- **Purpose**: Send user message and receive AI response
- **Request**: Message data with conversation_id, text, optional images/artifacts
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {access_token}`
- **Response**: Both user_message and assistant_message objects
- **Error Handling**: Show error message in chat, allow retry

# Components

## Modified Components

- **ChatBox.tsx**: Add API integration, conversation management, loading states
- Add conversation initialization on mount
- Handle message sending and response display
- Manage conversation_id persistence

## New Components/Services

- **api/chat.ts**: Service functions for API calls
- **hooks/useConversation.ts**: Custom hook for conversation state management
- **utils/conversationStorage.ts**: localStorage utilities for conversation persistence

# Design Decisions

## Conversation Persistence

- Use localStorage to store conversation_id across browser sessions
- Automatically resume conversation on chatbox reopen
- No expiration - conversations persist indefinitely

## Error Handling

- Network errors: Show user-friendly error message in chat
- API errors: Display error content from API response meta field
- Retry logic: Allow manual retry for failed messages

## Loading States

- Show typing indicator while waiting for API response
- Disable send button during API calls
- Maintain responsive UI during network requests

## Message Display

- Use `assistant_message.content` for AI responses
- Support rich text formatting if provided by API
- Handle images and artifacts in future iterations

# Security Considerations

- API endpoints require Bearer token authentication
- Access token is currently hardcoded for development
- HTTPS required for all API communications in production
- No sensitive user data exposed in chat messages
- Input validation on user messages before sending to API

# Performance Considerations

- API calls should be asynchronous to avoid blocking UI
- Implement request debouncing for rapid message sending
- Cache conversation data locally to reduce API calls
- Monitor API response times and implement timeouts
- Consider pagination for long conversation histories (future)
