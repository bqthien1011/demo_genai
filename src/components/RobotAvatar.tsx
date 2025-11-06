"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface RobotAvatarProps {
  isCollapsed?: boolean;
}

export function RobotAvatar({ isCollapsed = false }: RobotAvatarProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
        delay: 0.2,
      }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
          isCollapsed
            ? "bg-gradient-to-br from-gray-400 to-gray-600"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
      >
        <Bot className="w-6 h-6 text-white" />
        {isCollapsed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs">?</span>
          </motion.div>
        )}
      </motion.div>

      {/* Animated pulse ring */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-blue-400 rounded-full -z-10"
      />
    </motion.div>
  );
}
