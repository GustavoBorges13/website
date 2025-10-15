document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navMenu = document.querySelector('header nav');
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('section');
    const body = document.body;

    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const showSection = (sectionId) => {
        sections.forEach(sec => {
            sec.classList.add('hidden');
        });
        const sectionToShow = document.querySelector(sectionId);
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const sectionId = link.getAttribute('href');
            showSection(sectionId);

            if (sectionId === '#home') {
                body.classList.add('home-view');
            } else {
                body.classList.remove('home-view');
            }

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            navMenu.classList.remove('active');
        });
    });

    showSection('#home');
    body.classList.add('home-view');
});