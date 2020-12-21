using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class SzczepionkiOdczyny
    {
        public int Id { get; set; }
        public int OdczynId { get; set; }
        public int SzczepionkaId { get; set; }
        public int StopienCiezkosci { get; set; }
        public int? Czestosc { get; set; }

        public virtual Odczyny Odczyn { get; set; }
        public virtual Szczepionki Szczepionka { get; set; }
    }
}
