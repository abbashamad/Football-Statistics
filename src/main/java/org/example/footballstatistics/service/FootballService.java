package org.example.footballstatistics.service;

import org.example.footballstatistics.model.FootballApiCache;
import org.example.footballstatistics.repositories.FoorballApiCacheRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.util.Optional;

@Service
public class FootballService {

    private final WebClient webClient;
    private final FoorballApiCacheRepository cacheRepository;
    private final JsonMapper jsonMapper;

    public FootballService(
            @Value("${app.football.url}") String url,
            @Value("${app.football.api-key}") String key,
            FoorballApiCacheRepository cacheRepository,
            JsonMapper jsonMapper) {

        this.cacheRepository = cacheRepository;
        this.jsonMapper = jsonMapper;

        this.webClient = WebClient.builder()
                .baseUrl(url)
                .defaultHeader("x-apisports-key", key)
                .build();

    }

    public String getTeam(int leagueId) {

        //cacheKey identificerer ligaen og sæsonen præcist.
        String cacheKey = "teams:league:" + leagueId + ":season:2023";

        //Optional beskriver et resultat, der måske findes. isPresent() undersøger, om databasen fandt en række.
        Optional<FootballApiCache> savedResponse =
                cacheRepository.findById(cacheKey);

        if (savedResponse.isPresent()) {
            System.out.println("Henter hold fra databasen: " + cacheKey);
            return savedResponse.get().getResponseBody(); //Det første return stopper metoden, så API’et slet ikke bliver kaldt, når data findes.
        }

        System.out.println("Henter hold fra football API: " + cacheKey);

        String response = webClient.get()
                .uri("/teams?league={league}&season=2023", leagueId)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(20));

        if (response == null){
            throw new IllegalStateException("Football API returned no response");
        }

        JsonNode data = jsonMapper.readTree(response);

        if (data == null || !data.path("response").isArray()){
            throw new IllegalStateException("Football API returned unexpected data");
        }

        if (!data.path("errors").isEmpty()){
            return  response;
        }

        FootballApiCache cache = new FootballApiCache(cacheKey, response);
        cacheRepository.save(cache); //save() gemmer det gyldige svar til næste gang.

        return response;

    }

    public String getPlayers(int teamId, int page) {
       String cacheKey = "players:team:" + teamId + ":season:2023:page:" + page;

       Optional<FootballApiCache> savedResponse = cacheRepository.findById(cacheKey);

       if (savedResponse.isPresent()){
           System.out.println("Henter spilere fra databasen: " + cacheKey);
           return savedResponse.get().getResponseBody();
       }

        System.out.println("Henter spilere fra football API: " + cacheKey);

       String response = webClient.get()
               .uri("/players?team={team}&season=2023&page={page}", teamId, page)
               .retrieve()
               .bodyToMono(String.class)
               .block(Duration.ofSeconds(20));

       if (response == null){
           throw new IllegalStateException("Football API returned no response");
       }

       JsonNode data = jsonMapper.readTree(response);

       if (data == null || !data.path("response").isArray()){
           throw new IllegalStateException("Football API returned unexpected data");
       }

       if (!data.path("errors").isEmpty()){
           return response;
       }

       FootballApiCache cache = new FootballApiCache(cacheKey, response);
       cacheRepository.save(cache);

       return response;
    }


}
