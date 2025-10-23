package com.example.foodie.services.interfaces;

import com.example.foodie.dtos.BiasDTO;
import com.example.foodie.models.Bias;

public interface BiasService {
    Bias addBias(BiasDTO biasDTO);
    Bias updateBias(BiasDTO biasDTO);
}
