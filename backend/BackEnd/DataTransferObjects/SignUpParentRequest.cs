using System.ComponentModel.DataAnnotations;


namespace BackEnd.DataTransferObjects
{
    public class SignUpParentRequest
    {
        [Required]
        public string Imie { get; set; }
        [Required]
        public string Nazwisko { get; set; }
        [Required]
        public string Telefon { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Haslo { get; set; }
        [Required]
        [Compare("Haslo")]
        public string PotwierdzHaslo { get; set; }
    }
}