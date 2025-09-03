using MassTransit;
using Infrastructure.Contracts;
using DBOperations.Operations;
using DBOperations.Entities;

namespace Infrastructure.Consumers;

public class CargoManagementConsumer : IConsumer<MessageDistributionContract>
{
    private readonly IMessageOperations _operations;

    public CargoManagementConsumer(IMessageOperations operations)
    {
        _operations = operations;
    }
    public async Task Consume(ConsumeContext<MessageDistributionContract> context)
    {
        var message = context.Message;

        var _messages = new List<ChatLine>
        {
            new ChatLine
            {
                Sender = Sender.Customer,
                Message = message.Text,
                Timestamp = message.CreatedAt
            }
        };

        string? _tracking = message.CargoTrackingNumber;
        var _status = _tracking is not null ? TicketStatus.Classified : TicketStatus.Pending;

        if (_tracking is null)
        {
            _messages.Add(new ChatLine
            {
                Sender = Sender.System,
                Message = "Kargo takip numaranızı paylaşabilir misiniz?",
                Timestamp = DateTimeOffset.UtcNow
            });
        } else
        {
            _messages.Add(new ChatLine
            {
                Sender = Sender.System,
                Message = $"Kargo takip numaranız {_tracking} ile canlı desteğe bağlıyorum.",
                Timestamp = DateTimeOffset.UtcNow
            });
        }

        var entity = new Ticket
        {
            TicketId = message.MessageId,
            UserId = message.UserId,
            RoutingKey = message.RoutingKey,
            InitialRequest = message.Text,
            Category = message.Category,
            Urgency = message.Urgency,
            SuggestedReply = message.SuggestedReply,
            CargoTrackingNumber = _tracking,
            Status = _status,
            Messages = _messages,
            CreatedAt = message.CreatedAt
        };

        await _operations.InitializeTicketAsync(entity, context.CancellationToken);
    }
}