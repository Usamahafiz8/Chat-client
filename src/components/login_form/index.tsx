import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { ApiList, CustonAxios } from "./../api/index.tsx";

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

    // Perform client-side validation
    const emailError = validateEmail(data.email);

    if (emailError) {
      setErrors({
        ...errors,
        email: emailError,
      });
      return;
    }

    const res = await CustonAxios.post(ApiList.Users.startConversation, {
      fullName: data.name,
      email: data.email,
      role: "guest",
    });

    if (res.status === 400) {
      alert("Invalid credentials");
    } else {
      const resData = res.data;
      let id = resData.conversation._id;
      let userEmail = data.email;
      onChatStart(id, userEmail)
      // Call the callback function with the conversation ID and email as arguments
      // onChatStart(id, userEmail);
    }
  };

  // const handleLogin = async (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   // Perform client-side validation
  //   const emailError = validateEmail(data.email);

  //   if (emailError) {
  //     setErrors({
  //       ...errors,
  //       email: emailError,
  //     });
  //     return;
  //   }

  //   const res = await CustonAxios.post(ApiList.Users.startConversation, {
  //     fullName: data.name,
  //     email: data.email,
  //     role: "guest",
  //   });

  //   if (res.status === 400) {
  //     alert("Invalid credentials");
  //   } else {
  //     const resData = res.data;
  //     let id = resData.conversation._id
  //     setconversationID(id)
  //     setemail(data.email)
  //   }
  // };

  const [login, setLogin] = useState(false);

  //   check if the url and auth
  useEffect(() => {
    // Check if url and authToken exist and set the login state accordingly
    if (url && authToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [url, authToken]);
  
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
           {login ? (
             <>
        <Button variant="outlined">Start Conversation with admin</Button>
        </>
      ) : (
        <>
        
        <h1 style={{ fontWeight: 600, fontSize: "16px", color: "#1F2937" }}>
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
        </>)}
        </div>
  );
};

export default CustomerLogin;