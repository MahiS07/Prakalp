/**
 * Panel Resize Functionality
 * Handles smooth resizing of panels with draggable handles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set up resize handlers for all panels with resize-x class
    setupResizeHandlers();
    
    // Setup double-click to reset sizes
    setupDoubleClickReset();
});

/**
 * Sets up resize handlers for panels with resize-x class
 */
function setupResizeHandlers() {
    const panels = document.querySelectorAll('.resize-x');
    let isResizing = false;
    let currentPanel = null;
    let startX, startWidth, minWidth, maxWidth;
    let neighborPanel = null;
    let neighborStartWidth = 0;
    
    // Create resize handles for panels
    panels.forEach(panel => {
        // Create resize handle if it doesn't exist
        if (!panel.querySelector('.resize-handle-x')) {
            const handle = document.createElement('div');
            handle.className = 'resize-handle-x';
            panel.appendChild(handle);
        }
    });
    
    // Get all resize handles
    const handles = document.querySelectorAll('.resize-handle-x');
    
    // Add mouse events to handles
    handles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
    });
    
    document.addEventListener('mousemove', resizePanel);
    document.addEventListener('mouseup', stopResize);
    
    // Handle touch events for mobile
    handles.forEach(handle => {
        handle.addEventListener('touchstart', startResizeTouch);
    });
    
    document.addEventListener('touchmove', resizePanelTouch);
    document.addEventListener('touchend', stopResize);
    
    /**
     * Starts the resize operation
     */
    function startResize(e) {
        e.preventDefault();
        isResizing = true;
        currentPanel = this.parentNode;
        
        // Find the next or previous panel (depends on which handle is being dragged)
        neighborPanel = currentPanel.nextElementSibling;
        if (!neighborPanel || !neighborPanel.classList.contains('resize-x')) {
            neighborPanel = currentPanel.previousElementSibling;
        }
        
        // Get initial sizes
        startX = e.clientX;
        startWidth = currentPanel.offsetWidth;
        minWidth = parseInt(window.getComputedStyle(currentPanel).minWidth) || 200;
        maxWidth = window.innerWidth * 0.8; // Max 80% of window width
        
        if (neighborPanel) {
            neighborStartWidth = neighborPanel.offsetWidth;
        }
        
        // Add active class to handle
        this.classList.add('active');
        
        // Disable transitions during drag for smooth resize
        document.body.classList.add('resizing');
    }
    
    /**
     * Handles touch start for mobile devices
     */
    function startResizeTouch(e) {
        const touch = e.touches[0];
        e.clientX = touch.clientX;
        startResize.call(this, e);
    }
    
    /**
     * Resizes the panel based on mouse movement
     */
    function resizePanel(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        let newWidth = startWidth + deltaX;
        
        // Constrain to min/max width
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        
        currentPanel.style.width = newWidth + 'px';
        
        // Adjust neighbor panel if exists
        if (neighborPanel) {
            const neighborNewWidth = neighborStartWidth - deltaX;
            if (neighborNewWidth > minWidth) {
                neighborPanel.style.width = neighborNewWidth + 'px';
            }
        }
    }
    
    /**
     * Handles touch move for mobile devices
     */
    function resizePanelTouch(e) {
        if (!isResizing) return;
        
        const touch = e.touches[0];
        e.clientX = touch.clientX;
        resizePanel(e);
    }
    
    /**
     * Stops the resize operation
     */
    function stopResize() {
        if (!isResizing) return;
        
        isResizing = false;
        document.querySelectorAll('.resize-handle-x').forEach(handle => {
            handle.classList.remove('active');
        });
        
        // Re-enable transitions
        document.body.classList.remove('resizing');
        
        // Store size in local storage for persistence
        if (currentPanel) {
            const panelIndex = Array.from(panels).indexOf(currentPanel);
            localStorage.setItem(`panel-${panelIndex}-width`, currentPanel.style.width);
        }
    }
}

/**
 * Sets up double-click to reset panel sizes
 */
function setupDoubleClickReset() {
    const handles = document.querySelectorAll('.resize-handle-x');
    
    handles.forEach(handle => {
        handle.addEventListener('dblclick', resetPanelSize);
    });
    
    function resetPanelSize() {
        const panel = this.parentNode;
        const panels = document.querySelectorAll('.resize-x');
        const totalWidth = document.querySelector('main').offsetWidth;
        const equalWidth = totalWidth / panels.length;
        
        // Reset all panels to equal width
        panels.forEach(p => {
            p.style.width = equalWidth + 'px';
        });
        
        // Clear stored sizes
        panels.forEach((p, i) => {
            localStorage.removeItem(`panel-${i}-width`);
        });
    }
}

/**
 * Apply saved panel sizes on page load
 */
function applySavedPanelSizes() {
    const panels = document.querySelectorAll('.resize-x');
    
    panels.forEach((panel, index) => {
        const savedWidth = localStorage.getItem(`panel-${index}-width`);
        if (savedWidth) {
            panel.style.width = savedWidth;
        }
    });
}

// Apply saved sizes on load
window.addEventListener('load', applySavedPanelSizes);

// Handle window resize events
window.addEventListener('resize', function() {
    // Check if total panel width exceeds window width
    const panels = document.querySelectorAll('.resize-x');
    const totalWidth = Array.from(panels).reduce((sum, panel) => sum + panel.offsetWidth, 0);
    
    if (totalWidth > window.innerWidth) {
        // Reset panels to fit window
        const equalWidth = window.innerWidth / panels.length;
        panels.forEach(panel => {
            panel.style.width = equalWidth + 'px';
        });
    }
}); 