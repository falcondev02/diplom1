package diplom.demo.dto;

import diplom.demo.entity.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private Role role;
}
