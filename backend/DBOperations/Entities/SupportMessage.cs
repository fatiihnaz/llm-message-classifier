namespace DBOperations.Entities;

public class SupportMessage
{
    public Guid MessageId { get; set; }
    public string? UserId { get; set; }
    public string? RoutingKey { get; set; }
    public string Text { get; set; } = default!;
    public string? Category { get; set; }
    public int? Urgency { get; set; }
    public string? SuggestedReply { get; set; }
    public string? SupportNumber { get; set; }
    public string? Status { get; set; } // "Classified", "Pending", "Answered", "Archived"
    public DateTime CreatedAt { get; set; }
}
