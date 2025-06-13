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
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost(Name = "adduser")]
        public Result AddUser([FromBody] User user)
        {
            return _userService.AddUser(user);
        }

        [HttpGet(Name = "validateuser")]
        public Result ValidateUser([FromQuery] string userName, [FromQuery] string password) { 
            return _userService.ValidateUser(userName, password);
        }
    }
}
