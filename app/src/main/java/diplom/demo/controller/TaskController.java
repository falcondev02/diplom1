/*
package diplom.demo.controller;

import diplom.demo.entity.Task;
import diplom.demo.entity.TaskCategory;
import diplom.demo.entity.TaskPriority;
import diplom.demo.entity.TaskStatus;
import diplom.demo.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication") // Подключаем Bearer-токен в Swagger
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Создать новую задачу (user подставляется из JWT)")
    @PostMapping
    public ResponseEntity<Task> create(@RequestBody TaskDto dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setCategory(dto.getCategory());

        Task created = taskService.createTask(task);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Получить все задачи (USER – только свои, ADMIN – все)")
    @GetMapping
    public ResponseEntity<List<Task>> getAll(@RequestParam(required = false) TaskStatus status,
                                             @RequestParam(required = false) TaskPriority priority) {
        List<Task> tasks = taskService.getTasks(status, priority);
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Получить задачу по ID (USER – если своя, ADMIN – любую)")
    @GetMapping("/{id}")
    public ResponseEntity<Task> getOne(@PathVariable Long id) {
        System.out.println(">>> Запрос на получение задачи. Переданный ID: " + id);

        Task t = taskService.getTask(id);
        System.out.println(">>> Задача найдена: " + (t != null ? t.getTitle() : "NULL"));

        return ResponseEntity.ok(t);
    }

    @Operation(summary = "Обновить задачу по ID (USER – если своя, ADMIN – любую)")
    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody TaskDto dto) {
        Task newData = new Task();
        newData.setTitle(dto.getTitle());
        newData.setDescription(dto.getDescription());
        newData.setPriority(dto.getPriority());
        newData.setStatus(dto.getStatus());
        newData.setCategory(dto.getCategory());

        Task updated = taskService.updateTask(id, newData);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Удалить задачу по ID (только ADMIN)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    static class TaskDto {
        private String title;
        private String description;
        private TaskPriority priority;
        private TaskStatus status;
        private TaskCategory category;
    }
}
*/
