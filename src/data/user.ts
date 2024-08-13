import { faker } from "@faker-js/faker";

export type User = {
  id: number;
  name: string;
  avatar?: string;
};

export type Message = {
  id: number;
  user: User;
  content: string;
};

export type MessageResponse = {
  data: Message[];
  total: number;
  hasMore: boolean;
};

export const messagesCache: Message[] = [];

function generateMessages(totalMessages: number): Message[] {
  for (let i = 0; i < totalMessages; i++) {
    const id = i + 1;

    const user: User = {
      name: faker.internet.userName(),
      id,
      avatar: faker.image.avatar(),
    };

    const content = faker.lorem.sentence();

    messagesCache.push({
      id,
      user,
      content,
    });
  }

  return messagesCache;
}

export const maxMessages = 1_000;
// generate singletons for the messages

(() => {
  if (messagesCache.length === maxMessages) return;
  generateMessages(maxMessages);
})();

export function getMessages(offset: number, limit: number): MessageResponse {
  const start = Math.max(messagesCache.length - offset - limit, 0);
  const end = messagesCache.length - offset;

  return {
    data: messagesCache.slice(start, end),
    total: messagesCache.length,
    hasMore: messagesCache.length > offset + limit,
  };
}
