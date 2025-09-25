using System.Text.RegularExpressions;

namespace Infrastructure.Validators;
public static class CargoTrackingNumberValidator
{
    private static readonly Regex _rx = new(@"^[Cc]\d{8}[02468]\d$", RegexOptions.Compiled);

    public static bool IsValid(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return false;
        var s = input.Trim().ToUpperInvariant();
        return _rx.IsMatch(s);
    }
}
