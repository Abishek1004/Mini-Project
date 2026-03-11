package com.example.e_waste_management_backend.controller;

import com.example.e_waste_management_backend.dto.AuthResponse;
import com.example.e_waste_management_backend.dto.UserDTO;
import com.example.e_waste_management_backend.dto.LoginDTO;
import com.example.e_waste_management_backend.entity.GoogleUser;
import com.example.e_waste_management_backend.entity.PendingUser;
import com.example.e_waste_management_backend.entity.User;
import com.example.e_waste_management_backend.repository.GoogleUserRepository;
import com.example.e_waste_management_backend.repository.PendingUserRepository;
import com.example.e_waste_management_backend.repository.UserRepository;
import com.example.e_waste_management_backend.service.AuthServiceImpl;
import com.example.e_waste_management_backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthServiceImpl authService;
    @Autowired private PendingUserRepository pendingRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserRepository userRepository;
    @Autowired private GoogleUserRepository googleUserRepository;
    @Autowired private JwtUtil jwtUtil;

    // ─── Register (sends OTP) ────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO dto) {
        String result = authService.register(dto);
        if (result.equals("Email already registered"))
            return ResponseEntity.badRequest().body(Map.of("message", result));
        return ResponseEntity.ok(Map.of("message", result));
    }

    // ─── Verify OTP → completes registration + auto-login ───────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        PendingUser pending = pendingRepo.findByEmail(email).orElse(null);
        if (pending == null)
            return ResponseEntity.badRequest().body(Map.of("message", "OTP not found. Please register again."));
        if (pending.getExpiryTime().isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body(Map.of("message", "OTP expired. Please register again."));
        if (!pending.getOtp().equals(otp))
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP."));

        User user = new User();
        user.setName(pending.getName());
        user.setEmail(pending.getEmail());
        user.setPassword(pending.getPassword());
        user.setMobileNo(pending.getMobileNo());
        user.setVerified(true);
        userRepository.save(user);
        pendingRepo.delete(pending);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token,
            new AuthResponse.UserInfo(user.getId(), user.getName(), user.getEmail(), user.getMobileNo())));
    }

    // ─── Login ───────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body(Map.of("message", "No account found with this email."));
        if (!user.isVerified())
            return ResponseEntity.badRequest().body(Map.of("message", "Please verify your email before logging in."));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect password."));

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token,
            new AuthResponse.UserInfo(user.getId(), user.getName(), user.getEmail(), user.getMobileNo())));
    }

    // ─── Google OAuth ────────────────────────────────────────────────────────
    @GetMapping("/google-success")
    public ResponseEntity<?> googleSuccess(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        String name  = principal.getAttribute("name");
        googleUserRepository.findByEmail(email).orElseGet(() -> {
            GoogleUser u = new GoogleUser(); u.setEmail(email); u.setVerified(true);
            return googleUserRepository.save(u);
        });
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name != null ? name : email.split("@")[0]);
            u.setEmail(email); u.setPassword(""); u.setVerified(true);
            return userRepository.save(u);
        });
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token,
            new AuthResponse.UserInfo(user.getId(), user.getName(), user.getEmail(), user.getMobileNo())));
    }

    @GetMapping("/testing")
    public String testing() { return "Backend is running OK"; }
}
