using BackEnd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class ZgloszenieRequest
    {
        public int UzytId { get; set; }
        public DateTime Data { get; set; }
        //public IFormFile ZdjecieKsZd { get; set; }
        public int? LekarzId { get; set; }
        public bool ProsbaOKontakt { get; set; }
        public int PacjentId { get; set; }

        //List<ZaisnialeOdczyny> list;

        class ZaistnialeOdczyny
        {
            public int OdczynId {get;set; }

            class Atrybut
            {
                // jakies atrybuty
            }
           // public List<Atrybut> Atrybuty { get; set; }
        }

    }

    

}
