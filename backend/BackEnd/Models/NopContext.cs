﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BackEnd.Models
{
    public partial class NopContext : DbContext
    {
        public NopContext()
        {
        }

        public NopContext(DbContextOptions<NopContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AtrybutyOdczynow> AtrybutyOdczynow { get; set; }
        public virtual DbSet<DecyzjeLekarza> DecyzjeLekarza { get; set; }
        public virtual DbSet<Odczyny> Odczyny { get; set; }
        public virtual DbSet<OdczynyZgloszenia> OdczynyZgloszenia { get; set; }
        public virtual DbSet<Pacjenci> Pacjenci { get; set; }
        public virtual DbSet<Szczepionki> Szczepionki { get; set; }
        public virtual DbSet<SzczepionkiOdczyny> SzczepionkiOdczyny { get; set; }
        public virtual DbSet<Uzytkownicy> Uzytkownicy { get; set; }
        public virtual DbSet<Zgloszenia> Zgloszenia { get; set; }
        public virtual DbSet<ZgloszenieSzczepionki> ZgloszenieSzczepionki { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=Nop;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AtrybutyOdczynow>(entity =>
            {
                entity.ToTable("Atrybuty_Odczynow");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Info)
                    .HasColumnName("info")
                    .HasMaxLength(1000);

                entity.Property(e => e.OdczynId).HasColumnName("odczyn_id");

                entity.Property(e => e.Typ).HasColumnName("typ");

                entity.HasOne(d => d.Odczyn)
                    .WithMany(p => p.AtrybutyOdczynow)
                    .HasForeignKey(d => d.OdczynId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ATOD_Odczyny");
            });

            modelBuilder.Entity<DecyzjeLekarza>(entity =>
            {
                entity.ToTable("Decyzje_Lekarza");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Decyzja).HasColumnName("decyzja");

                entity.Property(e => e.Komentarz)
                    .HasColumnName("komentarz")
                    .HasMaxLength(3000);

                entity.Property(e => e.ZgloszenieId).HasColumnName("zgloszenie_id");

                entity.HasOne(d => d.Zgloszenie)
                    .WithMany(p => p.DecyzjeLekarza)
                    .HasForeignKey(d => d.ZgloszenieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Decyzje_Zgloszenia");
            });

            modelBuilder.Entity<Odczyny>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Nazwa)
                    .IsRequired()
                    .HasColumnName("nazwa")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<OdczynyZgloszenia>(entity =>
            {
                entity.ToTable("Odczyny_Zgloszenia");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Data)
                    .HasColumnName("data")
                    .HasColumnType("datetime");

                entity.Property(e => e.OdczynId).HasColumnName("odczyn_id");

                entity.Property(e => e.Wartosc)
                    .HasColumnName("wartosc")
                    .HasMaxLength(100);

                entity.Property(e => e.ZgloszenieId).HasColumnName("zgloszenie_id");

                entity.HasOne(d => d.Odczyn)
                    .WithMany(p => p.OdczynyZgloszenia)
                    .HasForeignKey(d => d.OdczynId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ODZG_Odczyny");

                entity.HasOne(d => d.Zgloszenie)
                    .WithMany(p => p.OdczynyZgloszenia)
                    .HasForeignKey(d => d.ZgloszenieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ODZG_Zgloszenia");
            });

            modelBuilder.Entity<Pacjenci>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DataUrodzenia)
                    .HasColumnName("data_urodzenia")
                    .HasColumnType("datetime");

                entity.Property(e => e.Imie)
                    .IsRequired()
                    .HasColumnName("imie")
                    .HasMaxLength(20);

                entity.Property(e => e.LekarzId).HasColumnName("lekarz_id");

                entity.Property(e => e.Nazwisko)
                    .IsRequired()
                    .HasColumnName("nazwisko")
                    .HasMaxLength(30);

                entity.Property(e => e.UzytId).HasColumnName("uzyt_id");

                entity.HasOne(d => d.Lekarz)
                    .WithMany(p => p.PacjenciLekarz)
                    .HasForeignKey(d => d.LekarzId)
                    .HasConstraintName("FK_Pacjenci_Uzytkwnicy2");

                entity.HasOne(d => d.Uzyt)
                    .WithMany(p => p.PacjenciUzyt)
                    .HasForeignKey(d => d.UzytId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Pacjenci_Uzytkownicy");
            });

            modelBuilder.Entity<Szczepionki>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Nazwa)
                    .IsRequired()
                    .HasColumnName("nazwa")
                    .HasMaxLength(100);

                entity.Property(e => e.Opis)
                    .HasColumnName("opis")
                    .HasColumnType("ntext");
            });

            modelBuilder.Entity<SzczepionkiOdczyny>(entity =>
            {
                entity.ToTable("Szczepionki_Odczyny");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Czestosc).HasColumnName("czestosc");

                entity.Property(e => e.OdczynId).HasColumnName("odczyn_id");

                entity.Property(e => e.StopienCiezkosci).HasColumnName("stopien_ciezkosci");

                entity.Property(e => e.SzczepionkaId).HasColumnName("szczepionka_id");

                entity.HasOne(d => d.Odczyn)
                    .WithMany(p => p.SzczepionkiOdczyny)
                    .HasForeignKey(d => d.OdczynId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SZOD_Odczyny");

                entity.HasOne(d => d.Szczepionka)
                    .WithMany(p => p.SzczepionkiOdczyny)
                    .HasForeignKey(d => d.SzczepionkaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SZOD_Szczepionki");
            });

            modelBuilder.Entity<Uzytkownicy>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(30);

                entity.Property(e => e.Haslo)
                    .IsRequired()
                    .HasColumnName("haslo")
                    .HasMaxLength(30);

                entity.Property(e => e.Imie)
                    .IsRequired()
                    .HasColumnName("imie")
                    .HasMaxLength(20);

                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasColumnName("login")
                    .HasMaxLength(20);

                entity.Property(e => e.Nazwisko)
                    .IsRequired()
                    .HasColumnName("nazwisko")
                    .HasMaxLength(30);

                entity.Property(e => e.Rola).HasColumnName("rola");

                entity.Property(e => e.Tel)
                    .HasColumnName("tel")
                    .HasMaxLength(30);
            });

            modelBuilder.Entity<Zgloszenia>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Data)
                    .HasColumnName("data")
                    .HasColumnType("date");

                entity.Property(e => e.LekarzId).HasColumnName("lekarz_id");

                entity.Property(e => e.PacjentId).HasColumnName("pacjent_id");

                entity.Property(e => e.ProsbaOKontakt).HasColumnName("prosba_o_kontakt");

                entity.Property(e => e.UzytId).HasColumnName("uzyt_id");

                entity.Property(e => e.ZdjecieKsZd)
                    .IsRequired()
                    .HasColumnName("zdjecie_ks_zd")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Lekarz)
                    .WithMany(p => p.ZgloszeniaLekarz)
                    .HasForeignKey(d => d.LekarzId)
                    .HasConstraintName("FK_Zgloszenia_Uzytkwnicy2");

                entity.HasOne(d => d.Pacjent)
                    .WithMany(p => p.Zgloszenia)
                    .HasForeignKey(d => d.PacjentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Zgloszenia_Pacjenci");

                entity.HasOne(d => d.Uzyt)
                    .WithMany(p => p.ZgloszeniaUzyt)
                    .HasForeignKey(d => d.UzytId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Zgloszenia_Uzytkownicy");
            });

            modelBuilder.Entity<ZgloszenieSzczepionki>(entity =>
            {
                entity.ToTable("Zgloszenie_Szczepionki");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.SzczepionkaId).HasColumnName("szczepionka_id");

                entity.Property(e => e.ZgloszenieId).HasColumnName("zgloszenie_id");

                entity.HasOne(d => d.Szczepionka)
                    .WithMany(p => p.ZgloszenieSzczepionki)
                    .HasForeignKey(d => d.SzczepionkaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ZGSZ_Szczepionki");

                entity.HasOne(d => d.Zgloszenie)
                    .WithMany(p => p.ZgloszenieSzczepionki)
                    .HasForeignKey(d => d.ZgloszenieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ZGSZ_Zgloszenia");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}