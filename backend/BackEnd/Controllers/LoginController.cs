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
using BC = BCrypt.Net.BCrypt;
using System.Security.Cryptography;
using System.Text;
using BackEnd.Helpers;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace BackEnd.Controllers
{
    
    [ApiController]
    public class LoginController : BaseController
    {

        //private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        private readonly NopContext _context;
        private readonly AppSettings _appSettings;


        public LoginController(NopContext context,
            IMapper mapper, IOptions<AppSettings> appSettings)
        {
            //_accountService = accountService;
            _mapper = mapper;
            _context = context;
            _appSettings = appSettings.Value;
        }
        
        [HttpPost("Test")]
        public IActionResult Test()
        {
            return (Ok("ok"));
        }
        
        /// <summary>
        /// Zwraca dane o użytkowniku wraz z krótkoterminowym tokenem dostępu i 
        /// długoterminowym refresh tokenem umiesczonym w plikach cookies. 
        /// </summary>
        /// <param name="value"> Email i hasło użytkownika </param>
        /// <returns> Dane o użytkowniku </returns>
        [HttpPost("SignIn")]
        public IActionResult SignIn([FromBody] AuthenticateRequest value)
        {
            var response = Authenticate(value, ipAddress());

            setTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        /// <summary>
        /// Na podstawie długoterminowego refresh-tokenu umieszczonego w plikach cookies tworzy i zwraca
        /// nowy krótkoterminowy token dostępu
        /// </summary>
        /// <returns> Dane o użytkowniku wraqz z krótkoterminowym tokenem </returns>
        [HttpPost("refresh-token")]
        public ActionResult<AuthenticateResponse> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = RefreshToken(refreshToken, ipAddress());
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
        [HttpPost("ParentSignUp")]
        public IActionResult ParentSignUp([FromBody] SignUpParentRequest value)
        {
            
            if (_context.Uzytkownicy.Any(x => x.Email == value.Email))
            {
                throw new AppException("Email Exist");
            }

            // map model to new account object
            var account = _mapper.Map<Uzytkownicy>(value);
            account.HashHasla = BC.HashPassword(value.Haslo);
            // first registered account is an admin
            account.Rola = (int)Role.Rodzic;
            account.Utworzone = DateTime.UtcNow;
            account.VerificationToken = randomTokenString();
            account.AkceptacjaWarunkow = true;
         
            // save account
            _context.Uzytkownicy.Add(account);
            _context.SaveChanges();
            sendVerificationEmail(account, Request.Headers["origin"]);
            return Ok();
        }
        [HttpPost("verify-email")]
        public IActionResult VerifyEmail(VerifyEmailRequest model)
        {
            
            var account = _context.Uzytkownicy.SingleOrDefault(x => x.VerificationToken == model.Token);

            if (account == null) throw new AppException("Verification failed");

            account.Zweryfikowany = DateTime.UtcNow;
            account.VerificationToken = null;

            _context.Uzytkownicy.Update(account);
            _context.SaveChanges();
            return Ok(new { message = "Verification successful, you can now login" });
        }
        
        /// <summary>
        /// Wyloguwuje obecnie zalogowanego użytownika, czyli usuwa plik cookies z długoterminowym 
        /// refresh-tokenem.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("Logout")]
        public IActionResult LogOut()
        {
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }
        private AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var account = _context.Uzytkownicy.SingleOrDefault(x => x.Email == model.Email);

            if (account == null || account.Zweryfikowany == null ||  !BC.Verify(model.Haslo, account.HashHasla))
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
        private AuthenticateResponse RefreshToken(string token, string ipAddress)
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
            if (refreshToken.TokenWygasa < DateTime.UtcNow) throw new AppException("Invalid token");
            return (refreshToken, account);
        }
        private void RevokeToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);
            // revoke token and save
            refreshToken.Anulowane = DateTime.UtcNow;
            refreshToken.AnulowanePrzezIp = ipAddress;
            _context.Update(account);
            _context.SaveChanges();
        }
       
     
        private void Send(string to, string subject, string html, string from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _appSettings.EmailFrom));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings.SmtpHost, _appSettings.SmtpPort, SecureSocketOptions.StartTls);
            smtp.Authenticate(_appSettings.SmtpUser, _appSettings.SmtpPass);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
        private void sendVerificationEmail(Uzytkownicy account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/verify-email/{account.VerificationToken}";
                message = $@"<p>Please click the below link to verify your email address:</p>
                             <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{account.VerificationToken}</code></p>";
            }

            Send(
                to: account.Email,
                subject: "Sign-up Verification API - Verify Email",
                html: $@"<h4>Verify Email</h4>
                         <p>Thanks for registering!</p>
                         {message}"
            );
        }
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgotPasswordRequest model)
        {
            var account = _context.Uzytkownicy.SingleOrDefault(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) throw new AppException("Email not found");

            // create reset token that expires after 1 day
            account.ResetToken = randomTokenString();
            account.ResetTokenWygasa = DateTime.UtcNow.AddDays(1);

            _context.Uzytkownicy.Update(account);
            _context.SaveChanges();

            // send email
            sendPasswordResetEmail(account, Request.Headers["origin"]);
            return Ok(new { message = "Please check your email for password reset instructions" });
        }
       

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest model)
        {
            var account = _context.Uzytkownicy.SingleOrDefault(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenWygasa > DateTime.UtcNow);

            if (account == null)
                throw new AppException("Invalid token");

            // update password and remove reset token
            account.HashHasla = BC.HashPassword(model.Password);
            account.Zaktualizowane = DateTime.UtcNow;
            account.ResetToken = null;
            account.ResetTokenWygasa = null;

            _context.Uzytkownicy.Update(account);
            _context.SaveChanges();
            return Ok(new { message = "Password reset successful, you can now login" });
        }

        private void sendPasswordResetEmail(Uzytkownicy account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/reset-password/{account.ResetToken}";
                message = $@"<p>Przoszę kliknąć w link aby przejść do resetu hasła</p>
                             <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                             <p><code>{account.ResetToken}</code></p>";
            }

            Send(
                to: account.Email,
                subject: "Sign-up Verification API - Reset Password",
                html: $@"<h4>Reset Password Email</h4>
                         {message}"
            );
        }
    }
}

