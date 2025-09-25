using System.ComponentModel.DataAnnotations;

namespace AiWorker;
public sealed class GroqOptions
{
    [Required] public string BaseUrl { get; init; } = default!;
    [Required] public string Model   { get; init; } = default!;
}
