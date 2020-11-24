using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Pacjenci
    {
        public Pacjenci()
        {
            Zgloszenia = new HashSet<Zgloszenia>();
        }

        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public DateTime DataUrodzenia { get; set; }
        public int UzytId { get; set; }
        public int? LekarzId { get; set; }

        public virtual Uzytkownicy Lekarz { get; set; }
        public virtual Uzytkownicy Uzyt { get; set; }
        public virtual ICollection<Zgloszenia> Zgloszenia { get; set; }
    }
}
