using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Infrastructure.Consumers;

namespace Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddClassifier(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<RabbitMqOptions>(configuration.GetSection("RabbitMQ"));

        services.AddMassTransit(x =>
        {
            // Consumer tanımları
            x.AddConsumer<CargoManagementConsumer>();
            x.AddConsumer<CargoTrackingConsumer>();
            x.AddConsumer<PaymentConsumer>();
            x.AddConsumer<SatisfactionConsumer>();

            x.UsingRabbitMq((context, config) =>
            {
                var options = context.GetRequiredService<IOptions<RabbitMqOptions>>().Value;
                config.Host(options.HostName, options.VirtualHost, h =>
                {
                    h.Username(options.UserName);
                    h.Password(options.Password);
                });

                config.PrefetchCount = (ushort)options.PrefetchCount;

                // Kuyruk tanımlamaları
                config.ReceiveEndpoint(options.CargoManagement, e => // ReceiveEndpoint ile kuyruk initialize ediliyor
                {
                    e.Bind(options.DirectExchange, s => // "support.queue" isimli Exchange'e bağlanıyor
                    {
                        s.RoutingKey = options.CargoManagement;
                        s.ExchangeType = "direct";
                    });

                    e.ConfigureConsumer<CargoManagementConsumer>(context); // Kuyruk ile Consumer ilişkilendiriliyor
                });

                config.ReceiveEndpoint(options.CargoTracking, e =>
                {
                    e.Bind(options.DirectExchange, s =>
                    {
                        s.RoutingKey = options.CargoTracking;
                        s.ExchangeType = "direct";
                    });

                    e.ConfigureConsumer<CargoTrackingConsumer>(context);
                });

                config.ReceiveEndpoint(options.Payment, e =>
                {
                    e.Bind(options.DirectExchange, s =>
                    {
                        s.RoutingKey = options.Payment;
                        s.ExchangeType = "direct";
                    });

                    e.ConfigureConsumer<PaymentConsumer>(context);
                });

                config.ReceiveEndpoint(options.Satisfaction, e =>
                {
                    e.Bind(options.DirectExchange, s =>
                    {
                        s.RoutingKey = options.Satisfaction;
                        s.ExchangeType = "direct";
                    });

                    e.ConfigureConsumer<SatisfactionConsumer>(context);
                });
            });
        });

        return services;
    }
}