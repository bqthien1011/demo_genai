"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { ChatLayout } from "@/components/chat/ChatLayout";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { PromptCard } from "@/components/chat/PromptCard";
import { TypingDots } from "@/components/TypingDots";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { chatTheme } from "@/lib/theme/chatbox";
import { cn } from "@/lib/utils";
import { useConversation } from "@/hooks/useConversation";
import { useProductContext } from "@/lib/context/ProductContext";
import { downloadImage } from "@/lib/services/chatApi";
import { AIGeneratedProduct } from "@/lib/types/product";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

// API Message interface for type safety
interface ApiMessage {
  id: string;
  conversation_id: string;
  created_at: string;
  role: "user" | "assistant";
  content: string;
  images: string[];
  tool_calls: unknown[];
  artifact?: unknown;
  meta?: Record<string, unknown>;
}

const initialMessages: Message[] = [
  {
    id: "assistant-1",
    text: "Xin chào! Mình là AI stylist của cửa hàng trang sức, mình có thể hỗ trợ bạn tìm thiết kế phù hợp trong vài bước.",
    isUser: false,
  },
  {
    id: "assistant-2",
    text: "Bạn đang quan tâm đến kiểu trang sức nào hôm nay? Nhẫn cầu hôn, vòng cổ, hay một món quà đặc biệt?",
    isUser: false,
  },
];

export default function ChatBox({ minimized }: { minimized?: boolean } = {}) {
  const [messages, setMessages] = useState<Message[]>(() => initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUploadActive, setIsUploadActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!minimized);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update expanded state when minimized prop changes
  useEffect(() => {
    setIsExpanded(!minimized);
  }, [minimized]);

  // Use the conversation hook for API integration
  const {
    messages: apiMessages,
    isLoading,
    error,
    sendUserMessage,
    clearError,
  } = useConversation();

  // Use product context for suggestions
  const {
    setSuggestedProducts,
    setIsLoading: setProductLoading,
    setAIMode,
    setAIProducts,
  } = useProductContext();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const isMountedRef = useRef(false);

  const promptItems = [
    {
      title: "Nhẫn kim cương",
      description: "Nhẫn kim cương cao cấp, quà kỷ niệm",
      raw: "Tôi đang tìm mua một chiếc nhẫn kim cương cao cấp. Tôi muốn kiểu dáng sang trọng, tinh tế, chất liệu bạch kim hoặc vàng trắng. Nhẫn gắn viên kim cương lớn, trong suốt, độ tinh khiết cao, màu sắc sáng lấp lánh. Phong cách thiết kế hiện đại nhưng vẫn giữ sự đẳng cấp. Size khoảng 16. Ngân sách của tôi không giới hạn, có thể từ vài trăm triệu đến vài tỷ đồng, miễn là sản phẩm thật sự độc đáo và xứng đáng. Mục đích là để làm quà kỷ niệm đặc biệt.",
    },
    {
      title: "Quà tặng sinh nhật",
      description: "Gợi ý trang sức cho từng nhóm tuổi và cá tính",
      raw: "Tôi đang tìm mua một chiếc nhẫn thời trang làm quà sinh nhật cho bạn gái 25 tuổi. Tôi muốn kiểu dáng nhẹ nhàng, hiện đại và trẻ trung. Chất liệu có thể là bạc hoặc vàng hồng, màu sắc chủ đạo là hồng vàng hoặc bạc sáng. Nhẫn có gắn một viên đá màu nhỏ, tốt nhất là birthstone theo tháng sinh. Size khoảng 14, và ngân sách tôi dự kiến nằm trong khoảng 5 đến 7 triệu đồng.",
    },
    {
      title: "Trang sức cưới",
      description: "Nhẫn cưới kim cương, 20-25 triệu",
      raw: "Tôi đang tìm mua một chiếc nhẫn cưới kim cương với các yêu cầu sau đây:\n• Kiểu dáng nhẫn: Nhẫn cưới, thiết kế đơn giản nhưng tinh tế.\n• Chất liệu: Vàng trắng.\n• Đá quý/chi tiết trang trí: Có gắn một viên kim cương nhỏ ở giữa.\n• Màu sắc chủ đạo: Vàng trắng sáng.\n• Phong cách thiết kế: Sang trọng, hiện đại.\n• Kích thước/size: Size 16.\n• Ngân sách dự kiến: Khoảng 20 – 25 triệu đồng.\n• Mục đích sử dụng: Nhẫn cưới.",
    },
  ];

  // Sync API messages with display messages
  useEffect(() => {
    console.log("API messages updated:", apiMessages.length);
    if (apiMessages.length > 0) {
      // Convert API messages to display format
      const displayMessages: Message[] = apiMessages.map(
        (apiMsg: ApiMessage) => ({
          id: apiMsg.id,
          text: apiMsg.content,
          isUser: apiMsg.role === "user",
          image: apiMsg.images.length > 0 ? apiMsg.images[0] : undefined,
        })
      );

      // Replace initial messages with API messages when we have them
      setMessages(displayMessages);

      // Check for product suggestions in the latest assistant message
      const latestAssistantMessage = apiMessages
        .filter((msg) => msg.role === "assistant")
        .slice(-1)[0];

      if (latestAssistantMessage?.artifact?.type === "product_suggestions") {
        // Parse product suggestions from artifact
        const suggestedProducts = latestAssistantMessage.artifact.design
          ? [latestAssistantMessage.artifact.design]
          : [];
        if (suggestedProducts.length > 0) {
          setSuggestedProducts(
            suggestedProducts.map((design) => ({
              id: design.id,
              name: design.name,
              image: design.images[0] || "",
              price: 0, // Default price, could be enhanced
              description: design.description,
              tags: [], // Could be parsed from properties
              category: "suggested",
            }))
          );
        }
      }

      // Check for AI generated images in tool_calls
      if (
        latestAssistantMessage?.tool_calls &&
        latestAssistantMessage.tool_calls.length > 1
      ) {
        console.log("Found tool_calls:", latestAssistantMessage.tool_calls);
        const respondToolCall = latestAssistantMessage.tool_calls[1] as any;
        console.log("Respond tool call:", respondToolCall);
        if (
          respondToolCall?.name === "respond_to_user" &&
          respondToolCall.arguments?.artifact?.design?.images
        ) {
          console.log("Found artifact images:", respondToolCall.arguments.artifact.design.images);
          const imageIds =
            respondToolCall.arguments.artifact.design.images.filter(
              (id: string) => id && id.trim() !== ""
            );
          console.log("Filtered image IDs:", imageIds);
          if (imageIds.length > 0) {
            console.log("Found image IDs:", imageIds);
            // Download images and update AI products
            const downloadPromises = imageIds.map((id: string) => {
              console.log("Downloading image:", id);
              return downloadImage(id);
            });
            Promise.all(downloadPromises)
              .then((imageUrls) => {
                console.log("Downloaded image URLs:", imageUrls);
                const design = respondToolCall.arguments.artifact.design;
                const aiProducts: AIGeneratedProduct[] = imageUrls.map(
                  (imageUrl, index) => ({
                    id: `${design.id || `ai-${Date.now()}`}-${index}`,
                    name: design.name || "AI Generated Design",
                    imageUrl: imageUrl,
                    image: imageUrl,
                    price: 0,
                    description: design.description || "",
                    tags: [],
                    category: "ai-generated",
                    isAIGenerated: true,
                    aiDescription: design.description || "",
                  })
                );
                console.log("Created AI products:", aiProducts);
                // Set AI mode and products
                setAIMode(true);
                setAIProducts(aiProducts);
              })
              .catch((error) => {
                console.error("Failed to download AI images:", error);
              });
          }
        }
      }
    }
  }, [apiMessages, setSuggestedProducts]);

  // Show loading state
  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      // Add error message to chat with retry option
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `${error}\n\n_Try sending your message again._`,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [error]);

  useEffect(() => {
    isMountedRef.current = true;
    const storedUrls = objectUrlsRef.current;
    return () => {
      isMountedRef.current = false;
      storedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");

    // Clear any previous errors
    clearError();

    try {
      // Send message via API
      await sendUserMessage(trimmed);

      // The hook will handle updating messages, so we don't need to do it here
      // The messages will be updated through the hook's state
    } catch (err) {
      console.error("Failed to send message:", err);
      // Error handling is done in the hook
    }
  };

  const handlePromptClick = async (prompt: string) => {
    try {
      clearError();
      await sendUserMessage(prompt);
    } catch (err) {
      console.error("Failed to send prompt:", err);
      // Error handling is done in the hook
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to base64 for API
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result as string;

      try {
        clearError();
        await sendUserMessage(
          input || "Mình gửi mẫu trang sức này để bạn tham khảo",
          [base64Image]
        );
        setInput("");
      } catch (err) {
        console.error("Failed to send image:", err);
        // Error handling is done in the hook
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleUploadClick = () => {
    setIsUploadActive(true);
    fileInputRef.current?.click();

    setTimeout(() => {
      if (!isMountedRef.current) {
        return;
      }
      setIsUploadActive(false);
    }, 500);
  };

  const messagesView = (
    <div
      className={cn(
        "flex h-full flex-col gap-5 overflow-y-auto px-6 py-8",
        "scrollbar-thin scrollbar-thumb-slate-300/60 scrollbar-track-transparent"
      )}
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          text={msg.text}
          image={msg.image}
          isUser={msg.isUser}
          renderMarkdown={!msg.isUser}
        />
      ))}
      {isTyping ? (
        <div
          className={cn(
            "group relative max-w-[72%] rounded-3xl px-6 py-4 text-sm leading-relaxed transition-all duration-200",
            "shadow-[0_18px_40px_-20px_rgba(32,79,150,0.35)] ring-1 ring-white/40 backdrop-blur-xl",
            "bg-white/85 text-slate-900"
          )}
        >
          <TypingDots />
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </div>
  );

  const promptsView = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Prompt suggestions
        </h2> */}
        <span className="text-xs text-slate-400">
          Chọn nhanh để bắt đầu trò chuyện
        </span>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {promptItems.map((item) => (
            <CarouselItem key={item.raw} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <PromptCard
                  title={item.title}
                  description={item.description}
                  onSelect={() => handlePromptClick(item.raw)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="shadow-lg" />
        <CarouselNext className="shadow-lg" /> */}
      </Carousel>
    </div>
  );

  const composerView = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div
        className={cn(
          chatTheme.glassPanel,
          "flex items-center gap-3 rounded-full px-4 py-2"
        )}
      >
        <button
          type="button"
          onClick={handleUploadClick}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full transition",
            "bg-slate-100/80 text-slate-600 hover:bg-slate-200/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60",
            isUploadActive ? "scale-95" : "active:scale-95"
          )}
          aria-label="Tải ảnh lên"
        >
          {isUploadActive ? (
            <span className="pointer-events-none absolute inset-0 rounded-full bg-slate-300/60 opacity-80 animate-[ping_0.6s_ease-out]" />
          ) : null}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16V8a2 2 0 012-2h12a2 2 0 012 2v8M4 16l4-4a2 2 0 012.828 0l2.344 2.344a2 2 0 002.828 0L20 10M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            />
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              const form = event.currentTarget.closest("form");
              if (form) {
                const submitEvent = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                form.dispatchEvent(submitEvent);
              }
            }
          }}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none overflow-y-auto max-h-32 min-h-[1.5rem]"
          rows={1}
          autoFocus
        />
        <button
          type="submit"
          className={cn(
            chatTheme.accentButton,
            chatTheme.accentButtonHover,
            "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
    </form>
  );

  return minimized && !isExpanded ? (
    <div className="h-screen flex items-end justify-end p-4">
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Expand ChatBox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  ) : (
    <ChatLayout
      className="h-screen"
      messages={messagesView}
      prompts={promptsView}
      composer={composerView}
    />
  );
}
