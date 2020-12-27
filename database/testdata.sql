use Nop

delete from Zgloszenie_Szczepionki
delete from Szczepionki_Odczyny
delete from Atrybuty_Zgloszenia
delete from Decyzje_Lekarza
delete from Atrybuty_Odczynow
delete from Odczyny_Zgloszenia
delete from Szczepionki
delete from Odczyny
delete from Zgloszenia
delete from Pacjenci
delete from RefreshToken
delete from Pliki
delete from Uzytkownicy

set identity_insert Uzytkownicy on

insert into Uzytkownicy 
	(id, imie, nazwisko, rola, haslo,email,telefon)
values
	(0, 'Jan', 'Kowalski', 0, 'rodzic','rodzic@wp.pl','888-88-88'),
	(1, 'Adam', 'Lekarski', 1, 'lekarz','lekarz@wp.pl','888-88-88'),
	(2, 'Krzysztof', 'PracowniczyPZH', 2,'pzh','pzh@wp.pl','888-88-88')

set identity_insert Uzytkownicy off

set identity_insert Pacjenci on

insert into Pacjenci
	(id, imie, nazwisko, data_urodzenia, uzyt_id, lekarz_id)
values
	(0, 'Janek', 'Kowalski', '20100301', 0, 1),
	(1, 'Małgosia', 'Kowalska', '20150301', 0, 1)
	
set identity_insert Pacjenci off

set identity_insert Szczepionki on

insert into Szczepionki
	(id, nazwa, opis)
values
	(0, 'Menveo', 'Produkt Menveo jest przeznaczony do czynnego uodpornienia dzieci (w wieku od 2 lat), młodzieży
i dorosłych narażonych na kontakt z dwoinkami zapalenia opon mózgowych (Neisseria meningitidis)
z grup serologicznych A, C, W135 i Y, w celu zapobiegania chorobie inwazyjnej.
Szczepionkę należy stosować zgodnie z obowiazujacymi oficjalnymi zaleceniami.')

set identity_insert Szczepionki off

set identity_insert Odczyny on

insert into Odczyny
	(id, nazwa)
values
	(0, 'Gorączka'),
	(1, 'Kaszel'),
	(2, 'Zdefiniuj własny')

set identity_insert Odczyny off

set identity_insert Atrybuty_Odczynow on

insert into Atrybuty_Odczynow
	(id, odczyn_id, typ, nazwa, info)
values
	(0, 0, 0, 'Temperatura', 'Stopni Celsjusza;36.6;0.1'),
	(1, 1, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(2, 1, 1, 'Typ', 'Mokry;Suchy'),
	(3, 2, 2, 'Pliki', null),
	(4, 2, 3, 'Opis tekstowy', null)

set identity_insert Atrybuty_Odczynow off

insert into Szczepionki_Odczyny
	(szczepionka_id, odczyn_id, stopien_ciezkosci, czestosc)
values
	(0, 0, 0, 2),
	(0, 1, 2, 1),
	(0, 2, 0, 2)