package com.mahesh.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
    private long totalProducts;
    private long totalCategories;
    private long lowStockItems;
    private long outOfStockItems;
    private BigDecimal totalInventoryValue;
    private List<ProductDTO> recentProducts;
}
