package com.axis.finance.dto.response;

import com.axis.finance.domain.enums.CategoryType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse {

    private Long id;
    private String name;
    private CategoryType categoryType;

}
