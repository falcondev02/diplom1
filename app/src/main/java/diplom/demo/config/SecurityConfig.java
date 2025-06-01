package diplom.demo.config;

import diplom.demo.security.JwtAuthenticationFilter;
import diplom.demo.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsServiceImpl  userDetailsService;

    /* ---------- beans ---------- */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authProvider(PasswordEncoder enc) {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setPasswordEncoder(enc);
        p.setUserDetailsService(userDetailsService);
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
    }

    /* ---------- main chain ---------- */

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable()
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // 1) Pre-flight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2) Public endpoints
                        .requestMatchers("/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                        // 3) USER & ADMIN access:
                        .requestMatchers(HttpMethod.POST,   "/api/orders").authenticated()              // оформить заказ
                        .requestMatchers(HttpMethod.GET,    "/api/orders/self/**").authenticated()      // посмотреть свои заказы
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/self/**").authenticated()      // отменить свой заказ
                        .requestMatchers(HttpMethod.PUT,    "/api/users/me/password").authenticated()   // сменить свой пароль

                        // 4) ADMIN-only endpoints:
                        .requestMatchers(HttpMethod.GET,  "/api/orders").hasRole("ADMIN")               // список всех заказов
                        .requestMatchers(HttpMethod.PUT,  "/api/orders/{id}/status").hasRole("ADMIN")    // сменить статус заказа
                        .requestMatchers(HttpMethod.GET,  "/api/users/**").hasRole("ADMIN")              // CRUD пользователей (список, удаление)
                        .requestMatchers("/api/products/**").hasRole("ADMIN")                            // CRUD товаров
                        .requestMatchers("/api/categories/**").hasRole("ADMIN")                          // CRUD категорий

                        // 5) Всё остальное (любой не описанный URL) – только авторизованные
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authProvider(passwordEncoder()))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
