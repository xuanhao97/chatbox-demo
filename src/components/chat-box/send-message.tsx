import { CornerDownLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import React from "react";
import { Message, messagesCache, User } from "@/data/user";
import { faker } from "@faker-js/faker";
import { Input } from "../ui/input";

const maxContentLength = 200;

export interface SendMessageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  scrollRef: React.MutableRefObject<{
    index: number;
    align: "start" | "end";
  } | null>;
}

const SendMessage = ({
  setMessages,
  total,
  messages,
  setTotal,
  scrollRef,
}: SendMessageProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [currentUser] = React.useState<User>({
    name: `Xuan Hao(You)`,
    id: total,
    avatar: faker.image.avatar(),
  });

  const [content, setContent] = React.useState("");

  const onSendMessage = () => {
    const contentTrim = content.trim();
    if (!contentTrim) return;

    const message: Message = {
      user: currentUser,
      content: contentTrim,
      id: total + 1,
    };
    const newMessages = [...messages, message];
    setMessages(newMessages);
    messagesCache.push(message);
    setTotal(total + 1);
    setContent("");

    scrollRef.current = {
      index: newMessages.length - 1,
      align: "end",
    };
    inputRef.current?.focus();
  };

  return (
    <div className="relative shrink-0 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Input
        ref={inputRef}
        autoFocus
        value={content}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            onSendMessage();
          }
        }}
        onChange={(event) => {
          setContent(event.target.value.slice(0, maxContentLength));
        }}
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        <Button
          onClick={() => {
            onSendMessage();
          }}
          size="sm"
          className="ml-auto gap-1.5"
        >
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default SendMessage;
