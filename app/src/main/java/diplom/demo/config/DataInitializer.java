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

    private final UserRepository             userRepo;
    private final PasswordEncoder            encoder;

    private final ProductCategoryRepository  categoryRepo;
    private final ProductRepository          productRepo;

    private final OrderRepository            orderRepo;    // только для демо-заказа

    @Override
    public void run(String... args) {
       orderRepo.deleteAll(); // OrderItem удаляются каскадно
        productRepo.deleteAll();
        categoryRepo.deleteAll();
        userRepo.deleteAll();/*  если в базе уже есть хоть один пользователь —
            считаем, что данные уже загружены
        //    if (userRepo.count() > 0) return;

        System.out.println(">>> Загружаю демонстрационные данные…");

        /* ---------- пользователи ---------- */
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

        /* ---------- категории ---------- */
        ProductCategory mugs      = categoryRepo.save(
                new ProductCategory(null, "Кружки",    "Керамические кружки с индивидуальным принтом"));
        ProductCategory tshirts   = categoryRepo.save(
                new ProductCategory(null, "Футболки", "Хлопковые футболки с вашим дизайном"));
        ProductCategory keychains = categoryRepo.save(
                new ProductCategory(null, "Брелоки",  "Металлические брелоки с гравировкой"));
        ProductCategory stationery = categoryRepo.save(ProductCategory.builder()
                .name("Канцелярия")
                .description("Блокноты, ручки, и другие предметы для записи")
                .build());

        /* ---------- товары (6 шт.) ---------- */
        Product mugClassic = productRepo.save(Product.builder()
                .name("Кружка белая классическая")
                .description("350 мл, подходит для ПММ. Любой текст или изображение.")
                .priceCents( 990)
                .inStock(84)
                .imageUrl("https://images.unsplash.com/photo-1650959858546-d09833d5317b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                //     .imageUrl("https://placehold.co/400x400?text=White+Mug")
                .category(mugs)
                .build());

        Product mugBlack = productRepo.save(Product.builder()
                .name("Кружка чёрная матовая")
                .description("300 мл, матовое покрытие. Печать по кругу.")
                .priceCents(1290)
                .inStock(32)
                .imageUrl("https://plus.unsplash.com/premium_photo-1718234942375-4fcef6828891?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .category(mugs)
                .build());

        Product tshirtBlack = productRepo.save(Product.builder()
                .name("Футболка чёрная")
                .description("100 % хлопок, плотность 180 г/м². Любой принт.")
                .priceCents(1990)
                .inStock(57)
                .imageUrl("https://plus.unsplash.com/premium_photo-1689531916407-d64dedd6126d?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .category(tshirts)
                .build());

        Product tshirtWhite = productRepo.save(Product.builder()
                .name("Футболка белая")
                .description("100 % хлопок, плотность 180 г/м². Сублимационная печать.")
                .priceCents(1790)
                .inStock(120)
                .imageUrl("https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .category(tshirts)
                .build());

        Product keychainRound = productRepo.save(Product.builder()
                .name("Брелок круглый металлический")
                .description("Диаметр 40 мм, двусторонняя гравировка лазером.")
                .priceCents( 590)
                .inStock(250)
                .imageUrl("https://tehuspeha.su/images/tehuspeha-catalog-328x328_0/item/z0mwdtlgo1.jpg")
                .category(keychains)
                .build());

        Product keychainHeart = productRepo.save(Product.builder()
                .name("Брелок сердце")
                .description("30 × 35 мм, зеркальный металл, гравировка с одной стороны.")
                .priceCents( 690)
                .inStock(170)
                .imageUrl("https://images.unsplash.com/photo-1727154085760-134cc942246e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .category(keychains)
                .build());
        Product keychainblock = productRepo.save(Product.builder()
                .name("Блокнот A5 с гравировкой")
                .description("80 листов, крафт-обложка. Идеально под логотип компании или надпись.")
                .priceCents(1090)
                .imageUrl("https://plus.unsplash.com/premium_photo-1667251760532-85310936c89a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .inStock(50)
                .category(stationery) // Или создай новую категорию "Канцелярия"
                .build());
        Product keychainpen = productRepo.save(Product.builder()
                .name("Ручка с логотипом")
                .description("Классическая синяя ручка с возможностью нанесения надписи или логотипа.")
                .priceCents(1090)
                .imageUrl("https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .inStock(200)
                .category(stationery) // Тоже можешь переназначить, если хочешь "Аксессуары" отдельно
                .build());

        /* ---------- демо-заказ для Alice ---------- */
        Order demoOrder = Order.builder()
                .user(alice)
                .status(OrderStatus.NEW)
                .note("На чёрной футболке текст «Hello, World!»")
                .address("г. Челябинск, пр-т Ленина, д. 1")  // ✅ или любой другой фиктивный адрес
                .build();

        OrderItem item1 = OrderItem.builder()
                .order(demoOrder)
                .product(mugClassic)
                .quantity(2)
                .priceCents(mugClassic.getPriceCents())
                .build();

        OrderItem item2 = OrderItem.builder()
                .order(demoOrder)
                .product(tshirtBlack)
                .quantity(1)
                .priceCents(tshirtBlack.getPriceCents())
                .build();

        demoOrder.setItems(List.of(item1, item2));
        orderRepo.save(demoOrder);

        System.out.println(">>> Demo-данные готовы!");
    }
}
