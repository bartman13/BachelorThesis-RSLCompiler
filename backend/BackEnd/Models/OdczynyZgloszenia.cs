using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class OdczynyZgloszenia
    {
        public int Id { get; set; }
        public int OdczynId { get; set; }
        public int ZgloszenieId { get; set; }
        public string Wartosc { get; set; }
        public DateTime Data { get; set; }

        public virtual Odczyny Odczyn { get; set; }
        public virtual Zgloszenia Zgloszenie { get; set; }
    }
}
