package diplom.demo.repository;

import diplom.demo.entity.Order;
import diplom.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository        extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
