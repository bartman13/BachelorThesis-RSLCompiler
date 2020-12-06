using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.DataTransferObjects
{
    public class AuthenticateRequest
    {
        [Required(ErrorMessage = "Name is required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Haslo { get; set; }
    }
}
