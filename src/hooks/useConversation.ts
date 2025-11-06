import { useState, useEffect, useCallback } from "react";
import {
  createConversation,
  sendMessage,
  SendMessageRequest,
  ChatResponse,
  Message,
  isApiError,
  Artifact,
} from "../lib/services/chatApi";
import {
  loadConversationId,
  saveConversationId,
  isValidConversationId,
} from "../lib/conversationStorage";

export interface UseConversationReturn {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  initializeConversation: () => Promise<void>;
  sendUserMessage: (
    message: string,
    images?: string[],
    artifact?: Artifact
  ) => Promise<void>;
  clearError: () => void;
  isInitialized: boolean;
}

export function useConversation(): UseConversationReturn {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const conversation = await createConversation();
      setConversationId(conversation.id);
      saveConversationId(conversation.id);
      setIsInitialized(true);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError("Failed to start conversation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize conversation on mount
  useEffect(() => {
    const initConversation = async () => {
      try {
        // Try to load existing conversation ID
        const savedId = loadConversationId();

        if (savedId && isValidConversationId(savedId)) {
          setConversationId(savedId);
          setIsInitialized(true);
        } else {
          // Create new conversation
          await initializeConversation();
        }
      } catch (err) {
        console.error("Failed to initialize conversation:", err);
        setError("Failed to initialize chat. Please refresh the page.");
      }
    };

    initConversation();
  }, [initializeConversation]);

  const sendUserMessage = useCallback(
    async (message: string, images?: string[], artifact?: Artifact) => {
      if (!conversationId) {
        setError("No active conversation. Please refresh the page.");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Add user message to local state immediately for better UX
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        role: "user",
        content: message,
        images: images || [],
        tool_calls: [],
        artifact: artifact,
        meta: undefined,
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const request: SendMessageRequest = {
          conversation_id: conversationId,
          message,
          images,
          artifact,
        };

        const response: ChatResponse = await sendMessage(request);

        // Replace temp user message with real one and add assistant message
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== userMessage.id);
          return [
            ...filtered,
            response.user_message,
            response.assistant_message,
          ];
        });
      } catch (err) {
        console.error("Failed to send message:", err);

        // Remove the temporary user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

        if (isApiError(err)) {
          setError(err.message);
        } else {
          setError("Failed to send message. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conversationId,
    messages,
    isLoading,
    error,
    initializeConversation,
    sendUserMessage,
    clearError,
    isInitialized,
  };
}
