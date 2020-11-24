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

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly NopContext _context;


        public LoginController(NopContext context)
        {


            _context = context;
        }


        // GET: Login
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Token/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: Login
        [HttpPost]
        public IActionResult SignIn([FromBody] AuthenticateRequest value)
        {
            try
            {
                if (value == null)
                {
                    return BadRequest("SingInObject was null");
                }
                if(!ModelState.IsValid)
                {
                    return BadRequest("Invalid SignInObject");
                }

                var user = _context.Uzytkownicy.FirstOrDefault((user) => (user.Email == value.Email && user.Haslo == value.Haslo));
                if(user == null)
                {

                    return NotFound(value.Email);
                }

                AuthenticateResponse response = new AuthenticateResponse(user);
                
                response.Token = Token.generateJwtToken(user);

                return Ok(response);
                
               


                

            }
            catch(Exception)
            {
                return StatusCode(500, "Internal server error");
            }
            
            
            
        }
        
    }
}
