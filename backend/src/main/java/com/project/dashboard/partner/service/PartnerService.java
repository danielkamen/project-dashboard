package com.project.dashboard.partner.service;

import com.project.dashboard.partner.Partner;
import com.project.dashboard.partner.PartnerRepository;
import com.project.dashboard.partner.github.GitHubClient;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private GitHubClient gitHubClient;

    private List<Partner> cachedPartners;

    public List<Partner> getAllPartners() {
        if (cachedPartners == null) {
            updatePartnerData();
        }
        return cachedPartners;
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

    private void updatePartnerData() {
        cachedPartners = partnerRepository.findAll();
    }
}