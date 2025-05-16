package diplom.demo.service;

import diplom.demo.dto.UserDto;
import diplom.demo.dto.UserRequest;
import diplom.demo.entity.ProductCategory;
import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;   // 🔥 добавили

  /*  public List<UserDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDto::from)
                .toList();
    }*/
  // UserService.java
  public void deleteUser(Long id) {
      if (!userRepo.existsById(id))
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
      userRepo.deleteById(id);
  }

    public Page<UserDto> getAllUsers(Pageable pageable) {
      return userRepo.findAll(pageable)
              .map(UserDto::from);
  }
    //public List<User> findAll()           { return userRepo.findAll();          }

    public User getByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User createUser(UserRequest req) {
        if (userRepo.findByUsername(req.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();

        return userRepo.save(user);
    }

}
