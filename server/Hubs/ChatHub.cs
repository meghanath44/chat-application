using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class ChatHub:Hub
    {
        public async Task sendMessageToUser(string message, string username) {
            await Clients.Client(Context.ConnectionId).SendAsync(message, username);
        }
    }
}
