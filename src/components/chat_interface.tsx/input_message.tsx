import {  useState } from "react";
import { io, Socket } from "socket.io-client";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// @ts-ignore
import { useParams } from "react-router-dom";
import { ApiList, CustonAxios } from "../api";


interface  ChatMessageInputProp{
  email:string
  conversationId:string
}
const ChatMessageInput = ({email, conversationId}: ChatMessageInputProp) => {
  const [inputValue, setInputValue] = useState("");
  
  // Socket.IO connection
  const socket: Socket = io("http://localhost:8080");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const isInputEmpty = inputValue.trim() === "";

  const sendMessage = async () => {
    if (!isInputEmpty && conversationId) {
      try {
        // const newMessage: Message = {
        //   _id: "temp-" + Date.now(),
        //   senderemail: email,
        //   message: inputValue,
        // };
        setInputValue("");
        // No need to set the chat state in this component
        // It will be managed in the ChatMessages component

        // Send the message to the server through Axios
        const res = await CustonAxios.post(
          ApiList.Users.sendMassage(conversationId),
          {
            senderemail: email,
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


  return (
    <>
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
    </>
  );
};

export default ChatMessageInput;
