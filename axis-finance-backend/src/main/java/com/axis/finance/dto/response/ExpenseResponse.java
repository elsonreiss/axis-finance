package com.axis.finance.dto.response;

import com.axis.finance.domain.model.Category;
import lombok.Data;

@Data
public class ExpenseResponse {

    private Long id;
    private String description;
    private Double amount;
    private Category category;

}
