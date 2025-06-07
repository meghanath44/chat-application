import { useState } from "react";
import "../Dashboard.css";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  time: string;
}

const chats: ChatItemProps[] = [
  { name: "Alice", lastMessage: "See you soon!", time: "10:45 AM" },
  { name: "Bob", lastMessage: "Got it!", time: "9:12 AM" },
  { name: "Charlie", lastMessage: "Hey there!", time: "Yesterday" },
  { name: "Alice", lastMessage: "See you soon!", time: "10:45 AM" },
  { name: "Bob", lastMessage: "Got it!", time: "9:12 AM" },
  { name: "Charlie", lastMessage: "Hey there!", time: "Yesterday" },
  { name: "Alice", lastMessage: "See you soon!", time: "10:45 AM" },
  { name: "Bob", lastMessage: "Got it!", time: "9:12 AM" },
  { name: "Charlie", lastMessage: "Hey there!", time: "Yesterday" },
  { name: "Alice", lastMessage: "See you soon!", time: "10:45 AM" },
  { name: "Bob", lastMessage: "Got it!", time: "9:12 AM" },
  { name: "Charlie", lastMessage: "Hey there!", time: "Yesterday" },
];

const ChatsBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="chats-bar">
      <div className="chat-desc">Chats</div>
      <div className="chat-search">
        <input
          className="search"
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>
      <div className="chat-list">
        {chats
          .filter((item) => {
            return item.name.toLowerCase().startsWith(searchQuery);
          })
          .map((chat, index) => (
            <div className="chat-item" key={index}>
              <div className="chat-avatar">{chat.name[0]}</div>
              <div className="chat-details">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-preview">{chat.lastMessage}</div>
              </div>
              <div className="chat-time">{chat.time}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatsBar;
