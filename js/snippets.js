document.addEventListener('DOMContentLoaded', function() {
    loadSnippets();
    initializeSnippetsCarousel();
});

function loadSnippets() {
    fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('snippets-container');
            data.forEach(snippet => {
                const img = document.createElement('img');
                img.src = snippet.url;
                img.alt = snippet.categories[0] || 'Snippet Image';
                img.className = 'snippet-image img-fluid mb-3'; // Add these classes
                img.dataset.categories = JSON.stringify(snippet.categories);
                container.appendChild(img);
            });
            updateFilterCounts();
        })
        .catch(error => console.error('Error:', error));
}

function createFilterButton(filter, text) {
    const button = document.createElement('button');
    button.className = 'btn';
    button.setAttribute('data-filter', filter);
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    button.appendChild(textSpan);
    
    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.textContent = '0'; // This will be updated when we count the snippets
    button.appendChild(countSpan);
    
    return button;
}

function filterSnippets(filter) {
    const snippets = document.querySelectorAll('#snippets-container img');
    snippets.forEach(snippet => {
        const categories = JSON.parse(snippet.dataset.categories);
        if (filter === 'all' || categories.includes(filter)) {
            snippet.style.display = '';
        } else {
            snippet.style.display = 'none';
        }
    });
}

function updateActiveButton(activeButton) {
    document.querySelectorAll('.filter-buttons .btn').forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function updateFilterCounts() {
    const snippets = document.querySelectorAll('#snippets-container img');
    const countMap = new Map();
    
    snippets.forEach(snippet => {
        const categories = JSON.parse(snippet.dataset.categories);
        categories.forEach(category => {
            countMap.set(category, (countMap.get(category) || 0) + 1);
        });
    });
    
    document.querySelectorAll('.filter-buttons .btn').forEach(button => {
        const filter = button.getAttribute('data-filter');
        const count = filter === 'all' ? snippets.length : (countMap.get(filter) || 0);
        button.querySelector('.count').textContent = count;
    });
}

// Call updateFilterCounts after loading snippets
function loadSnippets() {
    fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('snippets-container');
            const filterButtons = document.querySelector('.filter-buttons');
            
            // Clear existing content
            container.innerHTML = '';
            filterButtons.innerHTML = '';
            
            // Add "All" button
            const allButton = createFilterButton('all', 'All');
            filterButtons.appendChild(allButton);
            
            // Get unique categories
            const categories = [...new Set(data.flatMap(snippet => snippet.categories))];
            
            // Create filter buttons
            categories.forEach(category => {
                const button = createFilterButton(category, category);
                filterButtons.appendChild(button);
            });
            
            // Add event listeners to filter buttons
            document.querySelectorAll('.filter-buttons .btn').forEach(button => {
                button.addEventListener('click', function() {
                    filterSnippets(this.getAttribute('data-filter'));
                    updateActiveButton(this);
                });
            });
            
            // Load snippets
            data.forEach(snippet => {
                const img = document.createElement('img');
                img.src = snippet.url;
                img.alt = snippet.categories[0] || 'Snippet Image';
                img.className = 'img-fluid mb-3';
                img.dataset.categories = JSON.stringify(snippet.categories);
                container.appendChild(img);
            });
            
            updateFilterCounts(); // Add this line
            
            // Activate "All" button by default
            document.querySelector('.filter-buttons .btn[data-filter="all"]').click();
        })
        .catch(error => console.error('Error loading snippets:', error));
}

// Update the snippets count in the "View all snippets" button
const snippetsCount = document.getElementById('snippetsCount');
if (snippetsCount) {
    snippetsCount.textContent = data.length;
}

// Any other existing functions in your snippets.js file

function initializeSnippetsCarousel() {
    const carouselInner = document.querySelector('#snippetsCarousel .carousel-inner');
    fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
            // Take only the first 5 snippets
            const firstFiveSnippets = data.slice(0, 5);
            
            firstFiveSnippets.forEach((snippet, index) => {
                const item = document.createElement('div');
                item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                
                const img = document.createElement('img');
                img.src = snippet.url;
                img.className = 'd-block w-100';
                img.alt = `Snippet image ${index + 1}`;
                
                item.appendChild(img);
                carouselInner.appendChild(item);
            });

            // Initialize carousel
            new bootstrap.Carousel(document.getElementById('snippetsCarousel'), {
                interval: 2000,
                wrap: true,
                pause: false,
                ride: 'carousel',
                touch: false
            });
        })
        .catch(error => console.error('Error loading snippets for carousel:', error));
}

function updateSnippetsCount() {
    const allButton = document.querySelector('.filter-buttons .btn[data-filter="all"]');
    const snippetsCount = document.getElementById('snippetsCount');
    if (allButton && snippetsCount) {
        snippetsCount.textContent = allButton.querySelector('.count').textContent;
    }
}
