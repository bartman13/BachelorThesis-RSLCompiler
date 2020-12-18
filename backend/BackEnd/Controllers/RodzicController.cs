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
        /// <returns> Listę dzieci </returns>
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
        /// <returns> Listę niepożądanych odczynów </returns>
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
            DateTime timestamp = DateTime.Now;
            foreach (var nop in value.nopy)
            {
                var oz = new OdczynyZgloszenia
                {
                    Data = timestamp,
                    OdczynId = nop.id
                };
                foreach (var attr in nop.atrybuty)
                {
                    oz.AtrybutyZgloszenia.Add(new AtrybutyZgloszenia
                    {
                        Wartosc = attr.wartosc,
                        AtodId = attr.id
                    });
                }
                app.OdczynyZgloszenia.Add(oz);
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
        /// <summary>
        /// Zwraca historię zgłoszenia, czyli listę wszystkich wydarzeń dotyczących danego zgłoszenia.
        /// </summary>
        /// <param name="id">Id zgłoszenia </param>
        /// <returns>Listę wydarzeń dotyczących danego zgłoszenia</returns>
        [HttpGet("AppHistory/{id?}")]
        public IActionResult GetAppHistory(int? id)
        {
            var app = _context.Zgloszenia
                .Where(z => z.Id == id)
                .Include(i => i.DecyzjeLekarza)
                .Include(i => i.OdczynyZgloszenia)
                .ThenInclude(it => it.AtrybutyZgloszenia)
                .ThenInclude(it => it.Atod)
                .Include(i => i.ZgloszenieSzczepionki)
                .ThenInclude(it => it.Szczepionka)
                .FirstOrDefault();
            if (app == null) return BadRequest("Zgloszenie o podanym id nie istnieje");
            if (app.UzytId != Account.Id) return Unauthorized();
            List<AppEvent> events = new List<AppEvent>
            {
                new AppEvent
                {
                    Data = app.Data,
                    Tytul = "Wykonanie szczepienia",
                    Tresc = "Wykonanie szczepienia przy użyciu szczepionek: " + 
                        string.Join(", ", app.ZgloszenieSzczepionki.Select(zs => zs.Szczepionka.Nazwa)),
                    Typ = 0
                }
            };
            foreach(var n in app.OdczynyZgloszenia)
            {
                var odczyn = _context.Odczyny
                    .Where(x => x.Id == n.OdczynId)
                    .Include(i => i.SzczepionkiOdczyny)
                    .FirstOrDefault();
                int? sc = odczyn.SzczepionkiOdczyny.Max(so => so.StopienCiezkosci);
                events.Add(new AppEvent
                    {
                        Data = n.Data,
                        Tytul = "Nowy odczyn - " + odczyn?.Nazwa,
                        Tresc = string.Join(", ", n.AtrybutyZgloszenia.Select(a => a.Atod.Nazwa + " - " + a.Wartosc)),
                        Typ = 2 + (int) sc
                    }
                );
            }
            foreach (var d in app.DecyzjeLekarza)
            {
                string tytul = d.Decyzja switch
                {
                    0 => "Brak zgodności z dokumentem",
                    1 => "Nie potwierdzono występowania niepożądanych odczynów poszczepiennych",
                    2 => "Potwierdzono występowenie lekkiego niepożadanego odczynu poszczepiennego",
                    3 => "Potwierdzono występowenie poważnego niepożadanego odczynu poszczepiennego",
                    4 => "Potwierdzono występowenie ciężkiego niepożadanego odczynu poszczepiennego",
                    _ => null
                };
                events.Add(new AppEvent
                    {
                        Data = d.Data,
                        Tytul = tytul,
                        Tresc = d.Komentarz,
                        Typ = d.Decyzja + 5
                    }
                );
            }
            var timeline = events.GroupBy(e => e.Data,
                (key, values) =>
                {
                    var mainEvent = values.Where(v => v.Typ == values.Min(v => v.Typ)).FirstOrDefault();
                    return new DateAppInfoResponse 
                    {
                        Data = key,
                        Tytul = mainEvent.Tytul,
                        Typ = mainEvent.Typ,
                        Zdarzenia = values.Select(v => new AppEventResponse 
                        {
                            Typ = v.Typ,
                            Tytul = v.Tytul,
                            Tresc = v.Tresc
                        }).ToList()
                    };
                }).ToList();
            timeline[1].Zdarzenia.Insert(0, new AppEventResponse 
            {
                Typ = 1,
                Tytul = "Utworzenie zgłoszenia",
                Tresc = "Utworzono zgłoszenie"
            });
            timeline[1].Typ = timeline[1].Zdarzenia[0].Typ;
            timeline[1].Tytul = timeline[1].Zdarzenia[0].Tytul;
            return Ok(timeline);
        }
        private class AppEvent
        {
            public DateTime Data { get; set; }
            public string Tytul { get; set; }
            public string Tresc { get; set; }
            public int Typ { get; set; }
        }
        /// <summary>
        /// Dodaje do zgłoszenia nowe podejrzewane niepożądane odczyny.
        /// </summary>
        /// <param name="id"> Id zgłoszenia </param>
        /// <param name="nops"> Lista nowych podejrzewanych niepożądanych odczynów </param>
        /// <returns> Ok </returns>
        [HttpPost("UpdateApp/{id?}")]
        public IActionResult UpdateApp(int? id, [FromBody] ICollection<NopAtrybuty> nops)
        {
            var app = _context.Zgloszenia
                   .Where(z => z.Id == id)
                   .Include(i => i.OdczynyZgloszenia)
                   .FirstOrDefault();
            if (app == null) return BadRequest("Zgloszenie o podanym id nie istnieje");
            if (app.UzytId != Account.Id) return Unauthorized();
            DateTime timestamp = DateTime.Now;
            foreach (var nop in nops)
            {
                var oz = new OdczynyZgloszenia
                {
                    Data = timestamp,
                    OdczynId = nop.id
                }; 
                foreach (var attr in nop.atrybuty)
                {
                    oz.AtrybutyZgloszenia.Add(new AtrybutyZgloszenia
                    {
                        Wartosc = attr.wartosc,
                        AtodId = attr.id
                    });
                }
                app.OdczynyZgloszenia.Add(oz);
            }
            _context.SaveChanges();
            return Ok();
        }
    }
}


