    package com.example.ShopiShop.service;

    import lombok.RequiredArgsConstructor;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.mail.SimpleMailMessage;
    import org.springframework.mail.javamail.JavaMailSender;
    import org.springframework.scheduling.annotation.Async;
    import org.springframework.stereotype.Service;


    @Service
    @RequiredArgsConstructor
    public class EmailService {

        private final JavaMailSender mailSender;

        @Value("${app.frontend-url}")
        private String frontendUrl;

        @Async
        public void sendConfirmationEmail(String to, String token) {
            String subject = "Activate Your ShopiShop Account";
            String confirmationUrl = frontendUrl + "/confirm?token=" + token;
            String message = "Thank you for registering with ShopiShop. Please click the link below to activate your account:\n" + confirmationUrl;

            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);

            mailSender.send(mailMessage);
        }


        @Async
        public void sendPasswordResetEmail(String to, String resetToken) {
            String subject = "Reset Your ShopiShop Password";
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String message = "We received a request to reset your password. Please click the link below to set a new password:\n" + resetUrl;

            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailSender.send(mailMessage);
        }
    }
