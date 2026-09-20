/*=============== FIREBASE SETUP & GLOBAL VIEWS ===============*/
// We fetch the Firebase SDK globally so it works natively without module restrictions
const firebaseConfig = {
  apiKey: 'AIzaSyC7t_zDeZfqb9pE_8L5BOfpZOX3_PdbSYg',
  authDomain: 'nedcode-7b25f.firebaseapp.com',
  projectId: 'nedcode-7b25f',
  storageBucket: 'nedcode-7b25f.firebasestorage.app',
  messagingSenderId: '683098380380',
  appId: '1:683098380380:web:895ae95a6e75133dabee99',
};

// Fallback initial data
let unfilteredData = [
  {
    id: 1,
    caption: 'uConsole - polybar gedit',
    date: 'Sept 20, 2026',
    views: 732,
    mediaItems: [{ type: 'image', url: 'unfiltered Data/IMG_1836.jpeg' }],
  },
  {
    id: 2,
    caption: 'uConsole mod case',
    date: 'Sept 18, 2026',
    views: 78480,
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
    views: 574,
    mediaItems: [{ type: 'image', url: 'unfiltered Data/IMG_1892.jpeg' }],
  },
  {
    id: 4,
    caption: 'Mini notebook',
    date: 'Aug 21 , 2025',
    views: 220,
    mediaItems: [
      { type: 'image', url: 'unfiltered Data/IMG_2886.jpeg' },
      { type: 'image', url: 'unfiltered Data/IMG_2887.jpeg' },
    ],
  },
  {
    id: 5,
    caption: 'Unknown fruit',
    date: 'Aug 17, 2025',
    views: 341,
    mediaItems: [
      { type: 'image', url: 'unfiltered Data/IMG_2880.jpeg' },
      { type: 'image', url: 'unfiltered Data/IMG_2881.jpeg' },
    ],
  },
];

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('show-menu');
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

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    if (
      navToggle.querySelector('.ham1') &&
      navToggle.querySelector('.ham1').classList.contains('active')
    ) {
      navToggle.querySelector('.ham1').classList.remove('active');
    }
  });
}

const navLink = document.querySelectorAll('.nav-link');

function linkAction() {
  navLink.forEach((n) => n.classList.remove('active'));
  this.classList.add('active');
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show-menu');
  if (
    navToggle.querySelector('.ham1') &&
    navToggle.querySelector('.ham1').classList.contains('active')
  ) {
    navToggle.querySelector('.ham1').classList.remove('active');
  }
}

navLink.forEach((n) => n.addEventListener('click', linkAction));

if (navMenu) {
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

document.addEventListener('click', () => {
  if (navMenu && navMenu.classList.contains('show-menu')) {
    navMenu.classList.remove('show-menu');
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
const maxNumOfChars = 250;

const countCharacters = () => {
  if (!textArea) return;
  let numOfEnteredChars = textArea.value.length;
  let counter = maxNumOfChars - numOfEnteredChars;

  if (characterCounter) {
    characterCounter.textContent = counter + '/250';
    if (counter < 0) {
      characterCounter.style.color = 'var(--ninth-color)';
    } else if (counter < 50) {
      characterCounter.style.color = 'var(--fifteenth-color)';
    } else {
      characterCounter.style.color = 'var(--second-color)';
    }
  }
};

if (textArea) {
  textArea.addEventListener('input', countCharacters);
  textArea.setAttribute('maxlength', maxNumOfChars);
  countCharacters();
}

/*===== BACK TO TOP BUTTON =====*/
const createBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="uil uil-arrow-up"></i>';
  button.className = 'back-to-top-btn';
  button.id = 'backToTopBtn';
  button.title = 'Back to top';
  document.body.appendChild(button);
  return button;
};

const backToTopBtn = createBackToTopButton();

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/*=============== FIREBASE CLOUD VIEWS LOGIC ===============*/
let db = null;

async function initFirebaseAndViews() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();

      // Fetch global view counts from Firestore
      const docRef = db.collection('stats').doc('post_views');
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const cloudViews = docSnap.data();
        unfilteredData.forEach((post) => {
          if (cloudViews[post.id] !== undefined) {
            post.views = cloudViews[post.id];
          }
        });
      } else {
        // Initialize document if it doesn't exist yet
        const initialViews = {};
        unfilteredData.forEach((p) => (initialViews[p.id] = p.views));
        await docRef.set(initialViews);
      }
    }
  } catch (err) {
    console.error('Error connecting to Firebase, using default views:', err);
  }

  // Render feed after checking cloud views
  renderUnfilteredFeed();
}

// Increment post view safely once per session
async function incrementPostView(postId) {
  const sessionKey = `firebase_viewed_${postId}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, 'true');

  const post = unfilteredData.find((p) => p.id === postId);
  if (!post) return;

  post.views += 1;

  if (db) {
    try {
      const docRef = db.collection('stats').doc('post_views');
      await docRef.update({
        [postId]: firebase.firestore.FieldValue.increment(1),
      });
    } catch (err) {
      console.error('Failed to update cloud view count:', err);
    }
  }
}

const unfilteredIndices = {};
const unfilteredCooldowns = {};
let unfilteredCurrentPage = 1;
const unfilteredPostsPerPage = 5;

function updateUnfilteredSlideView(id, newIndex, totalSlides) {
  const now = Date.now();
  if (unfilteredCooldowns[id] && now - unfilteredCooldowns[id] < 350) return;
  unfilteredCooldowns[id] = now;

  unfilteredIndices[id] = newIndex;
  const container = document.getElementById(`uf-container-${id}`);
  if (!container) return;

  const slides = container.querySelectorAll('.unfiltered-slide');
  slides.forEach((slide, idx) => {
    slide.style.display = idx === newIndex ? 'flex' : 'none';
  });

  const dotsContainer = document.getElementById(`uf-dots-${id}`);
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.unfiltered-dot');
    dots.forEach((dot, idx) => {
      dot.style.background =
        idx === newIndex ? '#fff' : 'rgba(255,255,255,0.4)';
    });
  }

  const buttons = container.querySelectorAll('button');
  if (buttons.length >= 2) {
    const prevBtn = buttons[0];
    const nextBtn = buttons[1];
    const isFirst = newIndex === 0;
    const isLast = newIndex === totalSlides - 1;

    prevBtn.style.opacity = isFirst ? '0.3' : '0.8';
    prevBtn.style.pointerEvents = isFirst ? 'none' : 'auto';
    nextBtn.style.opacity = isLast ? '0.3' : '0.8';
    nextBtn.style.pointerEvents = isLast ? 'none' : 'auto';
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

  const totalPosts = unfilteredData.length;
  const totalPages = Math.ceil(totalPosts / unfilteredPostsPerPage) || 1;

  if (unfilteredCurrentPage > totalPages) unfilteredCurrentPage = totalPages;
  if (unfilteredCurrentPage < 1) unfilteredCurrentPage = 1;

  const startIndex = (unfilteredCurrentPage - 1) * unfilteredPostsPerPage;
  const endIndex = startIndex + unfilteredPostsPerPage;
  const paginatedItems = unfilteredData.slice(startIndex, endIndex);

  paginatedItems.forEach((item) => {
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
                <div style="position: absolute; inset: 0; background-image: url('${
                  media.url
                }'); background-size: cover; background-position: center; filter: blur(20px) brightness(0.6); transform: scale(1.1); pointer-events: none;"></div>
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
        }, event)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; opacity: ${
          currIdx === 0 ? '0.3' : '0.8'
        }; pointer-events: ${currIdx === 0 ? 'none' : 'auto'};">
                <i class="fa-solid fa-chevron-left" style="font-size: 0.8rem;"></i>
            </button>
            <button onclick="changeUnfilteredSlide(${item.id}, 1, ${
          item.mediaItems.length
        }, event)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; opacity: ${
          currIdx === item.mediaItems.length - 1 ? '0.3' : '0.8'
        }; pointer-events: ${
          currIdx === item.mediaItems.length - 1 ? 'none' : 'auto'
        };">
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
            <div class="unfiltered-media-container" id="uf-container-${item.id}" style="position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; user-select: none; background: #000;">
                ${slidesHTML}
                ${arrowsHTML}
                ${dotsHTML}
            </div>
            <div class="unfiltered-post-content" style="padding: 16px;">
                <p class="unfiltered-caption" style="margin-bottom: 14px; line-height: 1.5;">${item.caption}</p>
                <div class="unfiltered-footer-row" style="display: flex; justify-content: flex-end; align-items: center;">
                    <button class="unfiltered-share-btn" onclick="shareUnfilteredPost(${item.id})" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: inherit; opacity: 0.8; font-size: 0.9rem;">
                        <i class="fa-solid fa-share-nodes"></i> Share
                    </button>
                </div>
            </div>
        `;

    feedContainer.appendChild(itemEl);
    setupUnfilteredGestures(item.id, item.mediaItems.length);
  });

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
        ">${i}</button>
      `;
    }
    paginationEl.innerHTML = pagesHTML;
    feedContainer.appendChild(paginationEl);
  }
}

function changeUnfilteredPage(pageNumber) {
  unfilteredCurrentPage = pageNumber;
  renderUnfilteredFeed();
  const feedContainer = document.getElementById('unfilteredFeedList');
  if (feedContainer) {
    feedContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function shareUnfilteredPost(postId) {
  const post = unfilteredData.find((p) => p.id === postId);
  if (!post) return;
  const shareUrl = window.location.href.split('#')[0] + '#post-' + postId;
  const shareData = {
    title: 'NEDCODE Unfiltered',
    text: post.caption || 'Check out this post on NEDCODE Unfiltered!',
    url: shareUrl,
  };

  if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Link copied to clipboard!');
  } catch (err) {
    prompt('Copy this link:', shareUrl);
  }
}

function setupUnfilteredGestures(id, totalSlides) {
  const container = document.getElementById(`uf-container-${id}`);
  if (!container) return;

  let startX = 0;
  let isDragging = false;
  let hasSwiped = false;

  container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isDragging = true;
    hasSwiped = false;
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging || hasSwiped) return;
    const diffX = e.clientX - startX;
    const currentIdx = unfilteredIndices[id] || 0;

    if (Math.abs(diffX) > 40) {
      hasSwiped = true;
      if (diffX < 0 && currentIdx < totalSlides - 1) {
        updateUnfilteredSlideView(id, currentIdx + 1, totalSlides);
      } else if (diffX > 0 && currentIdx > 0) {
        updateUnfilteredSlideView(id, currentIdx - 1, totalSlides);
      }
    }
  });

  container.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    if (!hasSwiped) {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const currentIdx = unfilteredIndices[id] || 0;

      if (clickX < rect.width / 2 && currentIdx > 0) {
        updateUnfilteredSlideView(id, currentIdx - 1, totalSlides);
      } else if (clickX >= rect.width / 2 && currentIdx < totalSlides - 1) {
        updateUnfilteredSlideView(id, currentIdx + 1, totalSlides);
      }
    }
    hasSwiped = false;
  });

  container.addEventListener('pointerleave', () => {
    isDragging = false;
    hasSwiped = false;
  });

  container.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const currentIdx = unfilteredIndices[id] || 0;
      const scrollDelta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (Math.abs(scrollDelta) > 15) {
        if (scrollDelta > 0 && currentIdx < totalSlides - 1) {
          updateUnfilteredSlideView(id, currentIdx + 1, totalSlides);
        } else if (scrollDelta < 0 && currentIdx > 0) {
          updateUnfilteredSlideView(id, currentIdx - 1, totalSlides);
        }
      }
    },
    { passive: false }
  );
}

// Initialize Firebase and run feed renderer on page load
document.addEventListener('DOMContentLoaded', initFirebaseAndViews);
