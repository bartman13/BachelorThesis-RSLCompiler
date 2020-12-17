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
using Microsoft.AspNetCore.Http;

namespace BackEnd.Controllers
{
    /// <summary>
    /// Kontroler służący  do obsługi ządaużytkowników zalogowanych jako Rodzic
    /// </summary>
    [ApiController]
    [Authorize(Role.Rodzic)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public class RodzicController : BaseController
    {
        private readonly NopContext _context;

        /// <summary>
        /// Konstruktor przyjmujacy kontekst bazy danych
        /// </summary>
        public RodzicController(NopContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Zwraca wszystkie zgłoszenia utworzone przez zalogowanego użytkownika
        /// </summary>
        /// <returns> Listę zgłoszeń </returns>
        [HttpGet("[controller]")]
        public IActionResult GetApps()
        {
            var zgl = (from Zgloszenia in _context.Zgloszenia.Include("Pacjent") // w przyszlosci zamienic na data transfer objet
                       where Zgloszenia.UzytId == Account.Id
                       select Zgloszenia).ToList();
            if (zgl == null) return BadRequest(new { message = "Lista uzytkownikow jest nullem" });
            return Ok(zgl);
        }
        /// <summary>
        /// Zwraca wszystkie szczepionki predefiniowane w systemie
        /// </summary>
        /// <returns> Listę szczepionek </returns>
        [HttpGet("Szczepionki")]
        public IActionResult GetVaccines()
        {
            var vaccines = _context.Szczepionki.ToList();
            if (vaccines == null) return BadRequest(new { message = "Lista szczepionek jest nullem" });
            return Ok(vaccines);
        }
        /// <summary>
        /// Zwraca wszystkie dzieci przypisane przez zalogowanego urzytkownika
        /// </summary>
        /// <returns> Listę dziecci </returns>
        [HttpGet("Dzieci")]
        public IActionResult GetChildren()
        {
            var children = _context.Pacjenci.Where(x => x.UzytId == Account.Id).ToList();
            if (children == null) return BadRequest(new { message = "Lista dzieci jest nullem" });
            return Ok(children);
        }
        /// <summary>
        /// Zwraca predefiniowaną liste nieporządanych odczynów poszczepiennych dla danej szcczepionki
        /// </summary>
        /// <param name="id"> Id szczepionki </param>
        /// <returns> Listę Nop </returns>
        [HttpGet("Nop/{id?}")]
        public IActionResult GetNop(int? id)
        {
            var nops = _context.Odczyny.Where(x => _context.SzczepionkiOdczyny
                .Where(y => y.SzczepionkaId == id).Any(z => z.OdczynId == x.Id))
                .Include("AtrybutyOdczynow").ToList();

            if (nops == null) return BadRequest(new { message = "Lista odczynow jest nullem" });
            return Ok(nops);
        }
        /// <summary>
        /// Tworzy nowe zgloszenie
        /// </summary>
        /// <param name="value"> Dane pozwalajace utworzyc nowe zgłoszenie </param>
        /// <returns> Listę Nop </returns>
        [HttpPost("UtworzZgloszenie")]
        public IActionResult CreateApp([FromForm] CreateAppRequest value)
        {
            if (value == null) return BadRequest(new { message = "Vallue jest nullem" });
            var user = _context.Uzytkownicy.Single(x => x.Id == Account.Id);
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








    }
}


