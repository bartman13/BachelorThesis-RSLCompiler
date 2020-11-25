using BackEnd.DataTransferObjects;
using BackEnd.Helpers;
using BackEnd.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;


namespace WebApi.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        Uzytkownicy GetById(int id);            // proponowana zmiana nazyw w Bazie danych Uzytkownicy to tak naprawe Uzytkownik
    }
    public class UserService : IUserService
    {
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications
       

        private readonly AppSettings _appSettings;
        private readonly NopContext _DbContext;


        public UserService(IOptions<AppSettings> appSettings, NopContext DbContext)
        {
            _appSettings = appSettings.Value;
            _DbContext = DbContext;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = _DbContext.Uzytkownicy.SingleOrDefault(x => x.Email == model.Email && x.Haslo == model.Haslo);

            // return null if user not found
            if (user == null) return null;

            // authentication successful so generate jwt token
            var token = GenerateJwtToken(user);
            var response = new AuthenticateResponse(user);
            response.Token = token;
            return response;
        }

        

        public Uzytkownicy GetById(int id)
        {
            return _DbContext.Uzytkownicy.FirstOrDefault(x => x.Id == id);
        }

        // helper methods

        private string GenerateJwtToken(Uzytkownicy user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}