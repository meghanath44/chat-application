using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Repositories;
using server.ViewModels;

namespace server.Hubs
{
    public class ChatHub:Hub
    {
        private readonly IChatRepository _chatRepository;
        private readonly IUserRepository _userRepository;
        private readonly Dictionary<string, string> _usernameMap;
        public ChatHub(IChatRepository chatRepository, IUserRepository userRepository)
        {
            _chatRepository = chatRepository;
            _userRepository = userRepository;
            _usernameMap = new Dictionary<string, string>();
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            Console.WriteLine($"User connected: {username}");
            _usernameMap[username] = Context.UserIdentifier;
            //var chats = await _chatRepository.GetUserChats(username);
           // await Clients.Caller.SendAsync("ReceiveChatList", chats);
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

        public async Task SendMessageToFriend(string friendUsername, string message)
        {
            var username = Context.GetHttpContext().Request.Query["username"];
            //var chats = await _chatRepository.GetUserChats(username, friendUsername);
            //var fUser = _userRepository.GetUser(friendUsername);
            var chat = new ViewMessage
            {
                SenderUsername = username,
                ReceiverUsername = friendUsername,
                MessageText = message,
                SentAt = DateTime.Now
            };
            await Clients.User(_usernameMap.GetValueOrDefault(friendUsername)).SendAsync("ReceiveMessage", chat);
        }
    }
}
