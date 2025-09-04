using System.Text.RegularExpressions;

public static class MessageValidator
{
    // Metin içinde arama: alfasayısal sınırlarla çevrelenmiş "C##########" (sondan 2. çift)
    private static readonly Regex _rx = new(
        @"(?<![A-Za-z0-9])C\d{8}[02468]\d(?![A-Za-z0-9])",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    // İlk eşleşmeyi döndürür; yoksa null.
    public static string? TryExtractFirst(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return null;
        var m = _rx.Match(text.Trim());
        return m.Success ? m.Value.ToUpperInvariant() : null;
    }

    // Tüm benzersiz eşleşmeleri (orijinal sıralarıyla) döndürür
    public static IReadOnlyList<string> ExtractAll(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return Array.Empty<string>();
        var matches = _rx.Matches(text);
        if (matches.Count == 0) return Array.Empty<string>();

        // Duplicate’leri at (örn. aynı kod birden çok kez geçerse)
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var list = new List<string>(matches.Count);
        foreach (Match m in matches)
        {
            var v = m.Value.ToUpperInvariant();
            if (set.Add(v))
                list.Add(v);
        }
        return list;
    }
}
