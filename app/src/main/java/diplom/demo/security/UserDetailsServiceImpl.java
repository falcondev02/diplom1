package diplom.demo.security;

import diplom.demo.entity.User;
import diplom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

/**
 * Сервис, который Spring Security будет дергать при authenticate().
 * Он загружает User из БД и возвращает UserDetails
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepo.findByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        var auth = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());
        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(auth)
        );
    }
}


