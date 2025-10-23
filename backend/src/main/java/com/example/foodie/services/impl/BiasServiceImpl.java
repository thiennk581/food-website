package com.example.foodie.services.impl;

import com.example.foodie.dtos.BiasDTO;
import com.example.foodie.models.Bias;
import com.example.foodie.models.Tag;
import com.example.foodie.models.User;
import com.example.foodie.repos.BiasRepository;
import com.example.foodie.repos.TagRepository;
import com.example.foodie.repos.UserRepository;
import com.example.foodie.services.interfaces.BiasService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class BiasServiceImpl implements BiasService {
    private BiasRepository biasRepository;
    private UserRepository userRepository;
    private TagRepository tagRepository;

    @Override
    public Bias addBias(BiasDTO biasDTO){
        boolean isBiasExist = biasRepository.existsByUser_IdAndTag_Id(biasDTO.getUserId(), biasDTO.getTagId());

        if(isBiasExist){
            throw new RuntimeException("Bias đã tồn tại");
        }

        User user = userRepository.findById(biasDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Tag tag = tagRepository.findById(biasDTO.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag không tồn tại"));

        Bias newBias = Bias.builder()
                .user(user)
                .tag(tag)
                .score(biasDTO.getScore())
                .build();

        return biasRepository.save(newBias);
    }

    @Override
    public Bias updateBias(BiasDTO biasDTO){

        User user = userRepository.findById(biasDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Tag tag = tagRepository.findById(biasDTO.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag không tồn tại"));

        Optional<Bias> biasExisting = biasRepository.findByUser_idAndTag_Id(
                biasDTO.getUserId(),
                biasDTO.getTagId()
        );

        if(biasExisting.isPresent()){
            Bias updatedBias = biasExisting.get();
            updatedBias.setScore(biasDTO.getScore());
            return biasRepository.save(updatedBias);
        } else{
            Bias newBias = Bias.builder()
                    .user(user)
                    .tag(tag)
                    .score(biasDTO.getScore())
                    .build();

            return biasRepository.save(newBias);
        }
    }
}
