using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.DataTransferObjects;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;


namespace BackEnd.Controllers
{
    [ApiController]
    public class PracownikPzhController : BaseController
    {
        private readonly NopContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// Konstruktor przyjmujacy kontekst bazy danych
        /// </summary>
        public PracownikPzhController(NopContext context,  IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

          //          2 => "Potwierdzono występowenie lekkiego niepożadanego odczynu poszczepiennego",
          //          3 => "Potwierdzono występowenie poważnego niepożadanego odczynu poszczepiennego",
          //          4 => "Potwierdzono występowenie ciężkiego niepożadanego odczynu poszczepiennego",

        [HttpGet("ZgloszeniaPzh/{id?}")]
        public IActionResult GetNop(int? id)
        {
            int lekki =  0;
            int ciezki = 0;
            int powany = 0;
            const int days =31;
            Random rnd = new Random();
            PzhDashboardData responseData = new PzhDashboardData();
            responseData.Rows = new List<Row>();
            var apps = _context.ZgloszenieSzczepionki.Where(el => el.SzczepionkaId == id )
                .Include(zs => zs.Zgloszenie)
                    .ThenInclude(z => z.Pacjent)
                .Include(zs => zs.Zgloszenie)
                    .ThenInclude(z => z.DecyzjeLekarza)
                .ToList();
             
            foreach(var el in apps )
            {
                Row row = new Row();
                var decison = el.Zgloszenie.DecyzjeLekarza.LastOrDefault();

                if(decison== null  || (decison.Decyzja != 2 && decison.Decyzja != 3 && decison.Decyzja != 4 )) continue;
                
                row.Id = el.Zgloszenie.Id;
                row.Imie = el.Zgloszenie.Pacjent.Imie;
                row.Nazwisko = el.Zgloszenie.Pacjent.Nazwisko;
                row.Data_Utworzenia = el.Zgloszenie.DataUtworzenia;
                row.Data_Wystąpienia = decison.Data;
                if(decison.Decyzja == 2)
                {
                    row.Stopień = "Lekki";
                    lekki++;
                }
                else if (decison.Decyzja == 3)
                {
                    row.Stopień = "Poważny";
                    powany++;
                }
                else if (decison.Decyzja == 4)
                {
                    row.Stopień = "Ciężki";
                    ciezki++;
                }
                responseData.Rows.Add(row);
            }
            responseData.Lekkie = lekki;
            responseData.Poważne = powany;
            responseData.Ciężkie = ciezki;
            // hardcode na czas prezentacji
            {
                responseData.LastMonth = "Grudzień";
                responseData.AppsPerDay = new int[days];
                for(int i=0;i< days;++i)
                {
                    responseData.AppsPerDay[i] = rnd.Next(0, 3);
                }
            }
            return Ok(responseData);
        }


    }
}