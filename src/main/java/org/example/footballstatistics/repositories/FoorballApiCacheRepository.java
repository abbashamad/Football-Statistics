package org.example.footballstatistics.repositories;

import org.example.footballstatistics.model.FootballApiCache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoorballApiCacheRepository extends JpaRepository<FootballApiCache, String> {
}
