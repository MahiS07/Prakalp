// DOM Elements
const videoReels = document.querySelectorAll('.video-reel');
const videoContainers = document.querySelectorAll('.video-container');
let currentVideoIndex = 0;
let currentlyPlayingVideo = null;

// Function to pause all videos except the specified one
function pauseAllVideosExcept(currentVideo) {
    videoReels.forEach(reel => {
        const video = reel.querySelector('video');
        if (video !== currentVideo) {
            video.pause();
            video.currentTime = 0;
        }
    });
}

// Function to show only the current video
function showCurrentVideo() {
    videoReels.forEach((reel, index) => {
        if (index === currentVideoIndex) {
            reel.classList.add('active');
            const video = reel.querySelector('video');
            video.muted = false;
            video.play();
        } else {
            reel.classList.remove('active');
            const video = reel.querySelector('video');
            video.muted = true;
            video.pause();
        }
    });
}

// Initialize by showing the first video
showCurrentVideo();

// Video Controls
videoReels.forEach((reel, index) => {
    const video = reel.querySelector('video');
    const overlay = reel.querySelector('.video-overlay');
    const volumeSlider = reel.querySelector('.volume-slider');
    const volumeBtn = reel.querySelector('.volume-btn');
    
    // Set initial volume
    video.volume = volumeSlider.value;
    
    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value;
        updateVolumeIcon(volumeBtn, video.volume);
    });
    
    // Volume button click
    volumeBtn.addEventListener('click', () => {
        if (video.volume > 0) {
            video.volume = 0;
            volumeSlider.value = 0;
        } else {
            video.volume = 1;
            volumeSlider.value = 1;
        }
        updateVolumeIcon(volumeBtn, video.volume);
    });
    
    // Play/Pause on click
    reel.addEventListener('click', () => {
        if (video.paused) {
            pauseAllVideosExcept(video);
            video.play();
            currentlyPlayingVideo = video;
            overlay.style.opacity = '0';
        } else {
            video.pause();
            currentlyPlayingVideo = null;
            overlay.style.opacity = '1';
        }
    });
    
    // Show overlay on hover
    reel.addEventListener('mouseenter', () => {
        if (!video.paused) {
            overlay.style.opacity = '1';
        }
    });
    
    reel.addEventListener('mouseleave', () => {
        if (!video.paused) {
            overlay.style.opacity = '0';
        }
    });
    
    // Handle video loading
    video.addEventListener('loadstart', () => {
        video.classList.add('loading');
    });
    
    video.addEventListener('loadeddata', () => {
        video.classList.remove('loading');
    });
    
    // Handle video errors
    video.addEventListener('error', () => {
        console.error('Error loading video:', video.src);
        video.classList.remove('loading');
    });

    // Fullscreen functionality
    reel.addEventListener('dblclick', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            reel.requestFullscreen();
            currentVideoIndex = index;
        }
    });
});

// Function to update volume icon based on volume level
function updateVolumeIcon(btn, volume) {
    const icon = btn.querySelector('i');
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function navigateVideos(direction) {
    if (direction === 'up' && currentVideoIndex > 0) {
        currentVideoIndex--;
    } else if (direction === 'down' && currentVideoIndex < videoReels.length - 1) {
        currentVideoIndex++;
    }

    showCurrentVideo();
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        navigateVideos('up');
    } else if (e.key === 'ArrowDown') {
        navigateVideos('down');
    } else if (document.fullscreenElement) {
        const videos = Array.from(videoReels);
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (currentVideoIndex > 0) {
                    currentVideoIndex--;
                    videos[currentVideoIndex].scrollIntoView({ behavior: 'smooth' });
                    const video = videos[currentVideoIndex].querySelector('video');
                    pauseAllVideosExcept(video);
                    video.play();
                    currentlyPlayingVideo = video;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (currentVideoIndex < videos.length - 1) {
                    currentVideoIndex++;
                    videos[currentVideoIndex].scrollIntoView({ behavior: 'smooth' });
                    const video = videos[currentVideoIndex].querySelector('video');
                    pauseAllVideosExcept(video);
                    video.play();
                    currentlyPlayingVideo = video;
                }
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }
});

// Like Button Functionality
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.querySelector('.fa-heart')) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const count = btn.querySelector('span');
            
            if (icon.classList.contains('text-red-500')) {
                icon.classList.remove('text-red-500');
                count.textContent = (parseInt(count.textContent) - 1).toString();
            } else {
                icon.classList.add('text-red-500');
                count.textContent = (parseInt(count.textContent) + 1).toString();
            }
        });
    }
});

// Share Button Functionality
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.querySelector('.fa-share')) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Implement share functionality here
            console.log('Share button clicked');
        });
    }
}); 