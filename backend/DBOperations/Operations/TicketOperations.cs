using DBOperations;
using DBOperations.Entities;
using DBOperations.Operations;
using Microsoft.EntityFrameworkCore;

public class TicketOperations : ITicketOperations
{
    private readonly AppDbContext _database;

    public TicketOperations(AppDbContext database)
    {
        _database = database;
    }

    public async Task InitializeTicketAsync(Ticket message, CancellationToken ct)
    {
        var exists = await _database.Tickets.AnyAsync(m => m.TicketId == message.TicketId, ct);

        if (exists) return;

        await _database.Tickets.AddAsync(message, ct);
        await _database.SaveChangesAsync(ct);
    }

    public async Task<List<Ticket>> GetClassifiedMessagesAsync(string RoutingKey, CancellationToken ct)
    {
        return await _database.Tickets.AsNoTracking().Where(m => m.Status == TicketStatus.Classified && m.RoutingKey == RoutingKey).OrderByDescending(m => m.CreatedAt).ToListAsync(ct);
    }

    public async Task<List<Ticket>> GetUserMessagesAsync(string UserId, CancellationToken ct)
    {
        return await _database.Tickets.AsNoTracking().Where(m => m.UserId == UserId).OrderByDescending(m => m.CreatedAt).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ChatLine>> GetConversationAsync(Guid TicketId, CancellationToken ct)
    {
        var messages = await _database.Tickets.AsNoTracking().Where(t => t.TicketId == TicketId).Select(t => t.Messages).FirstOrDefaultAsync(ct);
        if (messages is null || messages.Count == 0) return Array.Empty<ChatLine>();
        return messages.OrderBy(m => m.Timestamp).ToList();
    }

    public async Task<Ticket?> GetTicketAsync(Guid TicketId, CancellationToken ct)
    {
        return await _database.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == TicketId, ct);
    }

    public async Task SetCargoTrackingNumberAsync(Guid ticketId, string cargoTrackingNumber, CancellationToken ct = default)
    {
        var ticket = await _database.Tickets.FirstOrDefaultAsync(t => t.TicketId == ticketId, ct);
        if (ticket is null) return;

        var newNumber = cargoTrackingNumber?.Trim();
        if (string.IsNullOrWhiteSpace(newNumber)) return;
        if (string.Equals(ticket.CargoTrackingNumber, newNumber, StringComparison.OrdinalIgnoreCase)) return;

        ticket.CargoTrackingNumber = newNumber;

        if (ticket.Status == TicketStatus.Pending) ticket.Status = TicketStatus.Classified;

        ticket.Messages.Add(
            new ChatLine
            {
                Sender = Sender.Customer,
                Message = $"{newNumber}",
                Timestamp = DateTimeOffset.UtcNow
            }
        );

        ticket.Messages.Add(
            new ChatLine
            {
                Sender = Sender.System,
                Message = $"Kargo takip numaranız {newNumber} ile canlı desteğe bağlıyorum.",
                Timestamp = DateTimeOffset.UtcNow
            }
        );

        await _database.SaveChangesAsync(ct);
    }
}