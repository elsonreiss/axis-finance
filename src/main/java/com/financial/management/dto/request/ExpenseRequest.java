package com.financial.management.dto.request;

import com.financial.management.domain.model.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseRequest {

    private String description;
    private Double amount;
    private Category category;

}
