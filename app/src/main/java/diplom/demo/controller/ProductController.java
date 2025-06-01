// src/main/java/diplom/demo/controller/ProductController.java
package diplom.demo.controller;

import diplom.demo.dto.ProductDto;
import diplom.demo.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @Operation(summary = "Каталог - все товары (с опцией фильтра по категории)")
    @GetMapping
    public ResponseEntity<Page<ProductDto>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId // ← добавили
    ) {
        if (categoryId != null) {
            // Если пришёл параметр categoryId, вызываем метод фильтрации
            return ResponseEntity.ok(
                    service.findByCategory(categoryId, PageRequest.of(page, size))
            );
        } else {
            // Иначе — просто всё
            return ResponseEntity.ok(
                    service.findAll(PageRequest.of(page, size))
            );
        }
    }

    @Operation(summary = "Детали товара")
    @GetMapping("{id}")
    public ProductDto one(@PathVariable Long id) {
        return service.findOne(id);
    }

    /* ==== ADMIN ==== */
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody ProductDto dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        return service.update(id, dto);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
