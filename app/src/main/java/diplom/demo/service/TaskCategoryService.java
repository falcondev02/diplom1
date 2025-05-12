/*
package diplom.demo.service;

import diplom.demo.entity.Task;
import diplom.demo.entity.TaskCategory;
import diplom.demo.repository.TaskCategoryRepository;
import diplom.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskCategoryService {
    private final TaskCategoryRepository categoryRepo;
    private final TaskRepository taskRepo;

    public List<TaskCategory> getAllCategories() { return categoryRepo.findAll(); }

    public TaskCategory createCategory(TaskCategory category) {
        return categoryRepo.save(category);
    }

    public void deleteCategory(Long id) {
        TaskCategory cat = categoryRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found"));
        // Проверяем, есть ли задачи:
        List<Task> tasks = taskRepo.findAll();
        boolean hasTasks = tasks.stream().anyMatch(t -> t.getCategory().equals(cat));
        if (hasTasks) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cannot delete category with tasks");
        }
        categoryRepo.delete(cat);
    }
}

*/
