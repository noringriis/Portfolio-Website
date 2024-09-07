document.addEventListener('DOMContentLoaded', function() {
    const snippetsContainer = document.getElementById('snippets-container');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    let snippetsData = [];

    // Function to fetch image data
    async function fetchSnippetsData() {
        try {
            const response = await fetch('images/snippets/');
            console.log('Fetch response:', response);
            const text = await response.text();
            console.log('Fetched text:', text);
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, 'text/html');
            const links = htmlDoc.getElementsByTagName('a');
            console.log('Found links:', links);
            
            snippetsData = Array.from(links)
                .filter(link => link.href.match(/\.(jpe?g|png|gif)$/i))
                .map(link => ({
                    name: link.textContent,
                    url: link.href,
                    date: new Date(link.nextElementSibling.textContent)
                }));
            console.log('Processed snippetsData:', snippetsData);

            snippetsData.sort((a, b) => b.date - a.date);
            console.log('Sorted snippetsData:', snippetsData);

            displaySnippets('all');
        } catch (error) {
            console.error('Error fetching snippets:', error);
        }
    }

    // Function to display snippets
    function displaySnippets(filter) {
        snippetsContainer.innerHTML = '';
        snippetsData.forEach(snippet => {
            if (filter === 'all' || snippet.name.includes(filter + '_')) {
                const img = document.createElement('img');
                img.src = snippet.url;
                img.alt = snippet.name;
                img.className = 'img-fluid mb-3';
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
    snippetsModal.addEventListener('show.bs.modal', fetchSnippetsData);
});
