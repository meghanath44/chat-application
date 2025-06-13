using server.Models;
using server.ViewModels;

namespace server.Repositories
{
    public interface IUserRepository
    {
        public Result AddUser(User user);
        public Result ValidateUser(string username, string password);
    }
}
