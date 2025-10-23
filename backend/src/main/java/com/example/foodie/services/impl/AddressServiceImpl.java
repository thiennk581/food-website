package com.example.foodie.services.impl;

import com.example.foodie.models.Address;
import com.example.foodie.models.User;
import com.example.foodie.repos.AddressRepository;
import com.example.foodie.repos.UserRepository;
import com.example.foodie.services.interfaces.AddressService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl extends BaseServiceImpl<Address> implements AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        super(addressRepository, Address.class);
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Address addAddressByUserId(Integer userId, Address address){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại user"));

        Optional<Address> addressExisting = addressRepository.findByUser_Id(userId);

        boolean userHasSameAddress = addressExisting.isPresent()
                && addressExisting.get().getAddress().equals(address.getAddress());

        if (userHasSameAddress){
            throw new RuntimeException("User đã có địa chỉ này rồi");
        }

        Address newAddress = Address.builder()
                .address(address.getAddress())
                .user(user)
                .isDefault(address.getIsDefault())
                .build();

        return addressRepository.save(newAddress);
    }

    @Override
    public List<Address> getAllAddressesByUserId(Integer userId){
        List<Address> allAddresses = addressRepository.findAllByUser_Id(userId);

        if (allAddresses.isEmpty()){
            throw new RuntimeException("User không có địa chỉ nào");
        }
        return allAddresses;
    }
}
