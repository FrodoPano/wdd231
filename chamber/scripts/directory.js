document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

const businesses = [
    {
        name: "Business Name 1",
        tagline: "Business Tag Line 1",
        email: "info1@gmail.com",
        phone: "800-555-1234",
        url: "mybusiness1.com"
    },
    {
        name: "Business Name 2",
        tagline: "Business Tag Line 2",
        email: "info2@gmail.com",
        phone: "800-555-5678",
        url: "mybusiness2.com"
    },
    {
        name: "Business Name 3",
        tagline: "Business Tag Line 3",
        email: "info3@gmail.com",
        phone: "800-555-9101",
        url: "mybusiness3.com"
    }
    // Add more businesses as needed
];

const directory = document.getElementById('directory');

businesses.forEach(business => {
    const card = document.createElement('div');
    card.classList.add('business-card');
    card.innerHTML = `
        <h3>${business.name}</h3>
        <p>${business.tagline}</p>
        <p>EMAIL: ${business.email}</p>
        <p>PHONE: ${business.phone}</p>
        <p>URL: <a href="http://${business.url}" target="_blank">${business.url}</a></p>
    `;
    directory.appendChild(card);
});