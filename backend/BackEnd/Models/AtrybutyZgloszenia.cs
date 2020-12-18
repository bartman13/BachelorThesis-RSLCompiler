using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class AtrybutyZgloszenia
    {
        public int Id { get; set; }
        public int OdzgId { get; set; }
        public int AtodId { get; set; }
        public string Wartosc { get; set; }

        public virtual AtrybutyOdczynow Atod { get; set; }
        public virtual OdczynyZgloszenia Odzg { get; set; }
    }
}
