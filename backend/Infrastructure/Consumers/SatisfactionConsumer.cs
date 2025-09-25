using MassTransit;
using Infrastructure.Contracts;
using DBOperations.Operations;
using DBOperations.Entities;

namespace Infrastructure.Consumers;

public class SatisfactionConsumer : IConsumer<MessageDistributionContract>
{
    private readonly ITicketOperations _operations;

    public SatisfactionConsumer(ITicketOperations operations)
    {
        _operations = operations;
    }
    public async Task Consume(ConsumeContext<MessageDistributionContract> context)
    {
        var message = context.Message;

        var _messages = new List<ChatLine>
        {
            new ChatLine { Sender = Sender.Customer, Message = message.Text, Timestamp = message.CreatedAt },
            new ChatLine { Sender = Sender.System,   Message = "Canlı desteğe bağlıyorum.", Timestamp = DateTimeOffset.UtcNow }
        };

        var entity = new Ticket
        {
            TicketId = message.MessageId,
            UserId = message.UserId,
            RoutingKey = message.RoutingKey,
            InitialRequest = message.Text,
            Category = message.Category,
            Urgency = message.Urgency,
            SuggestedReply = message.SuggestedReply,
            Status = TicketStatus.Classified,
            Messages = _messages,
            CreatedAt = message.CreatedAt
        };

        await _operations.InitializeTicketAsync(entity, context.CancellationToken);
    }
}