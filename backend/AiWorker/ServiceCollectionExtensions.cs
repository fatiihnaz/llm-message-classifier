using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace AiWorker;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAi(this IServiceCollection services, IConfiguration config)
    {
        // GroqOptions binding
        services.Configure<GroqOptions>(config.GetSection("Groq"));
        
        services.PostConfigure<GroqOptions>(o =>
        {
            if (!Uri.IsWellFormedUriString(o.BaseUrl, UriKind.Absolute))
                throw new InvalidOperationException("Groq:BaseUrl geçerli bir URL olmalı");
        });

        // ChatClient kaydı
        services.AddSingleton<ChatClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<GroqOptions>>().Value;
            var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY")
                         ?? throw new InvalidOperationException("GROQ_API_KEY bulunamadı.");
            return new ChatClient(
                model: options.Model,
                credential: new ApiKeyCredential(apiKey),
                options: new OpenAIClientOptions { Endpoint = new Uri(options.BaseUrl) }
            );
        });

        // AI servisleri
        services.AddSingleton<AiClassifier>();

        return services;
    }
}
