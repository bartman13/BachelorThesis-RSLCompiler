using BackEnd.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Tel { get; set; }
        public string Email { get; set; }
        public int Rola { get; set; }
        public string Login { get; set; }
        public string Haslo { get; set; }
        public string Token { get; set; }
        public AuthenticateResponse(Uzytkownicy user)
        {
            Id = user.Id;
            Imie = user.Imie;
            Nazwisko = user.Nazwisko;
            Tel = user.Tel;
            Email = user.Email;
            Rola = user.Rola;
            Login = user.Login;
            Haslo = user.Haslo;
        }
    }
    public static class Token
    {
        public static string generateJwtToken(Uzytkownicy user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes("aijsdhaksjdkajsdhkajdhkasjsdhaksjdhakjdhakjhdsakjhaskjdhaksjdakjdakjd");
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
