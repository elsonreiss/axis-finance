package com.financial.management.dto.response;

import com.financial.management.domain.model.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseResponse {

    private String description;
    private Double amount;
    private Category category;

}
