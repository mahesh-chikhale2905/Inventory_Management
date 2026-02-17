package com.mahesh.inventory.service;

import com.mahesh.inventory.dto.DashboardDTO;
import com.mahesh.inventory.dto.ProductDTO;
import com.mahesh.inventory.model.Product;
import com.mahesh.inventory.repository.CategoryRepository;
import com.mahesh.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;

        @Transactional(readOnly = true)
        public DashboardDTO getDashboardStats() {
                List<Product> allProducts = productRepository.findAll();

                long totalProducts = allProducts.size();
                long totalCategories = categoryRepository.count();

                long lowStockItems = allProducts.stream()
                                .filter(p -> p.getStockQuantity() > 0 && p.getStockQuantity() < 10)
                                .count();

                long outOfStockItems = allProducts.stream()
                                .filter(p -> p.getStockQuantity() == 0)
                                .count();

                BigDecimal totalValue = allProducts.stream()
                                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getStockQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Get 5 most recent products
                List<ProductDTO> recentProducts = productRepository.findAll(
                                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id"))).getContent().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());

                return DashboardDTO.builder()
                                .totalProducts(totalProducts)
                                .totalCategories(totalCategories)
                                .lowStockItems(lowStockItems)
                                .outOfStockItems(outOfStockItems)
                                .totalInventoryValue(totalValue)
                                .recentProducts(recentProducts)
                                .build();
        }

        private ProductDTO convertToDTO(Product product) {
                ProductDTO dto = new ProductDTO();
                dto.setId(product.getId());
                dto.setName(product.getName());
                dto.setDescription(product.getDescription());
                dto.setPrice(product.getPrice());
                dto.setStockQuantity(product.getStockQuantity());
                dto.setImageUrl(product.getImageUrl());

                if (product.getCategory() != null) {
                        dto.setCategoryId(product.getCategory().getId());
                        dto.setCategoryName(product.getCategory().getName());
                }

                dto.setCreatedAt(product.getCreatedAt());
                dto.setUpdatedAt(product.getUpdatedAt());
                return dto;
        }
}
