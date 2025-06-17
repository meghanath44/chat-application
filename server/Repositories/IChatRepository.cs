using server.ViewModels;

namespace server.Repositories
{
    public interface IChatRepository
    {
        public Task<List<ChatSummary>> GetUserChats(string username);

        public Task<List<Chats>> GetUserChats(string username,string friendUsername);
    }
}
