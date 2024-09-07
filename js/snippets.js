document.addEventListener('DOMContentLoaded', function() {
    const snippetsContainer = document.getElementById('snippets-container');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    let snippetsData = [];

    // Function to fetch image data
    async function fetchSnippetsData() {
        try {
            const response = await fetch('snippets.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            snippetsData = await response.json();
            console.log('Fetched snippets data:', snippetsData);
            updateFilterButtons();
                displaySnippets('all');
        } catch (error) {
            console.error('Error fetching snippets:', error);
            snippetsContainer.innerHTML = `<p>Error loading snippets: ${error.message}</p>`;
        }
    }

    // Function to update filter buttons
    function updateFilterButtons() {
        const categoryCounts = {
            'all': snippetsData.length
        };

        // Count snippets in each category
        snippetsData.forEach(snippet => {
            snippet.categories.forEach(category => {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
        });

        // Update button text and visibility
        filterButtons.forEach(button => {
            const category = button.dataset.filter;
            const count = categoryCounts[category] || 0;
            
            // Remove existing count span if it exists
            const existingCount = button.querySelector('.count');
            if (existingCount) {
                existingCount.remove();
            }

            // Get the original text (without the count)
            const originalText = button.textContent.trim();

            // Create a new span for the count
            const countSpan = document.createElement('span');
            countSpan.className = 'count small';
            countSpan.textContent = count;

            // Clear the button content and add the original text and new count span
            button.textContent = originalText + ' ';
            button.appendChild(countSpan);

            // Update visibility
            button.style.display = count > 0 ? '' : 'none';
        });
    }

    // Function to display snippets
    function displaySnippets(filter) {
        snippetsContainer.innerHTML = '';
        snippetsData.forEach((snippet, index) => {
            if (filter === 'all' || snippet.categories.includes(filter)) {
                const img = document.createElement('img');
                img.src = snippet.url;
                img.alt = `Snippet ${index + 1}`;
                img.className = 'img-fluid mb-3';
                img.onerror = function() {
                    console.error(`Failed to load image: ${snippet.url}`);
                    this.src = 'path/to/placeholder-image.jpg'; // Replace with an actual placeholder image path
                    this.alt = 'Image failed to load';
                };
                snippetsContainer.appendChild(img);
            }
        });
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displaySnippets(this.dataset.filter);
        });
    });

    // Fetch snippets data when the modal is shown
    const snippetsModal = document.getElementById('snippetsModal');
    let fetchedData = false;

    snippetsModal.addEventListener('show.bs.modal', function() {
        if (!fetchedData) {
            fetchSnippetsData();
            fetchedData = true;
        }
    });
});
