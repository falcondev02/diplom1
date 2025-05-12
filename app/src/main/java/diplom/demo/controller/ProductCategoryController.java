package diplom.demo.controller;

import diplom.demo.entity.ProductCategory;
import diplom.demo.service.ProductCategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService service;

    @GetMapping
    public List<ProductCategory> all() { return service.all(); }

    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ProductCategory create(@RequestBody ProductCategory c) {
        return service.create(c);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}

