using AutoMapper;
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
using System.Security.Cryptography;
using System.Text;


namespace BackEnd.Services
{
    public interface IAccountService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        void RevokeToken(string token, string ipAddress);
        void ParentRegister(SignUpParentRequest model);
        
    }

    public class AccountService : IAccountService
    {
        private readonly NopContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        //private readonly IEmailService _emailService;

        public AccountService(
            NopContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings)

        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;

        }
        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var account = _context.Uzytkownicy.SingleOrDefault(x => x.Email == model.Email && x.Haslo==model.Haslo);

            if (account == null ) 
                throw new AppException("Email or password is incorrect");

            // authentication successful so generate jwt and refresh tokens
            var jwtToken = generateJwtToken(account);
            var refreshToken = generateRefreshToken(ipAddress);
            account.RefreshToken.Add(refreshToken);

            // remove old refresh tokens from account
            removeOldRefreshTokens(account);

            //// save changes to db
            _context.Update(account);
            _context.SaveChanges();

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.Token = jwtToken;
            response.RefreshToken = refreshToken.Token;
            return response;
           
        }
        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken(ipAddress);
            refreshToken.Anulowane = DateTime.UtcNow;
            refreshToken.AnulowanePrzezIp = ipAddress;
            refreshToken.ZastapionePrzezToken = newRefreshToken.Token;
            account.RefreshToken.Add(newRefreshToken);

            removeOldRefreshTokens(account);

            _context.Update(account);
            _context.SaveChanges();

            //// generate new jwt
            var jwtToken = generateJwtToken(account);

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.Token = jwtToken;
            response.RefreshToken = newRefreshToken.Token;
            return response;
            
        }


        private string generateJwtToken(Uzytkownicy account)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", account.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private RefreshToken generateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = randomTokenString(),
                TokenWygasa = DateTime.UtcNow.AddDays(7),
                Utworzone = DateTime.UtcNow,
                UtworzonePrzezIp = ipAddress
            };
        }
        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }
        private void removeOldRefreshTokens(Uzytkownicy account)
        {
            var removeable = account.RefreshToken.ToList().FindAll(x => x.Utworzone.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.UtcNow);
            if (removeable != null)
            {
                foreach (var el in removeable)
                {
                    account.RefreshToken.Remove(el);
                }
            }
        }
        private (RefreshToken, Uzytkownicy) getRefreshToken(string token)
        {
            var account = _context.Uzytkownicy.SingleOrDefault(u => u.RefreshToken.Any(t => t.Token == token));
            if (account == null) throw new AppException("Invalid token");
            var refreshToken = _context.RefreshToken.Single(x => x.Token == token);
            if (refreshToken.TokenWygasa <  DateTime.UtcNow) throw new AppException("Invalid token");
            return (refreshToken, account);
        }
        public void RevokeToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);
            // revoke token and save
            refreshToken.Anulowane = DateTime.UtcNow;
            refreshToken.AnulowanePrzezIp = ipAddress;
            _context.Update(account);
            _context.SaveChanges();
        }
        public void ParentRegister(SignUpParentRequest model)
        {
            if (_context.Uzytkownicy.Any(x => x.Email == model.Email))
            {
                throw new AppException("Email Exist");
            }

            // map model to new account object
            var account = _mapper.Map<Uzytkownicy>(model);

            // first registered account is an admin
            account.Rola = (int)Role.Rodzic;
            account.Utworzone = DateTime.UtcNow;
            account.VerificationToken = randomTokenString();
            // save account
            _context.Uzytkownicy.Add(account);
            _context.SaveChanges();
            
        }
    }
}