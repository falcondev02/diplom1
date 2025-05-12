package diplom.demo.config;

import diplom.demo.entity.*;
import diplom.demo.repository.OrderRepository;
import diplom.demo.repository.ProductCategoryRepository;
import diplom.demo.repository.ProductRepository;
import diplom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    private final ProductCategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    private final OrderRepository orderRepo;     // только чтобы кинуть демо-заказ

    @Override
    public void run(String... args) {
        // если в базе уже есть хоть один юзер — значит всё инициализировано
        if (userRepo.count() > 0) return;

        System.out.println(">>> Bootstrapping demo data…");

        /* ==== users ==== */
        User admin = userRepo.save(User.builder()
                .username("admin")
                .password(encoder.encode("admin"))
                .role(Role.ADMIN)
                .build());

        User alice = userRepo.save(User.builder()
                .username("alice")
                .password(encoder.encode("pass123"))
                .role(Role.USER)
                .build());

        /* ==== categories ==== */
        ProductCategory mugs      = categoryRepo.save(new ProductCategory(null, "Mugs",      "Custom ceramic mugs"));
        ProductCategory tshirts   = categoryRepo.save(new ProductCategory(null, "T-Shirts",  "Cotton tees with your print"));
        ProductCategory keychains = categoryRepo.save(new ProductCategory(null, "Keychains", "Metal keychains with engraving"));

        /* ==== products ==== */
        Product mug = productRepo.save(Product.builder()
                .name("Classic White Mug")
                .description("350 ml, dishwasher-safe. Custom text or image.")
                .priceCents( 990)
                .imageUrl("https://placehold.co/400x400?text=Mug")
                .category(mugs)
                .build());

        Product tshirt = productRepo.save(Product.builder()
                .name("Black T-Shirt (Unisex)")
                .description("100 % cotton. Any design.")
                .priceCents(1990)
                .imageUrl("https://placehold.co/400x400?text=T-Shirt")
                .category(tshirts)
                .build());

        /* ==== demo order for Alice ==== */
        Order order = Order.builder()
                .user(alice)
                .status(OrderStatus.NEW)
                .note("Print ‘Hello world’ on the front.")
                .build();

        OrderItem item1 = OrderItem.builder()
                .order(order)
                .product(mug)
                .quantity(2)
                .priceCents(mug.getPriceCents())
                .build();

        OrderItem item2 = OrderItem.builder()
                .order(order)
                .product(tshirt)
                .quantity(1)
                .priceCents(tshirt.getPriceCents())
                .build();

        order.setItems(List.of(item1, item2));
        orderRepo.save(order);

        System.out.println(">>> Demo data ready!");
    }
}
