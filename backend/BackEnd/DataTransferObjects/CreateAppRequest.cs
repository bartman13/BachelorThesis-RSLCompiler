using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class CreateAppRequest
    {
        public DateTime Data { get; set; }
        public ICollection<int> szczepionkiId { get; set; }
        public int pacjentId { get; set; }
        public bool prosbaOKontakt { get; set; }
        public virtual ICollection<NopAtrybuty> nopy { get; set; }
        public virtual IFormFile zdjecieKsZd { get; set; }
    }
    
    public class NopAtrybuty
    {
        public int id { get; set; }
        public virtual ICollection<Atrybuty> atrybuty { get; set; }
        public DateTime data { get; set; }
    }
    public class Atrybuty
    {
        public int id { get; set; }
        public string wartosc { get; set; }
    }
}
