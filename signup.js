document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');

    // Add password requirements list
    const passwordRequirements = document.createElement('ul');
    passwordRequirements.className = 'password-requirements';
    passwordRequirements.innerHTML = `
        <li class="invalid" data-requirement="length">At least 8 characters</li>
        <li class="invalid" data-requirement="uppercase">At least one uppercase letter</li>
        <li class="invalid" data-requirement="lowercase">At least one lowercase letter</li>
        <li class="invalid" data-requirement="number">At least one number</li>
        <li class="invalid" data-requirement="special">At least one special character</li>
    `;
    passwordInput.parentElement.appendChild(passwordRequirements);

    // Add password strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    passwordInput.parentElement.appendChild(strengthIndicator);

    // Add focus effects to input fields
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('ring-2', 'ring-indigo-500');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('ring-2', 'ring-indigo-500');
        });
    });

    // Password validation
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update requirements list
        Object.entries(requirements).forEach(([requirement, isValid]) => {
            const li = passwordRequirements.querySelector(`[data-requirement="${requirement}"]`);
            if (isValid) {
                li.classList.remove('invalid');
                li.classList.add('valid');
            } else {
                li.classList.remove('valid');
                li.classList.add('invalid');
            }
        });

        // Update strength indicator
        const strength = Object.values(requirements).filter(Boolean).length;
        strengthIndicator.className = 'password-strength';
        if (strength <= 2) {
            strengthIndicator.classList.add('weak');
        } else if (strength <= 3) {
            strengthIndicator.classList.add('medium');
        } else if (strength <= 4) {
            strengthIndicator.classList.add('strong');
        } else {
            strengthIndicator.classList.add('very-strong');
        }
    });

    // Form submission handling
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = termsCheckbox.checked;

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        // Email validation
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Password validation
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (!terms) {
            showError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showSuccess('Account created successfully! Redirecting...');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);

        } catch (error) {
            showError('Failed to create account. Please try again.');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error bg-red-500 text-white p-3 rounded-lg mb-4 text-center';
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existingError = signupForm.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        signupForm.insertBefore(errorDiv, signupForm.firstChild);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success bg-green-500 text-white p-3 rounded-lg mb-4 text-center';
        successDiv.textContent = message;
        
        // Remove any existing success messages
        const existingSuccess = signupForm.querySelector('.success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        signupForm.insertBefore(successDiv, signupForm.firstChild);
    }

    // Add smooth transitions for form elements
    const formElements = signupForm.querySelectorAll('input, button, a');
    formElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });
}); 