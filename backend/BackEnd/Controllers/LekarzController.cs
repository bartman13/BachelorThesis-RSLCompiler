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
        public IActionResult GetApps()
        {
            var zgloszenia = (from Zgloszenia in _context.Zgloszenia
                              .Include("Uzyt") 
                              .Include("DecyzjeLekarza")
                              .Include("Pacjent")// w przyszlosci zamienic na data transfer objet
                       where Zgloszenia.Pacjent.LekarzId == Account.Id
                       select Zgloszenia).ToList();

            var ret = new List<DoctorAppResponse>();
            foreach(var el in zgloszenia)
            {
                ret.Add(new DoctorAppResponse
                {
                    Id = el.Id,
                    Data = el.DataUtworzenia,
                    Nazwa_Szczepionki = "Polfarma",
                    Imie = el.Uzyt.Imie,
                    Nazwisko = el.Uzyt.Nazwisko,
                    Status = el.DecyzjeLekarza.Count == 0 ? false : true

                });
            }
            return Ok(ret);
        }
    }
}