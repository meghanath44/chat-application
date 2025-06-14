using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("Messages")]
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("message_id")]
        public int MessageId { get; set; }

        [Required]
        [Column("sender_id")]
        public int SenderId { get; set; }

        [Required]
        [Column("receiver_id")]
        public int ReceiverId { get; set; }

        [Required]
        [Column("message")]
        public string MessageText { get; set; }

        [Column("sent_at")]
        public DateTime SentAt { get; set; }

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [ForeignKey("SenderId")]
        public User Sender { get; set; }

        [ForeignKey("ReceiverId")]
        public User Receiver { get; set; }
    }
}

