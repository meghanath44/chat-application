import { useState } from "react";
import "../Dashboard.css";
const ChatWindow: React.FC = () => {

  const [messages, setMessages] = useState([
    { from: "Alice", text: "Hey, how are you?", mine: false },
    { from: "Me", text: "I’m good, thanks!", mine: true },
    { from: "Alice", text: "Wanna catch up later?", mine: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { from: "Me", text: input, mine: true }]);
      setInput("");
    }
  };

  return (
    <div className="chat-window">
        <div className="chat-desc">
            <div className="chat-avatar">A</div>
            <div>Alice</div>
        </div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${msg.mine ? "mine" : "theirs"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input-area">
        <input
          className="message-input"
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
