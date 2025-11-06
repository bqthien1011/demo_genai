// Conversation storage utilities for localStorage persistence
const CONVERSATION_ID_KEY = "jewelry_chat_conversation_id";

export interface ConversationStorage {
  conversationId: string | null;
  saveConversationId: (id: string) => void;
  loadConversationId: () => string | null;
  clearConversationId: () => void;
  isStorageAvailable: () => boolean;
}

/**
 * Check if localStorage is available
 * Handles cases like private browsing mode or storage quota exceeded
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save conversation ID to localStorage
 */
export function saveConversationId(conversationId: string): void {
  if (!isStorageAvailable()) {
    console.warn("localStorage not available, conversation ID not saved");
    return;
  }

  try {
    localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
  } catch (error) {
    console.error("Failed to save conversation ID:", error);
  }
}

/**
 * Load conversation ID from localStorage
 */
export function loadConversationId(): string | null {
  if (!isStorageAvailable()) {
    console.warn("localStorage not available, cannot load conversation ID");
    return null;
  }

  try {
    const conversationId = localStorage.getItem(CONVERSATION_ID_KEY);
    return conversationId;
  } catch (error) {
    console.error("Failed to load conversation ID:", error);
    return null;
  }
}

/**
 * Clear conversation ID from localStorage
 */
export function clearConversationId(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error("Failed to clear conversation ID:", error);
  }
}

/**
 * Validate if a string looks like a valid conversation ID (UUID format)
 */
export function isValidConversationId(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
