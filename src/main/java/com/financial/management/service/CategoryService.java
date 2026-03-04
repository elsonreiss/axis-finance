package com.financial.management.service;

import com.financial.management.domain.model.Category;
import com.financial.management.dto.request.CategoryRequest;
import com.financial.management.dto.response.CategoryResponse;
import com.financial.management.exception.DuplicateResourceException;
import com.financial.management.repository.CategoryRepository;
import com.financial.management.utilities.TextUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public CategoryResponse create(CategoryRequest categoryRequest) {

        Category categoryEntity = new Category();

        String normalizedName = TextUtils.normalize(categoryRequest.getName());

        if (repository.existsByNormalizedName(normalizedName)) {
            throw new DuplicateResourceException("Nome já existe.");
        }

        categoryEntity.setName(categoryRequest.getName().trim());
        categoryEntity.setNormalizedName(normalizedName);
        categoryEntity.setCategoryType(categoryRequest.getCategoryType());

        repository.save(categoryEntity);

        return toResponse(categoryEntity);
    }

    public List<CategoryResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        String normalizedName = TextUtils.normalize(request.getName());

        if (request.getName().isEmpty() || request.getName().equals(category.getName())){
            category.setCategoryType(request.getCategoryType());
        } else {

            if (repository.existsByNormalizedName(normalizedName)) {
                throw new DuplicateResourceException("Nome já existe.");
            }

            category.setName(request.getName());
            category.setNormalizedName(normalizedName);
            category.setCategoryType(request.getCategoryType());
        }

        repository.save(category);

        return toResponse(category);
    }

    public void delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Categoria não encontrada!");
        }
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getCategoryId());
        response.setName(category.getName());
        response.setCategoryType(category.getCategoryType());
        return response;
    }

}
