// Get the modal element
const driversnoteModal = document.getElementById('driversnoteModal'); // Make sure this matches your modal's ID

// Add event listener for when modal opens
driversnoteModal.addEventListener('show.bs.modal', loadDriversnoteContent);

async function loadDriversnoteContent() {
    try {
        const response = await fetch('work/driversnote.md');
        const markdown = await response.text();
        
        // Using marked.js to convert markdown to HTML
        const htmlContent = marked.parse(markdown);
        document.getElementById('driversnoteContent').innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading markdown:', error);
        document.getElementById('driversnoteContent').innerHTML = 'Error loading content';
    }
}