using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class OdczynyZgloszenia
    {
        public OdczynyZgloszenia()
        {
            AtrybutyZgloszenia = new HashSet<AtrybutyZgloszenia>();
        }

        public int Id { get; set; }
        public int OdczynId { get; set; }
        public int ZgloszenieId { get; set; }
        public DateTime Data { get; set; }
        public DateTime DataWystapenia { get; set; }

        public virtual Odczyny Odczyn { get; set; }
        public virtual Zgloszenia Zgloszenie { get; set; }
        public virtual ICollection<AtrybutyZgloszenia> AtrybutyZgloszenia { get; set; }
    }
}
