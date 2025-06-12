using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public string email { get; set; }

        [Column("password")]
        public string password { get; set; }
    }
}
