using Newtonsoft.Json;

namespace BackEnd.DataTransferObjects
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public int Rola { get; set; }
        public string Login { get; set; }
        public string Haslo { get; set; }
        public string Token { get; set; }
        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }

    }
    
    
}
