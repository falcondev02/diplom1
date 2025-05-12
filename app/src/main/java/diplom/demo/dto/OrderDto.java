package diplom.demo.dto;

import diplom.demo.entity.Order;
import diplom.demo.entity.OrderStatus;

import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id, OrderStatus status, String note,
        List<OrderItemDto> items, Instant createdAt
) {
    public static OrderDto from(Order o) {
        List<OrderItemDto> itemDtos = o.getItems().stream()
                .map(item -> new OrderItemDto(item.getProduct().getId(), item.getQuantity()))
                .toList();

        return new OrderDto(
                o.getId(),
                o.getStatus(),
                o.getNote(),
                itemDtos,
                o.getCreatedAt()
        );
    }}
