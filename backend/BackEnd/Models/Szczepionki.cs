using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Szczepionki
    {
        public Szczepionki()
        {
            SzczepionkiOdczyny = new HashSet<SzczepionkiOdczyny>();
            ZgloszenieSzczepionki = new HashSet<ZgloszenieSzczepionki>();
        }

        public int Id { get; set; }
        public string Nazwa { get; set; }
        public string Opis { get; set; }
        public string PictureLink { get; set; }
        public string ProducentInfo { get; set; }
        public string ChorobyInfo { get; set; }
        public string ObecnaWiedzaInfo { get; set; }
        public string PrzeiwWskazaniaInfo { get; set; }

        public virtual ICollection<SzczepionkiOdczyny> SzczepionkiOdczyny { get; set; }
        public virtual ICollection<ZgloszenieSzczepionki> ZgloszenieSzczepionki { get; set; }
    }
}
