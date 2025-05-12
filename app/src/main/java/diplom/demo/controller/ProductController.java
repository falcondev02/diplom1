package diplom.demo.controller;

import diplom.demo.dto.ProductDto;
import diplom.demo.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @Operation(summary = "Каталог - все товары")
    @GetMapping
    public ResponseEntity<Page<ProductDto>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.findAll(PageRequest.of(page, size)));
    }


    @Operation(summary = "Детали товара")
    @GetMapping("{id}")
    public ProductDto one(@PathVariable Long id) {
        return service.findOne(id);
    }

    /* ==== ADMIN ==== */

    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto create(@RequestBody ProductDto dto) {
        return service.create(dto);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        return service.update(id, dto);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}