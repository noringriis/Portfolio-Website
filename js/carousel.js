document.addEventListener('DOMContentLoaded', function() {
    const carouselInner = document.querySelector('#heroCarousel .carousel-inner');
    const imageFolder = 'images/carousels/hero/';
    const imagePrefix = 'image';
    const imageExtension = '.jpg';
    const numberOfImages = 10; // Set this to the number of images in your folder

    // Function to create carousel items
    function createCarouselItems() {
        for (let i = 1; i <= numberOfImages; i++) {
            const item = document.createElement('div');
            item.className = `carousel-item ${i === 1 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = `${imageFolder}${imagePrefix}${i}${imageExtension}`;
            img.className = 'd-block w-100';
            img.alt = `Carousel image ${i}`;
            
            // Add error handling in case an image doesn't exist
            img.onerror = function() {
                this.parentElement.remove();
            };
            
            item.appendChild(img);
            carouselInner.appendChild(item);
        }
    }

    // Create carousel items
    createCarouselItems();

    // Initialize carousel
    new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 3000, // Change slide every 3 seconds
        wrap: true // Continuously loop
    });
});
