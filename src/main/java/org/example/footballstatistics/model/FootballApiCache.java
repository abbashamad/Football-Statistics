package org.example.footballstatistics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class FootballApiCache {

    @Id
    private String cacheKey;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String responseBody;

    public FootballApiCache() {
    }

    public FootballApiCache(String cacheKey, String responseBody) {
        this.cacheKey = cacheKey;
        this.responseBody = responseBody;
    }
}
