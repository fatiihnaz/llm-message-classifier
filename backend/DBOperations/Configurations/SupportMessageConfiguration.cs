using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DBOperations.Entities;

namespace DBOperations.Configurations;

public class SupportMessageConfiguration : IEntityTypeConfiguration<SupportMessage>
{
    public void Configure(EntityTypeBuilder<SupportMessage> builder)
    {
        builder.ToTable("support_messages");

        builder.HasKey(sm => sm.MessageId);

        builder.Property(sm => sm.Text).IsRequired();
        builder.Property(sm => sm.RoutingKey).IsRequired();
        builder.Property(sm => sm.Status).IsRequired().HasDefaultValue("Pending");
        builder.Property(sm => sm.CreatedAt).IsRequired().HasColumnType("timestamptz");

        builder.HasIndex(sm => sm.RoutingKey).HasDatabaseName("idx_sm_routing_key");
        builder.HasIndex(sm => sm.Urgency).HasDatabaseName("idx_sm_urgency");
        builder.HasIndex(sm => sm.CreatedAt).HasDatabaseName("idx_sm_created_at");
    }
}