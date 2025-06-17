import { useState } from "react";
import "../Dashboard.css";

interface ChatItemProps {
  friendUserName: string;
  lastMessage: string;
  lastMessageTime: string;
}

type Props = {
  setSelectedFriend: (friend: string) => void;
  chatList: ChatItemProps[];
};

const ChatsBar: React.FC<Props> = ({ setSelectedFriend, chatList }: Props) => {
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
        {chatList
          .filter((item) => {
            return item.friendUserName.toLowerCase().startsWith(searchQuery);
          })
          .map((chat, index) => (
            <div
              className="chat-item"
              key={index}
              onClick={(e) => setSelectedFriend(chat.friendUserName)}
            >
              <div className="chat-avatar">{chat.friendUserName[0]}</div>
              <div className="chat-details">
                <div className="chat-name">{chat.friendUserName}</div>
                <div className="chat-preview">{chat.lastMessage}</div>
              </div>
              <div className="chat-time">{chat.lastMessageTime}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatsBar;
