namespace Infrastructure;

public sealed class RabbitMqOptions
{
    public string HostName { get; set; } = "localhost";
    public int    Port     { get; set; } = 5672;
    public string UserName { get; set; } = "admin";
    public string Password { get; set; } = "admin";
    public string VirtualHost { get; set; } = "/";

    public string DirectExchange { get; set; } = "support.queue";
    public string CargoManagement { get; set; } = "support.cargo.management";
    public string CargoTracking { get; set; } = "support.cargo.tracking";
    public string Payment { get; set; } = "support.payment";
    public string Satisfaction { get; set; } = "support.satisfaction";

    public int PrefetchCount { get; set; } = 16;
    public bool Durable { get; set; } = true;
    public bool AutoDelete { get; set; } = false;
    public bool PublisherConfirm { get; set; } = true;
}
