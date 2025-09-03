namespace Infrastructure.Contracts;

public class MessageContract
{
    public Guid MessageId { get; set; } = Guid.NewGuid();
    public string? UserId { get; set; } = null;
    public string Text { get; set; } = default!;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
public class MessageDistributionContract : MessageContract
{
    public string? Category { get; set; } = null;
    public int? Urgency { get; set; } = null;
    public string? SuggestedReply { get; set; } = null;
    public string RoutingKey { get; set; } = default!;
    public string? CargoTrackingNumber { get; set; } = null;
}