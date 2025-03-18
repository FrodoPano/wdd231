// Automatically update the year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Toggle the navigation menu
const menuIcon = document.querySelector('.menu-icon');
const navUl = document.querySelector('nav ul');

menuIcon.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

// Close the navigation menu when a link is clicked
navUl.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navUl.classList.remove('active');
    }
});

// Weather API Fetch and Display
const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const weatherDesc = document.querySelector("#weather-desc");
const weatherForecast = document.querySelector("#weather-forecast");

async function fetchWeather() {
    try {
        const apiKey = 'd81da99496e45367a52401f4c1b425d9'; // Store securely in production
        const lat = 25.890748931906998;
        const lon = -103.61671668510803;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        // Fetch current weather
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) throw new Error(await currentResponse.text());
        const currentData = await currentResponse.json();

        // Fetch 3-day forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(await forecastResponse.text());
        const forecastData = await forecastResponse.json();

        // Display current weather and forecast
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("API Fetch Error:", error);
    }
}

function displayCurrentWeather(data) {
    // Display current temperature with zero decimal points
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;

    // Display weather icon
    const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.setAttribute("src", iconSrc);
    weatherIcon.setAttribute("alt", data.weather[0].description);

    // Display all weather events, capitalized
    const descriptions = data.weather.map(event => capitalizeWords(event.description)).join(", ");
    weatherDesc.textContent = descriptions;
}

function displayForecast(data) {
    // Filter the forecast data to get one entry per day for the next 3 days
    const forecastDays = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0]; // Extract the date part
        if (!forecastDays[date] && Object.keys(forecastDays).length < 3) {
            forecastDays[date] = entry;
        }
    });

    // Display the 3-day forecast
    weatherForecast.innerHTML = "<h3>3-Day Forecast</h3>";
    for (const [date, entry] of Object.entries(forecastDays)) {
        const day = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(entry.main.temp);
        const description = capitalizeWords(entry.weather[0].description);

        weatherForecast.innerHTML += `
            <div class="forecast-day">
                <p><strong>${day}</strong>: ${temp}&deg;F, ${description}</p>
            </div>
        `;
    }
}

// Helper function to capitalize each word in a string
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Fetch and Display Spotlights
async function fetchSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        displaySpotlights(members);
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}

function displaySpotlights(members) {
    const spotlightCards = document.getElementById('spotlight-cards');
    spotlightCards.innerHTML = ''; // Clear existing content

    // Filter gold and silver members
    const spotlightMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);

    // Randomly select 2 or 3 members
    const selectedMembers = spotlightMembers.sort(() => 0.5 - Math.random()).slice(0, 3);

    selectedMembers.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p>Membership Level: ${getMembershipLevel(member.membershipLevel)}</p>
        `;

        spotlightCards.appendChild(card);
    });
}

function getMembershipLevel(level) {
    switch (level) {
        case 1:
            return 'Member';
        case 2:
            return 'Silver';
        case 3:
            return 'Gold';
        default:
            return 'Unknown';
    }
}

// Call the functions on page load
fetchWeather();
fetchSpotlights();