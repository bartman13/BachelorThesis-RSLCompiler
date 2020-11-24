using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Odczyny
    {
        public Odczyny()
        {
            AtrybutyOdczynow = new HashSet<AtrybutyOdczynow>();
            OdczynyZgloszenia = new HashSet<OdczynyZgloszenia>();
            SzczepionkiOdczyny = new HashSet<SzczepionkiOdczyny>();
        }

        public int Id { get; set; }
        public string Nazwa { get; set; }

        public virtual ICollection<AtrybutyOdczynow> AtrybutyOdczynow { get; set; }
        public virtual ICollection<OdczynyZgloszenia> OdczynyZgloszenia { get; set; }
        public virtual ICollection<SzczepionkiOdczyny> SzczepionkiOdczyny { get; set; }
    }
}
