using DBOperations.Entities;

namespace DBOperations.Operations;

public interface ITicketOperations
{
    Task InitializeTicketAsync(Ticket message, CancellationToken ct = default);
    Task<List<Ticket>> GetClassifiedMessagesAsync(string RoutingKey, CancellationToken ct = default);
    Task<List<Ticket>> GetUserMessagesAsync(string UserId, CancellationToken ct = default);
    Task<IReadOnlyList<ChatLine>> GetConversationAsync(Guid TicketId, CancellationToken ct = default);
    Task<Ticket?> GetTicketAsync(Guid TicketId, CancellationToken ct = default);
}