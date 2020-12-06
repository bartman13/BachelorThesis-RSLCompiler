using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        public Uzytkownicy Account => (Uzytkownicy)HttpContext.Items["Account"];
    }
}