using System.ComponentModel.DataAnnotations;

namespace BackEnd.DataTransferObjects
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}


