package diplom.demo.service;

import diplom.demo.entity.Role;
import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import diplom.demo.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder; // 🆕

    public User register(String username, String password) {
        if (userRepo.findByUsername(username) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password)) // ✅ хешируем!
                .role(Role.USER)
                .build();
        return userRepo.save(user);
    }

    public String login(String username, String password) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/password");
        }
        User user = userRepo.findByUsername(username);
        return jwtProvider.generateToken(username, user.getRole().name());
    }
}



