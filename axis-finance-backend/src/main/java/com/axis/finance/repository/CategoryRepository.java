package com.axis.finance.repository;

import com.axis.finance.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNormalizedName(String normalizedName);

}
