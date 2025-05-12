package diplom.demo.controller;

import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import diplom.demo.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepo;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        authService.register(request.getUsername(), request.getPassword());
        return "User registered";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        User user = userRepo.findByUsername(request.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }


    @Data
    static class AuthRequest {
        private String username;
        private String password;
    }
    @Data
    static class AuthResponse {
        private final String token;
        private final String username; // <- добавь
        private final String role;
    }

}

