namespace server.ViewModels
{
    public class ViewMessage
    {
        public string MessageText { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
        public DateTime SentAt { get; set; }
    }
}
