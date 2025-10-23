package com.example.foodie.services.interfaces;

import com.example.foodie.models.Address;

import java.util.List;

public interface AddressService extends BaseService<Address>{
    public Address addAddressByUserId(Integer userId, Address address);
    public List<Address> getAllAddressesByUserId(Integer userId);
}
