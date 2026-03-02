package com.financial.management.dto.response;

import com.financial.management.domain.enums.CategoryType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse {

    private Long id;
    private String name;
    private CategoryType categoryType;

}
