package databases.project.backend.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
    


    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    String token = jwtTokenProvider.resolveToken(request);
    
    if (token != null && jwtTokenProvider.validateToken(token)) {
        // Authenticate and set the security context
        Authentication auth = jwtTokenProvider.getAuthentication(token);
        if (auth != null) {
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    } else {
        // Token is either invalid or missing; you may want to handle this by returning a 401 or 403 response
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Or SC_FORBIDDEN
    }
    
    filterChain.doFilter(request, response); // Proceed to the next filter in the chain
}
    
}

