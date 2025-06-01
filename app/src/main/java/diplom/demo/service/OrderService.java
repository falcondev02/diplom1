package diplom.demo.service;

import diplom.demo.dto.OrderDto;
import diplom.demo.dto.OrderRequest;
import diplom.demo.entity.*;
import diplom.demo.repository.OrderRepository;
import diplom.demo.repository.ProductRepository;
import diplom.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository  orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository    userRepo;

    private User current() {
        String username = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepo.findByUsername(username);
    }

    /* ---------- USER ---------- */

    public OrderDto create(OrderRequest req) {
        if (req.items() == null || req.items().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Order must contain at least one item");

        User user = current();
        Order order = Order.builder()
                .user(user)
                .note(req.note())
                .address(req.address())
                .status(OrderStatus.NEW)
                .build();

        List<OrderItem> items = req.items().stream().map(i -> {
            var product = productRepo.findById(i.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Product not found: " + i.productId()));
            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(i.quantity())
                    .priceCents(product.getPriceCents())
                    .build();
        }).toList();

        order.setItems(items);
        return OrderDto.from(orderRepo.save(order));
    }

    public List<OrderDto> history() {
        return orderRepo.findByUser(current())
                .stream().map(OrderDto::from).toList();
    }

    public OrderDto cancelOwn(Long id) {
        Order o = orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!o.getUser().equals(current()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your order");

        if (o.getStatus() != OrderStatus.NEW)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only NEW orders can be cancelled");

        o.setStatus(OrderStatus.CANCELLED);
        return OrderDto.from(o);
    }

    /* ---------- ADMIN ---------- */

    public Page<OrderDto> findAll(Pageable pageable) {
        return orderRepo.findAll(pageable).map(OrderDto::from);
    }

    public OrderDto adminSetStatus(Long id, OrderStatus status) {
        Order o = orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        o.setStatus(status);            // админ может ставить любой статус
        return OrderDto.from(o);
    }
}
