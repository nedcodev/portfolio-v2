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
      if (
        navToggle.querySelector('.ham1') &&
        !navToggle.querySelector('.ham1').classList.contains('active')
      ) {
        navToggle.querySelector('.ham1').classList.add('active');
      }
    } else {
      if (
        navToggle.querySelector('.ham1') &&
        navToggle.querySelector('.ham1').classList.contains('active')
      ) {
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
    if (
      navToggle.querySelector('.ham1') &&
      navToggle.querySelector('.ham1').classList.contains('active')
    ) {
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
  if (
    navToggle.querySelector('.ham1') &&
    navToggle.querySelector('.ham1').classList.contains('active')
  ) {
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
    if (
      navToggle.querySelector('.ham1') &&
      navToggle.querySelector('.ham1').classList.contains('active')
    ) {
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
    } else if (counter < 50) {
      // Updated from 20 to 50
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
    behavior: 'smooth',
  });
});

// Unfiltered items supporting multi-image/video carousels & touch/click navigation
// Load saved views from localStorage if they exist, otherwise use default data
const savedViews = JSON.parse(localStorage.getItem('unfiltered_views')) || {};

const unfilteredData = [
  {
    id: 1,
    caption: 'uConsole - polybar gedit',
    date: 'Sept 20, 2026',
    views: savedViews[1] !== undefined ? savedViews[1] : 732,
    mediaItems: [{ type: 'image', url: 'unfiltered Data/IMG_1836.jpeg' }],
  },
  {
    id: 2,
    caption: 'uConsole mod case',
    date: 'Sept 18, 2026',
    views: savedViews[2] !== undefined ? savedViews[2] : 78480,
    mediaItems: [
      { type: 'image', url: 'unfiltered Data/203745.png' },
      { type: 'image', url: 'unfiltered Data/203808.png' },
      { type: 'image', url: 'unfiltered Data/203820.png' },
      { type: 'image', url: 'unfiltered Data/203845.png' },
      { type: 'image', url: 'unfiltered Data/203857.png' },
      { type: 'image', url: 'unfiltered Data/203908.png' },
      { type: 'image', url: 'unfiltered Data/203950.png' },
    ],
  },
  {
    id: 3,
    caption: 'uConsole',
    date: 'Mar 28, 2025',
    views: savedViews[3] !== undefined ? savedViews[3] : 574,
    mediaItems: [{ type: 'image', url: 'unfiltered Data/IMG_1892.jpeg' }],
  },
  {
    id: 4,
    caption: 'Mini notebook',
    date: 'Aug 21 , 2025',
    views: savedViews[4] !== undefined ? savedViews[4] : 220,
    mediaItems: [
      { type: 'image', url: 'unfiltered Data/IMG_2886.jpeg' },
      { type: 'image', url: 'unfiltered Data/IMG_2887.jpeg' },
    ],
  },
  {
    id: 5,
    caption: 'Unknown fruit',
    date: 'Aug 17, 2025',
    views: savedViews[5] !== undefined ? savedViews[5] : 341,
    mediaItems: [
      { type: 'image', url: 'unfiltered Data/IMG_2880.jpeg' },
      { type: 'image', url: 'unfiltered Data/IMG_2881.jpeg' },
    ],
  },
];

// Helper to increment and persist views
function incrementPostView(postId) {
  const viewedSessionKey = `viewed_post_${postId}`;

  // Check if this specific browser already counted this view in this session/storage
  if (!sessionStorage.getItem(viewedSessionKey)) {
    sessionStorage.setItem(viewedSessionKey, 'true');

    const item = unfilteredData.find((p) => p.id === postId);
    if (item) {
      item.views += 1;

      // Save all current view counts into localStorage
      const viewsMap = {};
      unfilteredData.forEach((p) => {
        viewsMap[p.id] = p.views;
      });
      localStorage.setItem('unfiltered_views', JSON.stringify(viewsMap));
    }
  }
}

const unfilteredIndices = {};

// Pagination state variables (5 items per page)
let unfilteredCurrentPage = 1;
const unfilteredPostsPerPage = 5;

// Switch slides seamlessly without re-rendering the whole DOM / feed
function updateUnfilteredSlideView(id, newIndex, totalSlides) {
  unfilteredIndices[id] = newIndex;
  const container = document.getElementById(`uf-container-${id}`);
  if (!container) return;

  // 1. Show/hide correct slide images
  const slides = container.querySelectorAll('.unfiltered-slide');
  slides.forEach((slide, idx) => {
    slide.style.display = idx === newIndex ? 'flex' : 'none';
  });

  // 2. Update dots styling
  const dotsContainer = document.getElementById(`uf-dots-${id}`);
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.unfiltered-dot');
    dots.forEach((dot, idx) => {
      dot.style.background =
        idx === newIndex ? '#fff' : 'rgba(255,255,255,0.4)';
    });
  }

  // 3. Update arrow opacities & states dynamically
  const buttons = container.querySelectorAll('button');
  if (buttons.length >= 2) {
    const prevBtn = buttons[0];
    const nextBtn = buttons[1];

    const isFirst = newIndex === 0;
    const isLast = newIndex === totalSlides - 1;

    prevBtn.style.opacity = isFirst ? '0.3' : '0.8';
    prevBtn.style.pointerEvents = isFirst ? 'none' : 'auto';
    prevBtn.onmouseover = () => {
      if (!isFirst) prevBtn.style.opacity = '1';
    };
    prevBtn.onmouseout = () => {
      if (!isFirst) prevBtn.style.opacity = '0.8';
    };

    nextBtn.style.opacity = isLast ? '0.3' : '0.8';
    nextBtn.style.pointerEvents = isLast ? 'none' : 'auto';
    nextBtn.onmouseover = () => {
      if (!isLast) nextBtn.style.opacity = '1';
    };
    nextBtn.onmouseout = () => {
      if (!isLast) nextBtn.style.opacity = '0.8';
    };
  }
}

function changeUnfilteredSlide(id, direction, totalSlides, event) {
  if (event) event.stopPropagation();
  const currentIndex = unfilteredIndices[id] || 0;
  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < totalSlides) {
    updateUnfilteredSlideView(id, newIndex, totalSlides);
  }
}

function goToUnfilteredSlide(id, index, totalSlides) {
  updateUnfilteredSlideView(id, index, totalSlides);
}

function renderUnfilteredFeed() {
  const feedContainer = document.getElementById('unfilteredFeedList');
  if (!feedContainer) return;

  feedContainer.innerHTML = '';

  // Calculate pagination boundaries
  const totalPosts = unfilteredData.length;
  const totalPages = Math.ceil(totalPosts / unfilteredPostsPerPage) || 1;

  if (unfilteredCurrentPage > totalPages) unfilteredCurrentPage = totalPages;
  if (unfilteredCurrentPage < 1) unfilteredCurrentPage = 1;

  const startIndex = (unfilteredCurrentPage - 1) * unfilteredPostsPerPage;
  const endIndex = startIndex + unfilteredPostsPerPage;
  const paginatedItems = unfilteredData.slice(startIndex, endIndex);

  paginatedItems.forEach((item) => {
    // Increment view count persistently upon rendering/viewing
    incrementPostView(item.id);

    if (unfilteredIndices[item.id] === undefined)
      unfilteredIndices[item.id] = 0;
    const currIdx = unfilteredIndices[item.id];
    const hasMultiple = item.mediaItems.length > 1;

    const itemEl = document.createElement('div');
    itemEl.className = 'unfiltered-feed-item';
    itemEl.style.cssText =
      'width: 100%; max-width: 460px; margin: 0 auto 24px auto; background: rgba(255, 255, 255, 0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);';

    let slidesHTML = item.mediaItems
      .map(
        (media, idx) => `
            <div class="unfiltered-slide" data-id="${
              item.id
            }" data-slide="${idx}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: ${
          idx === currIdx ? 'flex' : 'none'
        }; align-items: center; justify-content: center; overflow: hidden; background: #000;">
                <!-- Blurred background fill -->
                <div style="position: absolute; inset: 0; background-image: url('${
                  media.url
                }'); background-size: cover; background-position: center; filter: blur(20px) brightness(0.6); transform: scale(1.1); pointer-events: none;"></div>
                
                <!-- Main sharp image -->
                <img src="${
                  media.url
                }" alt="Post content" loading="lazy" style="position: relative; max-width: 100%; max-height: 100%; object-fit: contain; z-index: 2; pointer-events: none;">
            </div>
        `
      )
      .join('');

    let arrowsHTML = hasMultiple
      ? `
            <button onclick="changeUnfilteredSlide(${item.id}, -1, ${
          item.mediaItems.length
        }, event)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; transition: opacity 0.2s; opacity: ${
          currIdx === 0 ? '0.3' : '0.8'
        }; pointer-events: ${
          currIdx === 0 ? 'none' : 'auto'
        };" onmouseover="if(${
          currIdx !== 0
        }) this.style.opacity='1';" onmouseout="if(${
          currIdx !== 0
        }) this.style.opacity='0.8';">
                <i class="fa-solid fa-chevron-left" style="font-size: 0.8rem;"></i>
            </button>
            <button onclick="changeUnfilteredSlide(${item.id}, 1, ${
          item.mediaItems.length
        }, event)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; transition: opacity 0.2s; opacity: ${
          currIdx === item.mediaItems.length - 1 ? '0.3' : '0.8'
        }; pointer-events: ${
          currIdx === item.mediaItems.length - 1 ? 'none' : 'auto'
        };" onmouseover="if(${
          currIdx !== item.mediaItems.length - 1
        }) this.style.opacity='1';" onmouseout="if(${
          currIdx !== item.mediaItems.length - 1
        }) this.style.opacity='0.8';">
                <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem;"></i>
            </button>
        `
      : '';

    let dotsHTML = hasMultiple
      ? `
            <div class="unfiltered-dots" id="uf-dots-${
              item.id
            }" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 10; background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 20px; backdrop-filter: blur(4px);">
                ${item.mediaItems
                  .map(
                    (_, idx) => `
                    <span class="unfiltered-dot ${
                      idx === currIdx ? 'active' : ''
                    }" onclick="goToUnfilteredSlide(${item.id},${idx}, ${
                      item.mediaItems.length
                    })" style="width: 8px; height: 8px; border-radius: 50\%; background: ${
                      idx === currIdx ? '#fff' : 'rgba(255,255,255,0.4)'
                    }; cursor: pointer; transition: background 0.3s;"></span>
                `
                  )
                  .join('')}
            </div>
        `
      : '';

    itemEl.innerHTML = `
            <!-- TOP BAR: Views on top left, Date/Time on top right -->
            <div class="unfiltered-header-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 0.9rem; color: var(--text-color, #ccc);">
                <div class="unfiltered-stat-item" style="display: flex; align-items: center; gap: 6px;">
                    <i class="fa-regular fa-eye"></i>
                    <span>${item.views}</span>
                </div>
                <div class="unfiltered-header-right" style="display: flex; align-items: center; gap: 6px; opacity: 0.85;">
                    <i class="fa-regular fa-clock"></i>
                    <span class="unfiltered-date">${item.date}</span>
                </div>
            </div>

            <!-- MEDIA CONTAINER -->
            <div class="unfiltered-media-container" id="uf-container-${item.id}" style="position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; user-select: none; background: #000;">
                ${slidesHTML}
                ${arrowsHTML}
                ${dotsHTML}
            </div>

            <!-- POST CONTENT & BOTTOM ACTIONS -->
            <div class="unfiltered-post-content" style="padding: 16px;">
                <p class="unfiltered-caption" style="margin-bottom: 14px; line-height: 1.5;">${item.caption}</p>
                
                <div class="unfiltered-footer-row" style="display: flex; justify-content: flex-end; align-items: center;">
                    
                    <!-- UNCOMMENT BELOW TO RE-ENABLE LIKES BUTTON & COUNT -->
                    <!-- 
                    <div class="unfiltered-stat-item" style="display: flex; align-items: center; gap: 8px;">
                        <button class="unfiltered-like-btn \${item.liked ? 'liked' : ''}" onclick="toggleUnfilteredLike(\${item.id})" style="background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center;">
                            <i class="\${item.liked ? 'fa-solid' : 'fa-regular'} fa-heart" style="font-size: 1.2rem; color: \${item.liked ? '#ff3b30' : 'inherit'};"></i>
                        </button>
                        <span id="uf-count-\${item.id}" style="font-weight: 500;">\${item.likes}</span>
                    </div> 
                    -->

                    <!-- Share Button -->
                    <button class="unfiltered-share-btn" onclick="shareUnfilteredPost(${item.id})" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: inherit; opacity: 0.8; font-size: 0.9rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                        <i class="fa-solid fa-share-nodes"></i> Share
                    </button>
                </div>
            </div>
        `;

    feedContainer.appendChild(itemEl);
    setupUnfilteredGestures(item.id, item.mediaItems.length);
  });

  // Render bottom page numbers pagination bar (only if there's more than 1 page)
  if (totalPages > 1) {
    const paginationEl = document.createElement('div');
    paginationEl.className = 'unfiltered-pagination';
    paginationEl.style.cssText =
      'display: flex; justify-content: center; align-items: center; gap: 8px; margin: 30px 0 20px 0;';

    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === unfilteredCurrentPage;
      pagesHTML += `
        <button onclick="changeUnfilteredPage(${i})" style="
          background: ${
            isActive ? 'var(--accent-color, #fff)' : 'rgba(255, 255, 255, 0.05)'
          };
          color: ${isActive ? '#000' : 'var(--text-color, #ccc)'};
          border: 1px solid ${
            isActive ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
          };
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: ${isActive ? '600' : '400'};
          font-size: 0.9rem;
          transition: all 0.2s;
        ">${i}</button>
      `;
    }
    paginationEl.innerHTML = pagesHTML;
    feedContainer.appendChild(paginationEl);
  }
}

// Function to handle page clicks and smooth scroll back up
function changeUnfilteredPage(pageNumber) {
  unfilteredCurrentPage = pageNumber;
  renderUnfilteredFeed();

  const feedContainer = document.getElementById('unfilteredFeedList');
  if (feedContainer) {
    feedContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Share helper function
async function shareUnfilteredPost(postId) {
  const post = unfilteredData.find((p) => p.id === postId);
  if (!post) return;

  const shareUrl = window.location.href.split('#')[0] + '#post-' + postId;
  const shareData = {
    title: 'NEDCODE Unfiltered',
    text: post.caption || 'Check out this post on NEDCODE Unfiltered!',
    url: shareUrl,
  };

  // 1. Try mobile native share first if available
  if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return; // User cancelled, do nothing
    }
  }

  // 2. Fallback clipboard copy for PC desktop (using a temporary textarea)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    textarea.style.position = 'fixed'; // Avoid scrolling to bottom
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      alert('Link copied to clipboard!');
    } else {
      prompt('Copy this link:', shareUrl);
    }
  } catch (err) {
    console.error('Failed to copy link: ', err);
    prompt('Copy this link:', shareUrl);
  }
}

/* 
// UNCOMMENT BELOW TO RE-ENABLE LIKE TOGGLE LOGIC
function toggleUnfilteredLike(id) {
  const item = unfilteredData.find((i) => i.id === id);
  if (item) {
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;
    renderUnfilteredFeed();
  }
}
*/

function setupUnfilteredGestures(id, totalSlides) {
  const container = document.getElementById(`uf-container-${id}`);
  if (!container) return;

  let startX = 0;
  let isDragging = false;

  container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  container.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    const currentIdx = unfilteredIndices[id] || 0;

    if (Math.abs(diffX) > 40) {
      if (diffX < 0 && currentIdx < totalSlides - 1) {
        updateUnfilteredSlideView(id, currentIdx + 1, totalSlides);
      } else if (diffX > 0 && currentIdx > 0) {
        updateUnfilteredSlideView(id, currentIdx - 1, totalSlides);
      }
    } else {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2 && currentIdx > 0) {
        updateUnfilteredSlideView(id, currentIdx - 1, totalSlides);
      } else if (clickX >= rect.width / 2 && currentIdx < totalSlides - 1) {
        updateUnfilteredSlideView(id, currentIdx + 1, totalSlides);
      }
    }
  });

  container.addEventListener('pointerleave', () => {
    isDragging = false;
  });
}

document.addEventListener('DOMContentLoaded', renderUnfilteredFeed);
