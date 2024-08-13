import { getMessages, Message } from "@/data/user";
import MessageItem from "./message-item";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MoveDown } from "lucide-react";

export interface MessageListProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  scrollRef: React.MutableRefObject<{
    index: number;
    align: "start" | "end";
  } | null>;
}
function MessageList({ messages, setMessages, scrollRef }: MessageListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const count = messages.length;

  const [hasMore, setHasMore] = useState(true);

  /**
   * I have used a virtualizer to render the list of messages.
   * This will help in rendering only the visible items in the viewport.
   */
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  });

  const items = virtualizer.getVirtualItems();

  const fetchData = useCallback(() => {
    const { data, hasMore } = getMessages(messages.length, 20);
    const newMessages = [...data, ...messages];
    setMessages(newMessages);
    setHasMore(hasMore);

    // if reverse scrolling scroll to the last element
    scrollRef.current = {
      index: newMessages.length - messages.length,
      align: "start",
    };
  }, [messages, scrollRef, setMessages]);

  useEffect(
    function handleScrollToIndex() {
      if (count && scrollRef.current) {
        const { index, align } = scrollRef.current;
        virtualizer.scrollToIndex(index, { align });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count]
  );

  useEffect(
    function handleObserverScroll() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "top" && hasMore) {
              fetchData();
            }
          }
        });
      });

      if (topRef.current) {
        observer.observe(topRef.current);
      }

      return () => {
        observer.disconnect();
      };
    },
    [fetchData, hasMore]
  );
  const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

  const isShowScrollDownButton = lastItem && lastItem.index !== count - 1;

  return (
    <div className="h-full">
      <div className="h-full overflow-auto" ref={parentRef}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div id="top" ref={topRef} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => {
              const message = messages[virtualRow.index];
              const lastMessage = messages[virtualRow.index - 1];
              if (!message) return null;
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className={cn("py-4 px-4", lastMessage && "pb-2")}
                >
                  <MessageItem message={message} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Button
        size={"icon"}
        className={cn(
          "rounded-full size-8 absolute bottom-2 left-1/2 z-10",
          isShowScrollDownButton ? "visible" : "invisible"
        )}
        onClick={() => {
          virtualizer.scrollToIndex(count - 1);
        }}
      >
        <MoveDown className="size-4" />
      </Button>
    </div>
  );
}

export default memo(MessageList);
