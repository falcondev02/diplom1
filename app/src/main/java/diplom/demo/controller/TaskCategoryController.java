/*
package diplom.demo.controller;

import diplom.demo.entity.TaskCategory;
import diplom.demo.service.TaskCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication") // для POST/DELETE требует токен
public class TaskCategoryController {

    private final TaskCategoryService categoryService;

    @Operation(summary = "Получить все категории (доступно без авторизации)")
    @GetMapping
    public ResponseEntity<List<TaskCategory>> getAll() {
        // GET /api/categories у нас в SecurityConfig открыт всем
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Operation(summary = "Создать новую категорию (ADMIN)")
    @PostMapping
    public ResponseEntity<TaskCategory> create(@RequestBody TaskCategory cat) {
        TaskCategory created = categoryService.createCategory(cat);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Удалить категорию (ADMIN)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
*/
