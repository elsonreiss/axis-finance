package com.axis.finance.dto.request;

import com.axis.finance.domain.model.Category;
import lombok.Data;

@Data
public class RevenueRequest {

    private String description;
    private Double amount;
    private Category category;

}
