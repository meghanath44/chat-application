using server.Models;
using server.Repositories;
using server.ViewModels;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Result AddUser(User user)
        {
            return _userRepository.AddUser(user);
        }

        public Result ValidateUser(string username, string password)
        {
            return _userRepository.ValidateUser(username, password);
        }
    }
}
