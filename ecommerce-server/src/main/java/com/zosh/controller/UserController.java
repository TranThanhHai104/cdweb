package com.zosh.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.UserException;
import com.zosh.modal.Address;
import com.zosh.modal.User;
import com.zosh.repository.AddressRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public UserController(UserService userService, AddressRepository addressRepository,
                          UserRepository userRepository) {
        this.userService = userService;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody User updatedUser) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
        if (updatedUser.getLastName() != null)  user.setLastName(updatedUser.getLastName());
        if (updatedUser.getMobile() != null)    user.setMobile(updatedUser.getMobile());
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<?> deleteAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Optional<Address> opt = addressRepository.findById(addressId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Address address = opt.get();
        if (address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        address.setUser(null);
        addressRepository.save(address);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId,
            @RequestBody Address updatedAddress) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Optional<Address> opt = addressRepository.findById(addressId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Address address = opt.get();
        if (address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        address.setFirstName(updatedAddress.getFirstName());
        address.setLastName(updatedAddress.getLastName());
        address.setStreetAddress(updatedAddress.getStreetAddress());
        address.setCity(updatedAddress.getCity());
        address.setState(updatedAddress.getState());
        address.setZipCode(updatedAddress.getZipCode());
        address.setMobile(updatedAddress.getMobile());
        return ResponseEntity.ok(addressRepository.save(address));
    }
}
