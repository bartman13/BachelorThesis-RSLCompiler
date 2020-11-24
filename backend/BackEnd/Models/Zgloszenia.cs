﻿using System;
using System.Collections.Generic;

namespace BackEnd.Models
{
    public partial class Zgloszenia
    {
        public Zgloszenia()
        {
            DecyzjeLekarza = new HashSet<DecyzjeLekarza>();
            OdczynyZgloszenia = new HashSet<OdczynyZgloszenia>();
            ZgloszenieSzczepionki = new HashSet<ZgloszenieSzczepionki>();
        }

        public int Id { get; set; }
        public int UzytId { get; set; }
        public DateTime Data { get; set; }
        public string ZdjecieKsZd { get; set; }
        public int? LekarzId { get; set; }
        public bool ProsbaOKontakt { get; set; }
        public int PacjentId { get; set; }

        public virtual Uzytkownicy Lekarz { get; set; }
        public virtual Pacjenci Pacjent { get; set; }
        public virtual Uzytkownicy Uzyt { get; set; }
        public virtual ICollection<DecyzjeLekarza> DecyzjeLekarza { get; set; }
        public virtual ICollection<OdczynyZgloszenia> OdczynyZgloszenia { get; set; }
        public virtual ICollection<ZgloszenieSzczepionki> ZgloszenieSzczepionki { get; set; }
    }
}