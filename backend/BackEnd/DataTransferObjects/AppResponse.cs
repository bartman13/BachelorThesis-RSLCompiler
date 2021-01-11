using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class AppResponse
    {
        public int Id { get; set; }
        public DateTime DataUtworzenia { get; set; }
        public DateTime DataSzczepienia { get; set; }
        public PacientResponse Pacjent { get; set; }
        public bool NoweDane { get; set; }
    }
    public class PacientResponse
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
    }
}
