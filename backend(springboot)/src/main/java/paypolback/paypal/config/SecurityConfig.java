package paypolback.paypal.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ Disable CSRF for APIs (Postman, mobile app, React Native)
                .csrf(AbstractHttpConfigurer::disable)

                // 🔐 Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // ✅ Allow all PayPal APIs without login
                        .requestMatchers("/api/paypal/**").permitAll()

                        // ✅ Allow Swagger / OpenAPI UI (optional)
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // ✅ Allow everything else for now
                        .anyRequest().permitAll()
                );

        // No form-login, no httpBasic – pure stateless API for now
        return http.build();
    }
}
