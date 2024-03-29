﻿using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Uzytkownicy
    {
        public Uzytkownicy()
        {
            PacjenciLekarz = new HashSet<Pacjenci>();
            PacjenciUzyt = new HashSet<Pacjenci>();
            Pliki = new HashSet<Pliki>();
            RefreshToken = new HashSet<RefreshToken>();
            Zgloszenia = new HashSet<Zgloszenia>();
        }

        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public int Rola { get; set; }
        public string HashHasla { get; set; }
        public bool? AkceptacjaWarunkow { get; set; }
        public string VerificationToken { get; set; }
        public DateTime? Zweryfikowany { get; set; }
        public string ResetToken { get; set; }
        public DateTime? ResetTokenWygasa { get; set; }
        public DateTime? ResetHasla { get; set; }
        public DateTime? Utworzone { get; set; }
        public DateTime? Zaktualizowane { get; set; }

        public virtual ICollection<Pacjenci> PacjenciLekarz { get; set; }
        public virtual ICollection<Pacjenci> PacjenciUzyt { get; set; }
        public virtual ICollection<Pliki> Pliki { get; set; }
        public virtual ICollection<RefreshToken> RefreshToken { get; set; }
        public virtual ICollection<Zgloszenia> Zgloszenia { get; set; }
    }
}
