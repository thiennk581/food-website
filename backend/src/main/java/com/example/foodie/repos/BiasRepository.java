package com.example.foodie.repos;

import com.example.foodie.models.Bias;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BiasRepository extends JpaRepository<Bias, Integer> {
    boolean existsByUser_IdAndTag_Id(int userId, int tagId);
    Optional<Bias> findByUser_idAndTag_Id(int userId, int tagId);
}
