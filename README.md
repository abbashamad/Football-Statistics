# Football Statistics

Et skoleprojekt bygget med Java, Spring Boot, MySQL og JavaScript.

Man kan vælge en liga, se hold og spillere fra sæson 2023 og stille OpenAI spørgsmål om en valgt spiller.

## Funktioner

- Vælg mellem seks ligaer.
- Se holdene i den valgte liga.
- Hent spillere fra et hold.
- Hent flere spillere med “Load more players”.
- Stil spørgsmål om en valgt spiller.
- Genbrug football-data gemt i MySQL for at spare API-kald.

## Teknologier

- Java 25 og Spring Boot
- WebClient til eksterne API-kald
- Spring Data JPA og MySQL
- HTML, CSS og JavaScript
- API-Football og OpenAI Chat Completions

## Sådan hænger projektet sammen

```text
Frontend
    → Controller
    → Service
    → Database eller eksternt API
```

Controlleren modtager requests fra JavaScript.

Servicen håndterer API-kald og opslag i databasen.

Entity-klassen beskriver de gemte data, og repository bruges til at finde og gemme dem.

JavaScript viser resultaterne på siden.

## Gemte football-data

FootballService undersøger først, om et svar allerede findes i databasen.

Hvis det findes, returneres det gemte JSON uden et nyt football-API-kald.

Hvis det mangler, hentes svaret fra API’et. Gyldige svar gemmes i databasen, mens API-fejl ikke gemmes.

Eksempler på databasenøgler:

```text
teams:league:39:season:2023
players:team:400:season:2023:page:1
```

Spillersider gemmes separat. Kun efterspurgte data bliver hentet og gemt, og de bevares efter genstart.

OpenAI-spørgsmål sendes til OpenAI ved hvert klik på Ask og gemmes ikke i denne tabel.

## Krav

- Java 25
- En lokal MySQL-server på port 3306
- En API-nøgle fra API-Football/API-Sports
- En OpenAI API-nøgle med adgang til den konfigurerede model og tilstrækkelig saldo

## Opsætning

Opret databasen i MySQL:

```sql
CREATE DATABASE IF NOT EXISTS football_statistics;
```

Tilføj følgende miljøvariabler i IntelliJ under:

Run → Edit Configurations → Environment variables

| Variabel | Indhold |
|---|---|
| FOOTBALL_API_KEY | Din API-Football-nøgle |
| OPEN_API_KEY | Din OpenAI-nøgle |
| DB_USERNAME | Dit MySQL-brugernavn |
| DB_PASSWORD | Din MySQL-adgangskode |

Nøgler og adgangskoder skal ikke skrives direkte i kildekoden.

Start FootballStatisticsApplication, og åbn:

http://localhost:8080

JPA opretter tabellen football_api_cache ud fra entity-klassen.

Databasens indhold følger ikke med, når repository klones.

## Begrænsninger

- Football-data gælder sæson 2023.
- Tilgængelige data og spillersider afhænger af API-abonnementet.
- Gemte data opdateres ikke automatisk.
- Første hentning af en ny holdliste eller spillerside bruger stadig et API-kald.
- AI-svar er ikke baseret på live-statistik og kan indeholde fejl.
- Projektet er beregnet til lokal brug og har ingen loginfunktion.

## AI-assistance

Projektet er udviklet med hjælp fra ChatGPT til kodeeksempler, forklaringer, fejlfinding og CSS-design.

Idéen til at genbruge data gennem en database er inspireret af undervisningens RegionKommune-projekt.
