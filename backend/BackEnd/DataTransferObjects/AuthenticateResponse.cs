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
    
    
}
