using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class DoctorAppResponse
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Nazwa_Szczepionki { get; set; }
        public DateTime Data { get; set; }
        public bool Status { get; set; }

    }
}
