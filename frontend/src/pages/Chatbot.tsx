import React, { useState, useEffect } from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import axios from "axios";


type Message = {
  text: string;
  sender: "user" | "bot";
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
  
    try {
      const response = await axios.post("http://localhost:3002/chatbot", {
        query: input,
      });
  
      const botResponse = response.data.response;
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I'm having trouble understanding you." }]);
    }
  
    setInput("");
  };
  

  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById("chat-input");
      inputElement?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "12px 18px",
            borderRadius: "45%",
            backgroundColor: "#2b2b2b",
            color: "#fff",
            fontSize: "20px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <QuestionAnswerIcon
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "450px",
            backgroundColor: "#2b2b2b",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "bottom 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#2b2b2b",
              color: "#fff",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "18px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Shoezzy Chatbot
            <button
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  margin: "8px 0",
                }}
              >
                {message.sender === "bot" && (
                  <img
                    src="src/assets/react.svg"
                    alt="Bot Avatar"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginBottom: "4px",
                    }}
                  />
                )}
                <div
                  style={{
                    backgroundColor:
                      message.sender === "user" ? "#2b2b2b" : "#e4e6eb",
                    color: message.sender === "user" ? "#fff" : "#000",
                    padding: "10px 15px",
                    borderRadius: "18px",
                    maxWidth: "70%",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                    fontSize: "14px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#888",
                    marginTop: "4px",
                  }}
                >
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                  margin: "10px 0",
                }}
              >
                Bot is typing...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                marginRight: "8px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#2b2b2b",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
