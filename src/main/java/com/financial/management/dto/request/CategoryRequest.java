package com.financial.management.dto.request;

import com.financial.management.domain.enums.CategoryType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private String name;
    private CategoryType categoryType;

}
