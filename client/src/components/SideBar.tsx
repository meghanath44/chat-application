import '../Dashboard.css';
const SideBar:React.FC = () =>{
    return (
    <div className="sidebar">
      <div className="sidebar-icon active" title="Chats">💬</div>
      <div className="sidebar-icon" title="Notifications">🔔</div>
      <div className="sidebar-icon" title="Profile">👤</div>
    </div>);
}

export default SideBar;