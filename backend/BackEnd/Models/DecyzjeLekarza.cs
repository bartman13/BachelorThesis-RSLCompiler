using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class DecyzjeLekarza
    {
        public int Id { get; set; }
        public int Decyzja { get; set; }
        public string Komentarz { get; set; }
        public int ZgloszenieId { get; set; }

        public virtual Zgloszenia Zgloszenie { get; set; }
    }
}
