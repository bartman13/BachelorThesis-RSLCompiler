using BackEnd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class DotorZgłoszenieInfo
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public bool ProsbaOKontakt { get; set; }
        public string Pacjent_Imie { get; set; }
        public string Pacjent_Nazwisko { get; set; }
        public int decyzja { get; set; }
        public Pliki ZdjecieKsZd { get; set; }
    }
}
