import { useEffect, useRef, useState } from "react";
import "../Dashboard.css";

type Props = {
  selectedFriend : string;
}

const ChatWindow: React.FC<Props> = ({selectedFriend} : Props) => {
  const [messages, setMessages] = useState([
    { from: "Alice", text: "Hey, how are you?", mine: false },
    { from: "Me", text: "I’m good, thanks!", mine: true },
    { from: "Alice", text: "Wanna catch up later?", mine: false },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { from: "Me", text: input, mine: true }]);
      setInput("");
    }
  };

  return <div className="window">
    {(selectedFriend=="")?(<div>

    </div>):(
      <div className="chat-window">
      <div className="chat-desc">
        <div className="chat-desc-left">
          <div className="chat-avatar"></div>
          <div>{selectedFriend}</div>
        </div>
        <div className="chat-desc-right">
          <div className="video-icon" onClick={() => alert("Video call")}>
            📹
          </div>
          <div className="audio-icon" onClick={() => alert("Audio call")}>
            📞
          </div>
        </div>
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
        <div ref={bottomRef}></div>
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
    )};
    </div>
};

export default ChatWindow;
