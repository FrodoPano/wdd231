const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        completed: false,
        description: 'This course introduces the basics of programming using Python.',
        certificate: 'Programming Basics',
        technology: ['Python', 'VS Code']
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        completed: false,
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        certificate: 'Web Development Basics',
        technology: ['HTML', 'CSS', 'JavaScript']
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        completed: false,
        description: 'This course dives deeper into programming concepts using functions in Python.',
        certificate: 'Intermediate Programming',
        technology: ['Python', 'VS Code']
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: false,
        description: 'Learn object-oriented programming using classes in Python.',
        certificate: 'Advanced Programming',
        technology: ['Python', 'VS Code']
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: false,
        description: 'Explore dynamic web development using JavaScript and APIs.',
        certificate: 'Dynamic Web Development',
        technology: ['JavaScript', 'APIs']
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        completed: false,
        description: 'Learn frontend development with a focus on modern frameworks.',
        certificate: 'Frontend Development',
        technology: ['React', 'JavaScript']
    }
];

const courseList = document.getElementById('course-list');
const totalCredits = document.getElementById('total-credits');
const filterButtons = document.getElementById('filter-buttons');
const courseDetails = document.getElementById('course-details');

let displayedCourses = courses;

function displayCourses(filteredCourses) {
    courseList.innerHTML = ''; // Clear the current list
    let credits = 0;

    filteredCourses.forEach(course => {
        const button = document.createElement('button');
        button.classList.add('course-button');
        if (course.completed) button.classList.add('completed');

        button.textContent = `${course.subject} ${course.number}`;

        // Add click event to show course details
        button.addEventListener('click', () => {
            displayCourseDetails(course);
        });

        courseList.appendChild(button);
        credits += course.credits;
    });

    totalCredits.textContent = credits; // Update total credits
}

function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <button id="closeModal">❌</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits</strong>: ${course.credits}</p>
        <p><strong>Certificate</strong>: ${course.certificate}</p>
        <p>${course.description}</p>
        <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
    `;
    courseDetails.showModal();

    const closeModal = document.getElementById('closeModal');
    closeModal.addEventListener('click', () => {
        courseDetails.close();
    });

    // Close modal when clicking outside of it
    courseDetails.addEventListener('click', (e) => {
        if (e.target === courseDetails) {
            courseDetails.close();
        }
    });
}

filterButtons.addEventListener('click', (e) => {
    if (e.target.id === 'all') {
        displayedCourses = courses; // Show all courses
    } else if (e.target.id === 'cse') {
        displayedCourses = courses.filter(course => course.subject === 'CSE'); // Show only CSE courses
    } else if (e.target.id === 'wdd') {
        displayedCourses = courses.filter(course => course.subject === 'WDD'); // Show only WDD courses
    }
    displayCourses(displayedCourses); // Update the displayed courses
});

// Initial display
displayCourses(courses);