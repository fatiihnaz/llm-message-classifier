using MassTransit;
using Infrastructure.Contracts;

namespace Infrastructure.Consumers;

public class CargoTrackingConsumer: IConsumer<MessageContract>
{
    public async Task Consume(ConsumeContext<MessageContract> context)
    {
        var message = context.Message;

        Console.WriteLine($"[CargoTrackingConsumer] Received message: {message.MessageId}, Text: {message.Text}, CreatedAt: {message.CreatedAt}, UserID: {message.UserId}");
        
        await Task.CompletedTask;
    }
}