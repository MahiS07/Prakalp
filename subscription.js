document.addEventListener('DOMContentLoaded', function() {
    // Get all subscription cards
    const subscriptionCards = document.querySelectorAll('.subscription-card');
    
    // Add click event listeners to all subscription cards
    subscriptionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button
            if (e.target.tagName === 'BUTTON') return;
            
            // Find the button within this card
            const button = this.querySelector('button');
            if (button) {
                button.click();
            }
        });
    });

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to price elements
    const priceElements = document.querySelectorAll('.text-3xl');
    priceElements.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        price.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click handlers for subscription buttons
    const subscriptionButtons = document.querySelectorAll('.subscription-card button');
    subscriptionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            
            // Get the plan name from the card
            const planName = this.closest('.subscription-card').querySelector('h3').textContent;
            
            // Show a confirmation message (you can replace this with your actual subscription logic)
            const message = `Thank you for choosing the ${planName}! Redirecting to payment...`;
            alert(message);
            
            // Here you would typically redirect to a payment page
            // window.location.href = '/payment.html?plan=' + encodeURIComponent(planName);
        });
    });

    // Add intersection observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all subscription and feature cards
    document.querySelectorAll('.subscription-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Add the fade-in class when element is visible
    document.addEventListener('scroll', function() {
        document.querySelectorAll('.subscription-card, .feature-card').forEach(card => {
            if (card.classList.contains('fade-in')) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    });
}); 