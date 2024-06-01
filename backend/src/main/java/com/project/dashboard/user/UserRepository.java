package com.project.dashboard.user;

import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Repository for performing CRUD operations on User entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Finds a user by their username.
     * @param email
     * @return the user being found
     */
    User findByEmail(String email);

    /**
     * Saves a user to the database.
     * @param user
     * @return the user being saved
     */
    User save(User user);


    /**
     * Is an email is already registered?
     * @param email
     * @return yes/no an email is already registered.
     */
    boolean existsByEmail(String email);
}