package diplom.demo.controller;

import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import diplom.demo.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepo;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequest req) {
        authService.register(req.getUsername(), req.getPassword());
        return ResponseEntity.ok(Map.of("msg", "ok"));
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
        // private final Long userId;
    }

}

