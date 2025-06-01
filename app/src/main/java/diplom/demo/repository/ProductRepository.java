// src/main/java/diplom/demo/repository/ProductRepository.java
package diplom.demo.repository;

import diplom.demo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // По умолчанию Spring Data JPA разберёт этот метод и подставит WHERE category_id = :categoryId
    Page<Product> findAllByCategory_Id(Long categoryId, Pageable pageable);
}
