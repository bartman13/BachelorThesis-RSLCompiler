using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class VaccineTransfer
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public string Opis { get; set; }
        public string PictureLink { get; set; }
        public string ProducentInfo { get; set; }
        public string ChorobyInfo { get; set; }
        public string ObecnaWiedzaInfo { get; set; }
        public string PrzeiwWskazaniaInfo { get; set; }
    }
}
