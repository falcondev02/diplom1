package diplom.demo.dto;

public record OrderItemDto(
        Long productId,
        int quantity,
        int priceCents,
        String name
) {}
