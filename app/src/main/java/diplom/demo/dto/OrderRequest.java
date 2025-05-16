package diplom.demo.dto;

import java.util.List;

public record OrderRequest(
        List<OrderItemRequestDto> items,
        String address,
        String note
) {}
