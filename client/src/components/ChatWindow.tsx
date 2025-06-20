import { useEffect, useRef, useState } from "react";
import "../Dashboard.css";
import { useLocation } from "react-router-dom";
import signalRService from "./signalRService";

type Props = {
  selectedFriend: string;
  connection: signalR.HubConnection | undefined;
  messages: Map<string,Set<any>>
  setMessages: React.Dispatch<React.SetStateAction<Map<string,Set<any>>>>;
};

const ChatWindow: React.FC<Props> = ({ selectedFriend, connection, messages, setMessages}: Props) => {
  const [selectedFriendMessages, setSelectedFriendMessages] = useState<Set<any>>(new Set<any>());
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  signalRService.connection = connection;
  const location=useLocation();
  const username = location.state?.username;
  const messagesRef = useRef<Map<string, Set<any>>>(new Map());

  useEffect(()=>{
    messagesRef.current=messages;
  },[messages]);

  useEffect(()=>{
    const chatHandler = (list:any[]) => {
      if(list.length>0){
        const friendUsername = list[0].senderUsername!=username?list[0].senderUsername:list[0].receiverUsername;
        let msgs = new Map(messagesRef.current);
        msgs.set(friendUsername,new Set(list));
        setMessages(msgs);
      }
    };

    const messageHandler = (chat : any)=>{
      if(chat!=null){
        let msgs=new Set<any>();
        if(messagesRef.current.has(chat.senderUsername)){
          msgs=messagesRef.current.get(chat.senderUsername)??new Set<any>();
        }
        setMessages(new Map(messagesRef.current).set(chat.senderUsername,msgs.add(chat)));
      }
    };

    signalRService.onReceiveChat(chatHandler);
    signalRService.onReceiveMessage(messageHandler);

    return () => {
    signalRService.offReceiveChat(chatHandler);
    signalRService.offReceiveMessage(messageHandler);
  };
  },[connection]);

  useEffect(() => {
    if (signalRService.connection?.state) {
      if(messages.has(selectedFriend)){
        setSelectedFriendMessages(messages.get(selectedFriend)??new Set<any>());
      }
      else signalRService.requestChat(selectedFriend);
    }
  }, [selectedFriend]);

  useEffect(() => {
     let msgs=messages.get(selectedFriend);
     if(msgs){
      setSelectedFriendMessages(new Set(msgs));
     }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFriendMessages]);

  const handleSend = () => {
    if (input.trim() !== "") {
      if (signalRService.connection?.state) {
      signalRService.sendMessage(selectedFriend,input.trim());
      }
      let msgs=messages.get(selectedFriend)??new Set<any>();
      setMessages(new Map(messages).set(selectedFriend,msgs.add({ receiverUsername: selectedFriend, senderUsername:username, messageText: input, messageTime: new Date()})));
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
            {Array.from(selectedFriendMessages).map((msg, idx) => (
              <div
                key={idx}
                className={`message-bubble ${
                  msg.receiverUsername == selectedFriend ? "mine" : "theirs"
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
