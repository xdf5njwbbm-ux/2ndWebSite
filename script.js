// ── Expanded Video Data (32 items) ─────────────────────────────
const categories = ["Girls", "Lifestyle", "Trending", "Exclusive", "Vlog", "Behind the Scenes"];
const creators = ["@StudioVault", "@NovaCuts", "@LuxeLife", "@PremiumVibes", "@NightOwl", "@RubyRose"];
const avatars = ["S", "N", "L", "P", "N", "R"];

const VIDEO_DATA = Array.from({ length: 32 }).map((_, i) => {
  const cIdx = i % creators.length;
  const isPremium = i % 5 === 0;
  const isNew = i % 7 === 0 && !isPremium;
  
  let badge = "";
  if (isPremium) badge = "VIP";
  else if (isNew) badge = "NEW";

  return {
    id: i,
    title: `Premium Collection Vol. ${i + 1} - Exclusive Content`,
    badge: badge,
    views: `${(Math.random() * 100 + 1).toFixed(1)}K views`,
    likes: Math.floor(Math.random() * 10000).toLocaleString(),
    time: `${Math.floor(Math.random() * 11 + 1)}d ago`,
    duration: `${Math.floor(Math.random() * 10 + 10)}:${Math.floor(Math.random() * 50 + 10)}`,
    category: categories[i % categories.length],
    creator: creators[cIdx],
    avatar: avatars[cIdx],
    subs: `${(Math.random() * 50 + 5).toFixed(1)}K subscribers`,
    // Generate a consistent gradient per card for the placeholder thumbnail
    bg: `linear-gradient(135deg, rgba(8, 10, 18, 0.4), rgba(8, 10, 18, 0.1)), linear-gradient(${120 + (i * 15)}deg, #13141c 0%, #${(220000 + i * 1111).toString(16)} 40%, #0057b7 100%)`
  };
});

// ── Pagination Logic ───────────────────────────────────────────
const ITEMS_PER_PAGE = 8;
let currentPage = 1;
const totalPages = Math.ceil(VIDEO_DATA.length / ITEMS_PER_PAGE);

const browseList = document.getElementById("browseList");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageDisplay = document.getElementById("currentPageDisplay");
const totalPagesDisplay = document.getElementById("totalPagesDisplay");

function renderBrowsePage(page) {
  browseList.innerHTML = "";
  
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = VIDEO_DATA.slice(startIndex, endIndex);

  pageItems.forEach(v => {
    const badgeHTML = v.badge ? `<span class="content-badge">${v.badge}</span>` : "";
    
    const cardHTML = `
      <article class="content-card" data-video-id="${v.id}" role="button" tabindex="0" aria-label="Open ${v.title}">
        <div class="content-image" style="background: ${v.bg}">
          ${badgeHTML}
          <div class="duration-badge">${v.duration}</div>
        </div>
        <div class="content-info">
          <h3>${v.title}</h3>
          <div class="content-meta-row">
            <span>&#128065; ${v.views}</span>
            <span>&#9200; ${v.time}</span>
          </div>
          <span class="content-category-tag">${v.category}</span>
        </div>
      </article>
    `;
    browseList.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Attach click listeners to new cards
  document.querySelectorAll(".content-card[data-video-id]").forEach((card) => {
    const handler = () => openVideoDetail(Number(card.dataset.videoId));
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); }
    });
  });

  // Update pagination UI
  currentPageDisplay.textContent = page;
  totalPagesDisplay.textContent = totalPages;
  prevPageBtn.disabled = page === 1;
  nextPageBtn.disabled = page === totalPages;
}

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderBrowsePage(currentPage);
    browseList.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderBrowsePage(currentPage);
    browseList.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// Initial render
renderBrowsePage(currentPage);

// ── Shared Video Rendering for Videos View ────────────────────────
const videosViewGrid = document.getElementById("videosViewGrid");
function renderVideosView() {
  if (!videosViewGrid) return;
  videosViewGrid.innerHTML = "";
  
  // Use first 12 items for this demo page
  const pageItems = VIDEO_DATA.slice(0, 12);
  
  pageItems.forEach(v => {
    const badgeHTML = v.badge ? `<span class="content-badge">${v.badge}</span>` : "";
    const cardHTML = `
      <article class="content-card" data-video-id="${v.id}" role="button" tabindex="0">
        <div class="content-image" style="background: ${v.bg}">
          ${badgeHTML}
          <div class="duration-badge">${v.duration}</div>
        </div>
        <div class="content-info">
          <h3>${v.title}</h3>
          <div class="content-meta">
            ${v.creator}<br>
            <span>${v.views}</span> • <span>${v.time}</span>
          </div>
          <div class="content-tags">
            <span class="tag">${v.category}</span>
          </div>
        </div>
      </article>
    `;
    videosViewGrid.insertAdjacentHTML("beforeend", cardHTML);
  });
  
  // Attach click listeners to new cards
  videosViewGrid.querySelectorAll(".content-card[data-video-id]").forEach((card) => {
    const handler = () => {
      openVideoDetail(Number(card.dataset.videoId));
    };
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); }
    });
  });
}
renderVideosView();


// ── View Navigation & Routing ──────────────────────────────────
const homeView       = document.getElementById("homeView");
const videoDetail    = document.getElementById("videoDetail");
const chatView       = document.getElementById("chatView");
const videosView     = document.getElementById("videosView");
const freeVideosView = document.getElementById("freeVideosView");
const profileView    = document.getElementById("profileView");
const premiumView    = document.getElementById("premiumView");

const allViews = [homeView, videoDetail, chatView, videosView, freeVideosView, profileView, premiumView];

function showView(viewToShow) {
  allViews.forEach(v => {
    if (v && v !== viewToShow) v.classList.add("hidden");
  });
  if (viewToShow) {
    viewToShow.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Logo clicks go home
const navLogoBtn = document.getElementById("navLogoBtn");
if (navLogoBtn) {
  navLogoBtn.addEventListener("click", () => showView(homeView));
}

// Video Detail elements
const vdBackBtn    = document.getElementById("vdBackBtn");
const vdGoBack     = document.getElementById("vdGoBack");
const vdTitle      = document.getElementById("vdTitle");
const vdBadge      = document.getElementById("vdBadge");
const vdViews      = document.getElementById("vdViews");
const vdLikes      = document.getElementById("vdLikes");
const vdDuration   = document.getElementById("vdDuration");
const vdCategory   = document.getElementById("vdCategory");
const vdAvatar     = document.getElementById("vdAvatar");
const vdCreator    = document.getElementById("vdCreator");
const vdSubs       = document.getElementById("vdSubs");
const vdLikesBtn   = document.getElementById("vdLikesBtn");

function openVideoDetail(id) {
  const v = VIDEO_DATA[id];
  if (!v) return;

  vdTitle.textContent    = v.title;
  vdBadge.textContent    = v.badge || "";
  vdBadge.style.display  = v.badge ? "inline-block" : "none";
  vdViews.textContent    = v.views;
  vdLikes.textContent    = v.likes + " likes";
  vdDuration.textContent = v.duration;
  vdCategory.textContent = v.category;
  vdAvatar.textContent   = v.avatar;
  vdCreator.textContent  = v.creator;
  vdSubs.textContent     = v.subs;
  vdLikesBtn.textContent = v.likes;

  showView(videoDetail);
}

function closeVideoDetail() {
  showView(homeView);
}

vdBackBtn.addEventListener("click", closeVideoDetail);
vdGoBack.addEventListener("click", closeVideoDetail);


// ── Mobile Menu Toggle ─────────────────────────────────────────
const menuToggle       = document.getElementById("menuToggle");
const mobileMenuOverlay= document.getElementById("mobileMenuOverlay");
const mobileMenuPanel  = document.getElementById("mobileMenuPanel");
const menuCards        = document.querySelectorAll(".menu-grid-card");

if (menuToggle && mobileMenuOverlay && mobileMenuPanel) {
  // Toggle menu
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });

  // Close when clicking outside panel
  mobileMenuOverlay.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      document.body.classList.remove("menu-open");
    }
  });

  // Menu Navigation Routing
  const menuVideosBtn = document.getElementById("menuVideosBtn");
  const menuFreeVideosBtn = document.getElementById("menuFreeVideosBtn");
  const menuChatBtn = document.getElementById("menuChatBtn");
  const menuPremiumBtn = document.getElementById("menuPremiumBtn");

  if (menuVideosBtn) {
    menuVideosBtn.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      showView(videosView);
    });
  }
  if (menuFreeVideosBtn) {
    menuFreeVideosBtn.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      showView(freeVideosView);
    });
  }
  if (menuChatBtn) {
    menuChatBtn.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      showView(chatView);
    });
  }
  if (menuPremiumBtn) {
    menuPremiumBtn.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      showView(premiumView);
    });
  }
}

// ── Profile Dropdown ───────────────────────────────────────────
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const navMyProfileBtn = document.getElementById("navMyProfileBtn");

if (profileBtn && profileDropdown) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("show");
  });
  
  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.remove("show");
    }
  });
}

if (navMyProfileBtn) {
  navMyProfileBtn.addEventListener("click", () => {
    profileDropdown.classList.remove("show");
    showView(profileView);
  });
}

// ── Support FAB ───────────────────────────────────────────────
const supportFabBtn = document.getElementById("supportFabBtn");
const supportMenu = document.getElementById("supportMenu");

if (supportFabBtn && supportMenu) {
  supportFabBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    supportMenu.classList.toggle("open");
    
    // Toggle the icons inside the button
    const closedIcon = supportFabBtn.querySelector(".opened-hidden");
    const openedIcon = supportFabBtn.querySelector(".opened-visible");
    if (closedIcon && openedIcon) {
      if (supportMenu.classList.contains("open")) {
        closedIcon.style.display = "none";
        openedIcon.style.display = "block";
      } else {
        closedIcon.style.display = "block";
        openedIcon.style.display = "none";
      }
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!supportMenu.contains(e.target) && e.target !== supportFabBtn && !supportFabBtn.contains(e.target)) {
      supportMenu.classList.remove("open");
      
      const closedIcon = supportFabBtn.querySelector(".opened-hidden");
      const openedIcon = supportFabBtn.querySelector(".opened-visible");
      if (closedIcon && openedIcon) {
        closedIcon.style.display = "block";
        openedIcon.style.display = "none";
      }
    }
  });
}

// ── Login Gate ──────────────────────────────────────────────────
const loginScreen = document.getElementById("loginScreen");
const appShell    = document.getElementById("appShell");

const signinForm   = document.getElementById("signinForm");
const signupForm   = document.getElementById("signupForm");
const signupPrompt = document.getElementById("signupPrompt");
const signinPrompt = document.getElementById("signinPrompt");
const showSignupBtn= document.getElementById("showSignupBtn");
const showSigninBtn= document.getElementById("showSigninBtn");

if (showSignupBtn && signinForm && signupForm) {
  showSignupBtn.addEventListener("click", () => {
    signinForm.classList.add("hidden");
    signupPrompt.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signinPrompt.classList.remove("hidden");
  });
}

if (showSigninBtn) {
  showSigninBtn.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    signinPrompt.classList.add("hidden");
    signinForm.classList.remove("hidden");
    signupPrompt.classList.remove("hidden");
  });
}

function enterApp() {
  loginScreen.classList.add("fade-out");
  loginScreen.addEventListener("transitionend", () => {
    loginScreen.style.display = "none";
  }, { once: true });
  appShell.classList.remove("hidden");
}

document.getElementById("signInBtn").addEventListener("click", enterApp);
document.getElementById("createAccountBtn").addEventListener("click", enterApp);


// ── Utilities ───────────────────────────────────────────────────
const passwordInput  = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
if(togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });
}

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
const rc1 = document.getElementById("refreshCode1");
if(rc1) rc1.addEventListener("click", () => document.getElementById("verifyCode1").textContent = randomCode());
const rc2 = document.getElementById("refreshCode2");
if(rc2) rc2.addEventListener("click", () => document.getElementById("verifyCode2").textContent = randomCode());

const premiumButton = document.getElementById("openPremium");
const premiumModal  = document.getElementById("premiumModal");
const closePremiumModal = document.getElementById("closePremiumModal");

if(premiumButton && premiumModal) {
  premiumButton.addEventListener("click", () => {
    premiumModal.classList.add("show");
  });

  closePremiumModal.addEventListener("click", () => {
    premiumModal.classList.remove("show");
  });

  premiumModal.addEventListener("click", (e) => {
    if (e.target === premiumModal) {
      premiumModal.classList.remove("show");
    }
  });
}

// ── Premium View UI Interactions ─────────────────────────────────
const premiumToggleBtns = document.querySelectorAll(".premium-toggle-group .p-toggle-btn");
premiumToggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    premiumToggleBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});