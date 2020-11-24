using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Uzytkownicy
    {
        public Uzytkownicy()
        {
            PacjenciLekarz = new HashSet<Pacjenci>();
            PacjenciUzyt = new HashSet<Pacjenci>();
            ZgloszeniaLekarz = new HashSet<Zgloszenia>();
            ZgloszeniaUzyt = new HashSet<Zgloszenia>();
        }

        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Tel { get; set; }
        public string Email { get; set; }
        public int Rola { get; set; }
        public string Login { get; set; }
        public string Haslo { get; set; }

        public virtual ICollection<Pacjenci> PacjenciLekarz { get; set; }
        public virtual ICollection<Pacjenci> PacjenciUzyt { get; set; }
        public virtual ICollection<Zgloszenia> ZgloszeniaLekarz { get; set; }
        public virtual ICollection<Zgloszenia> ZgloszeniaUzyt { get; set; }
    }
}
