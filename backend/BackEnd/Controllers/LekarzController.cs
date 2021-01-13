using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.DataTransferObjects;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [ApiController]
    [Authorize(Role.Lekarz)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public class LekarzController : BaseController
    {
        private readonly NopContext _context;
        private readonly IMapper _mapper;

        public LekarzController(NopContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("[controller]/Zgloszenia")]
        public async Task<IActionResult> GetApps()
        {
            var apps = await _context.Zgloszenia
                    .Include(i => i.Uzyt)
                    .Include(i => i.DecyzjeLekarza)
                    .Include(i => i.Pacjent)
                    .Include(i => i.OdczynyZgloszenia)
                    .Include(i => i.ZgloszenieSzczepionki)
                    .ThenInclude(i => i.Szczepionka)
                    .Where(z => z.Pacjent.LekarzId == Account.Id)
                    .Select(z => new DoctorAppResponse {
                        Id = z.Id,
                        Data = z.DataUtworzenia,
                        Nazwa_Szczepionki = z.ZgloszenieSzczepionki.First().Szczepionka.Nazwa,
                        Imie = z.Uzyt.Imie,
                        Nazwisko = z.Uzyt.Nazwisko,
                        Status = z.DecyzjeLekarza.Max(d => d.Data) > z.OdczynyZgloszenia.Max(oz => oz.Data)
                    })
                    .ToListAsync();
            return Ok(apps);
        }
        [HttpGet("[controller]/Zgloszenie/{id?}")]
        public IActionResult GetNop(int id)
        {
            var zgloszenie = _context.Zgloszenia.Where(p => p.Id == id)
                .Include("Pacjent")
                .Include("Uzyt")
                .Include("DecyzjeLekarza")
                .FirstOrDefault();
            DotorZgłoszenieInfo response = new DotorZgłoszenieInfo
            {
                Imie = zgloszenie.Uzyt.Imie,
                Nazwisko = zgloszenie.Uzyt.Nazwisko,
                Email = zgloszenie.Uzyt.Email,
                Telefon = zgloszenie.Uzyt.Telefon,
                Pacjent_Imie = zgloszenie.Pacjent.Imie,
                Pacjent_Nazwisko = zgloszenie.Pacjent.Nazwisko,
                ProsbaOKontakt = zgloszenie.ProsbaOKontakt,
                decyzja = zgloszenie.DecyzjeLekarza.Count == 0 ? -1 : zgloszenie.DecyzjeLekarza.Last().Decyzja

            };
            return Ok(response);
        }
        [HttpPost("[controller]/Decyzja/")]
        public IActionResult AddDecision([FromBody] DoctorAddDecision value)
        {

            var decision = _mapper.Map<DecyzjeLekarza>(value);
            decision.Data = DateTime.Now;
            _context.DecyzjeLekarza.Add(decision);
            _context.SaveChanges();
            return Ok();
        }


    }
}