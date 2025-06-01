package diplom.demo.controller;

import diplom.demo.dto.OrderDto;
import diplom.demo.dto.OrderRequest;
import diplom.demo.entity.OrderStatus;
import diplom.demo.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class OrderController {

    private final OrderService service;

    /* ---------- USER ---------- */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@RequestBody OrderRequest req) {
        return service.create(req);
    }

    @GetMapping("/self")
    public List<OrderDto> myOrders() { return service.history(); }

    @DeleteMapping("/{id}")
    public OrderDto cancel(@PathVariable Long id) { return service.cancelOwn(id); }

    /* ---------- ADMIN ---------- */

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<OrderDto>> all(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.findAll(PageRequest.of(page, size)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id,
                                 @RequestParam OrderStatus status) {
        return service.adminSetStatus(id, status);
    }
}
