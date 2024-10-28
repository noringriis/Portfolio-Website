document.addEventListener('DOMContentLoaded', function() {
    loadSnippets();
    initializeSnippetsCarousel();
});

function loadSnippets() {
    fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
            console.log('Loaded data:', data);

            const container = document.getElementById('snippets-container');
            const filterButtons = document.querySelector('.filter-buttons');
            
            // Clear existing content
            container.innerHTML = '';
            filterButtons.innerHTML = '';
            
            // Update the snippets count
            const snippetsCount = document.getElementById('snippetsCount');
            if (snippetsCount) {
                snippetsCount.textContent = data.length;
            }
            
            // Count categories
            const categoryCount = new Map();
            categoryCount.set('all', data.length);
            
            data.forEach(snippet => {
                snippet.categories.forEach(category => {
                    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
                });
            });
            
            console.log('Category counts:', Object.fromEntries(categoryCount));

            // Create buttons in the desired order
            const desiredOrder = ['all', 'User Interfaces', 'Web Design', 'Graphic Design', 'Illustrations'];
            desiredOrder.forEach((category, index) => {
                if (categoryCount.has(category)) {
                    const count = categoryCount.get(category);
                    const button = createFilterButton(category, category === 'all' ? 'All' : category);
                    button.querySelector('.count').textContent = count;
                    button.style.order = index; // Set the order using CSS
                    filterButtons.appendChild(button);
                    console.log(`Created button for ${category} with count ${count} and order ${index}`);
                }
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
            
            updateFilterCounts();
            
            // Activate "All" button by default
            document.querySelector('.filter-buttons .btn[data-filter="all"]').click();

            console.log('Final button order:', Array.from(filterButtons.children).map(btn => btn.textContent));
        })
        .catch(error => console.error('Error loading snippets:', error));
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

function initializeSnippetsCarousel() {
    const carouselInner = document.querySelector('#snippetsCarousel .carousel-inner');
    fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
            // The carousel will display the first 5 snippets in the .json file
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
