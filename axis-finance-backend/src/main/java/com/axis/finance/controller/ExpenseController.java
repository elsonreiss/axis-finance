package com.axis.finance.controller;

import com.axis.finance.domain.model.Expense;
import com.axis.finance.dto.request.ExpenseRequest;
import com.axis.finance.dto.response.ExpenseResponse;
import com.axis.finance.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
@CrossOrigin
public class ExpenseController {

    @Autowired
    private ExpenseService service;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody ExpenseRequest expenseRequest){
        Expense expense = service.createExpense(expenseRequest);
        return ResponseEntity.status(201).body(expense);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> findAll(){
        List<ExpenseResponse> expenses = service.findAll();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> findById(@PathVariable Long id) {
        ExpenseResponse expense = service.findById(id);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest request) {
        Expense updatedExpense = service.updateExpense(id, request);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
        return ResponseEntity.ok("Despesa excluída com sucesso!");
    }

}
