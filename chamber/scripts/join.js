// Automatically update the year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Toggle the navigation menu on hamburger button click
const menuIcon = document.querySelector('.menu-icon');
const navUl = document.querySelector('nav ul');

menuIcon.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

// Close the navigation menu when a link is clicked (optional)
navUl.addEventListener('click', () => {
    navUl.classList.remove('active');
});



// Set the timestamp when the form loads
document.getElementById('timestamp').value = new Date().toISOString();

// Handle membership level modals
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    const level = card.getAttribute('data-level').toLowerCase(); // Ensure lowercase
    const modal = document.getElementById(`${level}-details`);
    modal.showModal();

    const closeButton = document.getElementById(`close-${level}`);
    closeButton.addEventListener('click', () => {
      modal.close();
    });
  });
});

// Display form results on thankyou.html
const myInfo = new URLSearchParams(window.location.search);

console.log(myInfo.get('first'));
console.log(myInfo.get('last'));
console.log(myInfo.get('email'));
console.log(myInfo.get('phone'));
console.log(myInfo.get('ordinance'));
console.log(myInfo.get('business'));
console.log(myInfo.get('date'));


document.querySelector('#results').innerHTML= `
    <div class="thankyou-card">
      <h2>Thank You for Joining!</h2>
      <p><strong>First Name:</strong> ${myInfo.get('first')}</p>
      <p><strong>Last Name:</strong> ${myInfo.get('last')}</p>
      <p><strong>Email:</strong> ${myInfo.get('email')}</p>
      <p><p><strong>Mobile Phone:</strong> ${myInfo.get('phone')}</p>
      <p><strong>Membership:</strong> ${myInfo.get('ordinance')}</p>
      <p><strong>Business Name:</strong> ${myInfo.get('business')}</p>
      <p><strong>Form Submitted On:</strong> ${myInfo.get('date')}</p>
    </div>
  `
