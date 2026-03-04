package com.financial.management.controller;

import com.financial.management.domain.model.Revenue;
import com.financial.management.dto.request.RevenueRequest;
import com.financial.management.dto.response.RevenueResponse;
import com.financial.management.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/revenue")
@CrossOrigin
public class RevenueController {

    @Autowired
    private RevenueService service;

    @PostMapping
    public ResponseEntity<Revenue> createRevenue(@RequestBody RevenueRequest revenueRequest) {
        Revenue revenue = service.createRevenue(revenueRequest);
        return ResponseEntity.status(201).body(revenue);
    }

    @GetMapping
    public ResponseEntity<List<RevenueResponse>> findAll() {
        List<RevenueResponse> revenues = service.findAll();
        return ResponseEntity.ok(revenues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RevenueResponse> findById(@PathVariable Long id) {
        RevenueResponse revenue = service.findById(id);
        return ResponseEntity.ok(revenue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Revenue> updateRevenue(@PathVariable Long id, @RequestBody RevenueRequest request) {
        Revenue updatedRevenue = service.updateRevenue(id, request);
        return ResponseEntity.ok(updatedRevenue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRevenue(@PathVariable Long id) {
        service.deleteRevenue(id);
        return ResponseEntity.ok("Receita excluída com sucesso!");
    }

}
