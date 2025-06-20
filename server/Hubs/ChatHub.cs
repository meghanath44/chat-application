using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Repositories;
using server.ViewModels;

namespace server.Hubs
{
    public class ChatHub:Hub
    {
        private readonly IChatRepository _chatRepository;
        public ChatHub(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            Console.WriteLine($"User connected: {username}");
            //var chats = await _chatRepository.GetUserChats(username);
           // await Clients.Caller.SendAsync("ReceiveChatList", chats);
        }
        public async Task sendMessageToUser(string message, string email) {
            await Clients.All.SendAsync("receiveMessage", email, message);
        }

        public async Task GetChatList()
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            var chats = await _chatRepository.GetUserChats(username);
            await Clients.Caller.SendAsync("ReceiveChatList", chats);
        }

        public async Task GetChat(string friendUsername)
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            var chats = await _chatRepository.GetUserChats(username, friendUsername);
            await Clients.Caller.SendAsync("ReceiveChat", chats);
        }
        
    }
}
