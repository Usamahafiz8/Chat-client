import { ReactNode } from "react";

interface CustomLayoutProps {
    children: ReactNode;
  }

const ChatBox : React.FC<CustomLayoutProps> = ({ children }) => {



  return (
    <div>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100wh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            minHeight: "500px",
            width: "350px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
