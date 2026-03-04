package com.financial.management.repository;

import com.financial.management.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNormalizedName(String normalizedName);

}
