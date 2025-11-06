"use client";

import { motion } from "framer-motion";

interface TypingDotsProps {
  className?: string;
}

export function TypingDots({ className = "" }: TypingDotsProps) {
  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate="animate"
      className={`flex items-center space-x-1 ${className}`}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          className="w-2 h-2 bg-slate-400 rounded-full"
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
