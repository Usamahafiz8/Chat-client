// const socket: Socket = io("http://localhost:8080"); // Create socket connection
// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import {
//   Avatar,
//   IconButton,
//   InputAdornment,
//   OutlinedInput,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import PersonIcon from "@mui/icons-material/Person";
// import { ApiList, CustonAxios } from "../api";

// interface Message {
//   _id: string;
//   message: string;
//   senderemail: string;
// }

// interface ChatMessagesProps {
//   conversationId: string;
//   email: string;
// }

// const ChatMessages: React.FC<ChatMessagesProps> = ({
//   conversationId,
//   email,
// }) => {

//   const [inputValue, setInputValue] = useState("");
//   const [chat, setChat] = useState<Message[]>([]);
//   const [socket, setSocket] = useState<Socket | false>(false);
//   // getting messages
//   const [messages, setMessages] = useState<Message[]>([]); // Messages received from the socket
//   const senderEmail = email;
//   useEffect(() => {
//     return () => {
//       if (socket) socket.disconnect();
//     };
//   }, []);
//   const [error, setError] = useState<string>(""); // Error message received from the socket

//   useEffect(() => {
//     console.log({ socket });
//     console.count("get_messages");

//     if (socket && socket?.connected) return;

//     if (!socket) {
//       setSocket(io("http://localhost:8080"));

//       console.log({ socket }, "Inner");
//     }
//     // Listen for incoming messages or error responses from the socket
//     if (socket) {
//       console.log({ socket }, "3rd");
//       socket.on(
//         "getuserMessages",
//         (response: { messages?: Message[]; error?: string }) => {
//           if (response.messages) {
//             setMessages(response.messages);
//             setError("");
//           } else if (response.error) {
//             setError(response.error);
//             setMessages([]);
//           }
//         }
//       );
//     }

//     return () => {
//       if (socket) socket.off("getuserMessagesResponse");
//     };
//   }, [socket]);

//   const handleGetMessages = () => {
//     setSocket(io("http://localhost:8080"));

//     if (!socket) return;

//     // Emit a message to request messages through the socket
//     socket.emit("getuserMessages", {
//       conversationId,
//       senderemail: senderEmail,
//     });
//   };

//   // sending message socket.io\

//   const fetchMessages = () => {
//     if (!socket) return;
//     // Emit a message to request messages through the socket
//     socket.emit("getuserMessages", {
//       conversationId,
//       senderemail: senderEmail,
//     });
//   };

//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Scroll to the bottom of the messages container
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop =
//         messagesContainerRef.current.scrollHeight;
//     }
//   }, [chat]);

//   const isInputEmpty = inputValue.trim() === "";

//   const sendMessage = async () => {
//     console.count("SendMessage");
//     setSocket(io("http://localhost:8080"));

//     if (!isInputEmpty && conversationId && socket) {
//       try {
//         const newMessage: Message = {
//           _id: "temp-" + Date.now(),
//           senderemail: email,
//           message: inputValue,
//         };
//         setChat((prevChat) => [...prevChat, newMessage]);
//         console.log("Emptying input value");
//         setInputValue("");

//         // Send the message to the server through Axios
//         // await CustonAxios.post(ApiList.Users.sendMassage(conversationId), {
//         //   senderemail: email,
//         //   message: inputValue,
//         // });

//         // Send the message to the server through Socket.IO
//         socket.emit("usersendMessage", {
//           conversationId,
//           senderEmail,
//           message: inputValue,
//         });
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//       fetchMessages();
//     }
//   };

//   const handleKeyPress = async (
//     event: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (event.key === "Enter" && !isInputEmpty) {
//       console.log("handleKeyPress");
//       await sendMessage();
//     }
//   };

//   console.count("-------------RENDERING AGAIN");

//   return (
//     <div
//       style={{
//         height: "500px",
//         width: "350px",
//         border: "1px solid #E5E7EB",
//         borderRadius: "8px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//       }}
//     >
//       <div
//         style={{
//           flex: 1,
//           overflowY: "scroll",
//           padding: "16px",
//         }}
//         ref={messagesContainerRef}
//       >
//         <div>
//           <h2>Messages:</h2>
//           <ul>
//             sa
//             {messages.map((message) => (
//               <li key={message._id}>
//                 <strong>{message.senderemail}</strong> - {message.message}
//                 sad{" "}
//               </li>
//             ))}
//           </ul>
//         </div>
//         {chat.length > 0 ? (
//           <>
//             {chat.map((message) => (
//               <div
//                 key={message._id}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: message.senderemail ? "flex-end" : "flex-start",
//                   margin: "8px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   {message.senderemail ? (
//                     <>
//                       <div
//                         style={{
//                           maxWidth: "550px",
//                           backgroundColor: "#EC5C2A",
//                           color: "white",
//                           borderRadius: "8px",
//                           padding: "8px 12px",
//                           marginRight: "8px",
//                         }}
//                       >
//                         {message.message}
//                       </div>
//                       <Avatar style={{ backgroundColor: "#EC5C2A" }}>
//                         <PersonIcon />
//                       </Avatar>
//                     </>
//                   ) : (
//                     <>
//                       <Avatar style={{ backgroundColor: "#EC5C2A" }}>U</Avatar>
//                       <div
//                         style={{
//                           backgroundColor: "#F3F4F6",
//                           borderRadius: "8px",
//                           padding: "8px 12px",
//                           marginLeft: "8px",
//                           maxWidth: "550px",
//                         }}
//                       >
//                         {message.message}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//             <div>
//               <h2>Messages:</h2>
//               <ul>
//                 {messages.map((message) => (
//                   <li key={message._id}>
//                     <strong>{message.senderemail}</strong> - {message.message}
//                     {/* ({message.date} {message.time}) */}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         ) : (
//           <>Send a message to start the conversation with the support</>
//         )}
//       </div>
//       {error && <p>Error: {error}</p>}
//       <button onClick={handleGetMessages}>Get Messages</button>

//       <OutlinedInput
//         style={{ outlineColor: "#EC5C2A" }}
//         color="primary"
//         fullWidth
//         placeholder="Type your message..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyPress={handleKeyPress}
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="send message"
//               color={isInputEmpty ? "default" : "primary"}
//               disabled={isInputEmpty}
//               onClick={sendMessage}
//             >
//               <SendIcon />
//             </IconButton>
//           </InputAdornment>
//         }
//       />
//     </div>
//   );
// };

// export default ChatMessages;

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Avatar,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

interface Message {
  _id: string;
  message: string;
  senderemail: string;
}

interface ChatMessagesProps {
  conversationId: string;
  email: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  conversationId,
  email,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleGetMessages = () => {
    if (!socket) return;

    socket.emit("getuserMessages", {
      conversationId,
      senderemail: email,
    });
  };

  const sendMessage = async () => {
    if (!socket) return;

    if (inputValue.trim() === "" || !conversationId) return;

    try {
      const newMessage: Message = {
        _id: "temp-" + Date.now(),
        senderemail: email,
        message: inputValue,
      };
      setChat((prevChat) => [...prevChat, newMessage]);
      setInputValue("");
      socket.emit("userSendMessage", {
        conversationId,
        senderemail: email,
        message: inputValue,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await sendMessage();
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    // handleGetMessages();
    socket.on(
      "getuserMessagesResponse",
      (response: { messages?: Message[]; error?: string }) => {
        if (response.messages) {
          setMessages(response.messages);
          setError("");
        } else if (response.error) {
          setError(response.error);
          setMessages([]);
        }
      }
    );

    return () => {
      socket.off("getuserMessagesResponse");
    };
  }, [socket, handleGetMessages(), chat]);

  return (
    <div
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
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
          padding: "16px",
        }}
        ref={messagesContainerRef}
      >
        <div>
          {messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <>
                  <div
                    key={message._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: message.senderemail
                        ? "flex-end"
                        : "flex-start",
                      margin: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {message.senderemail ? (
                        <>
                          <div
                            style={{
                              maxWidth: "550px",
                              backgroundColor: "#EC5C2A",
                              color: "white",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              marginRight: "8px",
                            }}
                          >
                            {message.message}
                          </div>
                          <Avatar style={{ backgroundColor: "#EC5C2A" }}>
                            <PersonIcon />
                          </Avatar>
                        </>
                      ) : (
                        <>
                          <Avatar style={{ backgroundColor: "#EC5C2A" }}>
                            U
                          </Avatar>
                          <div
                            style={{
                              backgroundColor: "#F3F4F6",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              marginLeft: "8px",
                              maxWidth: "550px",
                            }}
                          >
                            {message.message}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              <p>Send a message to start the conversation with the support</p>
            </>
          )}
        </div>
        
      </div>
      {error && <p>Error: {error}</p>}
      {/* <button onClick={handleGetMessages}>Get Messages</button> */}
      <OutlinedInput
        style={{ outlineColor: "#EC5C2A" }}
        color="primary"
        fullWidth
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="send message"
              color={inputValue.trim() === "" ? "default" : "primary"}
              disabled={inputValue.trim() === ""}
              onClick={sendMessage}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default ChatMessages;
