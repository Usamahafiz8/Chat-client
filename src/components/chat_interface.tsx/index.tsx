// import ChatMessageInput from "./input_message";
import ChatMessages from "./messages";

interface ChatMessagesProps {
    conversationId: string; // Add a prop to pass the conversation ID
    Email: string; // Add a prop to pass the conversation ID
  }

export const ChatInterface = ({conversationId, Email}:ChatMessagesProps) => {
  return (
    <>
          <ChatMessages conversationId={conversationId} email={Email} />
      {/* <div
        style={{
          height: "500px",
          width: "350px",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ChatMessageInput email={Email} conversationId={conversationId} />       </div> */}
    </>
  );
};

// export {ChatMessageInput, ChatMessages}
