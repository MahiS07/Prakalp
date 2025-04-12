/**
 * Deep Learn Application JavaScript
 * Controls interactivity and video generation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSearchBar();
    initQuickSuggestions();
    initToggleButtons();
    initVideoGeneration();
    initOutputTabs();
    initFileUpload();
    setupAnimations();
});

/**
 * Initialize search bar functionality
 */
function initSearchBar() {
    const searchInput = document.querySelector('.search-container input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // Show loading indicator in search bar
            this.classList.add('searching');
            this.placeholder = 'Searching...';
            
            // Simulate search process
            setTimeout(() => {
                // Reset search bar
                this.classList.remove('searching');
                this.placeholder = 'Search for a topic...';
                
                // Trigger video generation
                document.getElementById('generate-btn').click();
            }, 1500);
        }
    });
    
    // Add clear search button
    const searchContainer = document.querySelector('.search-container .relative');
    const clearButton = document.createElement('i');
    clearButton.className = 'fas fa-times-circle absolute right-3 top-3 text-gray-400 cursor-pointer hidden';
    searchContainer.appendChild(clearButton);
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearButton.classList.remove('hidden');
        } else {
            clearButton.classList.add('hidden');
        }
    });
    
    // Clear search input on click
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        this.classList.add('hidden');
        searchInput.focus();
    });
}

/**
 * Initialize quick suggestions functionality
 */
function initQuickSuggestions() {
    const suggestions = document.querySelectorAll('.quick-suggestions span');
    const searchInput = document.querySelector('.search-container input');
    
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            // Set the search input value
            searchInput.value = this.textContent;
            
            // Show the clear button
            document.querySelector('.fa-times-circle').classList.remove('hidden');
            
            // Trigger the enter key press
            const enterEvent = new KeyboardEvent('keypress', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            searchInput.dispatchEvent(enterEvent);
        });
    });
}

/**
 * Initialize toggle buttons
 */
function initToggleButtons() {
    // Content type toggle
    const contentToggle = document.querySelector('.flex.items-center.justify-between.bg-gray-700 input');
    
    contentToggle.addEventListener('change', function() {
        // Update the label text color based on toggle state
        const engineering = this.parentNode.previousElementSibling;
        const competitive = this.parentNode.nextElementSibling;
        
        if (this.checked) {
            engineering.classList.add('text-gray-400');
            competitive.classList.add('text-white');
            engineering.classList.remove('text-white');
            competitive.classList.remove('text-gray-400');
        } else {
            engineering.classList.add('text-white');
            competitive.classList.add('text-gray-400');
            engineering.classList.remove('text-gray-400');
            competitive.classList.remove('text-white');
        }
    });
    
    // Analogies toggle
    const analogiesToggle = document.querySelector('.pt-2 input');
    
    analogiesToggle.addEventListener('change', function() {
        // Add a visual feedback when toggled
        const label = this.parentNode.nextElementSibling;
        
        if (this.checked) {
            label.classList.add('text-indigo-300');
            label.classList.remove('text-gray-300');
        } else {
            label.classList.add('text-gray-300');
            label.classList.remove('text-indigo-300');
        }
    });
}

/**
 * Initialize video generation functionality
 */
function initVideoGeneration() {
    const generateBtn = document.getElementById('generate-btn');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    generateBtn.addEventListener('click', function() {
        // Show loading animation
        this.disabled = true;
        this.classList.add('loading');
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
        
        // Simulate video generation (3 second delay)
        setTimeout(() => {
            // Update button state
            this.disabled = false;
            this.classList.remove('loading');
            this.innerHTML = '<i class="fas fa-play-circle mr-2"></i> Generate Video';
            
            // Replace placeholder with video
            videoPlaceholder.innerHTML = `
                <video id="video-player" class="w-full h-full object-cover" controls autoplay>
                    <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            
            // Apply the playback speed if set
            const videoPlayer = document.getElementById('video-player');
            const speedSelect = document.getElementById('speed-select');
            const speedValue = parseFloat(speedSelect.value);
            
            if (!isNaN(speedValue)) {
                videoPlayer.playbackRate = speedValue;
            }
            
            // Update flowchart view
            updateFlowchart();
            
            // Update notes view
            updateNotes();
            
            // Show quiz button after video ends
            videoPlayer.addEventListener('ended', function() {
                document.getElementById('quiz-section').classList.remove('hidden');
                document.getElementById('quiz-section').classList.add('animate-fade-in');
            });
            
            // Automatically show the quiz button after 10 seconds (for demo purposes)
            setTimeout(() => {
                document.getElementById('quiz-section').classList.remove('hidden');
                document.getElementById('quiz-section').classList.add('animate-fade-in');
            }, 10000);
        }, 3000);
    });
    
    // Handle speed selection
    document.getElementById('speed-select').addEventListener('change', function() {
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer && !videoPlayer.classList.contains('hidden')) {
            const speedValue = parseFloat(this.value);
            if (!isNaN(speedValue)) {
                videoPlayer.playbackRate = speedValue;
            }
        }
    });
}

/**
 * Initialize output tabs functionality
 */
function initOutputTabs() {
    const flowchartBtn = document.getElementById('flowchart-btn');
    const notesBtn = document.getElementById('notes-btn');
    const flowchartView = document.getElementById('flowchart-view');
    const notesView = document.getElementById('notes-view');
    
    flowchartBtn.addEventListener('click', function() {
        flowchartView.classList.remove('hidden');
        notesView.classList.add('hidden');
        
        this.classList.remove('bg-gray-800');
        this.classList.add('bg-indigo-600');
        notesBtn.classList.remove('bg-indigo-600');
        notesBtn.classList.add('bg-gray-800');
    });
    
    notesBtn.addEventListener('click', function() {
        notesView.classList.remove('hidden');
        flowchartView.classList.add('hidden');
        
        this.classList.remove('bg-gray-800');
        this.classList.add('bg-indigo-600');
        flowchartBtn.classList.remove('bg-indigo-600');
        flowchartBtn.classList.add('bg-gray-800');
    });
}

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    const fileInput = document.getElementById('pdf-upload');
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            const uploadContainer = document.querySelector('.upload-container');
            
            // Update the upload container with file info
            uploadContainer.innerHTML = `
                <i class="fas fa-check-circle text-4xl mb-3 text-green-400"></i>
                <p class="mb-1">${fileName} uploaded</p>
                <p class="text-xs text-gray-400 mb-3">File uploaded successfully</p>
                <button id="generate-from-pdf" class="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg">
                    <i class="fas fa-magic mr-2"></i> Generate Video
                </button>
            `;
            
            // Add event listener to the new button
            document.getElementById('generate-from-pdf').addEventListener('click', function() {
                // Trigger the generate video button
                document.getElementById('generate-btn').click();
            });
        }
    });
}

/**
 * Update the flowchart with dynamic content
 */
function updateFlowchart() {
    const flowchartView = document.getElementById('flowchart-view');
    let topic = document.querySelector('.search-container input').value;
    
    // If no topic is entered, use a default one
    if (!topic) {
        topic = 'Selected Topic';
    }
    
    flowchartView.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center p-4 flowchart-container">
            <div class="bg-indigo-800 p-3 rounded-lg mb-4 text-center w-48 shadow-lg hover:bg-indigo-700 transition-colors duration-300">
                <p class="font-bold">Start</p>
            </div>
            <i class="fas fa-arrow-down text-indigo-400 my-2"></i>
            <div class="bg-gray-700 p-3 rounded-lg mb-4 text-center w-64 shadow-md hover:bg-gray-600 transition-colors duration-300">
                <p>Introduction to ${topic}</p>
            </div>
            <i class="fas fa-arrow-down text-indigo-400 my-2"></i>
            <div class="bg-gray-700 p-3 rounded-lg mb-4 text-center w-64 shadow-md hover:bg-gray-600 transition-colors duration-300">
                <p>Key Concepts and Principles</p>
            </div>
            <i class="fas fa-arrow-down text-indigo-400 my-2"></i>
            <div class="bg-gray-700 p-3 rounded-lg mb-4 text-center w-64 shadow-md hover:bg-gray-600 transition-colors duration-300">
                <p>Practical Applications</p>
            </div>
            <i class="fas fa-arrow-down text-indigo-400 my-2"></i>
            <div class="bg-gray-700 p-3 rounded-lg mb-4 text-center w-64 shadow-md hover:bg-gray-600 transition-colors duration-300">
                <p>Advanced Techniques</p>
            </div>
            <i class="fas fa-arrow-down text-indigo-400 my-2"></i>
            <div class="bg-indigo-800 p-3 rounded-lg text-center w-48 shadow-lg hover:bg-indigo-700 transition-colors duration-300">
                <p class="font-bold">Conclusion</p>
            </div>
        </div>
    `;
    
    // Add animation to flowchart elements
    const flowchartItems = document.querySelectorAll('.flowchart-container > div');
    flowchartItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

/**
 * Update the notes with dynamic content
 */
function updateNotes() {
    const notesView = document.getElementById('notes-view');
    let topic = document.querySelector('.search-container input').value;
    
    // If no topic is entered, use a default one
    if (!topic) {
        topic = 'Selected Topic';
    }
    
    notesView.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md transform hover:translate-y-[-2px] transition-transform duration-300">
            <h3 class="font-bold text-indigo-400">Introduction to ${topic}</h3>
            <p class="text-sm text-gray-300">Overview of ${topic} and its relevance in the current landscape. This section covers the fundamental concepts and provides context for deeper understanding.</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md transform hover:translate-y-[-2px] transition-transform duration-300">
            <h3 class="font-bold text-indigo-400">Core Concepts</h3>
            <p class="text-sm text-gray-300">Explanation of the key principles and building blocks of ${topic}. This section breaks down complex ideas into easily digestible components.</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md transform hover:translate-y-[-2px] transition-transform duration-300">
            <h3 class="font-bold text-indigo-400">Practical Applications</h3>
            <p class="text-sm text-gray-300">Real-world examples and use cases demonstrating implementation of ${topic} in various contexts. Learn how these concepts apply to actual situations.</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md transform hover:translate-y-[-2px] transition-transform duration-300">
            <h3 class="font-bold text-indigo-400">Advanced Techniques</h3>
            <p class="text-sm text-gray-300">Deeper exploration of specialized methods and optimization strategies for ${topic}. This section is intended for those who want to master the subject.</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md transform hover:translate-y-[-2px] transition-transform duration-300">
            <h3 class="font-bold text-indigo-400">Summary and Next Steps</h3>
            <p class="text-sm text-gray-300">Recap of key points about ${topic} and suggestions for further learning. This section provides a roadmap for continued education on the subject.</p>
        </div>
    `;
    
    // Add animation to notes cards
    const noteCards = document.querySelectorAll('#notes-view > div');
    noteCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 300 + (index * 150));
    });
}

/**
 * Setup various animations for UI elements
 */
function setupAnimations() {
    // Header logo pulse animation
    const logo = document.querySelector('header .h-10.w-10');
    logo.classList.add('animate-pulse');
    
    // Add smooth transitions to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('transition-all', 'duration-300');
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('[class*="rounded-lg"]');
    cards.forEach(card => {
        if (!card.classList.contains('hover:')) {
            card.classList.add('hover:shadow-lg', 'transition-shadow', 'duration-300');
        }
    });
}

// Initialize everything when the page loads
window.addEventListener('load', function() {
    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
        document.body.classList.add('dark-theme');
    }
    
    // Apply any saved settings from localStorage
    applyUserPreferences();
});

/**
 * Apply user preferences from localStorage
 */
function applyUserPreferences() {
    // Apply saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
        const languageSelect = document.querySelector('select:nth-of-type(1)');
        languageSelect.value = savedLanguage;
    }
    
    // Save language preference when changed
    const languageSelect = document.querySelector('select:nth-of-type(1)');
    languageSelect.addEventListener('change', function() {
        localStorage.setItem('preferred-language', this.value);
    });
    
    // Apply saved duration preference
    const savedDuration = localStorage.getItem('preferred-duration');
    if (savedDuration) {
        const durationSelect = document.querySelector('select:nth-of-type(2)');
        durationSelect.value = savedDuration;
    }
    
    // Save duration preference when changed
    const durationSelect = document.querySelector('select:nth-of-type(2)');
    durationSelect.addEventListener('change', function() {
        localStorage.setItem('preferred-duration', this.value);
    });
} 