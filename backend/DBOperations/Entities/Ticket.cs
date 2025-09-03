using System.Text.Json.Serialization;

namespace DBOperations.Entities;

public class Ticket
{
    public Guid TicketId { get; set; }
    public string? UserId { get; set; }
    public string RoutingKey { get; set; } = default!;
    public string InitialRequest { get; set; } = default!;
    public string? Category { get; set; }
    public int? Urgency { get; set; }
    public string? SuggestedReply { get; set; }
    public string? CargoTrackingNumber { get; set; }
    public TicketStatus Status { get; set; } = TicketStatus.New;
    public List<ChatLine> Messages { get; set; } = new();
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class ChatLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Sender Sender { get; set; } = Sender.System;
    public string Message { get; set; } = default!;
    public bool HasSeen { get; set; }
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
}

public enum TicketStatus { New, Pending, Classified, Answered, Archived }

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Sender { Customer, Support, System }