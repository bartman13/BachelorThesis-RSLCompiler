using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class RefreshToken
    {
        public int Id { get; set; }
        public int UzytId { get; set; }
        public string Token { get; set; }
        public DateTime TokenWygasa { get; set; }
        public DateTime Utworzone { get; set; }
        public string UtworzonePrzezIp { get; set; }
        public DateTime? Anulowane { get; set; }
        public string AnulowanePrzezIp { get; set; }
        public string ZastapionePrzezToken { get; set; }

        public virtual Uzytkownicy Uzyt { get; set; }
    }
}
