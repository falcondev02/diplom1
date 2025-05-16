package diplom.demo.dto;

import diplom.demo.entity.Order;
import diplom.demo.entity.OrderStatus;

import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id,
        Long userId,
        OrderStatus status,
        String note,
        List<OrderItemDto> items,
        Instant createdAt,
        Instant updatedAt,
        Long totalSumCents,
        String address   // ← вот здесь раньше не хватало запятой перед этим полем
) {
    public static OrderDto from(Order o) {
        List<OrderItemDto> itemDtos = o.getItems().stream()
                .map(item -> new OrderItemDto(
                        item.getProduct().getId(),
                        item.getQuantity(),
                        item.getPriceCents(),
                        item.getProduct().getName()
                )).toList();

        long total = o.getItems().stream()
                .mapToLong(item -> (long) item.getPriceCents() * item.getQuantity())
                .sum();

        return new OrderDto(
                o.getId(),
                o.getUser().getId(),
                o.getStatus(),
                o.getNote(),
                itemDtos,
                o.getCreatedAt(),
                o.getUpdatedAt(),
                total,
                o.getAddress()   // ← это уже норм
        );
    }
}
