using server.Models;
using server.ViewModels;

namespace server.Services
{
    public interface IUserService
    {
        public Result AddUser(User user);
        public Result ValidateUser(string username,string password);
    }
}
