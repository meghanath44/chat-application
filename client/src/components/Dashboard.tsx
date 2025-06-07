import ChatWindow from "./ChatWindow";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import "../Dashboard.css";
import ChatsBar from "./ChatsBar";

const Dashboard: React.FC = () => {
  return (
    <div className="container">
      <TopBar></TopBar>
      <div className="dashboard-container">
        <SideBar></SideBar>
        <div className="main-content">
          <div className="main-body">
            <ChatsBar></ChatsBar>
            <ChatWindow></ChatWindow>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
