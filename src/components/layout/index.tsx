import { ReactNode } from "react";
import Header from "./header/chat_header";
import ChatBox from "./container";
import { ThemeProvider } from "@emotion/react";
import customTheme from "../theme";

interface CustomLayoutProps {
  children: ReactNode;
}

const ChatBoxLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme} >

    <ChatBox>
      <Header />
      {children}
    </ChatBox>
    </ThemeProvider>
  );
};

export default ChatBoxLayout;
