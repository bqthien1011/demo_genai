import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import ChatBox from "@/components/ChatBox";
import { RobotChatbot } from "@/components/RobotChatbot";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="w-1/2">
          <ProductList />
          <RobotChatbot />
        </div>
        <div className="w-1/2 h-full">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
