import CustomerLogin from "./login_form";
import ChatBoxLayout from "./layout/index.tsx";
import { useState } from "react";
import { ChatInterface } from "./chat_interface.tsx/index.tsx";

interface ChatProps {
  url: string;
  authToken: string;
}

const CustomerChatBox = ({ url, authToken }: ChatProps) => {
  const [conversationID, setConversationID] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleChatStart = (conversationID: string, userEmail: string) => {
    // Handle the redirection to the other component and pass the props
    setConversationID(conversationID);
    setUserEmail(userEmail);
  };

  console.count("CustomerChatBox")

  return (
    <ChatBoxLayout>
      {conversationID && userEmail ? (
        <div>
          <ChatInterface conversationId={conversationID} Email={userEmail}/>
          {conversationID}{userEmail}
        </div>
      ) : (
        <CustomerLogin url={url} authToken={authToken} onChatStart={handleChatStart} />
      )}
    </ChatBoxLayout>
  );
};

export default CustomerChatBox;
