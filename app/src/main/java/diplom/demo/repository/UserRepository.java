package diplom.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import diplom.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Чтобы можно было искать по username
    User findByUsername(String username);

}
