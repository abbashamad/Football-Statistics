package org.example.footballstatistics.api;

import org.example.footballstatistics.service.FootballService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/football")
public class FootballController {

    private final FootballService footballService;

    FootballController(FootballService footballService) {
        this.footballService = footballService;
    }

    @GetMapping
    public String getFootball(@RequestParam int league) {
        return footballService.getTeam(league);
    }

    @GetMapping("/players")
    public String getPlayers(@RequestParam int team, @RequestParam(defaultValue = "1") int page) {
        return footballService.getPlayers(team, page);
    }


}
