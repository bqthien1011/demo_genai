"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useProductContext } from "../lib/context/ProductContext";
import { RobotAvatar } from "./RobotAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { ChatbotButtons } from "./ChatbotButtons";
import { aiProducts } from "../lib/data/aiProducts";
import { useConversationContext } from "../lib/context/ConversationContext";

export function RobotChatbot({
  setChatBoxMinimized,
}: {
  setChatBoxMinimized?: (minimized: boolean) => void;
}) {
  const {
    chatbot,
    hideChatbot,
    collapseChatbot,
    expandChatbot,
    setAIMode,
    setAIProducts,
  } = useProductContext();

  const { sendUserMessage, isInitialized, isLoading } =
    useConversationContext();

  const [isSending, setIsSending] = useState(false);

  const handleAgree = async () => {
    if (isSending) return; // Prevent multiple clicks

    // Wait for conversation to be initialized if not ready yet
    if (!isInitialized) {
      console.log("Waiting for conversation initialization...");
      // Wait up to 2 seconds for initialization
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (isInitialized) break;
      }

      if (!isInitialized) {
        console.error("Conversation failed to initialize");
        return;
      }
    }

    setIsSending(true);
    try {
      // Open chat box if it's minimized
      if (setChatBoxMinimized) {
        setChatBoxMinimized(false);
      }
      // Send "tạo ảnh" message to chat AI
      await sendUserMessage("tạo ảnh");
      hideChatbot();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    collapseChatbot();
  };

  const handleAvatarClick = () => {
    if (chatbot.isCollapsed) {
      expandChatbot();
    }
  };

  return (
    <AnimatePresence>
      {chatbot.isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.5,
          }}
          className="fixed bottom-4 left-4 z-50 flex items-end space-x-3 max-w-sm md:max-w-md"
        >
          <div onClick={handleAvatarClick} className="cursor-pointer">
            <RobotAvatar isCollapsed={chatbot.isCollapsed} />
          </div>
          <AnimatePresence>
            {!chatbot.isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  duration: 0.3,
                }}
                className="flex flex-col space-y-2"
              >
                <SpeechBubble message={chatbot.message} />
                <ChatbotButtons
                  onAgree={handleAgree}
                  onClose={handleClose}
                  disabled={isSending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
