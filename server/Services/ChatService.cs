using Microsoft.EntityFrameworkCore;
using server.Repositories;
using server.ViewModels;

namespace server.Services
{
    public class ChatService:IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public Task<List<ChatSummary>> GetUserChats(string username)
        {
            return _chatRepository.GetUserChats(username);
        }

        public Task<List<Chats>> GetUserChats(string username,string friendUsername)
        {
            return _chatRepository.GetUserChats(username, friendUsername);
        }
    }
}
