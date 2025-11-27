using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReactAppREST.Server.Models;

public partial class SemestreFrontContext : DbContext
{
    public SemestreFrontContext()
    {
    }

    public SemestreFrontContext(DbContextOptions<SemestreFrontContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CaAlumno> CaAlumnos { get; set; }

    public virtual DbSet<CaGrado> CaGrados { get; set; }

    public virtual DbSet<CaUsuario> CaUsuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CaAlumno>(entity =>
        {
            entity.HasKey(e => e.CaAlumnNId).HasName("PK__CaAlumno__6F6CA6912002D27A");

            entity.Property(e => e.CaAlumnNId).HasColumnName("CaAlumn_nId");
            entity.Property(e => e.CaAlumnBActivo).HasColumnName("CaAlumn_bActivo");
            entity.Property(e => e.CaAlumnTApellidoMaterno)
                .HasMaxLength(50)
                .HasColumnName("CaAlumn_tApellidoMaterno");
            entity.Property(e => e.CaAlumnTApellidoPaterno)
                .HasMaxLength(50)
                .HasColumnName("CaAlumn_tApellidoPaterno");
            entity.Property(e => e.CaAlumnTNombre)
                .HasMaxLength(50)
                .HasColumnName("CaAlumn_tNombre");
            entity.Property(e => e.CaAlumnTTelefono)
                .HasMaxLength(50)
                .HasColumnName("CaAlumn_tTelefono");
            entity.Property(e => e.CaGradNId).HasColumnName("CaGrad_nId");

            entity.HasOne(d => d.CaGradN).WithMany(p => p.CaAlumnos)
                .HasForeignKey(d => d.CaGradNId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_CaAlumnos_CaGrados");
        });

        modelBuilder.Entity<CaGrado>(entity =>
        {
            entity.HasKey(e => e.CaGradoNId).HasName("PK__CaGrados__0507D9061CC43DF9");

            entity.Property(e => e.CaGradoNId).HasColumnName("CaGrado_nId");
            entity.Property(e => e.CaGradoTDescripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaGrado_tDescripcion");
        });

        modelBuilder.Entity<CaUsuario>(entity =>
        {
            entity.HasKey(e => e.CaUsuaNId).HasName("PK__CaUsuari__BDDDA1459F397283");

            entity.ToTable("CaUsuario");

            entity.Property(e => e.CaUsuaNId).HasColumnName("CaUsua_nId");
            entity.Property(e => e.CaUsuaBActivo).HasColumnName("CaUsua_bActivo");
            entity.Property(e => e.CaUsuaTApM)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaUsua_tApM");
            entity.Property(e => e.CaUsuaTApP)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaUsua_tApP");
            entity.Property(e => e.CaUsuaTContraseña)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CaUsua_tContraseña");
            entity.Property(e => e.CaUsuaTEmail)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaUsua_tEmail");
            entity.Property(e => e.CaUsuaTNombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaUsua_tNombre");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
