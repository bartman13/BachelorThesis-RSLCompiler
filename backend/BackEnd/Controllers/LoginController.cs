using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using BackEnd.DataTransferObjects;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.IdentityModel.Tokens;
using WebApi.Services;

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private IUserService _userService;



        public LoginController(IUserService userService)
        {


            _userService = userService;
        }
        
        [HttpPost]
        public IActionResult SignIn([FromBody] AuthenticateRequest value)
        {
            var user = _userService.Authenticate(value);
            if (user == null) return BadRequest(new { message = "Username or password is incorrect" });
            return Ok(user);
        }
        
    }
}
