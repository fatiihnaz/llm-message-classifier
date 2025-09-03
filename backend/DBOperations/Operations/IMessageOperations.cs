using DBOperations.Entities;

namespace DBOperations.Operations;

public interface IMessageOperations
{
    Task InitializeTicketAsync(Ticket message, CancellationToken ct = default);
    Task<List<Ticket>> GetClassifiedMessagesAsync(string RoutingKey, CancellationToken ct = default);
    Task<List<Ticket>> GetUserMessagesAsync(string UserId, CancellationToken ct = default);
    Task<IReadOnlyList<ChatLine>> GetMessagesAsync(Guid TicketId, CancellationToken ct = default);
}