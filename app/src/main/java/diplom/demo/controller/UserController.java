package diplom.demo.controller;

import diplom.demo.dto.UserDto;
import diplom.demo.dto.UserRequest;
import diplom.demo.entity.ProductCategory;
import diplom.demo.entity.User;
import diplom.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> create(@RequestBody UserRequest req) {
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username cannot be empty");
        }
        User created = userService.createUser(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UserController.java
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Получить список всех пользователей (доступно ADMIN)")
    @GetMapping
    public ResponseEntity<Page<UserDto>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDto> users = userService.getAllUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(users);
    }
/* @GetMapping
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }*/
  /*@GetMapping
  public List<User> all() { return userService.findAll(); }*/
}
