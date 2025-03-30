document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year and last modified date
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;

    // Hamburger menu functionality
    const menuIcon = document.querySelector('.menu-icon');
    const navUl = document.querySelector('nav ul');
    
    menuIcon.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    // Load attractions data
    fetch('data/attractions.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('attractions-container');
            data.forEach(attraction => {
                const card = document.createElement('div');
                card.className = 'attraction-card';
                card.innerHTML = `
                    <h2>${attraction.name}</h2>
                    <figure>
                        <img src="${attraction.image}" alt="${attraction.name}" loading="lazy">
                    </figure>
                    <address>${attraction.address}</address>
                    <p>${attraction.description}</p>
                    <button>Learn More</button>
                `;
                container.appendChild(card);
            });
        });

    // Visit tracking
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = new Date();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = new Date(lastVisit);
        const timeDiff = currentVisit - lastVisitDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            visitMessage.textContent = `You last visited ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentVisit);
});