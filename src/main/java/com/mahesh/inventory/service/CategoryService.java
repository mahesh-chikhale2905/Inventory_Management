package com.mahesh.inventory.service;

import com.mahesh.inventory.dto.CategoryDTO;
import com.mahesh.inventory.model.Category;
import com.mahesh.inventory.repository.CategoryRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        // Save first to get an ID assigned
        categoryRepository.save(category);
        categoryRepository.flush();

        // Immediately re-index everything to close any gaps and fix the current ID
        reindexCategories();

        // Re-fetch the newly created category by name because its ID likely changed
        // during re-indexing
        Category savedCategory = categoryRepository.findByName(categoryDTO.getName())
                .orElseThrow(() -> new RuntimeException("Error retrieving category after re-indexing"));

        return convertToDTO(savedCategory);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Delete the category (Cascades to products because of CascadeType.ALL)
        categoryRepository.delete(category);
        categoryRepository.flush();

        // Re-index remaining categories to be sequential (1, 2, 3...)
        reindexCategories();
    }

    private void reindexCategories() {
        // Ensure all pending changes are written to the DB before native updates
        entityManager.flush();

        // Disable foreign key checks to allow ID updates
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();

        try {
            // Get all categories ordered by current ID
            List<Category> categories = categoryRepository.findAll(Sort.by("id"));
            long newId = 1;

            for (Category cat : categories) {
                long oldId = cat.getId();
                if (oldId != newId) {
                    System.out.println("Re-indexing Category: " + cat.getName() + " [" + oldId + " -> " + newId + "]");

                    // Update products category_id to the new ID
                    entityManager.createNativeQuery("UPDATE products SET category_id = ? WHERE category_id = ?")
                            .setParameter(1, newId)
                            .setParameter(2, oldId)
                            .executeUpdate();

                    // Update category id to the new ID
                    entityManager.createNativeQuery("UPDATE categories SET id = ? WHERE id = ?")
                            .setParameter(1, newId)
                            .setParameter(2, oldId)
                            .executeUpdate();
                }
                newId++;
            }

            // Reset Auto-increment so the next added category gets the next logical ID
            entityManager.createNativeQuery("ALTER TABLE categories AUTO_INCREMENT = 1").executeUpdate();

        } catch (Exception e) {
            System.err.println("Critical error during category re-indexing: " + e.getMessage());
            throw e;
        } finally {
            // ALWAYS re-enable foreign key checks
            entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
            // Clear the persistence context so JPA/Hibernate doesn't use stale ID mappings
            entityManager.clear();
        }
    }

    public CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
