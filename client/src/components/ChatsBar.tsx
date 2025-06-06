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
];

const ChatsBar: React.FC = () => {
  return (
    <div>
      <div className="chat-desc">Chats</div>
      <div className="chat-search">
        <input className="search" type="text" placeholder="Search chats..." />
      </div>
      <div className="chat-list">
        {chats.map((chat, index) => (
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
