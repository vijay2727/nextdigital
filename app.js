/**
 * Lifelong Online Store Clone - JavaScript Application Logic
 * Interactive E-Commerce UI: Cart Drawer, Live Filters, Modals, Product Database & Timers
 */

// ==========================================================================
// 1. PRODUCT DATABASE (Authentic Lifelong Indian D2C Catalog)
// ==========================================================================
const PRODUCTS = [
  {
    id: 1,
    title: "Lifelong LLTM09 2.5 HP Peak Motorized Incline Treadmill",
    category: "Fitness",
    price: 16999,
    mrp: 35000,
    discount: "51% OFF",
    rating: 4.7,
    reviews: 1420,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    description: "Equipped with a powerful 2.5 HP peak noiseless motor, 12 preset workout programs, auto-incline, 120kg user weight capacity, and shock-absorbing anti-skid running deck.",
    specs: [
      "Motor: 2.5 HP Peak DC Motor (Noiseless)",
      "Speed: 1.0 - 14.0 Km/hr",
      "Display: High-definition LCD with heart rate monitor",
      "Warranty: 3-Year Motor Warranty + 1-Year Parts Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="140" rx="80" ry="12" fill="#e5e5e5"/>
        <polygon points="20,115 180,115 160,135 10,135" fill="#2d3036" stroke="#444"/>
        <polygon points="35,118 170,118 150,132 25,132" fill="#141517"/>
        <line x1="30" y1="125" x2="160" y2="125" stroke="#FF0000" stroke-width="2" stroke-dasharray="6 4"/>
        <path d="M150,115 L190,112 L180,90 L140,93 Z" fill="#222" stroke="#444"/>
        <polygon points="135,93 150,93 125,35 110,35" fill="#2d3036"/>
        <polygon points="155,93 170,93 145,35 130,35" fill="#2d3036"/>
        <rect x="105" y="25" width="45" height="20" rx="2" fill="#0d0e11" stroke="#FF0000"/>
        <rect x="110" y="28" width="35" height="8" rx="1" fill="#082338"/>
        <text x="127" y="34" font-size="5" fill="#00E5FF" font-family="monospace" text-anchor="middle">12.0 KM/H</text>
      </svg>
    `
  },
  {
    id: 2,
    title: "Lifelong LLM99 Foot, Calf & Ankle Massager with Heat Therapy",
    category: "Massagers",
    price: 4999,
    mrp: 12000,
    discount: "58% OFF",
    rating: 4.8,
    reviews: 3142,
    badge: "TOP RATED",
    badgeType: "deal",
    description: "Customized relief for heel spurs, plantar fasciitis, and leg muscle soreness. Features multi-angle kneading nodes, compression airbags, and warm infrared heating.",
    specs: [
      "4 Automatic Massage Modes + 3 Intensity Levels",
      "Therapeutic Soothing Heat System",
      "Removable & Washable Foot Fabric Sleeves",
      "Warranty: 1-Year Comprehensive Brand Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="135" rx="75" ry="12" fill="#e5e5e5"/>
        <path d="M30,105 C30,55 170,55 170,105 L165,130 C165,145 35,145 35,130 Z" fill="#881515" stroke="#b01f1f" stroke-width="2"/>
        <ellipse cx="100" cy="95" rx="60" ry="20" fill="#1b1c20"/>
        <ellipse cx="75" cy="97" rx="18" ry="14" fill="#0d0e10" stroke="#333"/>
        <ellipse cx="125" cy="97" rx="18" ry="14" fill="#0d0e10" stroke="#333"/>
        <rect x="92" y="75" width="16" height="36" rx="3" fill="#111" stroke="#FF0000"/>
        <circle cx="100" cy="85" r="2.5" fill="#00E5FF"/>
        <circle cx="100" cy="97" r="2.5" fill="#22A200"/>
      </svg>
    `
  },
  {
    id: 3,
    title: "Lifelong LL-AF4500 Digital Touchscreen Air Fryer 4.5L",
    category: "Kitchen",
    price: 2699,
    mrp: 6000,
    discount: "55% OFF",
    rating: 4.6,
    reviews: 1890,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    description: "Fry, roast, bake, and grill using 85% less cooking oil. 1400W high-speed air circulation delivers ultra-crisp golden texture on fries, samosas, and kebabs.",
    specs: [
      "Capacity: 4.5 Litres Family Size Basket",
      "Display: Smart Touch LED Panel with 8 Food Presets",
      "Safety: Auto Shut-Off & Overheat Protection",
      "Warranty: 1-Year Lifelong Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="138" rx="65" ry="10" fill="#e5e5e5"/>
        <path d="M55,45 C55,25 145,25 145,45 L150,125 C150,140 50,140 50,125 Z" fill="#1e2024" stroke="#333" stroke-width="2"/>
        <ellipse cx="100" cy="48" rx="38" ry="10" fill="#0c0d0f" stroke="#FF0000"/>
        <text x="100" y="51" font-size="6" fill="#00E5FF" font-family="monospace" font-weight="bold" text-anchor="middle">200°C 18M</text>
        <path d="M60,80 L140,80 L135,130 C135,136 65,136 65,130 Z" fill="#292c33"/>
        <rect x="94" y="90" width="12" height="30" rx="3" fill="#111" stroke="#FF0000"/>
      </svg>
    `
  },
  {
    id: 4,
    title: "Lifelong LLMG23 Power Pro 750W 3-Jar Mixer Grinder",
    category: "Kitchen",
    price: 1499,
    mrp: 3499,
    discount: "57% OFF",
    rating: 4.5,
    reviews: 2410,
    badge: "VALUE PACK",
    badgeType: "new",
    description: "Heavy-duty 750-watt copper winding motor capable of tough masala grinding, smooth batters, and refreshing milkshakes with 3 stainless steel jars.",
    specs: [
      "Motor: 750W Turbo Torque Motor",
      "Jars: 1.5L Liquidizing, 0.8L Dry Grinding, 0.4L Chutney Jar",
      "Blades: High-grade surgical stainless steel",
      "Warranty: 2-Year Motor Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="140" rx="60" ry="10" fill="#e5e5e5"/>
        <!-- Base body -->
        <path d="M65,95 L135,95 L145,135 L55,135 Z" fill="#FFFFFF" stroke="#FF0000" stroke-width="2"/>
        <circle cx="100" cy="115" r="9" fill="#111" stroke="#FF0000"/>
        <line x1="100" y1="115" x2="105" y2="110" stroke="#FF0000" stroke-width="2"/>
        <!-- Stainless Steel Jar -->
        <polygon points="75,95 125,95 130,45 70,45" fill="#e0e0e0" stroke="#999"/>
        <rect x="68" y="40" width="64" height="6" rx="2" fill="#111"/>
        <path d="M130,55 Q145,70 126,85" stroke="#111" stroke-width="4" fill="none"/>
      </svg>
    `
  },
  {
    id: 5,
    title: "Lifelong LLAC02 Magnetic Resistance Indoor Exercise Bike",
    category: "Fitness",
    price: 6499,
    mrp: 14999,
    discount: "56% OFF",
    rating: 4.6,
    reviews: 980,
    badge: "NEW LAUNCH",
    badgeType: "new",
    description: "Ultra-quiet magnetic resistance system with 8-level tension dial, padded ergonomic adjustable saddle, and digital pulse monitor for home cardio workouts.",
    specs: [
      "Resistance: 8-Level Magnetic Tension System",
      "Flywheel: 4 KG Balanced Precision Flywheel",
      "Max User Weight: 110 KG",
      "Warranty: 1-Year Comprehensive Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="142" rx="70" ry="10" fill="#e5e5e5"/>
        <!-- Wheels and Frame -->
        <circle cx="65" cy="115" r="22" stroke="#333" stroke-width="5" fill="#f8f8f8"/>
        <circle cx="135" cy="115" r="22" stroke="#333" stroke-width="5" fill="#f8f8f8"/>
        <!-- Frame Tubes -->
        <line x1="65" y1="115" x2="100" y2="115" stroke="#FF0000" stroke-width="4"/>
        <line x1="100" y1="115" x2="135" y2="115" stroke="#FF0000" stroke-width="4"/>
        <line x1="100" y1="115" x2="85" y2="65" stroke="#FF0000" stroke-width="4"/>
        <line x1="100" y1="115" x2="125" y2="55" stroke="#222" stroke-width="4"/>
        <!-- Seat -->
        <path d="M75,65 L100,65 L90,58 Z" fill="#111"/>
        <!-- Handlebar -->
        <path d="M125,55 L135,45 L120,42" stroke="#111" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    id: 6,
    title: "Lifelong LLPCM05 Rechargeable Cordless Beard Trimmer",
    category: "Grooming",
    price: 699,
    mrp: 1800,
    discount: "61% OFF",
    rating: 4.4,
    reviews: 1650,
    badge: "CLEARANCE",
    badgeType: "deal",
    description: "Self-sharpening stainless steel blades with 20 length settings (0.5mm - 10mm precision), USB fast charging, and up to 60 minutes cordless runtime.",
    specs: [
      "Precision: 0.5mm - 10mm Zoom Wheel Settings",
      "Battery: 60 Mins Runtime on Fast USB Charge",
      "Washable Detachable Head for Easy Cleaning",
      "Warranty: 1-Year Replacement Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="140" rx="40" ry="8" fill="#e5e5e5"/>
        <!-- Trimmer Body -->
        <rect x="86" y="45" width="28" height="85" rx="8" fill="#1b1c20" stroke="#333"/>
        <path d="M88,45 L112,45 L110,25 L90,25 Z" fill="#b0b0b0" stroke="#666"/>
        <line x1="92" y1="25" x2="92" y2="28" stroke="#333"/>
        <line x1="96" y1="25" x2="96" y2="28" stroke="#333"/>
        <line x1="100" y1="25" x2="100" y2="28" stroke="#333"/>
        <line x1="104" y1="25" x2="104" y2="28" stroke="#333"/>
        <circle cx="100" cy="75" r="5" fill="#FF0000"/>
        <rect x="94" y="95" width="12" height="4" rx="2" fill="#00E5FF"/>
      </svg>
    `
  },
  {
    id: 7,
    title: "Lifelong LLEK15 Rapid Boil 1.5L Stainless Steel Kettle",
    category: "Kitchen",
    price: 599,
    mrp: 1499,
    discount: "60% OFF",
    rating: 4.5,
    reviews: 4320,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    description: "Boil 1.5 litres of water in under 4 minutes. Features 360-degree swivel base, cool-touch handle, dry-boil safety protection, and single-touch lid opening.",
    specs: [
      "Power: 1500W Fast Heating Element",
      "Capacity: 1.5 Litres Food Grade Stainless Steel",
      "Safety: Automatic Shut-Off on Boiling",
      "Warranty: 1-Year Brand Warranty"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="138" rx="55" ry="10" fill="#e5e5e5"/>
        <!-- Base -->
        <ellipse cx="100" cy="132" rx="42" ry="7" fill="#111"/>
        <!-- Body -->
        <path d="M68,130 L132,130 L126,65 L74,65 Z" fill="#d8d8d8" stroke="#aaa"/>
        <ellipse cx="100" cy="65" rx="26" ry="6" fill="#111"/>
        <!-- Spout -->
        <polygon points="70,68 60,62 72,78" fill="#c0c0c0"/>
        <!-- Handle -->
        <path d="M125,70 Q145,95 130,125" stroke="#111" stroke-width="6" fill="none" stroke-linecap="round"/>
        <rect x="94" y="100" width="12" height="4" fill="#FF0000"/>
      </svg>
    `
  },
  {
    id: 8,
    title: "Lifelong LLGS23 Toughened Glass Top 3-Burner Gas Stove",
    category: "Kitchen",
    price: 1999,
    mrp: 4999,
    discount: "60% OFF",
    rating: 4.7,
    reviews: 2180,
    badge: "HOT DEAL",
    badgeType: "deal",
    description: "ISI certified shatter-proof 6mm black toughened glass stove. Features 3 high-efficiency brass burners, spill-proof pan supports, and 360-degree gas inlet nozzle.",
    specs: [
      "Glass: 6mm Black Break-Resistant Toughened Glass",
      "Burners: 1 Small, 1 Medium, 1 Jumbo Brass Burners",
      "Certification: ISI Marked with Anti-Skid Rubber Legs",
      "Warranty: 1-Year Warranty on Glass & Burners"
    ],
    svgIcon: `
      <svg viewBox="0 0 200 160" fill="none" class="card-img">
        <ellipse cx="100" cy="140" rx="75" ry="12" fill="#e5e5e5"/>
        <!-- Glass Deck -->
        <polygon points="30,105 170,105 160,125 40,125" fill="#111" stroke="#333"/>
        <rect x="35" y="100" width="130" height="6" rx="2" fill="#222" stroke="#FF0000"/>
        <!-- 3 Burners -->
        <ellipse cx="65" cy="104" rx="14" ry="5" fill="#c99738" stroke="#111"/>
        <ellipse cx="100" cy="104" rx="16" ry="6" fill="#c99738" stroke="#111"/>
        <ellipse cx="135" cy="104" rx="14" ry="5" fill="#c99738" stroke="#111"/>
        <!-- Knobs -->
        <circle cx="65" cy="116" r="4" fill="#555" stroke="#FF0000"/>
        <circle cx="100" cy="116" r="4" fill="#555" stroke="#FF0000"/>
        <circle cx="135" cy="116" r="4" fill="#555" stroke="#FF0000"/>
      </svg>
    `
  }
];

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('lifelong_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('lifelong_wishlist') || '[]');
let currentCategory = 'All';
let appliedDiscount = 0; // in percent or flat INR

// ==========================================================================
// 3. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  initHeroSlider();
  initTimers();
  initSearchAutocomplete();
  initAnnouncementDismiss();
});

// ==========================================================================
// 4. PRODUCT RENDERING & CATEGORY FILTERING
// ==========================================================================
function renderProducts(filter = 'All') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = filter === 'All' 
    ? PRODUCTS 
    : filter === 'Deals'
      ? PRODUCTS.filter(p => p.price < 3000 || p.discount.includes('6'))
      : PRODUCTS.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No products found in this category.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    return `
      <div class="product-card" data-id="${product.id}">
        <span class="card-badge badge-${product.badgeType}">${product.badge}</span>
        
        <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist(${product.id})" 
                aria-label="Save to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#FF0000' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div class="card-media-wrapper" onclick="openQuickView(${product.id})">
          ${product.svgIcon}
          <button class="card-quick-view-btn" type="button">QUICK VIEW</button>
        </div>

        <span class="card-category">${product.category}</span>
        <h3 class="card-title" onclick="openQuickView(${product.id})" title="${product.title}">${product.title}</h3>

        <div class="card-rating">
          <span class="stars">★★★★★</span>
          <span class="card-rating-text">${product.rating} (${product.reviews.toLocaleString('en-IN')})</span>
        </div>

        <div class="card-pricing-row">
          <span class="card-price">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="card-mrp"><del>₹${product.mrp.toLocaleString('en-IN')}</del></span>
          <span class="card-discount-badge">${product.discount}</span>
        </div>

        <button class="card-add-btn" onclick="quickAddToCart(${product.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          ADD TO CART
        </button>
      </div>
    `;
  }).join('');
}

function filterCategory(cat) {
  currentCategory = cat;
  
  // Update Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === cat);
  });

  renderProducts(cat);
}

// ==========================================================================
// 5. CART DRAWER & STATE LOGIC
// ==========================================================================
function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      mrp: product.mrp,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Added to cart: ${product.title.substring(0, 32)}...`);
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Item removed from cart");
}

function saveCart() {
  localStorage.setItem('lifelong_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update header badges
  const cartBadge = document.getElementById('cartBadgeCount');
  const cartHeaderTotal = document.getElementById('cartHeaderTotal');
  const cartDrawerItemCount = document.getElementById('cartDrawerItemCount');

  if (cartBadge) cartBadge.textContent = totalItems;
  if (cartHeaderTotal) cartHeaderTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (cartDrawerItemCount) cartDrawerItemCount.textContent = totalItems;

  // Render items in drawer
  const container = document.getElementById('cartDrawerItems');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h4>Your Shopping Cart is Empty</h4>
        <p>Discover our top-rated treadmills, air fryers, and massagers!</p>
        <button class="btn-primary" onclick="closeCartDrawer(); scrollToSection('productsSection')">EXPLORE PRODUCTS</button>
      </div>
    `;
    document.getElementById('cartDrawerFooter').style.display = 'none';
    return;
  }

  document.getElementById('cartDrawerFooter').style.display = 'block';

  container.innerHTML = cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id) || {};
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          ${prod.svgIcon || ''}
        </div>
        <div class="cart-item-details">
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem(${item.id})" aria-label="Remove item">&times;</button>
      </div>
    `;
  }).join('');

  // Shipping progress bar (Free Gift at ₹3,000 threshold)
  const giftThreshold = 3000;
  const trackerFill = document.getElementById('trackerFill');
  const trackerMsg = document.getElementById('trackerMsg');

  if (trackerFill && trackerMsg) {
    if (subtotal >= giftThreshold) {
      trackerFill.style.width = '100%';
      trackerFill.style.backgroundColor = '#22A200';
      trackerMsg.innerHTML = '🎉 <strong>CONGRATULATIONS!</strong> You unlocked FREE EXPRESS SHIPPING + FREE SHAKER!';
    } else {
      const remaining = giftThreshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / giftThreshold) * 100));
      trackerFill.style.width = `${pct}%`;
      trackerFill.style.backgroundColor = 'var(--color-primary)';
      trackerMsg.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more to unlock a <strong>FREE SHAKER BOTTLE!</strong>`;
    }
  }

  // Summary lines
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  document.getElementById('cartDrawerSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  
  const discountLine = document.getElementById('discountLine');
  if (appliedDiscount > 0) {
    discountLine.style.display = 'flex';
    document.getElementById('cartDrawerDiscount').textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
  } else {
    discountLine.style.display = 'none';
  }

  document.getElementById('cartDrawerGrandTotal').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

// Drawer Toggle Handlers
function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('cartTrigger')?.addEventListener('click', openCartDrawer);

// Coupon Code Logic
function applyCartCoupon() {
  const code = document.getElementById('cartCouponInput').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');

  if (code === 'SAVE10') {
    appliedDiscount = 0.10;
    msg.style.color = '#22A200';
    msg.textContent = '✓ Coupon "SAVE10" applied! 10% Discount subtracted.';
    updateCartUI();
  } else if (code === 'LIFELONG500') {
    appliedDiscount = 0.15;
    msg.style.color = '#22A200';
    msg.textContent = '✓ Special VIP coupon applied! 15% Off.';
    updateCartUI();
  } else {
    msg.style.color = '#FF0000';
    msg.textContent = 'Invalid coupon code. Try "SAVE10"';
  }
}

function proceedToCheckout() {
  if (cart.length === 0) return;
  alert("Redirecting to Lifelong Secure Payment Gateway...\n\nYour Order Total: " + document.getElementById('cartDrawerGrandTotal').textContent);
}

// ==========================================================================
// 6. WISHLIST MANAGEMENT
// ==========================================================================
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index === -1) {
    wishlist.push(productId);
    showToast("Added to Wishlist ❤️");
  } else {
    wishlist.splice(index, 1);
    showToast("Removed from Wishlist");
  }

  localStorage.setItem('lifelong_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts(currentCategory);
}

function updateWishlistUI() {
  const wishlistCount = document.getElementById('wishlistCount');
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

// ==========================================================================
// 7. QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('quickViewModalContent');
  if (!content) return;

  content.innerHTML = `
    <div class="modal-quick-grid">
      <div class="modal-img-col">
        <div class="modal-main-img">
          ${product.svgIcon}
        </div>
      </div>
      <div class="modal-info-col">
        <span class="modal-brand">LIFELONG INDIA • OFFICIAL STORE</span>
        <h2 class="modal-title">${product.title}</h2>
        
        <div class="card-rating">
          <span class="stars">★★★★★</span>
          <span class="card-rating-text">${product.rating} / 5.0 (${product.reviews.toLocaleString('en-IN')} Reviews)</span>
        </div>

        <div class="modal-price-row">
          <span class="modal-price">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="modal-mrp"><del>₹${product.mrp.toLocaleString('en-IN')}</del></span>
          <span class="card-discount-badge">${product.discount}</span>
        </div>

        <p class="modal-desc">${product.description}</p>

        <ul class="modal-specs-list">
          ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
        </ul>

        <div class="modal-actions">
          <button class="btn-primary" onclick="quickAddToCart(${product.id}); closeQuickView();">
            ADD TO CART NOW
          </button>
          <button class="btn-secondary" onclick="toggleWishlist(${product.id}); closeQuickView();">
            WISHLIST
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('quickViewModal')?.classList.add('active');
  document.getElementById('quickViewOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('active');
  document.getElementById('quickViewOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// 8. HERO SLIDER
// ==========================================================================
let currentSlide = 0;
let slideInterval = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('#heroDots .dot');
  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  document.getElementById('heroPrev')?.addEventListener('click', () => {
    const nextIdx = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(nextIdx);
    resetAutoSlide();
  });

  document.getElementById('heroNext')?.addEventListener('click', () => {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      showSlide((currentSlide + 1) % slides.length);
    }, 6000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  startAutoSlide();
}

// ==========================================================================
// 9. COUNTDOWN TIMERS
// ==========================================================================
function initTimers() {
  // Top announcement bar timer: 2 days, 14 hours, 38 mins
  let totalSeconds = 2 * 86400 + 14 * 3600 + 38 * 60 + 49;

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');

    const elD = document.getElementById('timerDays');
    const elH = document.getElementById('timerHours');
    const elM = document.getElementById('timerMins');
    const elS = document.getElementById('timerSecs');

    if (elD) elD.textContent = pad(d);
    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(m);
    if (elS) elS.textContent = pad(s);
  }, 1000);

  // Deal of the day timer
  let dealSeconds = 4 * 3600 + 18 * 60 + 32;
  setInterval(() => {
    if (dealSeconds <= 0) return;
    dealSeconds--;
    const h = Math.floor(dealSeconds / 3600);
    const m = Math.floor((dealSeconds % 3600) / 60);
    const s = dealSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');

    const dealTimer = document.getElementById('dealTimer');
    if (dealTimer) {
      dealTimer.textContent = `${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
    }
  }, 1000);
}

// ==========================================================================
// 10. SEARCH AUTOCOMPLETE & LIVE FILTER
// ==========================================================================
function initSearchAutocomplete() {
  const input = document.getElementById('headerSearchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('searchClearBtn');
  const resultsContainer = document.getElementById('searchResultsList');

  if (!input || !dropdown) return;

  input.addEventListener('focus', () => {
    dropdown.classList.add('active');
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query.length > 0) {
      clearBtn.style.display = 'block';
      const matches = PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        resultsContainer.innerHTML = matches.map(m => `
          <div class="search-result-item" onclick="openQuickView(${m.id})">
            <div class="search-result-img">${m.svgIcon}</div>
            <div class="search-result-info">
              <span class="search-result-title">${m.title}</span>
              <span class="search-result-price">₹${m.price.toLocaleString('en-IN')} <del style="color:#888; font-size:11px;">₹${m.mrp.toLocaleString('en-IN')}</del></span>
            </div>
          </div>
        `).join('');
      } else {
        resultsContainer.innerHTML = `<p style="font-size:12px; color:#888; padding:8px 0;">No matching products found.</p>`;
      }
    } else {
      clearBtn.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    resultsContainer.innerHTML = '';
    input.focus();
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-box')) {
      dropdown.classList.remove('active');
    }
  });
}

function quickSearch(keyword) {
  const input = document.getElementById('headerSearchInput');
  if (input) {
    input.value = keyword;
    input.dispatchEvent(new Event('input'));
  }
}

// ==========================================================================
// 11. PINCODE MODAL & LOGIC
// ==========================================================================
const pincodeTrigger = document.getElementById('pincodeModalTrigger');
if (pincodeTrigger) {
  pincodeTrigger.addEventListener('click', () => {
    document.getElementById('pincodeModal')?.classList.add('active');
    document.getElementById('pincodeOverlay')?.classList.add('active');
  });
}

function closePincodeModal() {
  document.getElementById('pincodeModal')?.classList.remove('active');
  document.getElementById('pincodeOverlay')?.classList.remove('active');
}

function verifyModalPincode() {
  const val = document.getElementById('modalPincodeInput').value.trim();
  const status = document.getElementById('modalPincodeStatus');
  if (val.length === 6 && /^\d+$/.test(val)) {
    status.style.color = '#22A200';
    status.innerHTML = `✓ Delivery available to <strong>${val}</strong>! Free delivery by tomorrow. Partial COD eligible.`;
    document.getElementById('currentPincodeLabel').textContent = `${val} (Verified)`;
    setTimeout(closePincodeModal, 1800);
  } else {
    status.style.color = '#FF0000';
    status.textContent = 'Please enter a valid 6-digit Indian PIN code.';
  }
}

function checkFooterPincode() {
  const val = document.getElementById('footerPincodeInput').value.trim();
  const res = document.getElementById('footerPincodeResult');
  if (val.length === 6 && /^\d+$/.test(val)) {
    res.style.color = '#22A200';
    res.textContent = `✓ PIN ${val} serviceable with zero shipping fee!`;
  } else {
    res.style.color = '#FF0000';
    res.textContent = 'Please enter valid 6 digits.';
  }
}

// ==========================================================================
// 12. ANNOUNCEMENT BAR DISMISS & WARRANTY MODAL
// ==========================================================================
function initAnnouncementDismiss() {
  document.getElementById('closeAnnouncement')?.addEventListener('click', () => {
    document.getElementById('announcementBar')?.classList.add('is-hidden');
  });
}

function showWarrantyModal() {
  alert("LIFELONG WARRANTY & SUPPORT\n\n• All Lifelong products come with 1 to 3 Years Brand Warranty.\n• For on-site service, WhatsApp +91-9711558877 or email customercare@lifelongonline.com.\n• Free reverse pickup & replacement within 7 days of delivery.");
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  alert(`Thank you for subscribing!\n\nUse your VIP Welcome coupon code "LIFELONG500" for 15% OFF your next order.`);
  document.getElementById('newsletterEmail').value = '';
}

// ==========================================================================
// 13. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22A200" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
