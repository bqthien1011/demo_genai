"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SpeechBubbleProps {
  message: string;
}

export function SpeechBubble({ message }: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);

    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 50); // Adjust typing speed here

    return () => clearInterval(timer);
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-200 max-w-xs md:max-w-sm"
    >
      <p className="text-gray-800 text-sm leading-relaxed">
        {displayedText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1 h-4 bg-gray-400 ml-1"
          />
        )}
      </p>

      {/* Speech bubble pointer */}
      <div className="absolute -left-2 bottom-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>

      {/* Shadow pointer */}
      <div className="absolute -left-2 bottom-2.5 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-200 border-b-8 border-b-transparent"></div>
    </motion.div>
  );
}
