using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BackEnd.Controllers
{
    [ApiController]
    [Authorize]
    public class RodzicController : ControllerBase
    {


        private readonly NopContext _context;


        public RodzicController(NopContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("[Controller]/{id}")]
        public IEnumerable<Zgloszenia> GetList( int id)
        {
            return from Zgloszenia in _context.Zgloszenia
                   where _context.Zgloszenia.All(x => x.UzytId == id)
                   select Zgloszenia;
        }
    }
}
