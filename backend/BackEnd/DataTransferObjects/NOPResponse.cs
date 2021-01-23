using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class NOPResponse
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public List<NOPAttributesResponse> AtrybutyOdczynow { get; set; }
    }
    public class NOPAttributesResponse
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public int Typ { get; set; }
        public string Info { get; set; }
    }
}
