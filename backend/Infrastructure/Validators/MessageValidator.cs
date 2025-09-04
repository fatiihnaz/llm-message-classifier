using System.Text.RegularExpressions;

public static class MessageValidator
{
    // Metin içinde arama: alfasayısal sınırlarla çevrelenmiş "C##########" (sondan 2. çift)
    private static readonly Regex _rx = new(
        @"(?<![A-Za-z0-9])[Cc]\d{8}[02468]\d(?![A-Za-z0-9])",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    // İlk eşleşmeyi döndürür; yoksa null.
    public static string? TryExtractFirst(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return null;
        var m = _rx.Match(text.Trim());
        return m.Success ? m.Value.ToUpperInvariant() : null;
    }
}
