using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class AtrybutyOdczynow
    {
        public AtrybutyOdczynow()
        {
            AtrybutyZgloszenia = new HashSet<AtrybutyZgloszenia>();
        }

        public int Id { get; set; }
        public int OdczynId { get; set; }
        public string Nazwa { get; set; }
        public int Typ { get; set; }
        public string Info { get; set; }
        public string Opis { get; set; }

        public virtual Odczyny Odczyn { get; set; }
        public virtual ICollection<AtrybutyZgloszenia> AtrybutyZgloszenia { get; set; }
    }
}
