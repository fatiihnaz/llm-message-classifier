using DBOperations;
using DBOperations.Entities;
using DBOperations.Operations;
using Microsoft.EntityFrameworkCore;

public class MessageOperations : IMessageOperations
{
    private readonly AppDbContext _database;

    public MessageOperations(AppDbContext database)
    {
        _database = database;
    }

    public async Task AddMessageAsync(SupportMessage message, CancellationToken ct)
    {
        var exists = await _database.SupportMessages.AnyAsync(m => m.MessageId == message.MessageId, ct);

        if (exists) return;

        await _database.SupportMessages.AddAsync(message, ct);
        await _database.SaveChangesAsync(ct);
    }

    public async Task<List<SupportMessage>> GetClassifiedMessagesAsync(string RoutingKey, CancellationToken ct)
    {
        return await _database.SupportMessages.AsNoTracking().Where(m => m.Status == "Classified" && m.RoutingKey == RoutingKey).ToListAsync(ct);
    }

    public async Task<List<SupportMessage>> GetUserMessagesAsync(string UserId, CancellationToken ct)
    {
        return await _database.SupportMessages.AsNoTracking().Where(m => m.UserId == UserId).ToListAsync(ct);
    }
}