document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
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

    // Weather API functionality
    const apiKey = 'd81da99496e45367a52401f4c1b425d9';
    const searchInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-weather');
    const unitElements = document.querySelectorAll('.unit');
    let currentUnit = 'c'; // Default to Celsius

    // Unit toggle functionality
    unitElements.forEach(unit => {
        unit.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.unit.active').classList.remove('active');
                this.classList.add('active');
                currentUnit = this.dataset.unit;
                // Convert temperatures if we have weather data
                const currentTemp = document.getElementById('current-temp');
                if (currentTemp.dataset.c && currentTemp.dataset.f) {
                    currentTemp.textContent = currentUnit === 'c' ? currentTemp.dataset.c : currentTemp.dataset.f;
                }
                // Convert forecast temperatures
                document.querySelectorAll('.forecast-temp span').forEach(span => {
                    if (span.classList.contains('forecast-high')) {
                        span.textContent = currentUnit === 'c' ? span.dataset.c + '°' : span.dataset.f + '°';
                    } else {
                        span.textContent = currentUnit === 'c' ? span.dataset.c + '°' : span.dataset.f + '°';
                    }
                });
            }
        });
    });

    // Search weather function
    function searchWeather() {
        const location = searchInput.value.trim();
        if (!location) return;

        // Show loading state
        document.getElementById('location').textContent = 'Loading...';
        document.getElementById('current-temp').textContent = '--';
        document.getElementById('conditions').textContent = '--';
        document.getElementById('humidity').textContent = '--';
        document.getElementById('wind-speed').textContent = '--';
        document.getElementById('weather-icon').textContent = '';
        document.getElementById('forecast-cards').innerHTML = '<p>Loading forecast...</p>';

        // First, get coordinates for the location
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(locationData => {
                if (locationData.length === 0) {
                    throw new Error('Location not found');
                }
                const { lat, lon } = locationData[0];
                return Promise.all([
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&cnt=24`)
                ]);
            })
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([currentData, forecastData]) => {
                updateWeatherDisplay(currentData, forecastData);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                document.getElementById('location').textContent = 'Error: ' + error.message;
                document.getElementById('forecast-cards').innerHTML = '<p>Could not load forecast</p>';
            });
    }

    // Update the weather display with data
    function updateWeatherDisplay(currentData, forecastData) {
        // Current weather
        const location = `${currentData.name}, ${currentData.sys.country || ''}`;
        const tempC = Math.round(currentData.main.temp);
        const tempF = Math.round((tempC * 9/5) + 32);
        const windKph = Math.round(currentData.wind.speed * 3.6);
        const windMph = Math.round(currentData.wind.speed * 2.237);
        const weatherIcon = getWeatherIcon(currentData.weather[0].id);

        document.getElementById('location').textContent = location;
        const currentTempElement = document.getElementById('current-temp');
        currentTempElement.textContent = currentUnit === 'c' ? tempC : tempF;
        currentTempElement.dataset.c = tempC;
        currentTempElement.dataset.f = tempF;
        document.getElementById('conditions').textContent = currentData.weather[0].description;
        document.getElementById('humidity').textContent = currentData.main.humidity;
        document.getElementById('wind-speed').textContent = currentUnit === 'c' ? `${windKph} km/h` : `${windMph} mph`;
        document.getElementById('weather-icon').textContent = weatherIcon;

        // Forecast - we'll use the first forecast for each of the next 3 days
        const forecastContainer = document.getElementById('forecast-cards');
        forecastContainer.innerHTML = '';

        // Group forecasts by day
        const dailyForecasts = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString(undefined, { weekday: 'short' });
            
            if (!dailyForecasts[dayKey]) {
                dailyForecasts[dayKey] = {
                    day: dayKey,
                    high_c: Math.round(item.main.temp_max),
                    low_c: Math.round(item.main.temp_min),
                    high_f: Math.round((item.main.temp_max * 9/5) + 32),
                    low_f: Math.round((item.main.temp_min * 9/5) + 32),
                    condition: item.weather[0].description,
                    icon: getWeatherIcon(item.weather[0].id)
                };
            } else {
                // Update highs and lows
                dailyForecasts[dayKey].high_c = Math.max(dailyForecasts[dayKey].high_c, Math.round(item.main.temp_max));
                dailyForecasts[dayKey].high_f = Math.max(dailyForecasts[dayKey].high_f, Math.round((item.main.temp_max * 9/5) + 32));
                dailyForecasts[dayKey].low_c = Math.min(dailyForecasts[dayKey].low_c, Math.round(item.main.temp_min));
                dailyForecasts[dayKey].low_f = Math.min(dailyForecasts[dayKey].low_f, Math.round((item.main.temp_min * 9/5) + 32));
            }
        });

        // Display forecast (skip today if it's included)
        const forecastDays = Object.values(dailyForecasts).slice(0, 3);
        forecastDays.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            forecastCard.innerHTML = `
                <h3>${day.day}</h3>
                <div class="forecast-icon">${day.icon}</div>
                <p>${day.condition}</p>
                <div class="forecast-temp">
                    <span class="forecast-high" data-c="${day.high_c}" data-f="${day.high_f}">
                        ${currentUnit === 'c' ? day.high_c + '°' : day.high_f + '°'}
                    </span>
                    <span data-c="${day.low_c}" data-f="${day.low_f}">
                        ${currentUnit === 'c' ? day.low_c + '°' : day.low_f + '°'}
                    </span>
                </div>
            `;
            forecastContainer.appendChild(forecastCard);
        });
    }

    // Get appropriate weather icon based on OpenWeatherMap condition code
    function getWeatherIcon(conditionCode) {
        if (conditionCode >= 200 && conditionCode < 300) return '⛈️'; // Thunderstorm
        if (conditionCode >= 300 && conditionCode < 400) return '🌧️'; // Drizzle
        if (conditionCode >= 500 && conditionCode < 600) return '🌧️'; // Rain
        if (conditionCode >= 600 && conditionCode < 700) return '❄️'; // Snow
        if (conditionCode >= 700 && conditionCode < 800) return '🌫️'; // Atmosphere (fog, etc.)
        if (conditionCode === 800) return '☀️'; // Clear
        if (conditionCode === 801) return '🌤️'; // Few clouds
        if (conditionCode === 802) return '⛅'; // Scattered clouds
        if (conditionCode === 803 || conditionCode === 804) return '☁️'; // Broken or overcast clouds
        return '🌈'; // Default
    }

    // Event listeners for weather search
    searchButton.addEventListener('click', searchWeather);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    
    searchWeather();
});