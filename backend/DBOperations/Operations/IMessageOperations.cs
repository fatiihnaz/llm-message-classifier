using DBOperations.Entities;

namespace DBOperations.Operations;

public interface IMessageOperations
{
    Task AddMessageAsync(SupportMessage message, CancellationToken ct = default);

    Task<List<SupportMessage>> GetClassifiedMessagesAsync(string RoutingKey, CancellationToken ct = default);
}