"use client";
import { useState } from "react";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import ChatBox from "@/components/ChatBox";
import { RobotChatbot } from "@/components/RobotChatbot";
import { TryOnSection } from "@/components/TryOnSection";
import { AIGeneratedProduct } from "@/lib/types/product";

export default function Home() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [chatBoxMinimized, setChatBoxMinimized] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<AIGeneratedProduct | null>(null);

  const dummyProduct = {
    id: "dummy",
    name: "Dummy Product",
    image: "",
    price: 0,
    description: "",
    tags: [],
    category: "",
    isAIGenerated: true as const,
    aiDescription: "",
    imageUrl: "",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-1/2">
          <ProductList
            setIsCustomizing={setIsCustomizing}
            setSelectedProduct={setSelectedProduct}
            setChatBoxMinimized={setChatBoxMinimized}
          />
          <RobotChatbot setChatBoxMinimized={setChatBoxMinimized} />
        </div>
        <div className="w-full md:w-1/2 h-full transition-all duration-300">
          {isCustomizing ? (
            <TryOnSection
              product={selectedProduct || dummyProduct}
              currentImage={selectedProduct?.imageUrl || ""}
            />
          ) : null}
        </div>
      </div>
      {/* Floating ChatBox */}
      {!chatBoxMinimized && (
        <div className="fixed top-0 right-0 w-1/2 h-full bg-white z-50 md:w-1/2">
          <div className="relative h-full">
            <ChatBox />
            <button
              onClick={() => setChatBoxMinimized(true)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
              title="Minimize ChatBox"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Minimized ChatBox Button */}
      {chatBoxMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setChatBoxMinimized(false)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
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
      )}
    </div>
  );
}
