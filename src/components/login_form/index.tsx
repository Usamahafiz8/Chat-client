import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { ApiList, CustonAxios } from "./../api/index.tsx";

import io from 'socket.io-client';

interface CustomerLoginProps {
  url: string;
  authToken: string;
  onChatStart: (conversationID: string, userEmail: string) => void;
}

const CustomerLogin = ({ url, authToken, onChatStart }: CustomerLoginProps) => {
  const [data, setData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  interface Message {
    _id: string;
    conversationId: string;
    senderemail: string;
    message: string;
    time: string;
    date: string;
  }

  const [login, setLogin] = useState(false);

  //   check if the url and auth
  useEffect(() => {
    // Check if url and authToken exist and set the login state accordingly
    if (url && authToken) {
      setLogin(true);
      // Clear email and name fields when url and authToken are present
      setData({ name: "", email: "" });
    } else {
      setLogin(false);
    }
  }, [url, authToken]);

  const validateEmail = (email: string) => {
    // Basic email validation (you can customize this based on your requirements)
    if (!email) {
      return "Email is required.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email address.";
    }
    return "";
  };

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log({login})
    // If login is not enabled (url and authToken missing), validate and process the form
    if (!login) {
      // Perform client-side validation
      const emailError = validateEmail(data.email);

      if (emailError) {
        setErrors({
          ...errors,
          email: emailError,
        });
        return;
      }

      // Process the form data and start the conversation
      const res = await CustonAxios.post(ApiList.Users.startConversation, {
        fullName: data.name,
        email: data.email,
        role: "guest",
      });

      if (res.status === 400) {
        alert("Invalid credentials");
      } else {
        console.log("HERE ")
        const resData = res.data;
        let id = resData.conversation._id;
        onChatStart(id, data.email);
      }
    }
    // If login is enabled (url and authToken present), start conversation with admin
    else {
      console.log("ELSE")
      const res = await CustonAxios.post(ApiList.Users.startConversation, {
        fullName: "", // Empty name
        email: "",   // Empty email
        role: "guest",
        url,
        auth_token: authToken,
      });

      if (res.status === 400) {
        alert("Invalid credentials");
      } else {
        const resData = res.data;
        let id = resData.conversation._id;
        onChatStart(id, data.email);
      }
    }
  };
  
//   // @ts-ignore
//   const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
//   // const [conversationId, setConversationId] = useState<string>(''); // Set the conversation ID
//   // const [senderEmail, setSenderEmail] = useState<string>(''); // Set the sender's email
//   const [messages, setMessages] = useState<Message[]>([]); // Messages received from the socket
//   // 64c8a915628d763bd3fccdf8 osama@gmail.com
// const senderEmail = 'osama@gmail.com';
// const conversationId = '64c8a915628d763bd3fccdf8'
//   // setSenderEmail("qwer@gmail.com")
//   // setConversationId('64c782167ceb23f0b58e2b00')
//   useEffect(() => {
//     const newSocket = io('http://localhost:8080'); // Replace with your socket server URL
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);
//   const [error, setError] = useState<string>(''); // Error message received from the socket


//   useEffect(() => {
//     if (!socket) return;

//     // Listen for incoming messages or error responses from the socket
//     socket.on('getuserMessagesResponse', (response: { messages?: Message[], error?: string }) => {
//       if (response.messages) {
//         setMessages(response.messages);
//         setError('');
//       } else if (response.error) {
//         setError(response.error);
//         setMessages([]);
//       }
//     });

//     return () => {
//       socket.off('getuserMessagesResponse');
//     };
//   }, [socket]);

//   const handleGetMessages = () => {
//     if (!socket) return;

//     // Emit a message to request messages through the socket
//     socket.emit('getuserMessages', {
//       conversationId,
//       senderemail: senderEmail,
//       // url: 'http://localhost:5000/api/get-data',
//       // auth_token: '991e7836-c9c9-41ee-8968-aacb27cbef65',
//     });
//   };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
      }}
    >
   <div>
      {/* Your component UI */}
      {/* <button onClick={handleGetMessages}>Get Messages</button>
      {error && <p>Error: {error}</p>}
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message) => (
            <li key={message._id}>
              <strong>{message.senderemail}</strong> - {message.message} ({message.date} {message.time})
            </li>
          ))}
        </ul>
      </div> */}
    </div>
      {login ? (
        <Button onClick={handleLogin} variant="outlined">
          Start Conversation with admin
        </Button>
      ) : (
        <>
          <h1
            style={{
              fontWeight: 600,
              fontSize: "16px",
              color: "#1F2937",
            }}
          >
            Fill the form to start the chat
          </h1>
          <TextField
            style={{ backgroundColor: "White" }}
            label="Name"
            variant="outlined"
            fullWidth
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <TextField
            style={{ backgroundColor: "White" }}
            label="Email"
            variant="outlined"
            fullWidth
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <Button
            variant="contained"
            fullWidth
            style={{
              background: "#EC5C2A",
              fontWeight: 600,
              fontSize: "16px",
            }}
            startIcon={<ChatOutlinedIcon />}
            onClick={handleLogin}
          >
            Start chat
          </Button>
        </>
      )}
    </div>
  );
};

export default CustomerLogin;
