package diplom.demo.dto;


public record PasswordChangeRequest(
        String oldPassword,
        String newPassword
) {}