using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class UserConnectionManager : IUserConnectionManager
    {
        private readonly Dictionary<string, string> _userMap = new();

        public void AddUser(string username, string connectionId)
        {
            _userMap[username] = connectionId;
        }

        public void RemoveConnection(string connectionId)
        {
            var item = _userMap.FirstOrDefault(kv => kv.Value == connectionId);
            if (!string.IsNullOrEmpty(item.Key))
            {
                _userMap.Remove(item.Key);
            }
        }

        public string? GetConnectionId(string username)
        {
            return _userMap.TryGetValue(username, out var connId) ? connId : null;
        }
    }
}
