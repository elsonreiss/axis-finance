package com.financial.management.service;

import com.financial.management.domain.model.Revenue;
import com.financial.management.dto.request.RevenueRequest;
import com.financial.management.dto.response.RevenueResponse;
import com.financial.management.repository.RevenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RevenueService {

    @Autowired
    private RevenueRepository repository;

    public Revenue createRevenue(RevenueRequest request) {
        Revenue revenue = new Revenue();
        revenue.setDescription(request.getDescription());
        revenue.setAmount(request.getAmount());
        revenue.setCategory(request.getCategory());
        return repository.save(revenue);
    }

    public List<RevenueResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RevenueResponse findById(Long id) {
        Revenue revenue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada!"));
        return toResponse(revenue);
    }

    public Revenue updateRevenue(Long id, RevenueRequest request) {
        Revenue revenue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        revenue.setDescription(request.getDescription());
        revenue.setAmount(request.getAmount());
        revenue.setCategory(request.getCategory());

        return repository.save(revenue);
    }

    public void deleteRevenue(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Receita não encontrada!");
        }
    }

    private RevenueResponse toResponse(Revenue revenue) {
        RevenueResponse response = new RevenueResponse();
        response.setDescription(revenue.getDescription());
        response.setAmount(revenue.getAmount());
        response.setCategory(revenue.getCategory());
        return response;
    }

}
