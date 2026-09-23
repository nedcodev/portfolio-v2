/*=============== FIREBASE SETUP & GLOBAL DATA ===============*/
const firebaseConfig = {
  apiKey: 'AIzaSyC7t_zDeZfqb9pE_8L5BOfpZOX3_PdbSYg',
  authDomain: 'nedcode-7b25f.firebaseapp.com',
  projectId: 'nedcode-7b25f',
  storageBucket: 'nedcode-7b25f.firebasestorage.app',
  messagingSenderId: '683098380380',
  appId: '1:683098380380:web:895ae95a6e75133dabee99',
};

// Fallback & initial manual data (these serve as your manual entry points)
let unfilteredData = [
  {
    id: 1,
    caption: 'uConsole - polybar gedit',
    date: 'Sept 22, 2026',
    views: 0,
    mediaItems: [
      {
        type: 'threads',
        url: 'https://www.threads.com/@nedcodev/post/DdlYrANlRqK',
      },
    ],
  },
  // {
  //   id: 2,
  //   caption: 'Raspberry Pi CM4',
  //   date: 'Sept 22, 2026',
  //   views: 0,
  //   mediaItems: [
  //     {
  //       type: 'twitter',
  //       url: 'https://x.com/nedcodev/status/2102322618812772407',
  //     },
  //   ],
  // },
  {
    id: 3,
    caption: 'ClockworkPi uConsole teardown & assembly',
    date: 'Sept 22, 2026',
    views: 0,
    mediaItems: [
      {
        type: 'threads',
        url: 'https://www.threads.com/@nedcodev/post/Ddmb_RLEwnd',
      },
    ],
  },
];

/*=============== NUMBER FORMATTER HELPER ===============*/
function formatNumber(num) {
  return num.toLocaleString();
}

/*=============== THREADS EMBED HELPERS ===============*/
// Pulls the post/share id out of a Threads URL, e.g.
// https://www.threads.com/@nedcodev/post/DdlYrANlRqK  -> DdlYrANlRqK
// https://www.threads.com/share/D_kobwCg2/            -> D_kobwCg2
function extractThreadsId(url) {
  const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
  const segments = cleanUrl.split('/');
  return segments[segments.length - 1] || 'unknown';
}

// Builds the same blockquote markup Threads' own "Get embed code" button
// generates, using only the post URL. Threads' embed.js scans the page for
// this exact structure and replaces it with the fully rendered post.
function buildThreadsEmbedHTML(url) {
  const postId = extractThreadsId(url);
  return `
    <blockquote class="text-post-media" data-text-post-permalink="${url}" data-text-post-version="0" id="ig-tp-${postId}" style=" background:#FFF; border: none; border-radius: 0; max-width:100%; margin: 0; min-width:270px; padding:0; width:100%;">
      <a href="${url}" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" target="_blank">
        <div style=" padding: 40px; display: flex; flex-direction: column; align-items: center;">
          <div style=" display:block; height:32px; width:32px; padding-bottom:20px;">
            <svg aria-label="Threads" height="32px" role="img" viewBox="0 0 192 192" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" /></svg>
          </div>
          <div style=" font-size: 15px; line-height: 21px; color: #000000; font-weight: 600; "> View on Threads</div>
        </div>
      </a>
    </blockquote>
  `;
}

// Threads' embed.js only scans the page once, on its own load. Since our
// feed items are added afterward by JavaScript, we force a fresh scan by
// swapping in a brand-new copy of the script whenever a Threads embed is
// rendered into the page.
function reloadThreadsEmbedScript() {
  const oldScript = document.querySelector(
    'script[src*="threads.com/embed.js"]',
  );
  if (oldScript) oldScript.remove();
  const newScript = document.createElement('script');
  newScript.async = true;
  newScript.src = 'https://www.threads.com/embed.js';
  document.body.appendChild(newScript);
}

/*=============== TWITTER / X EMBED HELPERS ===============*/
// Builds the same blockquote markup X's own "Embed Post" option generates,
// using only the tweet URL. X's widgets.js scans the page for this exact
// structure and replaces it with the fully rendered tweet.
function buildTwitterEmbedHTML(url) {
  return `
    <blockquote class="twitter-tweet" data-theme="dark">
      <a href="${url}"></a>
    </blockquote>
  `;
}

// Unlike Threads, X's widgets.js exposes an official reprocess function, so
// we just call it after new tweets are added to the page instead of having
// to reload the whole script.
function reloadTwitterEmbeds() {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load();
  }
}

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

/*=============== FIREBASE CLOUD SYNC LOGIC ===============*/
let db = null;

async function initFirebaseAndData() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();

      const docRef = db.collection('stats').doc('post_views');
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const cloudData = docSnap.data();
        unfilteredData.forEach((post) => {
          const baseViews = post.views;

          let cloudViewsDelta = 0;

          if (cloudData[post.id] !== undefined) {
            if (typeof cloudData[post.id] === 'number') {
              cloudViewsDelta = cloudData[post.id];
            } else if (cloudData[post.id].views !== undefined) {
              cloudViewsDelta = cloudData[post.id].views;
            }
          }

          post.views = baseViews + cloudViewsDelta;
        });
      } else {
        const initialData = {};
        unfilteredData.forEach((p) => {
          initialData[p.id] = 0;
        });
        await docRef.set(initialData);
      }
    }
  } catch (err) {
    console.error(
      'Error connecting to Firebase, using manual script data:',
      err,
    );
  }

  renderUnfilteredFeed();
}

async function incrementPostView(postId) {
  const sessionKey = `firebase_viewed_${postId}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, 'true');

  const post = unfilteredData.find((p) => p.id === postId);
  if (!post) return;

  post.views += 1;

  const viewsEl = document.getElementById(`uf-views-${postId}`);
  if (viewsEl) viewsEl.textContent = formatNumber(post.views);

  if (db) {
    try {
      const docRef = db.collection('stats').doc('post_views');
      await docRef.set(
        {
          [postId]: firebase.firestore.FieldValue.increment(1),
        },
        { merge: true },
      );
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

  let sawThreadsEmbed = false;
  let sawTwitterEmbed = false;

  paginatedItems.forEach((item) => {
    incrementPostView(item.id);

    if (unfilteredIndices[item.id] === undefined)
      unfilteredIndices[item.id] = 0;
    const currIdx = unfilteredIndices[item.id];
    const hasMultiple = item.mediaItems.length > 1;
    const isThreadsPost =
      item.mediaItems[0] && item.mediaItems[0].type === 'threads';
    const isTwitterPost =
      item.mediaItems[0] && item.mediaItems[0].type === 'twitter';

    const itemEl = document.createElement('div');
    itemEl.className = 'unfiltered-feed-item';
    itemEl.style.cssText =
      'width: 100%; max-width: 460px; margin: 0 auto 24px auto; background: rgba(255, 255, 255, 0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);';

    if (isThreadsPost) {
      itemEl.innerHTML = `
            <div class="unfiltered-header-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 0.9rem; color: var(--text-color, #ccc);">
                <div class="unfiltered-stat-item" style="display: flex; align-items: center; gap: 6px;">
                    <i class="fa-regular fa-eye"></i>
                    <span id="uf-views-${item.id}">${formatNumber(item.views)}</span>
                </div>
                <div class="unfiltered-header-right" style="display: flex; align-items: center; gap: 6px; opacity: 0.85;">
                    <span class="unfiltered-date">${item.date}</span>
                </div>
            </div>
     <div class="unfiltered-threads-container" style="width: 100%; overflow: hidden; padding: 16px; background: transparent; display: flex; justify-content: center;">
    <div style="width: 100%; max-width: 500px; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);">
        ${buildThreadsEmbedHTML(item.mediaItems[0].url)}
    </div>
</div>
            <div class="unfiltered-post-content" style="padding: 16px;">
               <div class="unfiltered-footer-row" style="display: flex; align-items: center; gap: 16px; margin-bottom: 0;">
    <p class="unfiltered-caption" style="margin: 0; line-height: 1.5; flex: 1;">${item.caption}</p>

    <button class="unfiltered-share-btn" onclick="shareUnfilteredPost(${item.id})" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: inherit; opacity: 0.8; font-size: 1.1rem; margin-left: auto; flex-shrink: 0;">
    <i class="fa-solid fa-share"></i>
</button>
</div>
        `;

      feedContainer.appendChild(itemEl);
      sawThreadsEmbed = true;
      return;
    }

    if (isTwitterPost) {
      itemEl.innerHTML = `
            <div class="unfiltered-header-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 0.9rem; color: var(--text-color, #ccc);">
                <div class="unfiltered-stat-item" style="display: flex; align-items: center; gap: 6px;">
                    <i class="fa-regular fa-eye"></i>
                    <span id="uf-views-${item.id}">${formatNumber(item.views)}</span>
                </div>
                <div class="unfiltered-header-right" style="display: flex; align-items: center; gap: 6px; opacity: 0.85;">
                    <span class="unfiltered-date">${item.date}</span>
                </div>
            </div>
          <div class="unfiltered-twitter-container" style="width: 100%; overflow: hidden; padding: 16px; background: transparent; display: flex; justify-content: center;">
    <div style="width: 100%; max-width: 500px;">
        ${buildTwitterEmbedHTML(item.mediaItems[0].url)}
    </div>
</div>
</div>
            <div class="unfiltered-post-content" style="padding: 16px;">
               <div class="unfiltered-footer-row" style="display: flex; align-items: center; gap: 16px; margin-bottom: 0;">
    <p class="unfiltered-caption" style="margin: 0; line-height: 1.5; flex: 1;">${item.caption}</p>

    <button class="unfiltered-share-btn" onclick="shareUnfilteredPost(${item.id})" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: inherit; opacity: 0.8; font-size: 1.1rem; margin-left: auto; flex-shrink: 0;">
    <i class="fa-solid fa-share"></i>
</button>
</div>
        `;

      feedContainer.appendChild(itemEl);
      sawTwitterEmbed = true;
      return;
    }

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
                }" alt="Post content" loading="lazy" style="position: relative; width: 100%; height: 100%; object-fit: cover; z-index: 2; pointer-events: none;">
            </div>
        `,
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
                `,
                  )
                  .join('')}
            </div>
        `
      : '';

    itemEl.innerHTML = `
            <div class="unfiltered-header-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 0.9rem; color: var(--text-color, #ccc);">
                <div class="unfiltered-stat-item" style="display: flex; align-items: center; gap: 6px;">
                    <i class="fa-regular fa-eye"></i>
                    <span id="uf-views-${item.id}">${formatNumber(item.views)}</span>
                </div>
                <div class="unfiltered-header-right" style="display: flex; align-items: center; gap: 6px; opacity: 0.85;">
                    <span class="unfiltered-date">${item.date}</span>
                </div>
            </div>
            <div class="unfiltered-media-container" id="uf-container-${
              item.id
            }" style="position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; user-select: none; background: #000;">
                ${slidesHTML}
                ${arrowsHTML}
                ${dotsHTML}
            </div>
            <div class="unfiltered-post-content" style="padding: 16px;">
                <!-- Footer row above the caption, with the share button -->
               <div class="unfiltered-footer-row" style="display: flex; align-items: center; gap: 16px; margin-bottom: 0;">
    <p class="unfiltered-caption" style="margin: 0; line-height: 1.5; flex: 1;">${item.caption}</p>

    <button class="unfiltered-share-btn" onclick="shareUnfilteredPost(${item.id})" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: inherit; opacity: 0.8; font-size: 1.1rem; margin-left: auto; flex-shrink: 0;">
    <i class="fa-solid fa-share"></i>
</button>
</div>
        `;

    feedContainer.appendChild(itemEl);
    setupUnfilteredGestures(item.id, item.mediaItems.length);
  });

  if (sawThreadsEmbed) {
    reloadThreadsEmbedScript();
  }

  if (sawTwitterEmbed) {
    reloadTwitterEmbeds();
  }

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
    { passive: false },
  );
}

document.addEventListener('DOMContentLoaded', initFirebaseAndData);
