document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = searchInput.value.trim();
        
        if (searchQuery) {
            // Redirect to index.html with the search query as a parameter
            window.location.href = `index.html?search=${encodeURIComponent(searchQuery)}`;
        }
    });

    // Add some interactivity to the search input
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.classList.add('ring-2', 'ring-blue-500');
    });

    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.classList.remove('ring-2', 'ring-blue-500');
    });
}); 