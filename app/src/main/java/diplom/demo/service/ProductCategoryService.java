package diplom.demo.service;

import diplom.demo.entity.ProductCategory;
import diplom.demo.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {
    private final ProductCategoryRepository repo;
    public List<ProductCategory> all()           { return repo.findAll();          }
    public ProductCategory create(ProductCategory c) { return repo.save(c);        }
    public void delete(Long id) { repo.deleteById(id); }
}

