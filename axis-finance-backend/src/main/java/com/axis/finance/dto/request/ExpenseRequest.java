package com.axis.finance.dto.request;

import com.axis.finance.domain.model.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseRequest {

    private String description;
    private Double amount;
    private Category category;

}
