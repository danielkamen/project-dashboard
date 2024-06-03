package com.project.dashboard.user;

import jakarta.persistence.*;
import java.util.List;

/**
 * Represents a user in the system.
 */

// Specifies that the class is an entity and is mapped to a database table
@Entity
public class User {

    // Marks this field as the primary key
    @Id
    // Specifies the primary key generation strategy
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @ElementCollection
    private List<String> projectsWorkingOn;

    // Getters and setters


    // Getters and Setters for projectsWorkingOn
    public List<String> getProjectsWorkingOn() {
        return projectsWorkingOn;
    }

    public void setProjectsWorkingOn(List<String> projectsWorkingOn) {
        this.projectsWorkingOn = projectsWorkingOn;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
