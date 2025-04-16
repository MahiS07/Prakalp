document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // Add focus effects to input fields
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('ring-2', 'ring-indigo-500');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('ring-2', 'ring-indigo-500');
        });
    });

    // Form submission handling
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Email validation
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Signing in...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showSuccess('Login successful! Redirecting...');

            // Store remember me preference
            if (remember) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }

            // Redirect to dashboard (replace with actual redirect)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            showError('Invalid email or password');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }

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
        const existingError = loginForm.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
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
        const existingSuccess = loginForm.querySelector('.success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }

    // Add smooth transitions for form elements
    const formElements = loginForm.querySelectorAll('input, button, a');
    formElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });
}); 