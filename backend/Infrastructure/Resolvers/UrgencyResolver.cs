namespace Infrastructure.Resolvers;

public sealed class UrgencyResolver
{
    public int Resolve(string urgency)
    {
        return urgency switch
        {
            "Yüksek"    => 3,
            "Orta"      => 2,
            "Düşük"     => 1,
            _           => 1
        };
    }
}