using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace BackEnd.Controllers
{
    [ApiController]
    [Authorize(Role.Rodzic)]
    public class RodzicController : BaseController
    {
        private readonly NopContext _context;

        public RodzicController(NopContext context)
        {
            _context = context;
        }

        [HttpGet("[controller]")]
        public IActionResult GetList()
        {
            var zgl = (from Zgloszenia in _context.Zgloszenia.Include("Pacjent")
                       where Zgloszenia.UzytId == Account.Id
                       select Zgloszenia).ToList();
            if (zgl == null || zgl.Count == 0) return BadRequest(new { message = "Lista uzytkownikow jest nullem" });
            return Ok(zgl);
        }
    }
}
