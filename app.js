// Catalog Data
const MODS_DATA = [
  {
    id: "ZED ASTRA SKINPACK",
    name: "ZED ASTRA SKINPACK",
    category: "BUS",
    price: 0,
    rating: 4.6,
    reviewsCount: 142,
    image: "assets/ZED ASTRA SKINPACK.png",
    version: "1.50 - 1.60+",
    fileSize: "667 MB",
    releaseDate: "July 2026",
    creator: "SKINPACK",
    downloadUrl: "https://sharemods.com/0v0e6n6u8ieg/ZED_ASTRA_SKINPACK_TEAM_JAR.scs.html",
    shortDesc: "ZED ASTRA SKINPACK FREE RELEASE.",
    description: "ZED ASTRA SKINPACK FREE RELEASE. 5 SKINS. Password in Video. https://youtu.be/iJQtZOmAgBY?si=kdIC_uM0UZTzXhDG",
    features: [
      "High Quality Skin Pack",
      "High Optimized",
      "5 exclusive skins",
      "Free Mod"
    ]
  },
  {
    id: "SILIWANGI 3.0",
    name: "MAP SILIWANGI 3.0",
    category: "MAP",
    price: 400,
    rating: 4.9,
    reviewsCount: 210,
    image: "assets/SILVANGI MAP MOD.jpg",
    version: "1.40 - 1.60+",
    fileSize: "1.6 GB",
    releaseDate: "April 2026",
    creator: "MAP",
    downloadUrl: "https://discord.gg/cZKrkP7fyP",
    shortDesc: "SILVANGI MAP MOD ETS 2 1.40 - 1.60+",
    description: "SILVANGI MAP MOD ETS 2 1.40 - 1.60+. WITH PROFILE AND DLC",
    features: [
      "High Optimized Map Mod",
      "24x7 Support",
      "lifetime update",
      "Profile and DLC",
      "lifetime update"
    ]
  },
  {
    id: "FREE VOCAL PACK",
    name: "FREE VOCAL PACK",
    category: "sounds",
    price: 0,
    rating: 4.9,
    reviewsCount: 210,
    image: "assets/VOCAL MOD.png",
    version: "1.40 - 1.60+",
    fileSize: "10 MB",
    releaseDate: "April 2026",
    creator: "SOUND",
    downloadUrl: "https://sharemods.com/j8fzkmge2sz6/free_vocal_BY_JAR.rar.html",
    shortDesc: "FREE VOCAL PACK ENJOY!",
    description: "Enhance your Euro Truck Simulator 2 experience with this free Vocal Pack. Featuring high-quality voice effects, realistic audio, and seamless compatibility with ETS2 v1.40–1.60+. Easy to install and perfect for making every journey more immersive. Password in Video:https://youtube.com/shorts/gtcvy5HA_Zw?si=h2Y49KvBehGQzvH9",
    features: [
      "High Optimized Vocal Mod",
      "Featuring high-quality voice effects",
      "realistic audio",
      "Easy to install",
      "24x7 Support"
    ]
  }
];

// App State
let cart = [];
let appliedCoupon = null;
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'popular';

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderCatalog();
  setupEventListeners();
  updateCartUI();

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Cookie Preference Popup trigger
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      const banner = document.getElementById('cookieBanner');
      if (banner) banner.classList.add('show');
    }, 1500);
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Search bar input
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      renderCatalog();
    });
  }

  // Category filter tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      renderCatalog();
    });
  });

  // Sorting
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // Cart Drawer open/close
  const cartTrigger = document.getElementById('cartTrigger');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  if (cartTrigger && cartOverlay) {
    cartTrigger.addEventListener('click', () => {
      cartOverlay.classList.add('open');
    });
  }

  if (cartClose && cartOverlay) {
    cartClose.addEventListener('click', () => {
      cartOverlay.classList.remove('open');
    });
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.remove('open');
      }
    });
  }

  // Coupon apply
  const btnApplyCoupon = document.getElementById('applyCouponBtn');
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener('click', applyCoupon);
  }

  // Mod Detail Close
  const detailModalOverlay = document.getElementById('detailModalOverlay');
  const detailModalClose = document.getElementById('detailModalClose');
  if (detailModalClose && detailModalOverlay) {
    detailModalClose.addEventListener('click', () => {
      detailModalOverlay.classList.remove('open');
    });
    detailModalOverlay.addEventListener('click', (e) => {
      if (e.target === detailModalOverlay) {
        detailModalOverlay.classList.remove('open');
      }
    });
  }

  // Detail Modal Tab Toggles (Info vs Features)
  const detailTabTriggers = document.querySelectorAll('.detail-tab-trigger');
  detailTabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      detailTabTriggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');
      const paneId = trigger.dataset.pane;
      document.querySelectorAll('.detail-tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      document.getElementById(paneId).classList.add('active');
    });
  });

  // Checkout Modal
  const btnCheckout = document.getElementById('checkoutBtn');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutClose = document.getElementById('checkoutClose');
  if (btnCheckout && checkoutOverlay) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      cartOverlay.classList.remove('open');
      checkoutOverlay.classList.add('open');
      setupCheckoutFlow();
    });
  }

  if (checkoutClose && checkoutOverlay) {
    checkoutClose.addEventListener('click', () => {
      checkoutOverlay.classList.remove('open');
    });
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) {
        checkoutOverlay.classList.remove('open');
      }
    });
  }

  // Newsletter form
  const joinBtn = document.querySelector('.btn-join');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      alert("Thanks for registering! We've registered your interest for VIP Beta access.");
    });
  }

  // Setup routing for page-views
  document.querySelectorAll('[data-target]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const target = elem.dataset.target;
      showView(target);
    });
  });

  // Setup footer category link actions
  document.querySelectorAll('[data-category-target]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = elem.dataset.categoryTarget;
      
      // 1. Show the catalog view
      showView('catalogView');
      
      // 2. Set the active tab in UI
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === targetCategory) {
          btn.classList.add('active');
        }
      });
      
      // 3. Update active filter & re-render
      currentFilter = targetCategory;
      renderCatalog();
      
      // 4. Scroll smoothly to the store section
      const storeSection = document.getElementById('store');
      if (storeSection) {
        storeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Catalog Rendering
function renderCatalog() {
  const grid = document.getElementById('modsGrid');
  if (!grid) return;

  // Filter items
  let items = MODS_DATA.filter(mod => {
    const matchesCategory = currentFilter === 'all' || mod.category === currentFilter;
    const matchesSearch = mod.name.toLowerCase().includes(currentSearch) || 
                          mod.shortDesc.toLowerCase().includes(currentSearch) ||
                          mod.creator.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });

  // Sort items
  if (currentSort === 'popular') {
    items.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else if (currentSort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  }

  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No mods found</h3>
        <p>Try clearing your filters or typing a different keyword.</p>
      </div>
    `;
    return;
  }

  items.forEach(mod => {
    const card = document.createElement('div');
    card.className = 'mod-card';
    card.innerHTML = `
      <div class="mod-card-img-box">
        <img src="${mod.image}" alt="${mod.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600';">
        <div class="mod-card-badge">${mod.creator}</div>
        <button class="mod-card-details-trigger" onclick="openModDetail('${mod.id}')" title="View details">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <div class="mod-card-content">
        <div class="mod-card-header">
          <span class="mod-card-category">${mod.category}</span>
          <span class="mod-card-version">ETS2 v${mod.version}</span>
        </div>
        <h3 class="mod-card-title">${mod.name}</h3>
        <p class="mod-card-desc">${mod.shortDesc}</p>
        <div class="mod-card-specs">
          <div class="mod-spec-item">
            <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>
            <span>${mod.fileSize}</span>
          </div>
          <div class="mod-spec-item">
            <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span>${mod.rating} (${mod.reviewsCount})</span>
          </div>
        </div>
        <div class="mod-card-footer">
          <div class="mod-card-price-box">
            <span class="mod-card-price-label">Price</span>
            <span class="mod-card-price">₹${mod.price.toFixed(2)}</span>
          </div>
          <a href="${mod.downloadUrl}" target="_blank" rel="noopener" class="btn-mod-add" style="text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Mod Detail Modal
function openModDetail(modId) {
  const mod = MODS_DATA.find(m => m.id === modId);
  if (!mod) return;

  const detailImg = document.getElementById('detailImg');
  const detailTitle = document.getElementById('detailTitle');
  const detailCreator = document.getElementById('detailCreator');
  const detailVersion = document.getElementById('detailVersion');
  const detailSize = document.getElementById('detailSize');
  const detailRelease = document.getElementById('detailRelease');
  const detailRating = document.getElementById('detailRating');
  
  const paneInfo = document.getElementById('paneInfo');
  const featuresList = document.getElementById('featuresList');
  const detailPrice = document.getElementById('detailPrice');

  if (detailImg) {
    detailImg.src = mod.image;
    detailImg.onerror = function() {
      this.src = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600';
    };
  }
  if (detailTitle) detailTitle.textContent = mod.name;
  if (detailCreator) detailCreator.textContent = mod.creator;
  if (detailVersion) detailVersion.textContent = mod.version;
  if (detailSize) detailSize.textContent = mod.fileSize;
  if (detailRelease) detailRelease.textContent = mod.releaseDate;
  if (detailRating) detailRating.innerHTML = `★ ${mod.rating} (${mod.reviewsCount} reviews)`;
  
  if (paneInfo) paneInfo.textContent = mod.description;
  
  if (featuresList) {
    featuresList.innerHTML = '';
    mod.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featuresList.appendChild(li);
    });
  }

  if (detailPrice) detailPrice.textContent = `₹${mod.price.toFixed(2)}`;

  const detailDownloadBtn = document.getElementById('detailDownloadBtn');
  if (detailDownloadBtn) detailDownloadBtn.href = mod.downloadUrl;

  // Reset tab to default info tab
  document.querySelectorAll('.detail-tab-trigger').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-pane="paneInfo"]').classList.add('active');
  document.querySelectorAll('.detail-tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('paneInfo').classList.add('active');

  document.getElementById('detailModalOverlay').classList.add('open');
}

// Cart Mechanics
function addToCart(modId) {
  const mod = MODS_DATA.find(m => m.id === modId);
  if (!mod) return;

  // Avoid duplicate downloads in card cart logic
  if (cart.some(item => item.id === modId)) {
    alert(`${mod.name} is already in your cart.`);
    return;
  }

  cart.push(mod);
  updateCartUI();

  // Micro animation: bounce cart badge
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.style.animation = 'none';
    setTimeout(() => {
      badge.style.animation = '';
    }, 10);
  }

  // Slide open the cart drawer to confirm addition
  document.getElementById('cartOverlay').classList.add('open');
}

function removeFromCart(modId) {
  cart = cart.filter(item => item.id !== modId);
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const itemsContainer = document.getElementById('cartItems');
  const subtotalVal = document.getElementById('subtotalValue');
  const discountRow = document.getElementById('discountRow');
  const discountVal = document.getElementById('discountValue');
  const totalVal = document.getElementById('totalValue');
  
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';
  }

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <p>Your cart is empty.</p>
        <p style="font-size: 0.8rem; margin-top: 8px; color: var(--text-muted);">Browse our catalog and add mod kits to get started.</p>
      </div>
    `;
    subtotalVal.textContent = '₹0.00';
    discountRow.style.display = 'none';
    totalVal.textContent = '₹0.00';
    return;
  }

  itemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600';">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">
          <span class="cart-item-price">₹${item.price.toFixed(2)}</span>
          <button class="btn-item-remove" onclick="removeFromCart('${item.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Remove</span>
          </button>
        </div>
      </div>
    `;
    itemsContainer.appendChild(div);
  });

  subtotalVal.textContent = `₹${subtotal.toFixed(2)}`;

  let discount = 0;
  if (appliedCoupon === 'SPEED') {
    discount = subtotal * 0.15;
    discountRow.style.display = 'flex';
    discountVal.textContent = `-₹${discount.toFixed(2)} (-15%)`;
  } else {
    discountRow.style.display = 'none';
  }

  const finalTotal = subtotal - discount;
  totalVal.textContent = `₹${finalTotal.toFixed(2)}`;
}

// Promo Coupon Codes
function applyCoupon() {
  const input = document.getElementById('couponInput');
  const msg = document.getElementById('couponMsg');
  if (!input) return;

  const val = input.value.trim().toUpperCase();

  if (val === 'SPEED') {
    appliedCoupon = 'SPEED';
    msg.style.display = 'block';
    msg.style.color = 'var(--accent-green)';
    msg.textContent = "Coupon 'SPEED' applied: 15% discount!";
    updateCartUI();
  } else if (val === '') {
    appliedCoupon = null;
    msg.style.display = 'none';
    updateCartUI();
  } else {
    msg.style.display = 'block';
    msg.style.color = 'var(--accent-red)';
    msg.textContent = "Invalid coupon code.";
  }
}

// Checkout Simulator Flow
let checkoutStep = 1;
function setupCheckoutFlow() {
  checkoutStep = 1;
  updateCheckoutStepUI();
  
  // Clear inputs
  document.getElementById('checkoutEmail').value = '';
  document.getElementById('checkoutCard').value = '';
  
  // Set total sum in payment pane
  const finalPriceText = document.getElementById('finalPriceConfirm');
  if (finalPriceText) {
    const totalVal = document.getElementById('totalValue').textContent;
    finalPriceText.textContent = totalVal;
  }

  // Set up next step listeners
  const btnNext1 = document.getElementById('btnNext1');
  const btnNext2 = document.getElementById('btnNext2');

  // Remove existing listeners to avoid multiple binding
  const newBtnNext1 = btnNext1.cloneNode(true);
  btnNext1.parentNode.replaceChild(newBtnNext1, btnNext1);
  newBtnNext1.addEventListener('click', () => {
    const email = document.getElementById('checkoutEmail').value.trim();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    checkoutStep = 2;
    updateCheckoutStepUI();
  });

  const newBtnNext2 = btnNext2.cloneNode(true);
  btnNext2.parentNode.replaceChild(newBtnNext2, btnNext2);
  newBtnNext2.addEventListener('click', () => {
    const card = document.getElementById('checkoutCard').value.trim();
    if (card.length < 12) {
      alert("Please enter a valid card number.");
      return;
    }
    checkoutStep = 3;
    updateCheckoutStepUI();
    triggerSuccessSetup();
  });
}

function updateCheckoutStepUI() {
  // Update step visual indicator bubbles
  document.querySelectorAll('.step-indicator').forEach(indicator => {
    const stepNum = parseInt(indicator.dataset.step);
    indicator.classList.remove('active', 'completed');
    if (stepNum === checkoutStep) {
      indicator.classList.add('active');
    } else if (stepNum < checkoutStep) {
      indicator.classList.add('completed');
    }
  });

  // Display active checkout pane
  document.querySelectorAll('.checkout-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`checkoutPane${checkoutStep}`).classList.add('active');
}

// Order Complete & Speed Download Simulation
function triggerSuccessSetup() {
  const downloadBtn = document.getElementById('btnDownloadMod');
  const progressBarContainer = document.getElementById('downloadProgressBarContainer');
  const progressBar = document.getElementById('downloadProgressBar');
  const statusText = document.getElementById('downloadStatusText');

  // Reset Download components
  if (progressBarContainer) progressBarContainer.style.display = 'none';
  if (progressBar) progressBar.style.width = '0%';
  if (statusText) statusText.style.display = 'none';
  
  if (downloadBtn) {
    downloadBtn.style.display = 'flex';
    downloadBtn.onclick = () => {
      // Begin Simulated Download
      downloadBtn.style.display = 'none';
      progressBarContainer.style.display = 'block';
      statusText.style.display = 'block';

      let progress = 0;
      // Download rate simulation showing extreme speed (500 MB/s download)
      const totalSizeMB = cart.reduce((acc, curr) => acc + parseInt(curr.fileSize), 0) || 500;
      
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4; // increment randomly
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          statusText.textContent = `Completed! ${totalSizeMB}MB downloaded at average speed of 680 MB/s. Files ready.`;

          // Redirect to the actual mod package download
          window.open("https://sharemods.com/0v0e6n6u8ieg/ZED_ASTRA_SKINPACK_TEAM_JAR.scs.html", "_blank");

          // Clear cart
          cart = [];
          updateCartUI();
        } else {
          const currentDownloaded = ((progress / 100) * totalSizeMB).toFixed(1);
          statusText.textContent = `Downloading package... ${currentDownloaded} MB / ${totalSizeMB} MB at 720 MB/s (${progress}%)`;
        }
        progressBar.style.width = `${progress}%`;
      }, 80);
    };
  }
}

// SPA Router View displayer
window.showView = function(viewId) {
  document.querySelectorAll('.page-view').forEach(view => {
    view.style.display = 'none';
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.style.display = 'block';
    targetView.classList.add('active');
  }

  // Update navigation link active class
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.target === viewId) {
      link.classList.add('active');
    }
  });

  // Scroll page smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// FAQ Accordion Handler
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('active');

  // Close all open FAQs
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('active');
    i.querySelector('.faq-answer').style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
};

// Support Form Handler
window.submitSupportTicket = function(event) {
  event.preventDefault();
  document.getElementById('supportForm').style.display = 'none';
  document.getElementById('supportFormSuccess').style.display = 'block';
};

window.resetSupportForm = function() {
  document.getElementById('supportForm').reset();
  document.getElementById('supportForm').style.display = 'block';
  document.getElementById('supportFormSuccess').style.display = 'none';
};

// Cookie Consent Handlers
window.acceptCookies = function(type) {
  localStorage.setItem('cookieConsent', type);
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('show');
    banner.classList.add('hide');
    setTimeout(() => {
      banner.classList.remove('hide');
    }, 500);
  }
};

window.showCookieBanner = function(event) {
  if (event) event.preventDefault();
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('hide');
    banner.classList.add('show');
  }
};
