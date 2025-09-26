using server.Models;
using server.ViewModels;
using System.Linq;

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
            int count = _dbContext.Users.Where<User>(u => u.UserName == username && u.Password == password).Count();
            return new Result() { isSuccess = (count==1) };  
        }

        public User GetUser(string username)
        {
            return _dbContext.Users.Where<User>(x => x.UserName == username).FirstOrDefault<User>();
        }
    }
}
 