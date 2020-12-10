using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.DataTransferObjects;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.IO;


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
        public IActionResult GetApps()
        {
            var zgl = (from Zgloszenia in _context.Zgloszenia.Include("Pacjent") // w przyszlosci zamienic na data transfer objet
                       where Zgloszenia.UzytId == Account.Id
                       select Zgloszenia).ToList();
            if (zgl == null) return BadRequest(new { message = "Lista uzytkownikow jest nullem" });
            return Ok(zgl);
        }
        [HttpGet("Szczepionki")]
        public IActionResult GetVaccines()
        {
            var vaccines = _context.Szczepionki.ToList();
            if (vaccines == null) return BadRequest(new { message = "Lista szczepionek jest nullem" });
            return Ok(vaccines);
        }
        [HttpGet("Dzieci")]
        public IActionResult GetChildren()
        {
            var children = _context.Pacjenci.Where(x => x.UzytId == Account.Id).ToList();
            if (children == null) return BadRequest(new { message = "Lista dzieci jest nullem" });
            return Ok(children);
        }
        [HttpGet("Nop/{id?}")]
        public IActionResult GetNop(int? id)
        {
            var nops = _context.Odczyny.Where(x => _context.SzczepionkiOdczyny
                .Where(y => y.SzczepionkaId == id).Any(z => z.OdczynId == x.Id))
                .Include("AtrybutyOdczynow").ToList();

            if (nops == null) return BadRequest(new { message = "Lista odczynow jest nullem" });
            return Ok(nops);
        }
        [HttpPost("UtworzZgloszenie")]
        public IActionResult CreateApp([FromForm] CreateAppRequest value)
        {
           if (value == null) return BadRequest(new { message = "Vallue jest nullem" });
            var user = _context.Uzytkownicy.Single(x => x.Id==Account.Id);
            Zgloszenia app = new Zgloszenia
            {
                Data = value.Data,
                PacjentId = value.pacjentId,
                ProsbaOKontakt = value.prosba_o_kontakt,
                UzytId = Account.Id,
                ZdjecieKsZd = Guid.NewGuid().ToString() + Path.GetExtension(value.zdjecieKsZd.FileName)
            };
            _context.Zgloszenia.Attach(app);
            app.ZgloszenieSzczepionki.Add(new ZgloszenieSzczepionki { SzczepionkaId = value.szczepionkaId });
            foreach (var nop in value.nopy)
            {
                app.OdczynyZgloszenia.Add(new OdczynyZgloszenia
                {
                    Data = DateTime.Now,
                    OdczynId = nop.id,
                    Wartosc = string.Join(";", nop.atrybuty.Select(x => x.wartosc))
                });
            }
            _context.SaveChanges();
            string directorypath = @"C:\NopImages";
            Directory.CreateDirectory(directorypath);
            using (FileStream stream = new FileStream(Path.Combine(directorypath, app.ZdjecieKsZd), FileMode.Create))
            {
                value.zdjecieKsZd.CopyTo(stream);
            }
            return Ok();
        }
        [HttpGet("AppHistory/{id?}")]
        public IActionResult GetAppHistory(int? id)
        {
            var app = _context.Zgloszenia
                .Where(z => z.Id == id)
                .Include("OdczynyZgloszenia")
                .Include("DecyzjeLekarza")
                .FirstOrDefault();
            if (app == null) return BadRequest("Zgloszenie o poadnym id nie istnieje");
            List<EventResponse> events = new List<EventResponse>
            {
                new EventResponse
                {
                    Data = app.Data,
                    Tytul = "Wykonanie szcepienia"
                }
            };
            foreach(var n in app.OdczynyZgloszenia)
            {
                events.Add(new EventResponse
                    {
                        Data = n.Data,
                        Tytul = _context.Odczyny.Where(x => x.Id == n.OdczynId).FirstOrDefault()?.Nazwa,
                        Tresc = n.Wartosc.Replace(";", ", ")
                    }
                );
            }
            return Ok(events);
        }
    }
}

    
