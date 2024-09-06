document.addEventListener('DOMContentLoaded', function() {
    const carouselInner = document.querySelector('#heroCarousel .carousel-inner');
    const imageDirectory = 'carousels/hero/';
    
    // Function to fetch and sort image files
    async function getImageFiles() {
        const response = await fetch(imageDirectory);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.match(/\.(jpe?g|png|gif)$/i))
            .map(a => a.href)
            .sort();
        return links;
    }

    // Function to create carousel items
    function createCarouselItem(imageSrc, isActive) {
        const item = document.createElement('div');
        item.className = `carousel-item ${isActive ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'd-block w-100';
        img.alt = 'Carousel Image';
        item.appendChild(img);
        return item;
    }

    // Load images and set up carousel
    getImageFiles().then(images => {
        images.forEach((image, index) => {
            const item = createCarouselItem(image, index === 0);
            carouselInner.appendChild(item);
        });

        // Initialize Bootstrap carousel
        new bootstrap.Carousel(document.getElementById('heroCarousel'), {
            interval: 3000
        });
    });
});
