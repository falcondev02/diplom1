package diplom.demo.controller;

import diplom.demo.dto.PasswordChangeRequest;
import diplom.demo.dto.UserDto;
import diplom.demo.dto.UserRequest;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    /* -------- регистрация (public) -------- */
    @PostMapping("/register")                 // /api/users/register
    public ResponseEntity<Map<String,String>> register(@RequestBody UserRequest r){
        userService.createUser(r);
        return ResponseEntity.ok(Map.of("msg","ok"));   // 200 ⬅ фронт больше не орёт
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> changeOwn(Authentication a,
                                       @RequestBody PasswordChangeRequest b){
        userService.changePassword(a.getName(), b);
        return ResponseEntity.ok().build();
    }


    /* ----------- admin zone ----------- */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Список всех пользователей (ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserDto>> findAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsers(PageRequest.of(page, size)));
    }

    /* -------- смена пароля пользователем -------- */

}
