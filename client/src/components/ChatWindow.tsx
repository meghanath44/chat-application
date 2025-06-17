import { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import signalRService from "./signalRService";

type Props = {
  selectedFriend: string;
  connection: signalR.HubConnection | undefined;
};

const ChatWindow: React.FC<Props> = ({ selectedFriend, connection }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  signalRService.connection = connection;

  useEffect(() => {
    signalRService.onReceiveChat((list) => {
      setMessages(list);
    });
    if (signalRService.connection?.state) {
      signalRService.requestChat(selectedFriend);
    }
  }, [selectedFriend]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([
        ...messages,
        { messageFlag: "out", messageText: input, messageTime: true },
      ]);
      setInput("");
    }
  };

  return (
    <div className="window">
      {selectedFriend == "" ? (
        <div></div>
      ) : (
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
                className={`message-bubble ${
                  msg.messageFlag == "out" ? "mine" : "theirs"
                }`}
              >
                {msg.messageText}
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
      )}
      ;
    </div>
  );
};

export default ChatWindow;
