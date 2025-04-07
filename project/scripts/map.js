

document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;


// Mobile navigation elements
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mainNav = document.querySelector('.main-nav');
const hamburgerIcon = hamburgerBtn.querySelector('i');

// Toggle mobile menu
function toggleMenu() {
    mainNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    if (mainNav.classList.contains('active')) {
        hamburgerIcon.classList.replace('fa-bars', 'fa-times');
    } else {
        hamburgerIcon.classList.replace('fa-times', 'fa-bars');
    }
}

// Close mobile menu
function closeMenu() {
    mainNav.classList.remove('active');
    document.body.classList.remove('no-scroll');
    hamburgerIcon.classList.replace('fa-times', 'fa-bars');
}

// Event listeners for mobile menu
hamburgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== hamburgerBtn) {
        closeMenu();
    }
});

// Close menu when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMenu();
    }
});


function adjustCoords(coords) {
    const naturalWidth = mapImg.naturalWidth;
    const naturalHeight = mapImg.naturalHeight;
    const displayWidth = mapImg.width; // Changed from offsetWidth to width
    const displayHeight = mapImg.height; // Changed from offsetHeight to height
    
    return [
        (coords[0] / naturalWidth) * displayWidth,
        (coords[1] / naturalHeight) * displayHeight,
        (coords[2] / naturalWidth) * displayWidth,
        (coords[3] / naturalHeight) * displayHeight
    ];
}

// Add this to handle window resize:
window.addEventListener('resize', function() {
    highlight.style.opacity = '0';
    // Force recalculate image dimensions
    mapImg.width = mapImg.offsetWidth;
    mapImg.height = mapImg.offsetHeight;
});