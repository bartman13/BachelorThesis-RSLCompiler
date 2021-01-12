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
	(id, imie, nazwisko, rola, hash_hasla,email,telefon)
values
	(0, 'Jan', 'Kowalski', 0, '$2a$11$sLwsQHGwX0HWGrN2Y44kXebgjpEEJ6bcU3uaHbd.5B1pvlQpEbxGm','rodzic@wp.pl','888-88-88'),
	(1, 'Adam', 'Lekarski', 1, '$2a$11$7V1ZrWGAALER2OCHl0N7cevVQNiJtS7Tw80E2Mv5WCA8sbvZtgAJC','lekarz@wp.pl','888-88-88'),
	(2, 'Krzysztof', 'PracowniczyPZH', 2,'$2a$11$7VsuNXvpR7zREk2qbkWX4OSRzZLTbB9uXdzNz55Zw3W87sZacuHiC','pzh@wp.pl','888-88-88')

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
	(0, 'Menveo', 'Produkt MENVEO jest przeznaczony do czynnego uodpornienia dzieci (w wieku od 2 lat), młodzieży
i dorosłych narażonych na kontakt z dwoinkami zapalenia opon mózgowych (Neisseria meningitidis)
z grup serologicznych A, C, W135 i Y, w celu zapobiegania chorobie inwazyjnej.
Szczepionkę należy stosować zgodnie z obowiazujacymi oficjalnymi zaleceniami.'),
	(1, 'Adacel', 'Produkt ADACEL jest stosowany do wzmocnienia ochrony przeciw błonicy, tężcowi i krztuścowi
(kokluszowi) u dzieci w wieku od czterech lat, u młodzieży i dorosłych po pełnym cyklu szczepienia podstawowego.'),
	(2, 'Fluarix', 'Produkt FLUARIX jest stosowany w celach profilaktyki grypy, szczególnie u osób z grup podwyższonego ryzyka powikłań po grypie.
Fluarix jest zalecany do stosowania u osób dorosłych i dzieci w wieku od 6 miesięcy.'),
	(3, 'Engerix B', 'Szczepionka ENGERIX B przeznaczona jest dla osób nieudpornionych w celu uzyskania uodpornienia przeciwko zakażeniom
spowodowanym przez wszystkie znane podtypy wirusa zapaplenia wątroby typu B (HBV). Należy oczekiwać, że szczepienie zapobiega także wirusowemu zapaleniu typu D,
wywołanemu przez HDV, ponieważ wirusowe zapalenie wątroby typu D występuje jednocześnie z wirusowym zapaleniem wątroby typu B (WZW typu B).'),
	(4, 'Pentaxim', 'PENTAXIM pomaga chronić dzieci przed błonicą, tężcem, krztuścem i poliomyelitis
oraz inwazyjnym zakażeniom wywołanym przez Haemophilus influenzae typ b (zapalenie opon
mózgowo-rdzeniowych, posocznica i inne) u dzieci od ukończenia 6. tygodnia życia.
Szczepionka ta nie chroni przed zakażeniami wywołanymi przez inne typy Haemophilus influenzae i
przed zapaleniami opon mózgowo-rdzeniowych wywoływanymi przez inne drobnoustroje.')

set identity_insert Szczepionki off

set identity_insert Odczyny on

insert into Odczyny
	(id, nazwa)
values
	(0,'Zdefiniuj własny'),
	(1, 'Kaszel'),
	(2, 'Gorączka'),
	(3, 'Zaburzenia łaknienia'),
	(4, 'Senność'),
	(5, 'Ból głowy'),
	(6, 'Nudności'),
	(7, 'Wymioty'),
	(8, 'Biegunka'),
	(9, 'Wysypka'),
	(10, 'Ból mięśni'),
	(11, 'Ból stawów'),
	(12, 'Drażliwość'),
	(13, 'Złe samopoczucie'),
	(14, 'Ból w miejscu wstrzyknięcia'),
	(15, 'Rumień w miejscu wsztrzyknięcia'),
	(16, 'Stwardnienie w miejscu wsztrzyknięcia'),
	(17, 'Dreszcze'),
	(18, 'Świąd w miejscu wstrzyknięcie'),
	(19, 'Trudności w oddychaniu'),
	(20, 'Sinienie języka'),
	(21, 'Sinienie warg'),
	(22, 'Obrzęk twarzy'),
	(23, 'Obrzęk gardła'),
	(24, 'Niskie ciśnienie tętnicze'),
	(25, 'Zmęczenie'),
	(26, 'Powiększenie pachowych węzłów chłonnych'),
	(27, 'Bolesność pachowych węzłów chłonnych'),
	(28, 'Ból ciała'),
	(29, 'Obrzęk w miejscu wsztrzyknięcia'),
	(30, 'Obrzęk stawów'),
	(31, 'Potliwość'),
	(32, 'Drażliwość'),
	(33, 'Objawy ze strony żołądka i jelit'),
	(34, 'Uogólnione powiększenie węzłów chłonnych'),
	(35, 'Parestezje'),
	(36, 'Zawroty głowy'),
	(37, 'Ból brzucha'),
	(38, 'Pokrzywka'),
	(39, 'Choroba grypopodobna'),
	(40, 'Bezsenność'),
	(41, 'Opuchnięcie nóg i stóp'),
	(42, 'Drgawki')

set identity_insert Odczyny off

set identity_insert Atrybuty_Odczynow on

insert into Atrybuty_Odczynow
	(id, odczyn_id, typ, nazwa, info)
values
	(0, 2, 0, 'Temperatura', 'Stopnie Celsjusza;37.5;0.1'),
	(1, 1, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(2, 1, 1, 'Typ', 'Mokry;Suchy'),
	(3, 0, 2, 'Pliki', null),
	(4, 0, 3, 'Opis tekstowy', null),
	(5, 3, 1, 'Apetyt', 'Nadmierny;Niewielki;Brak'),
	(6, 5, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(7, 9, 2, 'Zdjęcia', null),
	(8, 9, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(10, 10, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(11, 10, 3, 'Opis tekstowy', null),
	(12, 11, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(13, 11, 3, 'Opis tekstowy', null),
	(14, 14, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(15, 15, 2, 'Zdjęcia rumienia', null),
	(16, 15, 0, 'Średnica rumienia', 'Milimetry;50;1'),
	(17, 16, 2, 'Zdjęcia stwardnienia', null),
	(18, 16, 0, 'Średnica stwardnienia', 'Milimetry;50;1'),
	(19, 29, 2, 'Zdjęcia obrzęku', null),
	(20, 29, 3, 'Opis tekstowy', null),
	(21, 30, 2, 'Zdjęcia obrzęku', null),
	(22, 30, 3, 'Opis tekstowy', null),
	(23, 31, 3, 'Opis tekstowy', null),
	(24, 32, 3, 'Opis tekstowy', null),
	(25, 33, 3, 'Opis tekstowy', null),
	(26, 34, 3, 'Opis tekstowy', null),
	(27, 35, 3, 'Opis tekstowy', null),
	(28, 36, 3, 'Opis tekstowy', null),
	(29, 37, 1, 'Stopień', 'Lekki;Średni;Silny'),
	(30, 37, 1, 'Lokalizacja bólu', 'Dół brzucha;Środek brzucha;Góra brzucha'),
	(31, 38, 2, 'Zdjęcia pokrzywki', null),
	(32, 38, 3, 'Opis tekstowy', null),
	(33, 39, 3, 'Opis tekstowy', null),
	(34, 40, 3, 'Opis tekstowy', null),
	(35, 41, 3, 'Opis tekstowy', null),
	(36, 42, 3, 'Opis tekstowy', null)

set identity_insert Atrybuty_Odczynow off

insert into Szczepionki_Odczyny
	(szczepionka_id, odczyn_id, stopien_ciezkosci, czestosc)
values
	(0, 0, 0, 4),
	(0, 2, 0, 4),
	(0, 3, 0, 4),
	(0, 4, 0, 5),
	(0, 5, 0, 5),
	(0, 6, 0, 4),
	(0, 7, 0, 4),
	(0, 8, 0, 4),
	(0, 9, 0, 4),
	(0, 10, 0, 4),
	(0, 11, 0, 4),
	(0, 12, 0, 5),
	(0, 13, 0, 5),
	(0, 14, 0, 5),
	(0, 15, 0, 5),
	(0, 16, 0, 5),
	(0, 17, 0, 4),
	(0, 18, 0, 3),
	(1, 0, 0, 4),
	(1, 19, 2, 1),
	(1, 20, 2, 1),
	(1, 21, 2, 1),
	(1, 22, 2, 1),
	(1, 23, 2, 1),
	(1, 24, 2, 1),
	(1, 3, 0, 5),
	(1, 5, 0, 5),
	(1, 8, 0, 5),
	(1, 25, 0, 5),
	(1, 28, 0, 5),
	(1, 15, 0 ,5),
	(1, 29, 0 ,5),
	(1, 6, 0, 4),
	(1, 7, 0, 4),
	(1, 9, 0, 4),
	(1, 10, 0, 4),
	(1, 11, 0, 4),
	(1, 30, 0, 4),
	(1, 2, 0, 4),
	(1, 26, 0, 4),
	(1, 27, 0, 4),
	(2, 0, 0, 4),
	(2, 5, 0, 4),
	(2, 31, 0, 4),
	(2, 10, 0, 4),
	(2, 11, 0, 4),
	(2, 2, 0, 5),
	(2, 25, 0, 5),
	(2, 17, 0, 4),
	(2, 13, 0 ,4),
	(2, 14, 0, 5),
	(2, 15, 0, 5),
	(2, 16, 0, 5),
	(2, 29, 0, 5),
	(2, 3, 0, 5),
	(2, 32, 0, 5),
	(2, 4, 0, 5),
	(2, 5, 0, 5),
	(2, 33, 0, 4),
	(2, 10, 0, 5),
	(2, 11, 0, 5),
	(2, 17, 0, 4),
	(3, 0, 0, 4),
	(3, 34, 0, 2),
	(3, 5, 0, 5),
	(3, 4, 0, 4),
	(3, 36, 0, 3),
	(3, 35, 0, 2),
	(3, 6, 0, 4),
	(3, 7, 0, 4),
	(3, 8, 0, 4),
	(3, 37, 0, 4),
	(3, 38, 0, 2),
	(3, 18, 0, 2),
	(3, 9, 0, 2),
	(3, 10, 0, 3),
	(3, 11, 0, 2),
	(3, 3, 0, 4),
	(3, 14, 0, 5),
	(3, 15, 0, 5),
	(3, 25, 0, 5),
	(3, 2, 0, 4),
	(3, 13, 0, 4),
	(3, 29, 0, 4),
	(3, 16, 0, 4),
	(3, 39, 0, 4),
	(3, 1, 0, 4),
	(3, 32, 0, 5),
	(4, 0, 0, 4),
	(4, 30, 2, 1),
	(4, 13, 2, 1),
	(4, 36, 2, 1),
	(4, 3, 0, 5),
	(4, 32, 0, 5),
	(4, 4, 0, 5),
	(4, 7, 0, 5),
	(4, 15, 0, 5),
	(4, 2, 0, 5),
	(4, 29, 0, 5),
	(4, 14, 0, 5),
	(4, 8, 0, 4),
	(4, 16, 0, 4),
	(4, 40, 0, 4),
	(4, 41, 0, 2)