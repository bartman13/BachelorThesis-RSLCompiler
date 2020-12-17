use Nop

delete from Uzytkownicy
delete from Pacjenci
delete from Zgloszenia
delete from Decyzje_Lekarza
delete from Zgloszenie_Szczepionki
delete from Odczyny_Zgloszenia
delete from Szczepionki_Odczyny
delete from Szczepionki
delete from Atrybuty_Odczynow
delete from Odczyny



set identity_insert Uzytkownicy on

insert into Uzytkownicy 
	(id, imie, nazwisko, rola, haslo,email,telefon)
values
	(0, 'Jan', 'Kowalski', 0, 'rodzic','rodzic@wp.pl','888-88-88'),
	(1, 'Adam', 'Lekarski', 1, 'lekarz','lekarz@wp.pl','888-88-88'),
	(2, 'Krzysztow', 'PracowniczyPZH', 2,'pzh','pzh@wp.pl','888-88-88')

set identity_insert Uzytkownicy off

set identity_insert Pacjenci on

insert into Pacjenci
	(id, imie, nazwisko, data_urodzenia, uzyt_id, lekarz_id)
values
	(0, 'Janek', 'Kowalski', '20100301', 0, 1),
	(1, 'Malgosia', 'Kowalska', '20150301', 0, 1)
	
set identity_insert Pacjenci off

set identity_insert Zgloszenia on

insert into Zgloszenia
	(id, uzyt_id, "data", zdjecie_ks_zd, lekarz_id, prosba_o_kontakt, pacjent_id)
values
	(0, 0, GETDATE(), './zdjecie.png', 1, 1, 0),
	(1, 0, GETDATE(), './zdjecie.png', 1, 0, 0),
	(2, 0, GETDATE(), './zdjecie.png', 1, 1, 0)
	

set identity_insert Zgloszenia off

set identity_insert Szczepionki on

insert into Szczepionki
	(id, nazwa, opis)
values
	(0, 'Menveo', 'Produkt Menveo jest przeznaczony do czynnego uodpornienia dzieci (w wieku od 2 lat), m3odzie?y
i doros3ych nara?onych na kontakt z dwoinkami zapalenia opon mózgowych (Neisseria meningitidis)
z grup serologicznych A, C, W135 i Y, w celu zapobiegania chorobie inwazyjnej.
Szczepionke nale?y stosowaa zgodnie z obowi1zuj1cymi oficjalnymi zaleceniami.')

set identity_insert Szczepionki off

set identity_insert Odczyny on

insert into Odczyny
	(id, nazwa)
values
	(0, 'Gor1czka')

set identity_insert Odczyny off

insert into Atrybuty_Odczynow
	(odczyn_id, typ,nazwa, info)
values
	(0, 0,'Goraczka', 'Stopni Celsjusza')

insert into Szczepionki_Odczyny
	(szczepionka_id, odczyn_id, stopien_ciezkosci, czestosc)
values
	(0, 0, 0, 0)

insert into Odczyny_Zgloszenia
	(odczyn_id, zgloszenie_id, wartosc, "data")
values
	(0, 0, '37.7', GETDATE())

insert into Zgloszenie_Szczepionki
	(zgloszenie_id, szczepionka_id)
values
	(0, 0)