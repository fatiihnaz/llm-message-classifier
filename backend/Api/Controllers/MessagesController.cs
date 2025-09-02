using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AiWorker;
using Infrastructure;
using Infrastructure.Resolvers;
using Infrastructure.Contracts;
using MassTransit;
using DBOperations.Operations;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly AiClassifier _classifier;
    private readonly RoutingKeyResolver _routingKeyResolver;
    private readonly UrgencyResolver _urgencyResolver;
    private readonly RabbitMqOptions _options;
    private readonly ISendEndpointProvider _send;
    private readonly IMessageOperations _operations;
    public MessagesController(AiClassifier classifier, RoutingKeyResolver routingKeyResolver, UrgencyResolver urgencyResolver, IOptions<RabbitMqOptions> options, ISendEndpointProvider send, IMessageOperations operations)
    {
        _classifier = classifier;
        _routingKeyResolver = routingKeyResolver;
        _urgencyResolver = urgencyResolver;
        _options = options.Value;
        _send = send;
        _operations = operations;
    }

    [HttpPost("classify")]
    public async Task<IActionResult> ClassifyMessage([FromBody] MessageContract message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Text)) return BadRequest("Content required.");
        var result = await _classifier.ClassifyAsync(message.Text);
        var routingKey = _routingKeyResolver.Resolve(result.Category);
        var urgency = _urgencyResolver.Resolve(result.Urgency);

        var payload = new MessageDistributionContract
        {
            MessageId = message.MessageId,
            UserId = message.UserId,
            Text = message.Text,
            CreatedAt = message.CreatedAt,

            Category = result.Category,
            Urgency = urgency,
            SuggestedReply = result.SuggestedReply,
            RoutingKey = routingKey
        };

        Console.WriteLine($"\n\n{result.Category}");
        Console.WriteLine($"\n{result.SuggestedReply}");
        var exchangeEndpoint = await _send.GetSendEndpoint(new Uri($"exchange:{_options.DirectExchange}?type=direct"));
        await exchangeEndpoint.Send(payload, ctx => ctx.SetRoutingKey(routingKey), ct);

        return Accepted(new { message.MessageId, routingKey });
    }

    [HttpGet("support")]
    public async Task<IActionResult> GetMessages([FromQuery] string RoutingKey, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(RoutingKey)) return BadRequest("RoutingKey required.");

        var messages = await _operations.GetClassifiedMessagesAsync(RoutingKey, ct);
        return Ok(messages);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserMessages([FromQuery] string UserId, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(UserId)) return BadRequest("UserId required.");

        var messages = await _operations.GetUserMessagesAsync(UserId, ct);
        return Ok(messages);
    }
}
