using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [Route("[controller]/{id:int}")]
        public IActionResult GetList(int id)
        {

            var zgl = (from Zgloszenia in _context.Zgloszenia.Include("Pacjent")
                       where Zgloszenia.UzytId == id
                       select Zgloszenia).ToList();
            if (zgl == null || zgl.Count == 0) return BadRequest(new { message = "Lista uzytkownikow jest nullem" });
            return Ok(zgl);
        }
    }
}
