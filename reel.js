document.addEventListener('DOMContentLoaded', () => {
    const reelsContainer = document.querySelector('.reels-container');
    const reels = document.querySelectorAll('.reel-item');
    const prevBtn = document.querySelector('#prev-reel');
    const nextBtn = document.querySelector('#next-reel');
    const actionBtns = document.querySelectorAll('.action-btn');
    
    let currentReelIndex = 0;
    let isTransitioning = false;
    
    // Initialize first reel
    reels[0].classList.add('active');
    
    // Handle navigation
    function showReel(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const currentReel = reels[currentReelIndex];
        const nextReel = reels[index];
        
        // Update classes for transition
        currentReel.classList.remove('active');
        currentReel.classList.add('prev');
        
        nextReel.classList.add('active');
        
        // Play video
        const video = nextReel.querySelector('video');
        video.currentTime = 0;
        video.play().catch(e => console.log('Video autoplay failed:', e));
        
        // Pause other videos
        reels.forEach((reel, i) => {
            if (i !== index) {
                const otherVideo = reel.querySelector('video');
                otherVideo.pause();
            }
        });
        
        // Reset transition state after animation
        setTimeout(() => {
            currentReel.classList.remove('prev');
            isTransitioning = false;
        }, 500);
        
        currentReelIndex = index;
    }
    
    // Next reel
    nextBtn.addEventListener('click', () => {
        const nextIndex = (currentReelIndex + 1) % reels.length;
        showReel(nextIndex);
    });
    
    // Previous reel
    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentReelIndex - 1 + reels.length) % reels.length;
        showReel(prevIndex);
    });
    
    // Handle action buttons
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            const action = btn.querySelector('span').textContent.toLowerCase();
            
            switch(action) {
                case 'like':
                    btn.classList.toggle('liked');
                    if (btn.classList.contains('liked')) {
                        icon.style.color = '#ff0000';
                    } else {
                        icon.style.color = '#ffffff';
                    }
                    break;
                case 'share':
                    // In a real app, this would open a share dialog
                    alert('Share functionality would be implemented here');
                    break;
                case 'save':
                    btn.classList.toggle('saved');
                    if (btn.classList.contains('saved')) {
                        icon.style.color = '#00ff00';
                    } else {
                        icon.style.color = '#ffffff';
                    }
                    break;
            }
        });
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            const prevIndex = (currentReelIndex - 1 + reels.length) % reels.length;
            showReel(prevIndex);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            const nextIndex = (currentReelIndex + 1) % reels.length;
            showReel(nextIndex);
        }
    });
    
    // Handle touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    reelsContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    reelsContainer.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = touchStartY - touchEndY;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe up
                const nextIndex = (currentReelIndex + 1) % reels.length;
                showReel(nextIndex);
            } else {
                // Swipe down
                const prevIndex = (currentReelIndex - 1 + reels.length) % reels.length;
                showReel(prevIndex);
            }
        }
    }
    
    // Auto-play videos when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('video');
                if (video) {
                    video.play().catch(e => console.log('Video autoplay failed:', e));
                }
            } else {
                const video = entry.target.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.5 });
    
    reels.forEach(reel => observer.observe(reel));
}); 