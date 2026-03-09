package com.axis.finance.service;

import com.axis.finance.domain.model.Revenue;
import com.axis.finance.dto.request.RevenueRequest;
import com.axis.finance.dto.response.RevenueResponse;
import com.axis.finance.repository.RevenueRepository;
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
        response.setId(revenue.getRevenueId());
        response.setDescription(revenue.getDescription());
        response.setAmount(revenue.getAmount());
        response.setCategory(revenue.getCategory());
        return response;
    }

}
