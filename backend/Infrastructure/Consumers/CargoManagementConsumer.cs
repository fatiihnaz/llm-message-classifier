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
        var _status = "Classified";
        var _supportNumber = "CM-001";

        var entity = new SupportMessage
        {
            MessageId = message.MessageId,
            UserId = message.UserId,
            RoutingKey = message.RoutingKey,
            Text = message.Text,
            Category = message.Category,
            Urgency = message.Urgency,
            SuggestedReply = message.SuggestedReply,
            SupportNumber = _supportNumber,
            Status = _status,
            CreatedAt = message.CreatedAt
        };

        await _operations.AddMessageAsync(entity, context.CancellationToken);
    }
}