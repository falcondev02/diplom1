package diplom.demo.dto;

import java.util.List;

public record OrderRequest(List<OrderItemDto> items, String note) {}

