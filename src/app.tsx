import ChatBox from "./components/chat-box";

export default function App() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-dvh w-full">
      <h1 className="text-xl font-semibold">Welcome to the chat box.</h1>
      <ChatBox />
    </div>
  );
}
