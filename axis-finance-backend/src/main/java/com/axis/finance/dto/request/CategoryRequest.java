package com.axis.finance.dto.request;

import com.axis.finance.domain.enums.CategoryType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private String name;
    private CategoryType categoryType;

}
