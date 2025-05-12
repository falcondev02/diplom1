package diplom.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)   // ⬅️ bigint
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 4096)
    private String description;

    @Column(name = "price_cents", nullable = false)
    private Integer priceCents;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;
}

