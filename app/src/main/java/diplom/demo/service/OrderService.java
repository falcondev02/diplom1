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

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    /* ===== helpers ===== */

    private User current() {
        String username = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepo.findByUsername(username);
    }

    /* ===== public API ===== */

    /** USER делает заказ */
    public OrderDto create(OrderRequest req) {

        if (req.items() == null || req.items().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Order must contain at least one item");

        User user = current();

        Order order = Order.builder()
                .user(user)
                .note(req.note())
                .status(OrderStatus.NEW)
                .build();

        List<OrderItem> items = req.items().stream().map(i -> {
            var product = productRepo.findById(i.productId())   // i.productId() теперь Long
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

    /** USER – история */
    public List<OrderDto> history() {
        return orderRepo.findByUser(current())
                .stream().map(OrderDto::from).toList();
    }

    /** ADMIN – все заказы */
/*    public List<OrderDto> findAll() {
        if (current().getRole() != Role.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
        return orderRepo.findAll().stream().map(OrderDto::from).toList();
    }*/public Page<OrderDto> findAll(Pageable pageable) {

        return orderRepo.findAll(pageable)
                .map(OrderDto::from);
    }

    /** ADMIN – сменить статус */
    public OrderDto setStatus(Long id, OrderStatus status) {
        if (current().getRole() != Role.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");

        Order o = orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Order not found"));
        o.setStatus(status);
        return OrderDto.from(o);        // dirty-check
    }
}

