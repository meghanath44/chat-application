using server.ViewModels;

namespace server.Services
{
    public interface IChatService
    {
        public Task<List<ChatSummary>> GetUserChats(string username);
    }
}
