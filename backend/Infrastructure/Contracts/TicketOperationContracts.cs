namespace Infrastructure.Contracts;

public class CargoTrackingNumberContract
{
    public string CargoTrackingNumber { get; set; } = default!;
}
public class TicketOperationContract : CargoTrackingNumberContract
{
    public Guid TicketID { get; set; }
}