package com.project.dashboard.user.controller;

import com.project.dashboard.user.User;
import com.project.dashboard.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling user-related operations.
 */
// Indicates that this class handles HTTP requests and responses
@RestController
// Indicates that this class handles HTTP requests and responses
@RequestMapping("/api/users")
public class UserController {

    // Automatically injects the UserService bean into this controller
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    private static final String EDIT_PASSWORD = "password123";

    /**
     * Creates a new user account.
     * @param user the user details from the request body
     * @return the created user
     */
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user, @RequestHeader("edit-password") String editPassword) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        } else if (!EDIT_PASSWORD.equals(editPassword)) {
            return ResponseEntity.status(403).body("Invalid edit password");
        }
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    /**
     * Authenticates a user and returns a token.
     * @param user the login details from the request body
     * @return the authentication token
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        boolean isAuthenticated = userService.authenticateUser(user.getEmail(), user.getPassword());
        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(403).body("Invalid email or password");
        }
    }
}