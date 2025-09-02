using MassTransit;
using Infrastructure.Contracts;
using DBOperations.Operations;
using DBOperations.Entities;

namespace Infrastructure.Consumers;

public class SatisfactionConsumer : IConsumer<MessageDistributionContract>
{
    private readonly IMessageOperations _operations;

    public SatisfactionConsumer(IMessageOperations operations)
    {
        _operations = operations;
    }
    public async Task Consume(ConsumeContext<MessageDistributionContract> context)
    {
        var message = context.Message;
        var _status = "Classified";

        var entity = new SupportMessage
        {
            MessageId = message.MessageId,
            UserId = message.UserId,
            RoutingKey = message.RoutingKey,
            Text = message.Text,
            Category = message.Category,
            Urgency = message.Urgency,
            SuggestedReply = message.SuggestedReply,
            Status = _status,
            CreatedAt = message.CreatedAt
        };

        await _operations.AddMessageAsync(entity, context.CancellationToken);
    }
}