using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IndexController : ControllerBase
    {
       

       private readonly NopContext _context;
        

        public IndexController(NopContext context)
        {
         
            
            _context = context;
        }






        [HttpGet]
        public IEnumerable<Uzytkownicy> Get()
        {
           return  this._context.Uzytkownicy.ToList();
        }
    }
}
