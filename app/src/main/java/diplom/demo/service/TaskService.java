/*
package diplom.demo.service;

import diplom.demo.entity.*;
import diplom.demo.repository.TaskRepository;
import diplom.demo.repository.UserRepository;
import diplom.demo.repository.TaskCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final TaskCategoryRepository categoryRepo;

    */
/**
     * Определяем текущего пользователя из SecurityContext
     * Возвращаем User entity и role
     *//*

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        return user;
    }

    public Task createTask(Task task) {
        // Поле category не может быть null
        if (task.getCategory() == null || task.getCategory().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
        TaskCategory cat = categoryRepo.findById(task.getCategory().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        // status/priority по умолчанию
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }
        if (task.getPriority() == null) {
            task.setPriority(TaskPriority.MEDIUM);
        }

        // Владелец = текущий user
        User current = getCurrentUser();
        task.setUser(current);
        task.setCategory(cat);

        return taskRepo.save(task);
    }

    public List<Task> getTasks(TaskStatus status, TaskPriority priority) {
        User current = getCurrentUser();
        if (current.getRole() == Role.ADMIN) {
            // admin видит все
            if (status != null && priority != null) {
                return taskRepo.findByStatusAndPriority(status, priority);
            } else if (status != null) {
                return taskRepo.findByStatus(status);
            } else if (priority != null) {
                return taskRepo.findByPriority(priority);
            } else {
                return taskRepo.findAll();
            }
        } else {
            // user видит только свои
            if (status != null && priority != null) {
                return taskRepo.findByUserAndStatusAndPriority(current, status, priority);
            } else if (status != null) {
                return taskRepo.findByUserAndStatus(current, status);
            } else if (priority != null) {
                return taskRepo.findByUserAndPriority(current, priority);
            } else {
                return taskRepo.findByUser(current);
            }
        }
    }



    public Task updateTask(Long taskId, Task newData) {
        Task existing = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found"));

        User current = getCurrentUser();
        if (current.getRole() != Role.ADMIN) {
            // user должен быть владельцем
            if (!existing.getUser().getId().equals(current.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This task is not yours");
            }
        }

        // Нельзя менять владельца
        // => игнорируем newData.user

        // Нельзя сбросить category
        if (newData.getCategory() == null || newData.getCategory().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category cannot be null");
        }
        TaskCategory cat = categoryRepo.findById(newData.getCategory().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Category not found"));

        // Проверки status/priority (enum)
        if (newData.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status cannot be null");
        }
        if (newData.getPriority() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Priority cannot be null");
        }

        existing.setTitle(newData.getTitle());
        existing.setDescription(newData.getDescription());
        existing.setStatus(newData.getStatus());
        existing.setPriority(newData.getPriority());
        existing.setCategory(cat);

        return taskRepo.save(existing);
    }
    public Task getTask(Long taskId) {
        System.out.println(">>> Получение задачи с ID: " + taskId);

        Task t = taskRepo.findById(taskId)
                .orElseThrow(() -> {
                    System.out.println(">>> Ошибка: задача не найдена!");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
                });

        User current = getCurrentUser();

        System.out.println(">>> Найденная задача: " + t.getTitle() + " | ID пользователя владельца: " +
                (t.getUser() != null ? t.getUser().getId() : "NULL"));
        System.out.println(">>> Текущий пользователь: " + current.getUsername() + " | ID: " + current.getId() + " | Роль: " + current.getRole());

        if (current.getRole() == Role.ADMIN) {
            System.out.println(">>> ADMIN запросил задачу, доступ разрешен.");
            return t;
        } else {
            // user может видеть только свою
            if (!t.getUser().getId().equals(current.getId())) {
                System.out.println(">>> Ошибка: пользователь не является владельцем задачи!");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view someone else's task");
            }
            System.out.println(">>> Пользователь является владельцем задачи, доступ разрешен.");
            return t;
        }
    }

    public void deleteTask(Long taskId) {
        Task existing = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        User current = getCurrentUser();
        if (current.getRole() == Role.ADMIN) {
            // admin может удалять любую задачу
            taskRepo.delete(existing);
        } else {
            // user может удалить только свою
            if (!existing.getUser().getId().equals(current.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your task");
            }
            taskRepo.delete(existing);
        }
    }
}
*/
