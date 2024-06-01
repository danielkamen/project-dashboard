package com.project.dashboard.partner.controller;

import com.project.dashboard.partner.Partner;
import com.project.dashboard.partner.service.PartnerService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    @Autowired
    private PartnerService partnerService;

    @GetMapping
    public List<Partner> getAllPartners() {
        return partnerService.getAllPartners();
    }

    @PostMapping
    public Partner createPartner(@RequestBody Partner partner, @RequestHeader("user-email") String userEmail) {
        if (!partner.getRepoPath().startsWith("https://github.com/")) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }
        return partnerService.addPartner(partner, userEmail);
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
