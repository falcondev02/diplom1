package diplom.demo.repository;

import diplom.demo.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {}

