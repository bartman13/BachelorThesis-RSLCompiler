using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class DoctorAddDecision
    {
        public int Decyzja { get; set; }
        public string Komentarz { get; set; }
        public int ZgloszenieId { get; set; }
    }
}
