package com.project.dashboard.partner;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String logoUrl;
    private String description;
    private String repoPath;
    private boolean active;
    private String lastUpdated;
    private String updatedBy;

    // Specifies a collection of basic or embeddable types, fetched eagerly for immediate availability
    @ElementCollection(fetch = FetchType.EAGER)

    // Maps the collection to a separate table, linking via the specified foreign key
    @CollectionTable(name = "partner_users_working_on_project", joinColumns = @JoinColumn(name = "partner_id"))
    @Column(name = "users_working_on_project")
    private Set<String> usersWorkingOnProject = new HashSet<>();

    @Transient
    private String formattedUsersWorkingOnProject;

    // Getters and setters

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

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRepoPath() {
        return repoPath;
    }

    public void setRepoPath(String repoPath) {
        this.repoPath = repoPath;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Set<String> getUsersWorkingOnProject() {
        return usersWorkingOnProject;
    }

    public void setUsersWorkingOnProject(Set<String> usersWorkingOnProject) {
        this.usersWorkingOnProject = usersWorkingOnProject;
    }

    public String getFormattedUsersWorkingOnProject() {
        return formattedUsersWorkingOnProject;
    }

    public void setFormattedUsersWorkingOnProject(String formattedUsersWorkingOnProject) {
        this.formattedUsersWorkingOnProject = formattedUsersWorkingOnProject;
    }
}
