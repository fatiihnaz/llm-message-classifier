using Infrastructure;
using Infrastructure.Resolvers;
using DotNetEnv;
using AiWorker;
using DBOperations;
using Microsoft.EntityFrameworkCore;
using DBOperations.Operations;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddAi(builder.Configuration);
builder.Services.AddClassifier(builder.Configuration);
builder.Services.AddSingleton<RoutingKeyResolver>();
builder.Services.AddSingleton<UrgencyResolver>();
builder.Services.AddScoped<ITicketOperations, TicketOperations>();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Postgres") ?? throw new InvalidOperationException("Connection string 'Postgres' not found.");
    options.UseNpgsql(connectionString, npsql => npsql.EnableRetryOnFailure(3));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy => policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("AllowFrontend");
app.MapControllers();
app.Run();