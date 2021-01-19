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
using ClosedXML.Excel;

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

          
         /// <summary>
        /// Zwraca dane zasilające pracownika pzh  
        /// </summary>
        /// <param name="id"> Id szczepionki </param>
        /// <returns> Predefinioway obiekt z danymi </returns>
        [ProducesResponseType(typeof(PzhDashboardData),200)]
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
        /// <summary>
        /// Zwraca plik xlsx ze statystykami dotyczącymi szczepionki o podanym id.
        /// </summary>
        /// <param name="id"> Id szczepionki </param>
        /// <returns> Raport w postaci pliku xlsx </returns>
        [HttpGet("PZHRaport/{id?}")]
        public async Task<IActionResult> VaccineXlsxReport(int? id)
        {
            var rows = await _context.ZgloszenieSzczepionki.Where(el => el.SzczepionkaId == id)
                .Include(zs => zs.Zgloszenie)
                    .ThenInclude(z => z.Pacjent)
                .Include(zs => zs.Zgloszenie)
                    .ThenInclude(z => z.DecyzjeLekarza)
                .Select(zs => zs.Zgloszenie)
                .Select(app => new {
                    app.Id,
                    app.Pacjent.Imie,
                    app.Pacjent.Nazwisko,
                    app.DataUtworzenia,
                    Decyzja = app.DecyzjeLekarza
                               .Where(d => d.Decyzja > 1 && d.Decyzja < 5)
                               .OrderByDescending(d => d.Data)
                               .FirstOrDefault()
                })
                .Where(row => row.Decyzja != null)
                .Select(app => new Row
                {
                    Id = app.Id,
                    Imie = app.Imie,
                    Nazwisko = app.Nazwisko,
                    Data_Utworzenia = app.DataUtworzenia,
                    Data_Wystąpienia = app.Decyzja.Data,
                    Stopień = app.Decyzja.Decyzja == 2 ? "Lekki" :
                              app.Decyzja.Decyzja == 3 ? "Poważny" :
                              "Ciężki"
                })
                .ToListAsync();
            int lekkie = rows.Count(row => row.Stopień == "Lekki");
            int powazne = rows.Count(row => row.Stopień == "Poważny");
            int ciezkie = rows.Count(row => row.Stopień == "Ciężki");
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Arkusz 1");
            worksheet.Cell(1, 1).Value = "Imię pacjenta";
            worksheet.Cell(1, 1).Style.Font.Bold = true;
            worksheet.Column(1).Width = 20;
            worksheet.Cell(1, 2).Value = "Nazwisko pacjenta";
            worksheet.Cell(1, 2).Style.Font.Bold = true;
            worksheet.Column(2).Width = 20;
            worksheet.Cell(1, 3).Value = "Stopień potwierdzonogo niepożądanego odczynu poszczepiennego";
            worksheet.Cell(1, 3).Style.Font.Bold = true;
            worksheet.Column(3).Width = 40;
            worksheet.Cell(1, 4).Value = "Data utworzenia zgłoszenia";
            worksheet.Cell(1, 4).Style.Font.Bold = true;
            worksheet.Column(4).Width = 40;
            worksheet.Cell(1, 5).Value = "Data wystąpienia odczynu";
            worksheet.Cell(1, 5).Style.Font.Bold = true;
            worksheet.Column(5).Width = 40;
            for (int i = 0; i < rows.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = rows[i].Imie;
                worksheet.Cell(i + 2, 2).Value = rows[i].Nazwisko;
                worksheet.Cell(i + 2, 3).Value = rows[i].Stopień;
                worksheet.Cell(i + 2, 4).DataType = XLDataType.DateTime;
                worksheet.Cell(i + 2, 4).Value = rows[i].Data_Utworzenia;
                worksheet.Cell(i + 2, 5).DataType = XLDataType.DateTime;
                worksheet.Cell(i + 2, 5).Value = rows[i].Data_Wystąpienia;
            }
            worksheet.Cell(3, 15).Value = "Lekkich razem";
            worksheet.Cell(3, 16).Value = "Poważnych razem";
            worksheet.Cell(3, 17).Value = "Ciężkich razem";
            worksheet.Column(15).Width = 20;
            worksheet.Column(16).Width = 20;
            worksheet.Column(17).Width = 20;
            worksheet.Cell(4, 15).Value = lekkie;
            worksheet.Cell(4, 16).Value = powazne;
            worksheet.Cell(4, 17).Value = ciezkie;
            worksheet.Cell(4, 15).DataType = XLDataType.Number;
            worksheet.Cell(4, 16).DataType = XLDataType.Number;
            worksheet.Cell(4, 17).DataType = XLDataType.Number;
            using MemoryStream stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "statystyki.xlsx");
        }
    }
}