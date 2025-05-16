package diplom.demo.dto;

public record OrderItemRequestDto(
        Long productId,
        int quantity
) {}
