import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// @ts-ignore
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { ApiList, CustonAxios } from "../../../components/api/index.tsx";
import Header from "../../../components/layout/header/chat_header.tsx";


interface Message {
  _id: string;
  message: string;
  senderemail: string;
}

const CustomerChatBox: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const  {conversationId} = useParams<{ conversationId: string }>();
  // const conversationId = "64c767bc394a627f4116634f";
  // const conversationId = "64c782167ceb23f0b58e2b00";
console.log(conversationId);

  const email = "Osama@gmail.com";

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
        const res = await CustonAxios.post(
          ApiList.Users.sendMassage(conversationId),
          {
            senderemail: email, // Include the sender email in the request payload
            message: inputValue,
          }
        );

        console.log(res);

        // Send the message to the server through Socket.IO
        socket.emit("sendMessage", {
          conversationId,
          senderemail: email,
          message: inputValue,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isInputEmpty) {
      sendMessage();
    }
  };

  // Socket.IO connection
  const socket: Socket = io("http://localhost:8080");

  const fetchMessages = async () => {
    try {
      if (conversationId) {
        // Join the conversation room
        socket.emit("joinConversation", conversationId);

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

  useEffect(() => {
    // Listen for incoming messages from the socket server
    socket.on("getMessage", (data: any) => {
      const {  message, email } = data;
      const newMessage: Message = {
        _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
        senderemail: email,
        message,
      };
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    // Fetch initial messages and join the conversation room

    fetchMessages();

    // Clean up socket.io subscription on component unmount
    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Call the scroll function when chat state updates or new messages are received
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  // Socket.IO connection
  const socketRef = useRef<Socket>();
  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    // Clean up socket.io subscription on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch initial messages and join the conversation room
    fetchMessages();

    // Listen for incoming messages from the socket server
    socketRef.current?.on("getMessage", (data: any) => {
      const { message, senderemail } = data;
      const newMessage: Message = {
        _id: "temp-" + Date.now(), // Temporary ID until the server responds with the actual ID
        senderemail,
        message,
      };
      setChat((prevChat) => [...prevChat, newMessage]);
    });
  }, [conversationId, ]);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100wh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
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
          
          <Header onRefreshClick={fetchMessages} />
          <div
            style={{
              flex: 1, // Allow the chat messages to take remaining vertical space
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
                      alignItems:
                        message.senderemail  ? "flex-end" : "flex-start", // Change the alignment based on the user ID
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
                ))}
              </>
            ) : (
              <>send massage to start the conversation</>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OutlinedInput
              style={{ outlineColor: "#EC5C2A" }}
              color={"primary"}
              fullWidth
              placeholder="Type your message.."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress} // this line to handle Enter key press
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
        </Paper>
      </div>
    </>
  );
};

export default CustomerChatBox;
