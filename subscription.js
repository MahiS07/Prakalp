document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips for feature icons
    const featureIcons = document.querySelectorAll('.features-list li i');
    featureIcons.forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = icon.getAttribute('data-tooltip');
        icon.parentElement.appendChild(tooltip);

        // Add hover events for tooltips
        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });

    // Handle subscription button clicks
    const subscriptionButtons = document.querySelectorAll('.pricing-btn');
    subscriptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.getAttribute('data-plan');
            const card = button.closest('.pricing-card');
            
            // Add loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            button.disabled = true;
            
            // Add pulse animation to the card
            card.style.animation = 'pulse 1s ease-in-out';
            
            // Simulate API call
            setTimeout(() => {
                // In a real application, this would redirect to a payment gateway
                console.log(`Selected plan: ${plan}`);
                
                // Reset button state
                button.innerHTML = 'Subscribe Now';
                button.disabled = false;
                
                // Remove pulse animation
                card.style.animation = '';
            }, 1500);
        });
    });

    // Handle FAQ item clicks
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        const icon = question.querySelector('i');
        
        // Initially hide all answers
        answer.style.maxHeight = '0';
        answer.style.marginTop = '0';
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('p');
                    const otherIcon = otherItem.querySelector('h4 i');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.marginTop = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current answer
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.marginTop = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = '200px';
                answer.style.marginTop = '1rem';
                icon.style.transform = 'rotate(180deg)';
                
                // Smooth scroll to the answer
                answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Add scroll animation for pricing cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });

    // Add hover effect for pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add pulse animation for featured plan
    const featuredCard = document.querySelector('.pricing-card.featured');
    if (featuredCard) {
        setInterval(() => {
            featuredCard.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                featuredCard.style.animation = '';
            }, 2000);
        }, 10000);
    }

    // Handle currency toggle if implemented
    const currencyToggle = document.querySelector('.currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', () => {
            const prices = document.querySelectorAll('.price');
            const currentCurrency = currencyToggle.getAttribute('data-currency');
            const newCurrency = currentCurrency === 'USD' ? 'INR' : 'USD';
            
            prices.forEach(price => {
                const usdAmount = price.getAttribute('data-usd');
                const inrAmount = price.getAttribute('data-inr');
                price.textContent = newCurrency === 'USD' ? `$${usdAmount}` : `₹${inrAmount}`;
            });
            
            currencyToggle.setAttribute('data-currency', newCurrency);
            currencyToggle.textContent = `Switch to ${currentCurrency}`;
        });
    }
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
        }
        70% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
        }
    }
`;
document.head.appendChild(style); 