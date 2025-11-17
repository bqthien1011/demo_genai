"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  useConversation,
  UseConversationReturn,
} from "../../hooks/useConversation";

const ConversationContext = createContext<UseConversationReturn | null>(null);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const conversation = useConversation();

  return (
    <ConversationContext.Provider value={conversation}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = (): UseConversationReturn => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};
