package com.kata.pp_3_1_4.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import com.kata.pp_3_1_4.models.Role;
import com.kata.pp_3_1_4.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> showAllUsers();

    List<Role> getAllRoles();

    List<Role> findRolesByName(String roleName);

    User showOneUser(int id);

    User findByUsername(String username);

    User  saveUser(User user);

    User getUserById(int id);

    User  updateUser(User user, int id);

    void deleteUser(int id);
}
