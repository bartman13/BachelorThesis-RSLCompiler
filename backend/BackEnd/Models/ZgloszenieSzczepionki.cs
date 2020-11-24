using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class ZgloszenieSzczepionki
    {
        public int Id { get; set; }
        public int ZgloszenieId { get; set; }
        public int SzczepionkaId { get; set; }

        public virtual Szczepionki Szczepionka { get; set; }
        public virtual Zgloszenia Zgloszenie { get; set; }
    }
}
