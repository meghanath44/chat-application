using server.Models;
using server.ViewModels;

namespace server.Repositories
{
    public class UserRepository :IUserRepository
    {
        private readonly TestDBContext _dbContext;
        public UserRepository(TestDBContext context)
        {
          _dbContext = context;
        }
        public Result AddUser(User user)
        {
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return new Result() { isSuccess = true };
        }

        public Result ValidateUser(string username, string password)
        {
            return new Result() { isSuccess = false };  
        }
    }
}
 