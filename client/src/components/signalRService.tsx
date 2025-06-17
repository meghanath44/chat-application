import * as signalR from "@microsoft/signalr";

class signalRService {
  public connection: signalR.HubConnection | undefined;

  public setConnection = (username: string) => {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44330/chatHub?username=${username}`, {}) // pass username in query
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  };

  public startConnection = async () => {
    if (this.connection) {
      try {
        await this.connection.start();
        console.log("SignalR connected");
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    }
  };

  public onReceiveChatList = (callback: (chatList: any[]) => void) => {
    if (this.connection) {
      this.connection.on("ReceiveChatList", callback);
    }
  };

  public requestChatList = () => {
    if (this.connection)
      this.connection.invoke("GetChatList").catch((err) => console.error(err));
  };

  public requestChat = (selectedFriend: string) => {
    if (this.connection)
      this.connection
        .invoke("GetChat", selectedFriend)
        .catch((err) => console.log(err));
  };

  public onReceiveChat = (callback: (chatList: any[]) => void) => {
    if (this.connection) {
      this.connection.on("ReceiveChat", callback);
    }
  };
}

export default new signalRService();
