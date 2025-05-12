package diplom.demo.dto;

import diplom.demo.entity.Product;

import java.util.UUID;

public record ProductDto(
        Long id, String name, String description,
        int priceCents, String imageUrl, Long categoryId
) {
    public static ProductDto from(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPriceCents(),
                p.getImageUrl(),
                p.getCategory().getId()
        );
    }

}
