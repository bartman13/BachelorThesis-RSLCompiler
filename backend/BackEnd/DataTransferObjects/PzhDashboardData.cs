using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class PzhDashboardData
    {
        public string LastMonth { get; set; }
        public int Lekkie { get; set; }
        public int Poważne { get; set; }
        public int Ciężkie { get; set; }
        public int[] AppsPerDay { get; set; } 
        public List<Row> Rows { get; set; }
    }
    public class Row
    {
        public int Id { get; set; }
        public DateTime Data_Wystąpienia { get; set; }
        public DateTime Data_Utworzenia { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Stopień { get; set; }
    }
}
