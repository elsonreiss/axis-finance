package com.financial.management.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum CategoryType {

    RECEITA(1),
    DESPESA(2);

    private final Integer categoryTypeCode;

    CategoryType(Integer code) {
        this.categoryTypeCode = code;
    }

    public int getCategoryTypeCode() {
        return categoryTypeCode;
    }

    @JsonCreator
    public static CategoryType fromValue(Integer code) {
        for (CategoryType value : CategoryType.values()) {
            if (value.categoryTypeCode.equals(code)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid category type code: " + code);
    }

}
