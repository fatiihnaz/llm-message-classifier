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
        return await _database.Tickets.AsNoTracking().Where(m => m.Status == TicketStatus.Classified && m.RoutingKey == RoutingKey).ToListAsync(ct);
    }

    public async Task<List<Ticket>> GetUserMessagesAsync(string UserId, CancellationToken ct)
    {
        return await _database.Tickets.AsNoTracking().Where(m => m.UserId == UserId).ToListAsync(ct);
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
}