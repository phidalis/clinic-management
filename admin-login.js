// admin-login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    const togglePassword = document.querySelector('.toggle-password');
    const modal = document.getElementById('adminSuccessModal');
    
    // Admin credentials (in real app, this would be in backend)
    const ADMIN_EMAIL = 'admin@medicarepro.com';
    const ADMIN_PASSWORD = 'admin123';

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Input validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // Show error
    function showError(input, message) {
        const group = input.parentElement;
        input.classList.add('error');
        
        const existingError = group.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.color = '#dc3545';
        error.style.fontSize = '0.85rem';
        error.style.marginTop = '0.25rem';
        error.style.display = 'block';
        error.textContent = message;
        group.appendChild(error);
    }

    // Remove error
    function removeError(input) {
        const group = input.parentElement;
        input.classList.remove('error');
        const error = group.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value && !validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                removeError(this);
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value && !validatePassword(this.value)) {
                showError(this, 'Password must be at least 6 characters');
            } else {
                removeError(this);
            }
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            let isValid = true;

            // Validate email
            if (!email) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // Validate password
            if (!password) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                removeError(passwordInput);
            }

            if (isValid) {
                // Check against admin credentials
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    authenticateAdmin();
                } else {
                    showError(emailInput, 'Invalid email or password');
                    showError(passwordInput, 'Invalid email or password');
                    
                    // Shake animation
                    const card = document.querySelector('.admin-login-card');
                    card.style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 500);
                }
            }
        });
    }

    // Admin authentication
    function authenticateAdmin() {
        // Show loading state
        const loginBtn = document.querySelector('.admin-login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        loginBtn.disabled = true;

        // Simulate authentication delay
        setTimeout(() => {
            // Show success modal
            if (modal) {
                modal.classList.add('show');
            }
            
            // Reset button
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;

            // Store admin session
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminLoginTime', new Date().toISOString());
            localStorage.setItem('loggedInUser', JSON.stringify({
                role: 'admin',
                name: 'Administrator',
                email: ADMIN_EMAIL
            }));

            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 2000);
        }, 1500);
    }

    // Forgot password handler
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const notification = document.createElement('div');
            notification.className = 'forgot-notification';
            notification.innerHTML = `
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>Password Reset</strong>
                    <p>For demo purposes, use: admin@medicarepro.com / admin123</p>
                </div>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border-left: 4px solid var(--primary);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        });
    }

    // Remember me functionality
    const rememberCheckbox = document.querySelector('.remember-me input');
    const savedEmail = localStorage.getItem('adminRememberedEmail');
    
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function() {
            if (rememberCheckbox && rememberCheckbox.checked && validateEmail(emailInput.value)) {
                localStorage.setItem('adminRememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('adminRememberedEmail');
            }
        });
    }

    // Add keyboard shortcut (Ctrl+Shift+D) to auto-fill demo credentials
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            if (emailInput && passwordInput) {
                emailInput.value = ADMIN_EMAIL;
                passwordInput.value = ADMIN_PASSWORD;
                
                // Highlight the fields
                [emailInput, passwordInput].forEach(input => {
                    input.style.backgroundColor = '#e8f5e9';
                    setTimeout(() => {
                        input.style.backgroundColor = '';
                    }, 1000);
                });
                
                // Show tooltip
                const tooltip = document.createElement('div');
                tooltip.textContent = 'Demo credentials filled!';
                tooltip.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4CAF50;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    z-index: 3000;
                    animation: fadeInOut 2s ease;
                `;
                document.body.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.remove();
                }, 2000);
            }
        }
    });

    // Prevent form resubmission on page refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
});