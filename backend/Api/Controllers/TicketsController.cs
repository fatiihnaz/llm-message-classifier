using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AiWorker;
using Infrastructure;
using Infrastructure.Resolvers;
using Infrastructure.Contracts;
using Infrastructure.Validators;
using MassTransit;
using DBOperations.Operations;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AiClassifier _classifier;
    private readonly RoutingKeyResolver _routingKeyResolver;
    private readonly UrgencyResolver _urgencyResolver;
    private readonly RabbitMqOptions _options;
    private readonly ISendEndpointProvider _send;
    private readonly ITicketOperations _operations;
    public TicketsController(AiClassifier classifier, RoutingKeyResolver routingKeyResolver, UrgencyResolver urgencyResolver, IOptions<RabbitMqOptions> options, ISendEndpointProvider send, ITicketOperations operations)
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

        var cargoTrackingNumber = MessageValidator.TryExtractFirst(message.Text);

        var payload = new MessageDistributionContract
        {
            MessageId = message.MessageId,
            UserId = message.UserId,
            Text = message.Text,
            CreatedAt = message.CreatedAt,

            Category = result.Category,
            Urgency = urgency,
            SuggestedReply = result.SuggestedReply,
            RoutingKey = routingKey,
            CargoTrackingNumber = cargoTrackingNumber
        };

        var exchangeEndpoint = await _send.GetSendEndpoint(new Uri($"exchange:{_options.DirectExchange}?type=direct"));
        await exchangeEndpoint.Send(payload, ctx => ctx.SetRoutingKey(routingKey), ct);

        return Accepted(new { message.MessageId });
    }

    [HttpGet("support")]
    public async Task<IActionResult> GetSupportMessages([FromQuery] string RoutingKey, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(RoutingKey)) return BadRequest(new ProblemDetails { Title = "Validation error", Detail = "RoutingKey required" });

        var messages = await _operations.GetClassifiedMessagesAsync(RoutingKey, ct);

        if (messages == null || !messages.Any()) return NoContent();

        return Ok(messages);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserMessages([FromQuery] string UserId, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(UserId)) return BadRequest(new ProblemDetails { Title = "Validation error", Detail = "UserId required" });

        var messages = await _operations.GetUserMessagesAsync(UserId, ct);

        if (messages == null || !messages.Any()) return NoContent();

        return Ok(messages);
    }

    [HttpGet("conversation")]
    public async Task<IActionResult> GetConversation([FromQuery] Guid TicketId, CancellationToken ct)
    {
        if (TicketId == Guid.Empty) return BadRequest(new ProblemDetails { Title = "Validation error", Detail = "TicketId required" });

        var conversation = await _operations.GetConversationAsync(TicketId, ct);

        if (conversation == null || !conversation.Any()) return NoContent();

        return Ok(conversation);
    }

    [HttpGet]
    public async Task<IActionResult> GetTicket([FromQuery] Guid TicketId, CancellationToken ct)
    {
        if (TicketId == Guid.Empty) return BadRequest(new ProblemDetails { Title = "Validation error", Detail = "TicketId required" });

        var ticket = await _operations.GetTicketAsync(TicketId, ct);

        if (ticket == null) return NoContent();

        return Ok(ticket);
    }

    [HttpPatch("cargo-tracking-number")]
    public async Task<IActionResult> UpdateCargoTrackingNumber([FromQuery] Guid TicketId, [FromBody] CargoTrackingNumberContract payload, CancellationToken ct)
    {
        var newNumber = payload?.CargoTrackingNumber?.Trim();
        if (!CargoTrackingNumberValidator.IsValid(newNumber)) return BadRequest(new ProblemDetails { Title = "Validation error", Detail = "CargoTrackingNumber required" });

        var ticket = await _operations.GetTicketAsync(TicketId, ct);
        if (ticket is null) return NotFound();

        var endpoint = await _send.GetSendEndpoint(new Uri($"queue:{_options.TicketOperations}"));
        await endpoint.Send(new TicketOperationContract
        {
            TicketID = TicketId,
            CargoTrackingNumber = newNumber!
        }, ct);


        return Accepted();
    }
}
