using System.ComponentModel.DataAnnotations;
namespace BackEnd.DataTransferObjects
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
