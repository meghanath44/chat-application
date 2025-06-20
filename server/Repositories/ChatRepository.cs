using Microsoft.EntityFrameworkCore;
using server.Models;
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

        public async Task<List<ViewMessage>> GetUserChats(string username,string friendUsername)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync((u) => ((u.UserName == username) || (u.Email == username)));

            var fuser = await _dbContext.Users.FirstOrDefaultAsync((u) => ((u.UserName == friendUsername) || (u.Email == friendUsername)));

            if (user == null || fuser == null) return new List<ViewMessage>();
            var userId = user.UserId;
            var fuserId = fuser.UserId;

            var messages = await _dbContext.Messages.Where(m => ((m.SenderId == userId && m.ReceiverId == fuserId) || (m.SenderId == fuserId && m.ReceiverId == userId))).ToListAsync();
            var chats = messages.Select(m =>
            {
                return new ViewMessage
                {
                    SenderUsername = (m.SenderId==userId)?username:friendUsername,
                    ReceiverUsername = (m.SenderId != userId) ? username : friendUsername,
                    MessageText = m.MessageText,
                    SentAt = m.SentAt
                };
            }).OrderByDescending(m =>m.SentAt).ToList();

            return chats;
        }
    }
}
