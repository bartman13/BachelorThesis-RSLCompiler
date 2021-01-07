using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Pliki
    {
        public Pliki()
        {
            Zgloszenia = new HashSet<Zgloszenia>();
        }

        public int Id { get; set; }
        public string OryginalnaNazwa { get; set; }
        public string NazwaPliku { get; set; }
        public int UzytId { get; set; }

        public virtual Uzytkownicy Uzyt { get; set; }
        public virtual ICollection<Zgloszenia> Zgloszenia { get; set; }
    }
}
