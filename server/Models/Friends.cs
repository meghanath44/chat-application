using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("Friends")]
    public class Friends
    {
        [Key]
        public int friendsCount { get; set; }

        [Column("email")]
        public string email { get; set; }

        [Column("friendsEmail")]
        public string friendsEmail {  get; set; }
    }
}
