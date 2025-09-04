using DBOperations.Operations;
using DBOperations.Entities;
using Infrastructure.Contracts;
using MassTransit;

public class TicketOperationConsumer : IConsumer<TicketOperationContract>
{
    private readonly ITicketOperations _ticketOperations;

    public TicketOperationConsumer(ITicketOperations ticketOperations)
    {
        _ticketOperations = ticketOperations;
    }

    public async Task Consume(ConsumeContext<TicketOperationContract> context)
    {
        var payload = context.Message;

        if (string.IsNullOrWhiteSpace(payload.CargoTrackingNumber)) return;

        await _ticketOperations.SetCargoTrackingNumberAsync(payload.TicketID, payload.CargoTrackingNumber);
    }
}