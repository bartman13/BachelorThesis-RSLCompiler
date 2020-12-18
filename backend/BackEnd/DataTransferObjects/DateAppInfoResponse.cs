using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class DateAppInfoResponse
    {
        public DateTime Data { get; set; }
        public string Tytul { get; set; }
        public int Typ { get; set; }
        public List<AppEventResponse> Zdarzenia { get; set; }
    }
    public class AppEventResponse
    {
        public int Typ { get; set; }
        public string Tytul { get; set; }
        public string Tresc { get; set; }
    }
}
