import { Message } from "@/data/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { memo } from "react";

export interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="flex gap-2">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={message.user.avatar} alt="Avatar" />
        <AvatarFallback>
          <Skeleton />
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1 flex-1">
        <div className="flex gap-2">
          <p className="text-sm font-medium line-clamp-1 break-all">
            {message.user.name}
          </p>
          <p className="text-xs items-center text-muted-foreground whitespace-nowrap">
            {message.id}
          </p>
        </div>
        <p className="text-sm text-muted-foreground hyphens-auto break-word">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default memo(MessageItem);
