package diplom.demo.service;

import diplom.demo.dto.PasswordChangeRequest;
import diplom.demo.dto.UserDto;
import diplom.demo.dto.UserRequest;
import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder enc;

    /* регистрация */
    public User createUser(UserRequest req) {
        if (userRepo.findByUsername(req.getUsername()) != null)
            throw new RuntimeException("Username already exists");

        User u = User.builder()
                .username(req.getUsername())
                .password(enc.encode(req.getPassword()))
                .role(req.getRole())
                .build();
        return userRepo.save(u);
    }

    /* admin */
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        userRepo.deleteById(id);
    }

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepo.findAll(pageable).map(UserDto::from);
    }

    /* смена пароля */
    public void changePassword(String username, PasswordChangeRequest b){
        User u = userRepo.findByUsername(username);
        if(!enc.matches(b.oldPassword(),u.getPassword()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"wrong old pass");
        u.setPassword(enc.encode(b.newPassword()));
        userRepo.save(u);
    }
}
