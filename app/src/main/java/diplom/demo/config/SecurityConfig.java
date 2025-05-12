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
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

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
                        // Разрешить preflight-запросы (CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        /* --- ПУБЛИКА --- */
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()

                        // Разрешаем только GET-запросы к заказам для авторизованных пользователей (user + admin)
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").permitAll()

                        /* --- ТОЛЬКО ADMIN --- */
                        .requestMatchers(HttpMethod.OPTIONS, "/api/users/**").permitAll()
                        .requestMatchers("/api/products/**").hasRole("ADMIN")        // POST/PUT/DELETE
                        .requestMatchers("/api/categories/**").hasRole("ADMIN")      // POST/PUT/DELETE
                        .requestMatchers("/api/orders/**").hasRole("ADMIN")          // POST/PUT/DELETE

                        /* --- всё остальное --- */
                        .anyRequest().authenticated()
                )

               /* .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()   // <-- добавь!

                        *//* --- ПУБЛИКА --- *//*
                        .requestMatchers("/api/auth/**" ,              // login / register
                                "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").permitAll()
                        *//* --- НУЖЕН ЛЮБОЙ ЛОГИН --- *//*
             //           .requestMatchers("/api/orders/**").authenticated()

                        *//* --- ТОЛЬКО ADMIN --- *//*
                        .requestMatchers(HttpMethod.OPTIONS, "/api/users/**").permitAll()
                        .requestMatchers("/api/products/**").hasRole("ADMIN")       // POST/PUT/DELETE
                        .requestMatchers("/api/categories/**").hasRole("ADMIN")     // POST/PUT/DELETE
                        .requestMatchers("/api/orders/**").hasRole("ADMIN")     // POST/PUT/DELETE

                        *//* --- всё остальное --- *//*
                        .anyRequest().authenticated()
                )*/

                .authenticationProvider(authProvider(passwordEncoder()))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
