import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Avatar, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { ApiList, CustonAxios } from "../api";

interface Message {
  _id: string;
  message: string;
  senderemail: string;
}

interface ChatMessagesProps {
  conversationId: string;
  email: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ conversationId, email }) => {
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const socket: Socket = io("http://localhost:8080"); // Create socket connection
  
  const fetchMessages = async () => {
    try {
      if (conversationId) {
        const res = await CustonAxios.get<{ messages: Message[] }>(
          ApiList.GetMassages(conversationId),
          {
            headers: {
              Authorization: `${localStorage.getItem("admin:token")}`,
            },
          }
        );
  
        if (res.status === 200) {
          const responseData = res.data;
          setChat(responseData.messages);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const isInputEmpty = inputValue.trim() === "";

  const sendMessage = async () => {
    if (!isInputEmpty && conversationId) {
      try {
        const newMessage: Message = {
          _id: "temp-" + Date.now(),
          senderemail: email,
          message: inputValue,
        };
        setChat((prevChat) => [...prevChat, newMessage]);
        setInputValue("");

        // Send the message to the server through Axios
        await CustonAxios.post(ApiList.Users.sendMassage(conversationId), {
          senderemail: email,
          message: inputValue,
        });

        // Send the message to the server through Socket.IO
        socket.emit("sendMessage", {
          conversationId,
          senderemail: email,
          message: inputValue,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
      fetchMessages()
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isInputEmpty) {
      sendMessage();
    }
  };


  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Listen for incoming messages from the socket server
    socket.on("getMessage", (data: any) => {
      const { senderemail, message } = data;
      const newMessage: Message = {
        _id: "temp-" + Date.now(),
        senderemail,
        message,
      };
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    // Join the conversation room
    if (conversationId) {
      socket.emit("joinConversation", conversationId);
    }

    // Clean up socket.io subscription on component unmount
    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chat]);

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
        {chat.length > 0 ? (
          <>
            {chat.map((message) => (
              <div
                key={message._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: message.senderemail ? "flex-end" : "flex-start",
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
                      <Avatar style={{ backgroundColor: "#EC5C2A" }}>U</Avatar>
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
            ))}
          </>
        ) : (
          <>Send a message to start the conversation with the support</>
        )}
      </div>
      <OutlinedInput
        style={{ outlineColor: "#EC5C2A" }}
        color="primary"
        fullWidth
        placeholder="Type your message..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="send message"
              color={isInputEmpty ? "default" : "primary"}
              disabled={isInputEmpty}
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


// const [inputValue, setInputValue] = useState("");
// const [chat, setChat] = useState<Message[]>([]);
// const socket = useRef<Socket | null>(null);

// const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setInputValue(event.target.value);
// };

// const isInputEmpty = inputValue.trim() === "";

// const sendMessage = () => {
//   if (!isInputEmpty && conversationId) {
//     // Emit the message to the server through Socket.IO
//     socket.current?.emit("sendMessage", {
//       conversationId,
//       senderemail: email,
//       message: inputValue,
//     });

//     setInputValue("");
//   }
// };

// const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//   if (event.key === "Enter" && !isInputEmpty) {
//     sendMessage();
//   }
// };

// useEffect(() => {
//   // Create a socket connection
//   socket.current = io("http://localhost:8080");

//   // Listen for incoming messages from the socket server
//   socket.current.on("getMessage", (data: any) => {
//     const { message, senderemail } = data;
//     const newMessage: Message = {
//       _id: "temp-" + Date.now(),
//       senderemail,
//       message,
//     };
//     setChat((prevChat) => [...prevChat, newMessage]);
//   });

//   // Fetch initial messages and join the conversation room
//   const fetchMessages = async () => {
//     try {
//       if (conversationId) {
//         const res = await CustonAxios.get<{ messages: Message[] }>(
//           ApiList.GetMassages(conversationId),
//           {
//             headers: {
//               Authorization: `${localStorage.getItem("admin:token")}`,
//             },
//           }
//         );

//         if (res.status === 200) {
//           const responseData = res.data;
//           setChat(responseData.messages);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   fetchMessages();

//   // Clean up socket.io subscription on component unmount
//   return () => {
//     if (socket.current) {
//       socket.current.disconnect();
//     }
//   };
// }, [conversationId]);

// const messagesContainerRef = useRef<HTMLDivElement>(null);

// // Scroll to the bottom of the messages container
// const scrollToBottom = () => {
//   if (messagesContainerRef.current) {
//     messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//   }
// };

// useEffect(() => {
//   scrollToBottom();
// }, [chat]);
// Scroll to the bottom of the messages container
// const scrollToBottom = () => {
  //   if (messagesContainerRef.current) {
    //     messagesContainerRef.current.scrollTop =
    //       messagesContainerRef.current.scrollHeight;
    //   }
    // };
    // useEffect(() => {
  //   // Listen for incoming messages from the socket server
  //   socket.on("getMessage", (data: any) => {
  //     const { message, email } = data;
  //     const newMessage: Message = {
  //       _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
  //       senderemail: email,
  //       message,
  //     };
  //     setChat((prevChat) => [...prevChat, newMessage]);
  //   });

  //   // Fetch initial messages and join the conversation room

  //   // fetchMessages();

  //   // Clean up socket.io subscription on component unmount
  //   scrollToBottom();
  //   fetchMessages();
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [conversationId, chat]);

  // Socket.IO connection
  // const socketRef = useRef<Socket>();








  
  // useEffect(() => {

  //   s.on("getMessage", (data: any) => {
  //     console.log("Socket called")
  //     const { message, email } = data;
  //     const newMessage: Message = {
  //       _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
  //       senderemail: email,
  //       message,
  //     };
  //     setChat((prevChat) => [...prevChat, newMessage]);
  //     scrollToBottom();
  //   });
  //   // Clean up socket.io subscription on component unmount
  //   return () => {
  //     s?.disconnect();
  //   };
  // }, [s]);


  // useEffect(() => {
  
  //   // Join the conversation room on connection
  //   // s.emit("joinConversation", conversationId);
  
  //   s.on("getMessage", (data: any) => {
  //     console.log("Socket called");
  //     const { message, email } = data;
  //     const newMessage: Message = {
  //       _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
  //       senderemail: email,
  //       message,
  //     };
  //     setChat((prevChat) => [...prevChat, newMessage]);
  //     scrollToBottom();
  //   });
  
  //   // Fetch messages by conversation ID and emit to the user's socket
  //   s.emit("getMessages", conversationId);
  
  //   return () => {
  //     s.disconnect(); // Clean up socket.io subscription on component unmount
  //   };
  // }, [conversationId]);

  
  

  // useEffect(() => {
  //   // Fetch initial messages and join the conversation room
  //   fetchMessages();            

  //   // Listen for incoming messages from the socket server
  //   socketRef.current?.on("getMessage", (data: any) => {
  //     const { message, senderemail } = data;
  //     const newMessage: Message = {
  //       _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
  //       senderemail,
  //       message,
  //     };
  //     setChat((prevChat) => [...prevChat, newMessage]);
  //   });
  // }, [conversationId, ]);

  //   const [chat, setChat] = useState<Message[]>([]);

  // // Socket.IO connection
  // const socket: Socket = io("http://localhost:8080");

  // const fetchMessages = async () => {
  //   try {
  //     if (conversationId) {
  //       // Join the conversation room
  //       socket.emit("joinConversation", conversationId);

  //       const res = await CustonAxios.get<{ messages: Message[] }>(
  //         ApiList.GetMassages(conversationId),
  //       );

  //       if (res.status === 200) {
  //         const responseData = res.data;
  //         setChat(responseData.messages);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  // useEffect(() => {
  //   // Listen for incoming messages from the socket server
  //   socket.on("getMessage", (data: any) => {
  //     const { message, email } = data;
  //     const newMessage: Message = {
  //       _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
  //       senderemail: email,
  //       message,
  //     };

  //     setChat((prevChat) => [...prevChat, newMessage]);
  //   });

  //   // Fetch initial messages and join the conversation room
  //   fetchMessages();

  //   // Clean up socket.io subscription on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [conversationId,]);

  // const messagesContainerRef = useRef<HTMLDivElement>(null);

  // // Scroll to the bottom of the messages container
  // const scrollToBottom = () => {
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTop =
  //       messagesContainerRef.current.scrollHeight;
  //   }
  // };

  // // Call the scroll function when chat state updates or new messages are received
  // useEffect(() => {
  //   scrollToBottom();
  // }, [chat]);



// import React, { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { Avatar, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
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
//   const socket = useRef<Socket | null>(null);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(event.target.value);
//   };

//   const isInputEmpty = inputValue.trim() === "";

//   const sendMessage = () => {
//     if (!isInputEmpty && conversationId) {
//       // Emit the message to the server through Socket.IO
//       socket.current?.emit("sendMessage", {
//         conversationId,
//         senderemail: email,
//         message: inputValue,
//       });

//       setInputValue("");
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter" && !isInputEmpty) {
//       sendMessage();
//     }
//   };
//   // Fetch initial messages and join the conversation room
//   const fetchMessages = async () => {
//     try {
//       if (conversationId) {
//         const res = await CustonAxios.get<{ messages: Message[] }>(
//           ApiList.GetMassages(conversationId),
//           {
//             headers: {
//               Authorization: `${localStorage.getItem("admin:token")}`,
//             },
//           }
//         );

//         if (res.status === 200) {
//           const responseData = res.data;
//           setChat(responseData.messages);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };
  
//   useEffect(() => {
//     // Create a socket connection
//     socket.current = io("http://localhost:8080");

//     // Listen for incoming messages from the socket server
//     socket.current.on("getMessage", (data: any) => {
//       const { message, senderemail } = data;
//       const newMessage: Message = {
//         _id: "temp-" + Date.now(),
//         senderemail,
//         message,
//       };
//       setChat((prevChat) => [...prevChat, newMessage]);
//     });

//     console.log('message');
    

//     fetchMessages();

//     // Clean up socket.io subscription on component unmount
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, [conversationId]);

//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Scroll to the bottom of the messages container
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chat]);

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
//       <button onClick={fetchMessages}>refresh</button>
//       <div
//         style={{
//           flex: 1,
//           overflowY: "scroll",
//           padding: "16px",
//         }}
//         ref={messagesContainerRef}
//       >
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
//                       <Avatar style={{ backgroundColor: "#EC5C2A" }}>
//                         U
//                       </Avatar>
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
//           </>
//         ) : (
//           <>Send massage to start the conversation with the support</>
//         )}
//       </div>
//       <OutlinedInput
//         style={{ outlineColor: "#EC5C2A" }}
//         color={"primary"}
//         fullWidth
//         placeholder="Type your message.."
//         value={inputValue}
//         onChange={handleInputChange}
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
