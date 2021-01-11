using BackEnd.DataTransferObjects;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [ApiController]
    public class SharedController : BaseController
    {
        private readonly NopContext _context;
        private readonly IConfiguration _configuration;
        /// <summary>
        /// Konstruktor przyjmujacy kontekst bazy danych
        /// </summary>
        public SharedController(NopContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        /// <summary>
        /// Zwraca historię zgłoszenia, czyli listę wszystkich wydarzeń dotyczących danego zgłoszenia.
        /// </summary>
        /// <param name="id">Id zgłoszenia </param>
        /// <returns>Listę wydarzeń dotyczących danego zgłoszenia</returns>
        [Authorize]
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
            if (app == null) return NotFound("Zgloszenie o podanym id nie istnieje");
            if (Account.Rola == (int)Role.Rodzic && app.UzytId != Account.Id) return Unauthorized();
            if (Account.Rola == (int)Role.Rodzic)
            {
                foreach(var d in app.DecyzjeLekarza)
                {
                    d.Wyswietlone = true;
                    _context.Update(d);
                }
            }
            _context.SaveChanges();
            List<AppEvent> events = new List<AppEvent>
            {
                new AppEvent
                {
                    Data = app.DataSzczepienia,
                    Tytul = "Wykonanie szczepienia",
                    Tresc = "Wykonanie szczepienia przy użyciu szczepionek: " +
                        string.Join(", ", app.ZgloszenieSzczepionki.Select(zs => zs.Szczepionka.Nazwa)),
                    Typ = 0
                }
            };
            foreach (var n in app.OdczynyZgloszenia)
            {
                var odczyn = _context.Odczyny
                    .Where(x => x.Id == n.OdczynId)
                    .Include(i => i.SzczepionkiOdczyny)
                    .FirstOrDefault();
                int? sc = odczyn.SzczepionkiOdczyny.Max(so => so.StopienCiezkosci);
                events.Add(new AppEvent
                {
                    Data = n.DataWystapenia,
                    Tytul = odczyn?.Nazwa,
                    Atrybuty = new List<AppEventAttribute>(n.AtrybutyZgloszenia.Select(a => new AppEventAttribute()
                    {
                        Nazwa = a.Atod.Nazwa,
                        Wartosc = a.Wartosc,
                        Typ = a.Atod.Typ
                    })),
                    Typ = 2 + (int)sc
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
            events.Add(new AppEvent
            {
                Typ = 1,
                Tytul = "Utworzenie zgłoszenia",
                Tresc = "Utworzono zgłoszenie",
                Data = app.DataUtworzenia
            });
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
                            Tresc = v.Tresc,
                            Atrybuty = v.Atrybuty
                        }).ToList()
                    };
                }).OrderBy(i => i.Data).ToList();
            return Ok(timeline);
        }
        private class AppEvent
        {
            public DateTime Data { get; set; }
            public string Tytul { get; set; }
            public string Tresc { get; set; }
            public int Typ { get; set; }
            public List<AppEventAttribute> Atrybuty { get; set; }
        }
        /// <summary>
        /// Zwraca plik o poadnej nazwie
        /// </summary>
        /// <param name="filename"> Nazwa pliku </param>
        /// <returns> Żądany plik </returns>
        [Authorize]
        [HttpGet("File/{filename}")]
        public IActionResult DownloadFile(string filename)
        {
            var file = _context.Pliki.FirstOrDefault(f => f.NazwaPliku == filename);
            if (file == null) return NotFound();
            if (Account.Rola == (int)Role.Rodzic && file.UzytId != Account.Id) return Unauthorized();
            string directorypath = _configuration["FileStorage"];;
            Stream stream = new FileStream(Path.Combine(directorypath, filename), FileMode.Open);
            if (stream == null) return NotFound();
            return File(stream, "application/octet-stream", file.OryginalnaNazwa);
        }
        /// <summary>
        /// Zwraca nazwę pliku 
        /// </summary>
        /// <param name="filename"> Nazwa pliku na serwerze </param>
        /// <returns> Oryginalna nazwa pliku </returns>
        [Authorize]
        [HttpGet("FileInfo/{filename}")]
        public IActionResult GetFileInfo(string filename)
        {
            var file = _context.Pliki.FirstOrDefault(f => f.NazwaPliku == filename);
            if (file == null) return NotFound();
            if (Account.Rola == (int)Role.Rodzic && file.UzytId != Account.Id) return Unauthorized();
            return Ok(file.OryginalnaNazwa);
        }
        [HttpGet("ListaSzczepionek")]
        public IActionResult GetAllVaccines()
        {
            return Ok(_context.Szczepionki.ToList());
        }
    }
}
