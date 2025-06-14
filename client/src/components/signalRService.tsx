import * as signalR from"@microsoft/signalr";

class signalRService{

public connection:signalR.HubConnection | undefined;

public setConnection = (username: string) => {
  this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:44330/chatHub?username=${username}`,{}) // pass username in query
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};

public startConnection = async () => {
    if(this.connection){
try {
    await this.connection.start();
    console.log("SignalR connected");
  } catch (error) {
    console.error("Connection failed: ", error);
  }
    }
    
}

public onReceiveChatList = (callback: (chatList: any[]) => void) => {
    if(this.connection) {
        this.connection.on("ReceiveChatList", callback);
        console.log("onrecieve method");
    }
};

// public ReceiveChatList = (chatList:any[]) =>{
//     console.log(chatList);
// };

public requestChatList = () => {
  if(this.connection) this.connection.invoke("GetChatList").catch(err => console.error(err));
};
}

export default new signalRService();
