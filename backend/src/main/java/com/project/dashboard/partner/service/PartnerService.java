package com.project.dashboard.partner.service;

import com.project.dashboard.partner.Partner;
import com.project.dashboard.partner.PartnerRepository;
import com.project.dashboard.partner.github.GitHubClient;
import com.project.dashboard.user.User;
import com.project.dashboard.user.UserRepository;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private GitHubClient gitHubClient;

    @Autowired
    private UserRepository userRepository;

    private List<Partner> cachedPartners;

    public List<Partner> getAllPartners() {
        if (cachedPartners == null) {
            updatePartnerData();
        }
        cachedPartners.forEach(this::populateFormattedUsers);
        return cachedPartners;
    }

    public Partner getPartnerById(Long id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        populateFormattedUsers(partner);
        return partner;
    }

    public Partner addPartner(Partner partner, String userEmail) {
        try {
            partner.setLastUpdated(gitHubClient.getLastCommitDate(partner.getRepoPath()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }
        partner.setUpdatedBy(userEmail);
        Partner savedPartner = partnerRepository.save(partner);
        updatePartnerData();
        return savedPartner;
    }

    public Partner updatePartner(Long id, Partner partnerDetails, String userEmail) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        try {
            partner.setLastUpdated(gitHubClient.getLastCommitDate(partnerDetails.getRepoPath()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }
        partner.setName(partnerDetails.getName());
        partner.setLogoUrl(partnerDetails.getLogoUrl());
        partner.setDescription(partnerDetails.getDescription());
        partner.setRepoPath(partnerDetails.getRepoPath());
        partner.setActive(partnerDetails.isActive());
        partner.setUpdatedBy(userEmail);

        Partner updatedPartner = partnerRepository.save(partner);
        updatePartnerData();
        return updatedPartner;
    }

    public void deletePartner(Long id) {
        partnerRepository.deleteById(id);
        updatePartnerData();
    }

    public Partner addUserToProject(Long projectId, String email) {
        Partner partner = partnerRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        User user = userRepository.findByEmail(email);

        if (user != null) {
            if (!partner.getUsersWorkingOnProject().contains(email)) {
                partner.getUsersWorkingOnProject().add(email);
                partnerRepository.save(partner);
            }

            if (!user.getProjectsWorkingOn().contains(partner.getName())) {
                user.getProjectsWorkingOn().add(partner.getName());
                userRepository.save(user);
            }
        }
        updatePartnerData();
        return partner;
    }

    public Partner removeUserFromProject(Long projectId, String email) {
        Partner partner = partnerRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        User user = userRepository.findByEmail(email);

        if (user != null) {
            if (partner.getUsersWorkingOnProject().contains(email)) {
                partner.getUsersWorkingOnProject().remove(email);
                partnerRepository.save(partner);
            }

            if (user.getProjectsWorkingOn().contains(partner.getName())) {
                user.getProjectsWorkingOn().remove(partner.getName());
                userRepository.save(user);
            }
        }
        updatePartnerData();
        return partner;
    }

    private void updatePartnerData() {
        cachedPartners = partnerRepository.findAll();
        cachedPartners.forEach(this::populateFormattedUsers);
    }

    private void populateFormattedUsers(Partner partner) {
        String formattedUsers = partner.getUsersWorkingOnProject().stream()
                .map(email -> {
                    User user = userRepository.findByEmail(email);
                    return email + " (" + (user != null ? user.getName() : "Unknown User") + ")";
                })
                .collect(Collectors.joining(", "));
        partner.setFormattedUsersWorkingOnProject(formattedUsers);
    }
}
