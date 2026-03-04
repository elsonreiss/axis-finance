package com.financial.management.service;

import com.financial.management.domain.model.Expense;
import com.financial.management.dto.request.ExpenseRequest;
import com.financial.management.dto.response.ExpenseResponse;
import com.financial.management.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository repository;

    public Expense createExpense(ExpenseRequest expenseRequest) {

        Expense expenseEntity = new Expense();

        expenseEntity.setDescription(expenseRequest.getDescription());
        expenseEntity.setAmount(expenseRequest.getAmount());
        expenseEntity.setCategory(expenseRequest.getCategory());

        return repository.save(expenseEntity);

    }

    public List<ExpenseResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ExpenseResponse findById(Long id) {
        Expense expense = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
        return toResponse(expense);
    }

    public Expense updateExpense(Long id, ExpenseRequest request) {
        Expense expense = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada!"));

        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());

        return repository.save(expense);
    }

    public void deleteExpense(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Despesa não encontrada!");
        }
    }

    private ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setDescription(expense.getDescription());
        response.setAmount(expense.getAmount());
        response.setCategory(expense.getCategory());
        return response;
    }

}
