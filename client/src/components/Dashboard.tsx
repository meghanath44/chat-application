import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import "../Dashboard.css";
import ChatsBar from "./ChatsBar";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Dashboard: React.FC = () => {

  const [connection, setConnection] =useState<signalR.HubConnection>();
  const [selectedFriend, setSelectedFriend] = useState("");
  
  useEffect(()=>{
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44330/chatHub",{})
      .withAutomaticReconnect()
      .build();

      setConnection(newConnection);
  },[]);

  useEffect(()=>{
    if(connection){
      connection.start()
        .then(()=>{
          console.log("connected");
        })
    }
  })

  return (
    <div className="container">
      <TopBar></TopBar>
      <div className="dashboard-container">
        <SideBar></SideBar>
        <div className="main-content">
          <div className="main-body">
            <ChatsBar setSelectedFriend = {setSelectedFriend}></ChatsBar>
            <ChatWindow
             selectedFriend = {selectedFriend}></ChatWindow>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
