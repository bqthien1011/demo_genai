// API service for chat functionality
const API_BASE_URL = "http://10.1.9.220:8000";

// Access token for API authentication
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OGEzYTBkNy00MzRmLTRkNGItOGNmMC00Yjg1ZDNhOWUzMzAiLCJleHAiOjE3NjM2OTE4MDh9.ldiZNHlRJK7UIjNjg7CGBDluIrNVBoo0QU-PbKwCiiY";

// Types
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  created_at: string;
  role: "user" | "assistant";
  content: string;
  images: string[];
  tool_calls: unknown[];
  artifact?: Artifact;
  meta?: Record<string, unknown>;
}

export interface Artifact {
  id: string;
  type: string;
  design?: Design;
}

export interface Design {
  id: string;
  name: string;
  description: string;
  properties: Record<string, string | number | boolean>;
  images: string[];
  three_d_model: string;
  reference_images: string[];
}

export interface CreateConversationRequest {
  title: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  message: string;
  images?: string[];
  artifact?: Artifact;
}

export interface ChatResponse {
  conversation_id: string;
  user_message: Message;
  assistant_message: Message;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// API Functions
export async function createConversation(
  title: string = "New jewelry design consultation"
): Promise<Conversation> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Conversation = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create conversation:", error);
    throw new ApiError(
      "Failed to initialize conversation. Please try again.",
      500
    );
  }
}

export async function sendMessage(
  request: SendMessageRequest
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new ApiError("Failed to send message. Please try again.", 500);
  }
}

// Utility function to check if error is ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
