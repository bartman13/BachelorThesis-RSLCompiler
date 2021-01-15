using AutoMapper;
using BackEnd.Controllers;
using BackEnd.DataTransferObjects;
using BackEnd.Helpers;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace TestyJednostkowe
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void LoginControllerTests()
        {
            var options = new DbContextOptionsBuilder<NopContext>()
                .UseInMemoryDatabase(databaseName: "Nop")
                .Options;
            using (var context = new NopContext(options))
            {
                context.Uzytkownicy.Add(new Uzytkownicy { Id = 1, Imie="Jan", Nazwisko = "Kowalski", Rola = 0, HashHasla = "$2a$11$sLwsQHGwX0HWGrN2Y44kXebgjpEEJ6bcU3uaHbd.5B1pvlQpEbxGm", Email = "rodzic@wp.pl", Telefon = "888-88-88" });
                context.Uzytkownicy.Add(new Uzytkownicy { Id = 2, Imie = "Adam", Nazwisko = "Lekarski", Rola = 1, HashHasla = "$2a$11$7V1ZrWGAALER2OCHl0N7cevVQNiJtS7Tw80E2Mv5WCA8sbvZtgAJC", Email = "lekarz@wp.pl", Telefon = "888-88-88" });
                context.Uzytkownicy.Add(new Uzytkownicy { Id = 3, Imie = "Krzysztof", Nazwisko = "PracowniczyPZH", Rola = 2, HashHasla = "$2a$11$7VsuNXvpR7zREk2qbkWX4OSRzZLTbB9uXdzNz55Zw3W87sZacuHiC", Email = "pzh@wp.pl", Telefon = "888-88-88" });
                context.Pacjenci.Add(new Pacjenci { Id = 1, Imie = "Janek", Nazwisko = "Kowalski", DataUrodzenia = DateTime.Now, UzytId = 1, LekarzId = 2 });
                context.Pacjenci.Add(new Pacjenci { Id = 2, Imie = "Ma³gosia", Nazwisko = "Kowalska", DataUrodzenia = DateTime.Now, UzytId = 1, LekarzId = 2 });
                context.Szczepionki.Add(new Szczepionki { Id = 0, Nazwa = "Menveo", Opis = "" });
                context.Odczyny.Add(new Odczyny { Id = 1, Nazwa = "Zdefiniuj w³asny" });
                context.Odczyny.Add(new Odczyny { Id = 2, Nazwa = "Kaszel" });
                context.Odczyny.Add(new Odczyny { Id = 3, Nazwa = "Gor¹czka" });
                context.Odczyny.Add(new Odczyny { Id = 4, Nazwa = "Zaburzenia ³aknienia" });
                context.Odczyny.Add(new Odczyny { Id = 5, Nazwa = "Sennoœæ" });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 1, OdczynId = 3, Typ = 0, Nazwa = "Temperatura", Info = "Stopnie Celsjusza;37.5;0.1" });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 2, OdczynId = 2, Typ = 1, Nazwa = "Stopieñ", Info = "Lekki;Œredni;Silny" });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 3, OdczynId = 2, Typ = 1, Nazwa = "Typ", Info = "Mokry;Suchy" });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 4, OdczynId = 1, Typ = 2, Nazwa = "Pliki", Info = null });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 5, OdczynId = 1, Typ = 3, Nazwa = "Opis tekstowy", Info = null });
                context.AtrybutyOdczynow.Add(new AtrybutyOdczynow { Id = 6, OdczynId = 4, Typ = 1, Nazwa = "Apetyt", Info = "Nadmierny;Niewielki;Brak" });
                context.SzczepionkiOdczyny.Add(new SzczepionkiOdczyny { Id = 1, SzczepionkaId = 1, OdczynId = 1, StopienCiezkosci = 0, Czestosc = 4 });
                context.SzczepionkiOdczyny.Add(new SzczepionkiOdczyny { Id = 2, SzczepionkaId = 1, OdczynId = 3, StopienCiezkosci = 0, Czestosc = 4 });
                context.SzczepionkiOdczyny.Add(new SzczepionkiOdczyny { Id = 3, SzczepionkaId = 1, OdczynId = 4, StopienCiezkosci = 0, Czestosc = 4 });
                context.SzczepionkiOdczyny.Add(new SzczepionkiOdczyny { Id = 4, SzczepionkaId = 1, OdczynId = 5, StopienCiezkosci = 0, Czestosc = 5 });
                context.SzczepionkiOdczyny.Add(new SzczepionkiOdczyny { Id = 5, SzczepionkaId = 1, OdczynId = 6, StopienCiezkosci = 0, Czestosc = 5 });
                context.SaveChanges();
                AppSettings settings = new AppSettings { EmailFrom = "info@aspnet-core-signup-verification-api.com", RefreshTokenTTL = 2, Secret = "asddasdasdadadadasdsadasdasdadadadadsadasda",
                    SmtpHost = "[ENTER YOUR OWN SMTP OPTIONS OR CREATE FREE TEST ACCOUNT IN ONE CLICK AT https://ethereal.email/]", SmtpPass = "", SmtpPort = 587, SmtpUser = ""
                };
                var mapper = new MapperConfiguration(cfg => {
                    cfg.CreateMap<Uzytkownicy, AuthenticateResponse>();
                    cfg.CreateMap<Zgloszenia, DoctorAppResponse>();
                    cfg.CreateMap<SignUpParentRequest, Uzytkownicy>();
                    cfg.CreateMap<SignUpParentRequest, Uzytkownicy>();
                    cfg.CreateMap<DoctorAddDecision, DecyzjeLekarza>();
                    cfg.CreateMap<Szczepionki, VaccineTransfer>();
                });
                var appSettings = Options.Create(settings);
                var controller = new LoginController(new AccountService(context, mapper.CreateMapper(), appSettings), mapper.CreateMapper());
                controller.ControllerContext = new ControllerContext();
                controller.ControllerContext.HttpContext = new DefaultHttpContext();
                controller.ControllerContext.HttpContext.Request.Headers["X-Forwarded-For"] = "127.0.0.1";
                var response = controller.SignIn(new AuthenticateRequest { Email = "rodzic@wp.pl", Haslo = "rodzic" }) as ObjectResult;
                var result = response.Value as AuthenticateResponse;
                Assert.AreEqual(200, response.StatusCode);
                Assert.AreEqual(1, result.Id);
                var fakeValues = new Dictionary<string, string>
                {
                    {"Jwt:Encryptionkey", "abc"},
                    {"Jwt:Issuer", "test.com"},
                    {"Jwt:ExpiryTimeInMinutes", "some value"}
                };
                IConfiguration config = new ConfigurationBuilder()
                    .AddInMemoryCollection(fakeValues)
                    .Build();
                var parentController = new RodzicController(context, config);
                parentController.ControllerContext = new ControllerContext();
                parentController.ControllerContext.HttpContext = new DefaultHttpContext();
                parentController.ControllerContext.HttpContext.Items["Account"] = context.Uzytkownicy.FirstOrDefault(el => el.Id == 1);
                parentController.ControllerContext.HttpContext.Request.Headers["X-Forwarded-For"] = "127.0.0.1";
                var children = parentController.GetChildren() as ObjectResult;
                Assert.AreEqual(200, children.StatusCode);
                var patientList = children.Value as List<Pacjenci>;
                Assert.AreEqual(2, patientList.Count);
            }
        }
    }
}
