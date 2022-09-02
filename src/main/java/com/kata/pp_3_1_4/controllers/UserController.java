package com.kata.pp_3_1_4.controllers;

import com.kata.pp_3_1_4.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.kata.pp_3_1_4.models.User;


import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public User userInfoPage (Principal principal) {
        return userService.findByUsername(principal.getName());
    }

}
