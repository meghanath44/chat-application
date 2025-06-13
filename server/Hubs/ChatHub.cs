using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class ChatHub:Hub
    {
        public async Task sendMessageToUser(string message, string email) {
            await Clients.All.SendAsync("receiveMessage", email, message);
        }
    }
}
