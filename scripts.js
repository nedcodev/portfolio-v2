/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
// Validate if constant exists
if (navToggle) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent this click from triggering the document click
    navMenu.classList.toggle('show-menu');
    
    // When opening the menu, make sure the hamburger animation stays in sync
    if (navMenu.classList.contains('show-menu')) {
      if (navToggle.querySelector('.ham1') && !navToggle.querySelector('.ham1').classList.contains('active')) {
        navToggle.querySelector('.ham1').classList.add('active');
      }
    } else {
      if (navToggle.querySelector('.ham1') && navToggle.querySelector('.ham1').classList.contains('active')) {
        navToggle.querySelector('.ham1').classList.remove('active');
      }
    }
  });
}

/*===== MENU HIDDEN =====*/
// Validate if constant exists
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    
    // Update hamburger icon state
    if (navToggle.querySelector('.ham1') && navToggle.querySelector('.ham1').classList.contains('active')) {
      navToggle.querySelector('.ham1').classList.remove('active');
    }
  });
}

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav-link');

function linkAction() {
  /*Active link*/
  navLink.forEach((n) => n.classList.remove('active'));
  this.classList.add('active');

  /*Remove menu mobile*/
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show-menu');
  
  // Update hamburger icon state
  if (navToggle.querySelector('.ham1') && navToggle.querySelector('.ham1').classList.contains('active')) {
    navToggle.querySelector('.ham1').classList.remove('active');
  }
}

navLink.forEach((n) => n.addEventListener('click', linkAction));

// Prevent menu from closing when clicking inside the menu
if (navMenu) {
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
  if (navMenu && navMenu.classList.contains('show-menu')) {
    navMenu.classList.remove('show-menu');
    
    // Update hamburger icon state
    if (navToggle.querySelector('.ham1') && navToggle.querySelector('.ham1').classList.contains('active')) {
      navToggle.querySelector('.ham1').classList.remove('active');
    }
  }
});

/*===== CONTACT-TEXTAREA =====*/
let textArea = document.getElementById('textbox');
let characterCounter = document.getElementById('char_count');
const maxNumOfChars = 250; // Updated from 100 to 250

const countCharacters = () => {
  if (!textArea) return; // Guard clause if element doesn't exist
  
  let numOfEnteredChars = textArea.value.length;
  let counter = maxNumOfChars - numOfEnteredChars;
  
  if (characterCounter) {
    characterCounter.textContent = counter + '/250'; // Updated from /100 to /250

    if (counter < 0) {
      characterCounter.style.color = 'var(--ninth-color)';
    } else if (counter < 50) { // Updated from 20 to 50
      characterCounter.style.color = 'var(--fifteenth-color)';
    } else {
      characterCounter.style.color = 'var(--second-color)';
    }
  }
};

if (textArea) {
  textArea.addEventListener('input', countCharacters);
  // Set maxlength attribute
  textArea.setAttribute('maxlength', maxNumOfChars);
  // Initialize counter on page load
  countCharacters();
}

/*===== BACK TO TOP BUTTON =====*/
// Create the back to top button element
const createBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="uil uil-arrow-up"></i>';
  button.className = 'back-to-top-btn';
  button.id = 'backToTopBtn';
  button.title = 'Back to top';
  document.body.appendChild(button);
  return button;
};

// Initialize the button
const backToTopBtn = createBackToTopButton();

// Show/hide the button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

// Scroll to top when the button is clicked
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});