package com.example.e_waste_management_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // ✅ Public APIs
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",
                                "/api/**"   // 👈 Allow this API
                        ).permitAll()

                        // ❗ Everything else requires login
                        .anyRequest().authenticated()
                )

                .oauth2Login(Customizer.withDefaults());

        return http.build();
    }
}