import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import "../Dashboard.css";
import ChatsBar from "./ChatsBar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import signalRService from "./signalRService";

const Dashboard: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [selectedFriend, setSelectedFriend] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [messages, setMessages] =useState<Map<string,Set<any>>>(new Map());
  const location = useLocation();
  const username = location.state?.username;
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (username && !isConnectedRef.current) {
      isConnectedRef.current = true;
      signalRService.setConnection(username);
      signalRService.onReceiveChatList((list) => {
        setChatList(list);
      });
      signalRService.startConnection().then(() => {
        setConnection(signalRService.connection);
        signalRService.requestChatList();
      });
    }
  }, [username]);

  return (
    <div className="container">
      <TopBar></TopBar>
      <div className="dashboard-container">
        <SideBar></SideBar>
        <div className="main-content">
          <div className="main-body">
            <ChatsBar
              setSelectedFriend={setSelectedFriend}
              chatList={chatList}
            ></ChatsBar>
            <ChatWindow
              selectedFriend={selectedFriend}
              connection={connection}
              messages={messages}
              setMessages={setMessages}
            ></ChatWindow>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
