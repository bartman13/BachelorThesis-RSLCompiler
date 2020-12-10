using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class EventResponse
    {
        public DateTime Data { get; set; }
        public string Tytul { get; set; }
        public string Tresc { get; set; }
    }
}
