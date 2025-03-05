const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        completed: false
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        completed: false
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        completed: false
    }
];

const courseList = document.getElementById('course-list');
const totalCredits = document.getElementById('total-credits');
const filterButtons = document.getElementById('filter-buttons');

let displayedCourses = courses;

function displayCourses(filteredCourses) {
    courseList.innerHTML = ''; // Clear the current list
    let credits = 0;

    filteredCourses.forEach(course => {
        const button = document.createElement('button');
        button.classList.add('course-button');
        if (course.completed) button.classList.add('completed');

        button.textContent = `${course.subject} ${course.number}`;

        // Add click event to toggle selection
        button.addEventListener('click', () => {
            course.completed = !course.completed; // Toggle completed status
            button.classList.toggle('completed'); // Toggle completed style
            updateTotalCredits(filteredCourses); // Update total credits
        });

        courseList.appendChild(button);
        credits += course.credits;
    });

    totalCredits.textContent = credits; // Update total credits
}

function updateTotalCredits(filteredCourses) {
    let credits = 0;
    filteredCourses.forEach(course => {
        if (course.completed) credits += course.credits;
    });
    totalCredits.textContent = credits;
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