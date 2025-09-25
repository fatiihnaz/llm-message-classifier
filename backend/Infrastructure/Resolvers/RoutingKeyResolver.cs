using Microsoft.Extensions.Options;

namespace Infrastructure.Resolvers;

public sealed class RoutingKeyResolver
{
    private readonly RabbitMqOptions _options;

    public RoutingKeyResolver(IOptions<RabbitMqOptions> options)
    {
        _options = options.Value;
    }

    public string Resolve(string category)
    {
        return category switch
        {
            "Kargo Yönetimi"    => _options.CargoManagement,
            "Kargo Takip"       => _options.CargoTracking,
            "Ödeme Sorunu"      => _options.Payment,
            "Memnuniyet"        => _options.Satisfaction,
            _                   => _options.Satisfaction
        };
    }
}