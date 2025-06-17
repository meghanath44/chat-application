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
            var user = await _dbContext.Users
                .FirstOrDefaultAsync((u) => ((u.UserName == username) || (u.Email == username)));
        

            if (user == null) return new List<ChatSummary>();
            var userId = user.UserId;

            var messages = await _dbContext.Messages
     .Where(m => m.SenderId == userId || m.ReceiverId == userId)
     .ToListAsync(); // Fetch from DB first

            var chats = messages
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g =>
                {
                    var latestMessage = g.OrderByDescending(m => m.SentAt).First();
                    var friendId = latestMessage.SenderId == userId ? latestMessage.ReceiverId : latestMessage.SenderId;
                    return new { latestMessage, friendId };
                })
                .Join(_dbContext.Users,
                      x => x.friendId,
                      u => u.UserId,
                      (x, u) => new ChatSummary
                      {
                          FriendUserName = u.UserName,
                          LastMessage = x.latestMessage.MessageText,
                          LastMessageTime = x.latestMessage.SentAt
                      })
                .OrderByDescending(c => c.LastMessageTime)
                .ToList();


            return chats;
        }

        public async Task<List<Chats>> GetUserChats(string username,string friendUsername)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync((u) => ((u.UserName == username) || (u.Email == username)));

            var fuser = await _dbContext.Users.FirstOrDefaultAsync((u) => ((u.UserName == friendUsername) || (u.Email == friendUsername)));

            if (user == null || fuser == null) return new List<Chats>();
            var userId = user.UserId;
            var fuserId = fuser.UserId;

            var messages = await _dbContext.Messages.Where(m => ((m.SenderId == userId && m.ReceiverId == fuserId) || (m.SenderId == fuserId && m.ReceiverId == userId))).ToListAsync();
            var chats = messages.Select(m =>
            {
                return new Chats
                {
                    MessageText = m.MessageText,
                    MessageTime = m.SentAt,
                    MessageFlag = m.SenderId == userId ? "out" : "in"
                };
            }).OrderByDescending(m =>m.MessageTime).ToList();

            return chats;
        }
    }
}
