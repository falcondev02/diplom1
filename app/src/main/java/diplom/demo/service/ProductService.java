// src/main/java/diplom/demo/service/ProductService.java
package diplom.demo.service;

import diplom.demo.dto.ProductDto;
import diplom.demo.entity.Product;
import diplom.demo.entity.Role;
import diplom.demo.entity.User;
import diplom.demo.repository.ProductCategoryRepository;
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

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository repo;
    private final ProductCategoryRepository catRepo;
    private final UserRepository userRepo;

    private User current() {
        String username = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepo.findByUsername(username);
    }

    private void adminGuard() {
        if (current().getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin privileges required");
        }
    }

    // --------------- новый метод: найти по категории ---------------
    public Page<ProductDto> findByCategory(Long categoryId, Pageable pageable) {
        return repo.findAllByCategory_Id(categoryId, pageable)
                .map(ProductDto::from);
    }

    // --------------- существующие методы ---------------
    public Page<ProductDto> findAll(Pageable pageable) {
        return repo.findAll(pageable)
                .map(ProductDto::from);
    }

    public ProductDto findOne(Long id) {
        return ProductDto.from(repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")));
    }

    public ProductDto create(ProductDto dto) {
        adminGuard();
        var category = catRepo.findById(dto.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        Product p = Product.builder()
                .name(dto.name())
                .description(dto.description())
                .priceCents(dto.priceCents())
                .imageUrl(dto.imageUrl())
                .inStock(dto.inStock())
                .category(category)
                .build();

        return ProductDto.from(repo.save(p));
    }

    public ProductDto update(Long id, ProductDto dto) {
        adminGuard();
        Product existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        var category = catRepo.findById(dto.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        existing.setName(dto.name());
        existing.setDescription(dto.description());
        existing.setPriceCents(dto.priceCents());
        existing.setImageUrl(dto.imageUrl());
        existing.setCategory(category);
        existing.setInStock(dto.inStock());

        return ProductDto.from(existing);
    }

    public void delete(Long id) {
        adminGuard();
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        repo.deleteById(id);
    }
}
