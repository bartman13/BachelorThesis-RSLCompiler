SET NOCOUNT ON
GO

USE master
GO
if exists (select * from sysdatabases where name='Nop')
		drop database Nop
go

DECLARE @device_directory NVARCHAR(520)
SELECT @device_directory = SUBSTRING(filename, 1, CHARINDEX(N'master.mdf', LOWER(filename)) - 1)
FROM master.dbo.sysaltfiles WHERE dbid = 1 AND fileid = 1

EXECUTE (N'CREATE DATABASE Nop
  ON PRIMARY (NAME = N''Nop'', FILENAME = N''' + @device_directory + N'nop.mdf'')
  LOG ON (NAME = N''Nop_log'',  FILENAME = N''' + @device_directory + N'nop.ldf'')')
go

GO

set quoted_identifier on
GO

SET DATEFORMAT mdy
GO
use "Nop"
go

CREATE TABLE Uzytkownicy (
	id int IDENTITY (1, 1) NOT NULL ,
	imie nvarchar (20) NOT NULL,
	nazwisko nvarchar (30) NOT NULL,
	telefon nvarchar (30) NULL,
	email nvarchar (30) NULL,
	rola int NOT NULL,
	"login" nvarchar (20) NOT NULL,
	haslo  nvarchar (30) NOT NULL,
	akceptacja_warunkow bit NULL,
	verification_token nvarchar(50) NULL,
	zweryfikowany datetime NULL,
	reset_token nvarchar(50) NULL,
	reset_token_wygasa datetime NULL,
	reset_hasla  datetime NULL,
	utworzone datetime NULL,
	zaktualizowane datetime NULL
	CONSTRAINT PK_Uzytkownicy PRIMARY KEY CLUSTERED
	(
		id
	)
)

GO

CREATE TABLE RefreshToken(
	id int IDENTITY(1, 1) NOT NULL,
	uzyt_id int NOT NULL,
	token nvarchar(100) not null,
	token_wygasa datetime not NULL,
	utworzone datetime not NULL,
	utworzone_przez_ip nvarchar(20) not NULL,
	anulowane datetime NULL,
	anulowane_przez_ip nvarchar(20) NULL,
	zastapione_przez_token nvarchar(100) NULL


	CONSTRAINT PK_RefreshToken PRIMARY KEY CLUSTERED
	(
		id
	),
	CONSTRAINT FK_RefreshToken_Uzytkownicy FOREIGN KEY
	(
		uzyt_id
	) REFERENCES Uzytkownicy
	(
		id
	)
)
Go
CREATE TABLE Pacjenci (
	id int IDENTITY (1, 1) NOT NULL ,
	imie nvarchar (20) NOT NULL,
	nazwisko nvarchar (30) NOT NULL,
	data_urodzenia datetime NOT NULL,
	uzyt_id int NOT NULL,
	lekarz_id int NULL
	CONSTRAINT PK_Pacjenci PRIMARY KEY CLUSTERED
	(
		id
	),
	CONSTRAINT FK_Pacjenci_Uzytkownicy FOREIGN KEY
	(
		uzyt_id
	) REFERENCES Uzytkownicy
	(
		id
	),
	CONSTRAINT FK_Pacjenci_Uzytkwnicy2 FOREIGN KEY
	(
		lekarz_id
	) REFERENCES Uzytkownicy
	(
		id
	)
)

GO

CREATE TABLE Zgloszenia (
	id int IDENTITY (1, 1) NOT NULL,
	uzyt_id int NOT NULL,
	"data" date NOT NULL,
	zdjecie_ks_zd nvarchar(50) NOT NULL,
	lekarz_id int NULL,
	prosba_o_kontakt bit NOT NULL,
	pacjent_id int NOT NULL
	CONSTRAINT PK_Zgloszenia PRIMARY KEY CLUSTERED
	(
		id
	),
	CONSTRAINT FK_Zgloszenia_Uzytkownicy FOREIGN KEY
	(
		uzyt_id
	) REFERENCES Uzytkownicy
	(
		id
	),
	CONSTRAINT FK_Zgloszenia_Uzytkwnicy2 FOREIGN KEY
	(
		lekarz_id
	) REFERENCES Uzytkownicy
	(
		id
	),
	CONSTRAINT FK_Zgloszenia_Pacjenci FOREIGN KEY
	(
		pacjent_id
	) REFERENCES Pacjenci
	(
		id
	)
)

GO

CREATE TABLE Decyzje_Lekarza (
	id int IDENTITY (1, 1) NOT NULL,
	decyzja int NOT NULL,
	komentarz nvarchar(3000) NULL,
	zgloszenie_id int NOT NULL,
	CONSTRAINT PK_Decyzje_Lekarza PRIMARY KEY CLUSTERED
	(
		id
	),
	CONSTRAINT FK_Decyzje_Zgloszenia FOREIGN KEY
	(
		zgloszenie_id
	) REFERENCES Zgloszenia
	(
		id
	)
)

GO

CREATE TABLE Szczepionki (
	id int IDENTITY (1, 1) NOT NULL,
	nazwa nvarchar(100) NOT NULL,
	opis ntext NULL,
	CONSTRAINT PK_Szczepionki PRIMARY KEY CLUSTERED
	(
		id
	)
)

GO

CREATE TABLE Zgloszenie_Szczepionki (
	id int IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	zgloszenie_id int NOT NULL,
	szczepionka_id int NOT NULL,
	CONSTRAINT FK_ZGSZ_Zgloszenia FOREIGN KEY
	(
		zgloszenie_id
	) REFERENCES Zgloszenia
	(
		id
	),
	CONSTRAINT FK_ZGSZ_Szczepionki FOREIGN KEY
	(
		szczepionka_id
	) REFERENCES Szczepionki
	(
		id
	)
)

GO

CREATE TABLE Odczyny(
	id int IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	nazwa nvarchar(100) NOT NULL,
)

GO

CREATE TABLE Atrybuty_Odczynow(
	id int IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	odczyn_id int NOT NULL,
	typ int NOT NULL,
	info nvarchar(1000) NULL,
	CONSTRAINT FK_ATOD_Odczyny FOREIGN KEY
	(
		odczyn_id
	) REFERENCES Odczyny
	(
		id
	)
)

GO

CREATE TABLE Odczyny_Zgloszenia(
	id int IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	odczyn_id int NOT NULL,
	zgloszenie_id int NOT NULL,
	wartosc nvarchar(100) NULL,
	"data" datetime NOT NULL,
	CONSTRAINT FK_ODZG_Odczyny FOREIGN KEY
	(
		odczyn_id
	) REFERENCES Odczyny
	(
		id
	),
	CONSTRAINT FK_ODZG_Zgloszenia FOREIGN KEY
	(
		zgloszenie_id
	) REFERENCES Zgloszenia
	(
		id
	)
)

GO

CREATE TABLE Szczepionki_Odczyny (
	id int IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	odczyn_id int NOT NULL,
	szczepionka_id int NOT NULL,
	stopien_ciezkosci int NULL,
	czestosc int NULL,
	CONSTRAINT FK_SZOD_Odczyny FOREIGN KEY
	(
		odczyn_id
	) REFERENCES Odczyny
	(
		id
	),
	CONSTRAINT FK_SZOD_Szczepionki FOREIGN KEY
	(
		szczepionka_id
	) REFERENCES Szczepionki
	(
		id
	)
)

GO