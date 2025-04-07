document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;

    // Mobile navigation elements
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');
    const hamburgerIcon = hamburgerBtn.querySelector('i');

    // Toggle mobile menu
    function toggleMenu() {
        mainNav.classList.toggle('active');
        if (mainNav.classList.contains('active')) {
            hamburgerIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        }
    }

    // Close mobile menu
    function closeMenu() {
        mainNav.classList.remove('active');
        hamburgerIcon.classList.replace('fa-times', 'fa-bars');
    }

    // Event listeners for mobile menu
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function() {
        if (mainNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Prevent menu from closing when clicking inside it
    mainNav.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Load time zone data
    fetch('scripts/timezone.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const time_zones = data.time_zones;
            populate_table(time_zones);
            create_alphabet_links(time_zones);
            setup_search(time_zones);
        })
        .catch(error => {
            console.error('Error loading time zone data:', error);
            // You might want to display an error message to the user here
        });

    // Populate the table with time zone data
    function populate_table(time_zones) {
        const table_body = document.getElementById('timezone-table-body');
        table_body.innerHTML = '';

        if (!time_zones || time_zones.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-data">No time zone data available</td>';
            table_body.appendChild(row);
            return;
        }

        time_zones.forEach(tz => {
            const row = document.createElement('tr');
            
            const abbr_cell = document.createElement('td');
            abbr_cell.textContent = tz.abbreviation;
            abbr_cell.className = 'abbreviation';
            row.appendChild(abbr_cell);
            
            const name_cell = document.createElement('td');
            name_cell.textContent = tz.name;
            row.appendChild(name_cell);
            
            const location_cell = document.createElement('td');
            location_cell.textContent = tz.location;
            row.appendChild(location_cell);
            
            const offset_cell = document.createElement('td');
            offset_cell.textContent = tz.offset;
            row.appendChild(offset_cell);
            
            table_body.appendChild(row);
        });
    }

    // Create alphabet links for quick navigation
    function create_alphabet_links(time_zones) {
        const alphabet_links = document.getElementById('alphabet-links');
        alphabet_links.innerHTML = '';
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        alphabet.forEach(letter => {
            const link = document.createElement('a');
            link.href = `#${letter}`;
            link.textContent = letter;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scroll_to_letter(letter, time_zones);
            });
            alphabet_links.appendChild(link);
            
            // Add separator (except after last letter)
            if (letter !== 'Z') {
                alphabet_links.appendChild(document.createTextNode(' | '));
            }
        });
    }

    // Scroll to the first occurrence of a time zone starting with the specified letter
    function scroll_to_letter(letter, time_zones) {
        const table_body = document.getElementById('timezone-table-body');
        const rows = table_body.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const abbr = rows[i].querySelector('.abbreviation')?.textContent;
            if (abbr && abbr.startsWith(letter)) {
                // Remove any existing highlights
                document.querySelectorAll('.highlight-row').forEach(row => {
                    row.classList.remove('highlight-row');
                });
                
                // Add highlight to current row
                rows[i].classList.add('highlight-row');
                
                // Scroll to the row
                rows[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                break;
            }
        }
    }

    // Set up search functionality
    function setup_search(time_zones) {
        const search_input = document.getElementById('search-input');
        const search_button = document.getElementById('search-button');
        
        function perform_search() {
            const search_term = search_input.value.trim().toLowerCase();
            if (!search_term) {
                populate_table(time_zones);
                return;
            }
            
            const filtered = time_zones.filter(tz => {
                return (
                    tz.abbreviation.toLowerCase().includes(search_term) ||
                    tz.name.toLowerCase().includes(search_term) ||
                    tz.location.toLowerCase().includes(search_term) ||
                    tz.offset.toLowerCase().includes(search_term)
                );
            });
            
            populate_table(filtered);
            
            if (filtered.length > 0) {
                document.querySelector('tbody tr')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        search_button.addEventListener('click', perform_search);
        search_input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                perform_search();
            }
        });
    }
});