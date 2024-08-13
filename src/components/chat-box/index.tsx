import { useRef, useState } from "react";
import MessageList from "./message-list";
import SendMessage from "./send-message";
import { getMessages, Message } from "@/data/user";

const defaultMessagesResponse = getMessages(0, 20);

/**
 * This component is the main chat box component.
 * Messages not asynchronously loaded, but a fake data is used to show the messages.
 * Because I not using loading state.
 */
export default function ChatBox() {
  // I have used a fake data to show the messages.
  const [messages, setMessages] = useState<Message[]>(
    defaultMessagesResponse.data
  );
  const [total, setTotal] = useState(defaultMessagesResponse.total);

  /**
   * This ref is used to scroll to the last element when new messages are added.
   * This is message not asynchronous and will be used to scroll to the last element.
   */
  const scrollRef = useRef<{ index: number; align: "start" | "end" } | null>({
    index: messages.length - 1,
    align: "end",
  });

  return (
    <div className="relative overflow-y-auto p-1 flex w-[400px] h-[500px] flex-col rounded-xl bg-muted/50">
      <MessageList
        scrollRef={scrollRef}
        messages={messages}
        setMessages={setMessages}
      />
      <SendMessage
        messages={messages}
        setMessages={setMessages}
        total={total}
        setTotal={setTotal}
        scrollRef={scrollRef}
      />
    </div>
  );
}
