using server.ViewModels;

namespace server.Services
{
    public interface IChatService
    {
        public Task<List<ChatSummary>> GetUserChats(string username);

        public Task<List<Chats>> GetUserChats(string username,string friendUsername);
    }
}
