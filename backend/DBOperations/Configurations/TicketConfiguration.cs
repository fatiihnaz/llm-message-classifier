using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DBOperations.Entities;

namespace DBOperations.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("tickets");

        builder.HasKey(t => t.TicketId);

        builder.Property(t => t.InitialRequest).IsRequired();
        builder.Property(t => t.RoutingKey).IsRequired();
        builder.Property(t => t.Status).IsRequired().HasDefaultValue(TicketStatus.New);

        builder.OwnsMany(t => t.Messages, nb =>
        {
            nb.ToJson();
            nb.Property(m => m.Sender).IsRequired();
            nb.Property(m => m.Message).IsRequired();
            nb.Property(m => m.Timestamp).IsRequired().HasColumnType("timestamptz");
        });

        builder.Property(t => t.CreatedAt).IsRequired().HasColumnType("timestamptz");
        builder.Property(t => t.UpdatedAt).HasColumnType("timestamptz");

        builder.HasIndex(t => t.RoutingKey).HasDatabaseName("idx_routing_key");
        builder.HasIndex(t => t.Urgency).HasDatabaseName("idx_urgency");
        builder.HasIndex(t => t.CreatedAt).HasDatabaseName("idx_created_at");
    }
}