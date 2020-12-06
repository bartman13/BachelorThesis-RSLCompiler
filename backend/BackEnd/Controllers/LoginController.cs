using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.DataTransferObjects;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Controllers
{
    
    [ApiController]
    public class LoginController : BaseController
    {

        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;




        public LoginController(IAccountService accountService,
            IMapper mapper)
        {
            _accountService = accountService;
            _mapper = mapper;
        }
        
        [HttpPost("SignIn")]
        public IActionResult SignIn([FromBody] AuthenticateRequest value)
        {
            var response = _accountService.Authenticate(value, ipAddress());
            setTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        
        [HttpPost("refresh-token")]
        public ActionResult<AuthenticateResponse> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = _accountService.RefreshToken(refreshToken, ipAddress());
            setTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}
