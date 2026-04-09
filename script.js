// ── Expanded Video Data (32 items) ─────────────────────────────
const categories = ["All", "Domination", "Foot Worship", "Giant POV"];
const creators = ["Muscle God", "Muscle God", "Muscle God", "Muscle God", "Muscle God", "Muscle God"];
const avatars = ["MG", "MG", "MG", "MG", "MG", "MG"];

// ── Edit these durations to match each video card (cards 1–12) ──
const durations = [
  "5:16",  // Card 1  – Domination Vol. 1
  "5:51",  // Card 2  – Domination Vol. 2
  "4:15", // Card 3  – Domination Vol. 3
  "8:13",  // Card 4  – Domination Vol. 4
  "4:23",  // Card 5  – Domination Vol. 5
  "4:36", // Card 6  – Domination Vol. 6
  "3:13",  // Card 7  – Domination Vol. 7
  "5:49", // Card 8  – Foot Worship Vol. 8
  "5:41",  // Card 9  – Foot Worship Vol. 9
  "5:23", // Card 10 – Foot Worship Vol. 10
  "4:58",  // Card 11 – Foot Worship Vol. 11
  "3:03", // Card 12 – Giant POV Vol. 12
];

// ── Edit these to control the stats shown on each card (cards 1–12) ──
const views  = ["45.2K","28.7K","63.1K","12.4K","89.0K","34.6K","51.3K","22.8K","76.5K","18.9K","40.2K","55.7K"];
const likes  = ["3,841","1,204","5,672","988","7,430","2,115","4,560","1,780","6,320","902","3,200","4,890"];
const times  = ["3d ago","1d ago","5d ago","2d ago","7d ago","4d ago","6d ago","1d ago","8d ago","2d ago","3d ago","5d ago"];
const subs   = ["22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K","22.1K"];

const VIDEO_DATA = Array.from({ length: 12 }).map((_, i) => {
  const cIdx = i % creators.length;
  const isPremium = i % 5 === 0;
  const isNew = i % 7 === 0 && !isPremium;

  let category = "";
  let bg = "";

  // 1-7: Domination
  if (i < 7) {
    category = "Domination";
    const ext = [".jpg", ".png", ".png", ".png", ".png", ".png", ".png"][i];
    bg = `url('assets/images/dom_${i + 1}${ext}') center/cover no-repeat`;
  } 
  // 8-11: Foot Worship
  else if (i < 11) {
    category = "Foot Worship";
    bg = `url('assets/images/foot_${i - 6}.png') center/cover no-repeat`;
  } 
  // 12: Giant POV
  else {
    category = "Giant POV";
    bg = `url('assets/images/giant_1.jpg') center/cover no-repeat`;
  }

  let badge = isPremium ? "VIP" : (isNew ? "NEW" : "");

  return {
    id: i,
    title: `${category} Vol. ${i + 1}`,
    badge: badge,
    views: views[i],
    likes: likes[i],
    time: times[i],
    duration: durations[i],
    category: category,
    creator: creators[cIdx],
    avatar: avatars[cIdx],
    subs: `${subs[i]} subscribers`,
    bg: bg
  };
});

const customVideos = [
  {
    id: 998,
    title: "Exclusive Premium Chokehold",
    badge: "VIP",
    views: "23.5K views",
    likes: "4,440",
    time: "2d ago",
    duration: "2:01",
    category: "Domination",
    creator: creators[0],
    avatar: avatars[0],
    subs: "22.1K subscribers",
    bg: "url('assets/images/img_video_2.png') center/cover no-repeat"
  },
  {
    id: 999,
    title: "Exclusive Foot Worship",
    badge: "NEW",
    views: "18.2K views",
    likes: "2,204",
    time: "1d ago",
    duration: "6:10",
    category: "Foot Worship",
    creator: creators[0],
    avatar: avatars[0],
    subs: "22.1K subscribers",
    bg: "url('assets/images/img_video_1.png') center/cover no-repeat"
  }
];
VIDEO_DATA.unshift(...customVideos);

// ── Shared Video Rendering for Main Grid ──────────────────────────
const videosViewGrid = document.getElementById("videosViewGrid");
const videosSearchInput = document.getElementById("videosSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const popularToggleBtn = document.getElementById("popularToggleBtn");
const popularStatusBadge = document.getElementById("popularStatusBadge");
const videosViewTitle = document.getElementById("videosViewTitle");
const videosViewSubtitle = document.getElementById("videosViewSubtitle");

let isPopularActive = false;
let currentSearchQuery = "";
let activeCategory = "All";

function renderVideosView() {
  if (!videosViewGrid) return;
  videosViewGrid.innerHTML = "";

  // 1. Filter and Sort logic
  let dataCopy = [...VIDEO_DATA];

  // Filter by Category
  if (activeCategory !== "All") {
    dataCopy = dataCopy.filter(v => v.category === activeCategory);
  }

  // Filter by Search Query
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    dataCopy = dataCopy.filter(v => 
      v.title.toLowerCase().includes(query) || 
      v.category.toLowerCase().includes(query) ||
      v.creator.toLowerCase().includes(query)
    );
  }

  // Sort by Popularity
  if (isPopularActive) {
    const parseViewsNum = (str) => {
      const num = parseFloat(str.replace(/[^0-9.]/g, ''));
      return str.toLowerCase().includes('k') ? num * 1000 : num;
    };
    dataCopy.sort((a, b) => parseViewsNum(b.views) - parseViewsNum(a.views));
  }

  // 2. Render all results for this view
  const pageItems = dataCopy;

  if (pageItems.length === 0) {
    videosViewGrid.innerHTML = `
      <div class="no-results-message">
        <span class="icon">🔍</span>
        <p>No videos found matching your filters.</p>
        <button class="clear-filters-link" onclick="resetFilters()">Clear all filters</button>
      </div>
    `;
    return;
  }

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
            ${v.creator}
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
    const handler = () => openVideoDetail(Number(card.dataset.videoId));
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); }
    });
  });
}

// Global reset helper for "No Results"
window.resetFilters = () => {
  activeCategory = "All";
  currentSearchQuery = "";
  isPopularActive = false;
  
  if (videosSearchInput) videosSearchInput.value = "";
  if (popularToggleBtn) popularToggleBtn.classList.remove("active");
  if (popularStatusBadge) popularStatusBadge.classList.add("hidden");
  
  // Reset pills
  document.querySelectorAll(".keyword-pills .pill").forEach(p => {
    p.classList.toggle("active", p.dataset.category === "All");
  });

  updateHeaderText();
  renderVideosView();
};

function updateHeaderText() {
  if (videosViewTitle && videosViewSubtitle) {
    videosViewTitle.textContent = isPopularActive ? "Most Popular Videos" : "Videos";
    videosViewSubtitle.textContent = isPopularActive 
      ? "Showing trending content" 
      : "42,236 videos available";
  }
}

// ── Videos Filter & Toggle Listeners ──────────────────────────────────
if (popularToggleBtn) {
  popularToggleBtn.addEventListener("click", () => {
    isPopularActive = !isPopularActive;
    
    popularToggleBtn.classList.toggle("active", isPopularActive);
    if (popularStatusBadge) popularStatusBadge.classList.toggle("hidden", !isPopularActive);
    
    updateHeaderText();
    renderVideosView();
  });
}

if (videosSearchInput) {
  videosSearchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.trim();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = currentSearchQuery ? "flex" : "none";
    }
    renderVideosView();
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    videosSearchInput.value = "";
    currentSearchQuery = "";
    clearSearchBtn.style.display = "none";
    renderVideosView();
    videosSearchInput.focus();
  });
}

// Category Pills Implementation
document.querySelectorAll(".keyword-pills .pill").forEach(pill => {
  pill.addEventListener("click", () => {
    // Update active UI
    document.querySelectorAll(".keyword-pills .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");

    // Update state and re-render
    activeCategory = pill.dataset.category || "All";
    renderVideosView();
  });
});

// Initial render
renderVideosView();


// ── View Navigation & Routing ──────────────────────────────────
const homeView = document.getElementById("homeView");
const videoDetail = document.getElementById("videoDetail");
const chatView = document.getElementById("chatView");
const freeVideosView = document.getElementById("freeVideosView");
const profileView = document.getElementById("profileView");
const premiumView = document.getElementById("premiumView");
const subscribeView = document.getElementById("subscribeView");
const paymentView = document.getElementById("paymentView");
const optionsView = document.getElementById("optionsView");

const allViews = [homeView, videoDetail, chatView, freeVideosView, profileView, premiumView, subscribeView, paymentView, optionsView];

// Track current view to allow instant swapping without redundant loops
let activeView = homeView; 

function showView(viewToShow) {
  if (!viewToShow) return;

  if (activeView === viewToShow) {
    // Already on this view — still force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return;
  }

  // Swap views
  if (activeView) activeView.classList.add("hidden");
  viewToShow.classList.remove("hidden");
  activeView = viewToShow;

  // Scroll to top AFTER view is visible — works on iOS, Android, and desktop
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Logo clicks go home
const navLogoBtn = document.getElementById("navLogoBtn");
if (navLogoBtn) {
  navLogoBtn.addEventListener("click", () => showView(homeView));
}

// Video Detail elements
const vdBackBtn = document.getElementById("vdBackBtn");
const vdGoBack = document.getElementById("vdGoBack");
const vdTitle = document.getElementById("vdTitle");
const vdBadge = document.getElementById("vdBadge");
const vdViews = document.getElementById("vdViews");
const vdLikes = document.getElementById("vdLikes");
const vdDuration = document.getElementById("vdDuration");
const vdCategory = document.getElementById("vdCategory");
const vdAvatar = document.getElementById("vdAvatar");
const vdCreator = document.getElementById("vdCreator");
const vdSubs = document.getElementById("vdSubs");
const vdLikesBtn = document.getElementById("vdLikesBtn");
const vdPremiumCta = document.getElementById("vdPremiumCta");

function openVideoDetail(id) {
  // Redirect any video click straight to payment options for ultimate conversion
  showView(optionsView);
}

function closeVideoDetail() {
  showView(homeView);
}

vdBackBtn.addEventListener("click", closeVideoDetail);
vdGoBack.addEventListener("click", closeVideoDetail);

if (vdPremiumCta) {
  vdPremiumCta.addEventListener("click", () => {
    showView(optionsView);
  });
}

const subGoBackBtn = document.getElementById("subGoBackBtn");
if (subGoBackBtn) {
  subGoBackBtn.addEventListener("click", () => {
    showView(homeView);
  });
}


// ── Mobile Menu Toggle ─────────────────────────────────────────
const menuToggle = document.getElementById("menuToggle");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuPanel = document.getElementById("mobileMenuPanel");
const menuCards = document.querySelectorAll(".menu-grid-card");

if (menuToggle && mobileMenuOverlay && mobileMenuPanel) {
  // Toggle menu
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
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
    menuVideosBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.remove("menu-open");
      showView(homeView);
      
      // Target the integrated video section on home page
      setTimeout(() => {
        const anchor = document.getElementById("videosAnchor");
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  }
  if (menuFreeVideosBtn) {
    menuFreeVideosBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.remove("menu-open");
      showView(freeVideosView);
    });
  }
  if (menuChatBtn) {
    menuChatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.remove("menu-open");
      window.open("https://t.me/musclegodmaddox", "_blank");
    });
  }
  if (menuPremiumBtn) {
    menuPremiumBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.remove("menu-open");
      showView(optionsView);
    });
  }
}

// ── Profile Dropdown ───────────────────────────────────────────
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const navMyProfileBtn = document.getElementById("navMyProfileBtn");

// ── Notification Dropdown ───────────────────────────────────────
const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");

if (notificationBtn && notificationDropdown) {
  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle("show");
    notificationBtn.classList.toggle("active");
    if (profileDropdown) profileDropdown.classList.remove("show");
  });

  document.addEventListener("click", (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
      notificationDropdown.classList.remove("show");
      notificationBtn.classList.remove("active");
    }
  });
}

if (profileBtn && profileDropdown) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("show");

    // Close notification if open
    if (notificationDropdown) {
      notificationDropdown.classList.remove("show");
      notificationBtn.classList.remove("active");
    }
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
const appShell = document.getElementById("appShell");

const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");
const signupPrompt = document.getElementById("signupPrompt");
const signinPrompt = document.getElementById("signinPrompt");
const showSignupBtn = document.getElementById("showSignupBtn");
const showSigninBtn = document.getElementById("showSigninBtn");

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
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });
}

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const signupPasswordInput = document.getElementById("signupPasswordInput");
const toggleSignupPassword = document.getElementById("toggleSignupPassword");
if (toggleSignupPassword && signupPasswordInput) {
  toggleSignupPassword.addEventListener("click", () => {
    const isHidden = signupPasswordInput.type === "password";
    signupPasswordInput.type = isHidden ? "text" : "password";
    // Using simple text toggle as before, but can be iconized in CSS
    const eyeIcon = toggleSignupPassword.querySelector(".eye-icon");
    if (eyeIcon) {
      eyeIcon.textContent = isHidden ? "🙈" : "👁";
    }
  });
}
const rc1 = document.getElementById("refreshCode1");
if (rc1) rc1.addEventListener("click", () => document.getElementById("verifyCode1").textContent = randomCode());
const rc2 = document.getElementById("refreshCode2");
if (rc2) rc2.addEventListener("click", () => document.getElementById("verifyCode2").textContent = randomCode());

const premiumButton = document.getElementById("openPremium");

if (premiumButton) {
  premiumButton.addEventListener("click", () => {
    // skip the bundle overview and go straight to options for a faster path
    showView(optionsView);
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

// ── Payment Flow Navigation ──────────────────────────────
const subNowBtns = document.querySelectorAll(".subscribe-now-btn");
const payGoBackBtn = document.getElementById("payGoBackBtn");
const billingForm = document.getElementById("billingForm");

if (subNowBtns) {
  subNowBtns.forEach(btn => {
    btn.addEventListener("click", () => showView(paymentView));
  });
}

const optGoBackBtn = document.getElementById("optGoBackBtn");
if (optGoBackBtn) {
  optGoBackBtn.addEventListener("click", () => showView(homeView));
}


// Add generic handlers for other options
const optCashApp = document.getElementById("optCashApp");
if (optCashApp) {
  optCashApp.addEventListener("click", () => {
    window.open("https://cash.app/$JackedAlpha", "_blank");
  });
}

const optVenmo = document.getElementById("optVenmo");
if (optVenmo) {
  optVenmo.addEventListener("click", () => {
    window.open("https://venmo.com/u/JackedAlpha", "_blank");
  });
}

// ── Telegram Redirects ───────────────────────────────────────────
const telegramLink = "https://t.me/musclegodmaddox";
const menuCustomBtn = document.getElementById("menuCustomBtn");
const menuDirectBtn = document.getElementById("menuDirectBtn");
const statCustomBtn = document.getElementById("statCustomBtn");

[menuCustomBtn, menuDirectBtn, statCustomBtn].forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      window.open(telegramLink, "_blank");
    });
  }
});

const optAmazon = document.getElementById("optAmazon");
if (optAmazon) {
  optAmazon.addEventListener("click", () => {
    window.open("https://www.amazon.com/hz/wishlist/ls/1BD87YHL498Z6?ref_=wl_share", "_blank");
  });
}

const optThrone = document.getElementById("optThrone");
if (optThrone) {
  optThrone.addEventListener("click", () => {
    window.open("https://throne.com/flexmasterkyle", "_blank");
  });
}

['optCrypto'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      alert(`You selected ${id.replace('opt', '')}. Instructions for this method will be provided here.`);
    });
  }
});

if (payGoBackBtn) {
  payGoBackBtn.addEventListener("click", () => showView(optionsView));
}

if (billingForm) {
  billingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = billingForm.querySelector(".pay-now-btn span");
    if (btn) btn.textContent = "Processing...";

    setTimeout(() => {
      alert("Payment Successful! Your VIP Membership is now active.");
      showView(homeView);
      if (btn) btn.textContent = "Complete Payment";
      billingForm.reset();
    }, 2000);
  });
}
// ── AGE VERIFICATION LOGIC ───────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const ageGate = document.getElementById("ageVerification");
  const ageUnavailable = document.getElementById("ageUnavailable");
  const ageYesBtn = document.getElementById("ageYesBtn");
  const ageNoBtn = document.getElementById("ageNoBtn");
  const ageBackBtn = document.getElementById("ageBackBtn");

  if (ageYesBtn && ageGate) {
    ageYesBtn.addEventListener("click", () => {
      ageGate.classList.add("fade-out");
      // Wait for animation then hide
      setTimeout(() => {
        ageGate.style.display = "none";
      }, 500);

      // Bypass login and enter app directly
      if (typeof enterApp === "function") {
        enterApp();
      }
    });
  }

  if (ageNoBtn && ageGate && ageUnavailable) {
    ageNoBtn.addEventListener("click", () => {
      ageGate.classList.add("hidden");
      ageUnavailable.classList.remove("hidden");
    });
  }

  if (ageBackBtn && ageGate && ageUnavailable) {
    ageBackBtn.addEventListener("click", () => {
      ageUnavailable.classList.add("hidden");
      ageGate.classList.remove("hidden");
    });
  }
});
