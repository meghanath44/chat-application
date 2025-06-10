using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.ViewModels;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost(Name = "adduser")]
        public Result AddUser([FromBody] User user)
        {
            Result result = new Result()
            {
                isSuccess = true
            };
            return result;
        }
    }
}
