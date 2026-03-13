// patient-login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('patientLoginForm');
    const passwordInput = document.querySelector('input[type="password"]');
    const togglePassword = document.querySelector('.toggle-password');
    const loginModal = document.getElementById('successModal');
    const signupModal = document.getElementById('signupModal');
    
    // Toggle password visibility for login
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle password for signup
    const togglePasswordSignup = document.querySelector('.toggle-password-signup');
    if (togglePasswordSignup) {
        togglePasswordSignup.addEventListener('click', function() {
            const signupPassword = document.getElementById('signupPassword');
            if (signupPassword) {
                const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                signupPassword.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Open signup modal
    const registerLink = document.querySelector('.register-link a');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (signupModal) {
                signupModal.classList.add('show');
            }
        });
    }

    // Close signup modal function
    window.closeSignupModal = function() {
        if (signupModal) {
            signupModal.classList.remove('show');
        }
    };

    // Handle Signup Form Submission
    const signupForm = document.getElementById('patientSignupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('signupFullName')?.value;
            const email = document.getElementById('signupEmail')?.value;
            const phone = document.getElementById('signupPhone')?.value;
            const dob = document.getElementById('signupDob')?.value;
            const gender = document.getElementById('signupGender')?.value;
            const address = document.getElementById('signupAddress')?.value;
            const password = document.getElementById('signupPassword')?.value;
            const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

            // Validate required fields
            if (!fullName || !email || !phone || !dob || !gender || !address || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Validate password strength
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate phone (simple validation)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }

            // Create patient ID
            const patientId = 'P' + Date.now().toString().slice(-6);

            // Create patient object
            const newPatient = {
                id: patientId,
                name: fullName,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                address: address,
                password: password,
                registeredDate: new Date().toISOString().split('T')[0],
                status: 'active',
                lastVisit: 'Never',
                age: calculateAge(dob),
                bloodGroup: 'Not Specified',
                emergencyContact: 'Not Provided'
            };

            // Get existing patients
            let patients = JSON.parse(localStorage.getItem('patients')) || [];
            
            // Check if email already exists
            if (patients.some(p => p.email === email)) {
                alert('Email already registered! Please use a different email or login.');
                return;
            }

            // Add new patient
            patients.push(newPatient);
            localStorage.setItem('patients', JSON.stringify(patients));

            // Auto login after signup
            localStorage.setItem('loggedInPatient', JSON.stringify(newPatient));

            alert('Registration successful! Redirecting to your dashboard...');
            if (signupModal) {
                signupModal.classList.remove('show');
            }
            
            // Redirect to patient dashboard
            setTimeout(() => {
                window.location.href = 'patient-dashboard.html';
            }, 1500);
        });
    }

    // Calculate age from date of birth
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.querySelector('input[type="text"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            if (!emailInput || !passwordInput) return;
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            let isValid = true;

            // Validate email/ID
            if (!email) {
                showError(emailInput, 'Please enter your email or patient ID');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // Validate password
            if (!password) {
                showError(passwordInput, 'Please enter your password');
                isValid = false;
            } else {
                removeError(passwordInput);
            }

            if (isValid) {
                // Get patients from localStorage
                const patients = JSON.parse(localStorage.getItem('patients')) || [];
                
                // Find patient by email or ID
                const patient = patients.find(p => 
                    p.email === email || p.id === email
                );

                // Validate credentials
                if (patient && patient.password === password) {
                    // Save logged in user
                    localStorage.setItem('loggedInPatient', JSON.stringify(patient));
                    
                    // Show success modal
                    if (loginModal) {
                        loginModal.classList.add('show');
                    }
                    
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        if (loginModal) {
                            loginModal.classList.remove('show');
                        }
                        window.location.href = 'patient-dashboard.html';
                    }, 2000);
                } else {
                    showError(emailInput, 'Invalid email/ID or password');
                    showError(passwordInput, 'Invalid email/ID or password');
                }
            }
        });
    }

    // Show error message
    function showError(input, message) {
        const inputGroup = input.parentElement;
        input.classList.add('error');
        
        const existingError = inputGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = '#e74c3c';
        errorMessage.style.fontSize = '0.85rem';
        errorMessage.style.marginTop = '0.25rem';
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
        inputGroup.appendChild(errorMessage);
    }

    // Remove error
    function removeError(input) {
        const inputGroup = input.parentElement;
        input.classList.remove('error');
        const errorMessage = inputGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Remove error on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            removeError(this);
        });
    });

    // Remember me functionality
    const rememberCheckbox = document.querySelector('input[type="checkbox"]');
    const savedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedEmail) {
        const emailInput = document.querySelector('input[type="text"]');
        if (emailInput) {
            emailInput.value = savedEmail;
        }
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function() {
            const emailInput = document.querySelector('input[type="text"]');
            if (rememberCheckbox && rememberCheckbox.checked && emailInput) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        });
    }

    // Forgot password link
    const forgotLink = document.querySelector('.remember-forgot a');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset link would be sent to your email in a real application.');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (signupModal && e.target === signupModal) {
            signupModal.classList.remove('show');
        }
        if (loginModal && e.target === loginModal) {
            loginModal.classList.remove('show');
        }
    });

    // Set minimum date for DOB (must be at least 1 year old)
    const dobInput = document.getElementById('signupDob');
    if (dobInput) {
        const today = new Date();
        const minDate = new Date(today.setFullYear(today.getFullYear() - 100)).toISOString().split('T')[0];
        const maxDate = new Date().toISOString().split('T')[0];
        dobInput.setAttribute('max', maxDate);
        dobInput.setAttribute('min', minDate);
    }
});