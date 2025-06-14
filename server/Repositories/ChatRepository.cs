using Microsoft.EntityFrameworkCore;
using server.ViewModels;

namespace server.Repositories
{
    public class ChatRepository:IChatRepository
    {
        private readonly TestDBContext _dbContext;
        public ChatRepository(TestDBContext context)
        {
            _dbContext = context;
        }

        public async Task<List<ChatSummary>> GetUserChats(string username)
        {
            return new List<ChatSummary>();
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return new List<ChatSummary>();
            var userId = user.UserId;

            var chats = await (from m in _dbContext.Messages
                               where m.SenderId == userId || m.ReceiverId == userId
                               group m by m.SenderId == userId ? m.ReceiverId : m.SenderId into g
                               let latestMessage = g.OrderByDescending(m => m.SentAt).FirstOrDefault()
                               join u in _dbContext.Users
                                   on (latestMessage.SenderId == userId ? latestMessage.ReceiverId : latestMessage.SenderId)
                                   equals u.UserId
                               orderby latestMessage.SentAt descending
                               select new ChatSummary
                               {
                                   FriendUserName = u.UserName,
                                   LastMessage = latestMessage.MessageText,
                                   LastMessageTime = latestMessage.SentAt
                               }).ToListAsync();

            return chats;
        }
    }
}
