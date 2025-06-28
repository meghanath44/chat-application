import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import "../Dashboard.css";
import ChatsBar from "./ChatsBar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import signalRService from "./signalRService";
import VideoCallModal from "./VideoCallModal";

const Dashboard: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [selectedFriend, setSelectedFriend] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [messages, setMessages] =useState<Map<string,Set<any>>>(new Map());
  const [callFlag, setCallFlag] = useState("");

  const isConnectedRef = useRef(false);

  const location = useLocation();
  const username = location.state?.username;

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

  const endVideoCall = () =>{
    setCallFlag("");
  }

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
              setCallFlag={setCallFlag}
            ></ChatWindow>
          </div>
        </div>
        {connection && <VideoCallModal callFlag={callFlag} setCallFlag={setCallFlag} connection={connection} selectedFriend={selectedFriend}/>}
      </div>
    </div>
  );
};
export default Dashboard;
