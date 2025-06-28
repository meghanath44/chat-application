using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public interface IUserConnectionManager
    {
        void AddUser(string username, string connectionId);
        void RemoveConnection(string connectionId);
        string? GetConnectionId(string username);
    }
}
