document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // Add loading state to button
    const setLoading = (isLoading) => {
        submitButton.disabled = isLoading;
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        } else {
            submitButton.classList.remove('loading');
            submitButton.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        }
    };

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Email validation
        if (!email || !email.includes('@')) {
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        // Password validation
        if (!password || password.length < 6) {
            passwordInput.classList.add('error');
            isValid = false;
        } else {
            passwordInput.classList.remove('error');
        }

        return isValid;
    };

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Redirect to dashboard or handle success
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Login failed:', error);
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-sm mt-2 text-center';
            errorDiv.textContent = 'Login failed. Please check your credentials and try again.';
            loginForm.appendChild(errorDiv);
            
            // Remove error message after 3 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        } finally {
            setLoading(false);
        }
    });

    // Input field animations
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Remember me checkbox animation
    const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');
    rememberMeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            e.target.classList.add('checked');
        } else {
            e.target.classList.remove('checked');
        }
    });

    // Add smooth transitions for form elements
    const formElements = loginForm.querySelectorAll('input, button, a');
    formElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });
}); 