package com.project.dashboard.partner.controller;

import com.project.dashboard.partner.Partner;
import com.project.dashboard.partner.service.PartnerService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    @Autowired
    private PartnerService partnerService;

    @GetMapping
    public ResponseEntity<List<Partner>> getAllPartners() {
        List<Partner> partners = partnerService.getAllPartners();
        return ResponseEntity.ok(partners);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Partner> getPartnerById(@PathVariable Long id) {
        Partner partner = partnerService.getPartnerById(id);
        return ResponseEntity.ok(partner);
    }

    @PostMapping
    public Partner createPartner(@RequestBody Partner partner, @RequestHeader("user-email") String userEmail) {
        if (!partner.getRepoPath().startsWith("https://github.com/")) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }
        return partnerService.addPartner(partner, userEmail);
    }

    @PostMapping("/addUserToProject")
    public ResponseEntity<Partner> addUserToProject(@RequestParam Long projectId, @RequestParam String email) {
        Partner updatedPartner = partnerService.addUserToProject(projectId, email);
        return ResponseEntity.ok(updatedPartner);
    }

    @PostMapping("/removeUserFromProject")
    public ResponseEntity<Partner> removeUserFromProject(@RequestParam Long projectId, @RequestParam String email) {
        Partner updatedPartner = partnerService.removeUserFromProject(projectId, email);
        return ResponseEntity.ok(updatedPartner);
    }

    @PutMapping("/{id}")
    public Partner updatePartner(@PathVariable Long id, @RequestBody Partner partnerDetails, @RequestHeader("user-email") String userEmail) {
        return partnerService.updatePartner(id, partnerDetails, userEmail);
    }

    @DeleteMapping("/{id}")
    public void deletePartner(@PathVariable Long id) {
        partnerService.deletePartner(id);
    }
}