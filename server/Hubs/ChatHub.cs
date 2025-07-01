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
        private readonly IUserConnectionManager _connectionManager;
        public ChatHub(IChatRepository chatRepository, IUserRepository userRepository, IUserConnectionManager connectionManager)
        {
            _chatRepository = chatRepository;
            _userRepository = userRepository;
            _connectionManager = connectionManager;
        }

        public async Task SendOffer(string targetUser, string offer)
        {
            var user = _connectionManager.GetConnectionId(targetUser);
            await Clients.Client(user).SendAsync("ReceiveOffer", Context.GetHttpContext().Request.Query["username"].ToString(), offer);
        }

        public async Task SendAnswer(string targetUser, string answer, long time)
        {
            var user = _connectionManager.GetConnectionId(targetUser);
            await Clients.Client(user).SendAsync("ReceiveAnswer", Context.GetHttpContext().Request.Query["username"].ToString(), answer, time);
        }

        public async Task SendIceCandidate(string targetUser, string candidate)
        {
            var user = _connectionManager.GetConnectionId(targetUser);
            await Clients.Client(user).SendAsync("ReceiveIceCandidate", Context.GetHttpContext().Request.Query["username"], candidate);
        }
        public override Task OnConnectedAsync()
        {
            var username = Context.GetHttpContext()?.Request.Query["username"];
            if (!string.IsNullOrEmpty(username))
            {
                _connectionManager.AddUser(username, Context.ConnectionId);
                Console.WriteLine($"Connected: {username} -> {Context.ConnectionId}");
            }
            return base.OnConnectedAsync();
        }

        public async Task EndCall(string targetUser)
        {
            var user = _connectionManager.GetConnectionId(targetUser);
            await Clients.Client(user).SendAsync("EndCall");
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _connectionManager.RemoveConnection(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
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
            var user = _connectionManager.GetConnectionId(friendUsername);
            await Clients.Client(user).SendAsync("ReceiveMessage", chat);
        }
    }
}
