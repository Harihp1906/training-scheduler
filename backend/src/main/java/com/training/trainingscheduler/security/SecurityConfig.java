package com.training.trainingscheduler.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Route rules cover the full endpoint contract up front (courses, enrollments,
 * quizzes, certificates, admin, contact) even though most controllers land in
 * later build steps -- Spring Security matchers are harmless against
 * not-yet-existing paths, and it avoids re-editing this file per entity.
 * Ownership (e.g. "a student can only read their own enrollment") is enforced
 * in the service layer, not here -- these rules only cover role-level access.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.cors.origin}")
    private String corsOrigin;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                // Certificate verification is public by design (anyone can check
                // a certificate ID); listing/revoking is admin-only.
                .requestMatchers(HttpMethod.GET, "/api/certificates/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/certificates").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/certificates/*/revoke").hasRole("ADMIN")

                // Course catalog is public to read; admin-only to list all
                // (incl. inactive) or to mutate.
                .requestMatchers(HttpMethod.GET, "/api/courses/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/*").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/enrollments/course/*").hasRole("ADMIN")

                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(corsOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
