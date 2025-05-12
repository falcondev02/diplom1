package diplom.demo.dto;

import diplom.demo.entity.Role;

public record UserDto(Long id, String username, Role role) {
    public static UserDto from(diplom.demo.entity.User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getRole());
    }
}

