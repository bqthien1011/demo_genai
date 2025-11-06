"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface ChatbotButtonsProps {
  onAgree: () => void;
  onClose: () => void;
}

export function ChatbotButtons({ onAgree, onClose }: ChatbotButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      className="flex space-x-2"
    >
      <Button
        onClick={onAgree}
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Đồng ý
      </Button>

      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
      >
        Đóng
      </Button>
    </motion.div>
  );
}
