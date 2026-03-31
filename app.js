/* =============================================
   DRIVEEASE — ENHANCED PREMIUM CAR RENTAL
   app.js (with image upload & interactivity)
   ============================================= */

"use strict";

// =============================================
// DATA STORE
// =============================================

const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(key); }
};

// =============================================
// SEED DATA WITH CAR IMAGES
// =============================================

const SEED_VEHICLES = [
  { 
    id: 'v1', name: 'Toyota Camry', type: 'sedan', price: 2200, seats: 5, 
    status: 'approved', vendorId: 'vendor1', vendorName: 'SpeedRent Co.',
    desc: 'Comfortable full-size sedan, perfect for business trips.',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop'],
    trending: true, rating: 4.8, bookings: 142
  },
  { 
    id: 'v2', name: 'Honda CR-V', type: 'suv', price: 3000, seats: 7,
    status: 'approved', vendorId: 'vendor2', vendorName: 'TopDrive Rentals',
    desc: 'Versatile 7-seater SUV great for family road trips.',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop'],
    trending: true, rating: 4.9, bookings: 198
  },
  { 
    id: 'v3', name: 'Hyundai i20', type: 'hatchback', price: 1200, seats: 5,
    status: 'approved', vendorId: 'vendor1', vendorName: 'SpeedRent Co.',
    desc: 'Fuel-efficient city hatchback, easy to drive and park.',
    images: ['https://images.unsplash.com/photo-1552519507-0f70e2690ed0?w=600&h=400&fit=crop'],
    trending: false, rating: 4.5, bookings: 87
  },
  { 
    id: 'v4', name: 'BMW 5 Series', type: 'luxury', price: 6500, seats: 5,
    status: 'approved', vendorId: 'vendor3', vendorName: 'Luxury Wheels',
    desc: 'Premium luxury sedan with top-class interiors.',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop'],
    trending: true, rating: 5.0, bookings: 234
  },
  { 
    id: 'v5', name: 'Tata Nexon', type: 'suv', price: 1800, seats: 5,
    status: 'approved', vendorId: 'vendor2', vendorName: 'TopDrive Rentals',
    desc: 'Compact SUV with stellar safety ratings.',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop'],
    trending: false, rating: 4.6, bookings: 65
  },
  { 
    id: 'v6', name: 'Mercedes E-Class', type: 'luxury', price: 8000, seats: 5,
    status: 'pending', vendorId: 'vendor3', vendorName: 'Luxury Wheels',
    desc: 'Business class luxury with advanced tech features.',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'],
    trending: false, rating: 4.9, bookings: 0
  },
];

const SEED_VENDORS = [
  { id: 'vendor1', name: 'SpeedRent Co.',    email: 'speed@rent.com',    password: '123456', status: 'approved' },
  { id: 'vendor2', name: 'TopDrive Rentals', email: 'top@drive.com',     password: '123456', status: 'approved' },
  { id: 'vendor3', name: 'Luxury Wheels',    email: 'luxury@wheels.com', password: '123456', status: 'pending'  },
];

const SEED_USERS = [
  { id: 'user1', name: 'Arjun Kumar', email: 'arjun@example.com', password: '123456', phone: '+91 98765 43210', city: 'Chennai' },
  { id: 'user2', name: 'Sneha Mehta', email: 'sneha@example.com', password: '123456', phone: '+91 91234 56789', city: 'Mumbai'  },
];

const SEED_BOOKINGS = [
  { id: 'b1', userId: 'user1', userName: 'Arjun Kumar', userEmail: 'arjun@example.com', userPhone: '+91 98765 43210', userCity: 'Chennai', vehicleId: 'v1', vehicleName: 'Toyota Camry', startDate: '2025-04-01', endDate: '2025-04-03', days: 2, total: 4400,  status: 'confirmed', bookedAt: '2025-03-28T09:00:00' },
  { id: 'b2', userId: 'user2', userName: 'Sneha Mehta', userEmail: 'sneha@example.com', userPhone: '+91 91234 56789', userCity: 'Mumbai',  vehicleId: 'v4', vehicleName: 'BMW 5 Series',    startDate: '2025-04-05', endDate: '2025-04-07', days: 2, total: 13000, status: 'confirmed', bookedAt: '2025-03-27T14:30:00' },
];

function initStore() {
  if (!Store.get('vehicles')) Store.set('vehicles', SEED_VEHICLES);
  if (!Store.get('vendors'))  Store.set('vendors',  SEED_VENDORS);
  if (!Store.get('users'))    Store.set('users',    SEED_USERS);
  if (!Store.get('bookings')) Store.set('bookings', SEED_BOOKINGS);
  if (!Store.get('messages')) Store.set('messages', []);
}

// =============================================
// COMPARATORS
// =============================================

const Comparators = {
  byName:      (a, b) => a.name.localeCompare(b.name),
  byPriceAsc:  (a, b) => a.price - b.price,
  byPriceDesc: (a, b) => b.price - a.price,
  byRating:    (a, b) => (b.rating || 0) - (a.rating || 0),
  byStatus:    (a, b) => (a.status || '').localeCompare(b.status || ''),
  byDate:      (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt),
  byEmail:     (a, b) => a.email.localeCompare(b.email),
};

// =============================================
// FUNCTIONAL UTILS
// =============================================

const filterByKey  = (arr, key, val) => arr.filter(item => item[key] === val);
const sortBy       = (arr, cmp)      => [...arr].sort(cmp);
const search       = (arr, keys, q)  => arr.filter(item => keys.some(k => (item[k] || '').toLowerCase().includes(q.toLowerCase())));
const mapVehicleCards = vehicles     => vehicles.map(renderVehicleCard).join('');

// =============================================
// STATE
// =============================================

let currentUser   = null;
let currentRole   = null; // 'user' | 'admin' | 'vendor'
let bookingTarget = null;
let uploadedImages = []; // For vendor vehicle image upload
let currentTypeFilter = ''; // For filter tags

// =============================================
// LOADER & INIT
// =============================================

window.addEventListener('load', () => {
  initStore();
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    animateCounters();
    renderTrendingVehicles();
  }, 1800);
});

// =============================================
// ANIMATED COUNTERS
// =============================================

function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target + (counter.textContent.includes('%') ? '%' : (target > 1000 ? '+' : '+'));
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : (target > 1000 ? '' : ''));
      }
    }, 16);
  });
}

// =============================================
// TRENDING VEHICLES
// =============================================

function renderTrendingVehicles() {
  const vehicles = (Store.get('vehicles') || [])
    .filter(v => v.status === 'approved' && v.trending)
    .sort((a, b) => (b.bookings || 0) - (a.bookings || 0))
    .slice(0, 3);
  
  const container = document.getElementById('trendingVehicles');
  if (!container) return;
  
  container.innerHTML = vehicles.map(v => `
    <div class="vehicle-card" onclick="openVehicleDetail('${v.id}')">
      <div class="vehicle-card-img">
        <img src="${v.images[0]}" alt="${v.name}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'"/>
        <span class="vehicle-type-badge">${v.type}</span>
        <span class="vehicle-trending-badge"><i class="fas fa-fire"></i> TRENDING</span>
      </div>
      <div class="vehicle-card-body">
        <div class="vehicle-card-name">${v.name}</div>
        <div class="vehicle-card-meta">
          <span><i class="fas fa-users"></i> ${v.seats} Seats</span>
          <span><i class="fas fa-star"></i> ${v.rating || 4.5}</span>
          <span><i class="fas fa-store"></i> ${v.vendorName}</span>
        </div>
        <div class="vehicle-card-footer">
          <div class="vehicle-price">₹${v.price.toLocaleString()} <span>/ day</span></div>
          <button class="btn-small btn-book" onclick="event.stopPropagation(); ${currentUser && currentRole === 'user' ? `openBookingModal('${v.id}')` : `openModal('signinModal')`}">
            <i class="fas fa-calendar-plus"></i> Book
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// =============================================
// NAVBAR
// =============================================

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// =============================================
// PAGE ROUTING
// =============================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
  document.getElementById('navLinks').classList.remove('open');
  if (pageId === 'vehicles')         renderPublicVehicles();
  if (pageId === 'user-dashboard')   loadUserDashboard();
  if (pageId === 'admin-dashboard')  loadAdminDashboard();
  if (pageId === 'vendor-dashboard') loadVendorDashboard();
  if (pageId === 'home')             renderTrendingVehicles();
}

// =============================================
// MODALS
// =============================================

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
function switchModal(fromId, toId) {
  closeModal(fromId);
  setTimeout(() => openModal(toId), 150);
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
});

// =============================================
// TOAST
// =============================================

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${getToastIcon(type)} ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
function getToastIcon(type) {
  if (type === 'success') return '<i class="fas fa-check-circle"></i>';
  if (type === 'error')   return '<i class="fas fa-times-circle"></i>';
  return '<i class="fas fa-info-circle"></i>';
}

// =============================================
// AUTH — USER
// =============================================

function signUp() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPass').value;
  if (!name || !email || !pass) { showToast('Please fill all fields', 'error'); return; }
  if (pass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  const users = Store.get('users') || [];
  if (users.find(u => u.email === email)) { showToast('Email already registered', 'error'); return; }
  const newUser = { id: 'u_' + Date.now(), name, email, password: pass, phone: '', city: '', joinedAt: new Date().toISOString() };
  users.push(newUser);
  Store.set('users', users);
  currentUser = newUser; currentRole = 'user';
  closeModal('signupModal');
  showToast(`Welcome, ${name}! 🎉`, 'success');
  updateNavForAuth();
  showPage('user-dashboard');
}

function signIn() {
  const email = document.getElementById('signinEmail').value.trim();
  const pass  = document.getElementById('signinPass').value;
  if (!email || !pass) { showToast('Please fill all fields', 'error'); return; }
  const users = Store.get('users') || [];
  const user  = users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('Invalid email or password', 'error'); return; }
  currentUser = user; currentRole = 'user';
  closeModal('signinModal');
  showToast(`Welcome back, ${user.name}!`, 'success');
  updateNavForAuth();
  showPage('user-dashboard');
}

function adminLogin() {
  closeModal('signupModal'); closeModal('signinModal');
  currentUser = { id: 'admin', name: 'Admin', email: 'admin@driveease.com' };
  currentRole = 'admin';
  showToast('Admin access granted', 'success');
  updateNavForAuth();
  showPage('admin-dashboard');
}

function signOut() {
  currentUser = null; currentRole = null;
  showToast('Signed out successfully', 'info');
  updateNavForAuth();
  showPage('home');
}

// =============================================
// NAV UPDATE AFTER AUTH
// =============================================

function updateNavForAuth() {
  const actions = document.getElementById('navActions');
  if (currentUser && currentRole !== null) {
    const initial = (currentUser.name || 'U').charAt(0).toUpperCase();
    const roleLabel = currentRole === 'admin' ? 'Admin' : currentRole === 'vendor' ? 'Vendor' : 'My Account';
    const dashPage  = currentRole === 'admin' ? 'admin-dashboard' : currentRole === 'vendor' ? 'vendor-dashboard' : 'user-dashboard';
    actions.innerHTML = `
      <div class="nav-user-pill" onclick="showPage('${dashPage}')">
        <div class="nav-avatar">${initial}</div>
        <span>${roleLabel}</span>
        <i class="fas fa-chevron-right" style="font-size:0.7rem; opacity:0.6;"></i>
      </div>
      <button class="btn-outline btn-signout-small" onclick="signOut()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
    `;
    renderTrendingVehicles();
  } else {
    actions.innerHTML = `
      <button class="btn-outline" onclick="openModal('signinModal')">Sign In</button>
      <button class="btn-primary" onclick="openModal('signupModal')">Get Started</button>
      <button class="btn-outline vendor-btn" onclick="openModal('vendorSigninModal')">Vendor</button>
    `;
  }
}

// =============================================
// AUTH — VENDOR
// =============================================

function vendorSignUp() {
  const name  = document.getElementById('vendorName').value.trim();
  const email = document.getElementById('vendorEmail').value.trim();
  const pass  = document.getElementById('vendorPass').value;
  if (!name || !email || !pass) { showToast('Please fill all fields', 'error'); return; }
  if (pass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  const vendors = Store.get('vendors') || [];
  if (vendors.find(v => v.email === email)) { showToast('Email already registered', 'error'); return; }
  const nv = { id: 'vnd_' + Date.now(), name, email, password: pass, status: 'pending', joinedAt: new Date().toISOString() };
  vendors.push(nv);
  Store.set('vendors', vendors);
  currentUser = nv; currentRole = 'vendor';
  closeModal('vendorSignupModal');
  showToast('Vendor account created! Pending admin approval.', 'success');
  updateNavForAuth();
  showPage('vendor-dashboard');
}

function vendorSignIn() {
  const email = document.getElementById('vendorSigninEmail').value.trim();
  const pass  = document.getElementById('vendorSigninPass').value;
  if (!email || !pass) { showToast('Please fill all fields', 'error'); return; }
  const vendors = Store.get('vendors') || [];
  const vendor  = vendors.find(v => v.email === email && v.password === pass);
  if (!vendor) { showToast('Invalid email or password', 'error'); return; }
  currentUser = vendor; currentRole = 'vendor';
  closeModal('vendorSigninModal');
  showToast(`Welcome, ${vendor.name}!`, 'success');
  updateNavForAuth();
  showPage('vendor-dashboard');
}

// =============================================
// IMAGE UPLOAD WITH PREVIEW
// =============================================

function previewImages(event) {
  const files = event.target.files;
  if (files.length > 5) {
    showToast('Maximum 5 images allowed', 'error');
    event.target.value = '';
    return;
  }
  
  uploadedImages = [];
  const container = document.getElementById('imagePreviewContainer');
  container.innerHTML = '';
  
  Array.from(files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.push(e.target.result);
      
      const preview = document.createElement('div');
      preview.className = 'image-preview-item';
      preview.innerHTML = `
        <img src="${e.target.result}" alt="Preview ${index + 1}"/>
        <button type="button" class="image-preview-remove" onclick="removeImage(${index})">
          <i class="fas fa-times"></i>
        </button>
      `;
      container.appendChild(preview);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index) {
  uploadedImages.splice(index, 1);
  document.getElementById('vehImages').value = '';
  
  const container = document.getElementById('imagePreviewContainer');
  const items = container.querySelectorAll('.image-preview-item');
  if (items[index]) items[index].remove();
}

// =============================================
// PROFILE
// =============================================

function saveProfile() {
  const name  = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const city  = document.getElementById('profileCity').value.trim();
  const users = Store.get('users') || [];
  const idx   = users.findIndex(u => u.id === currentUser.id);
  if (idx === -1) return;
  users[idx] = { ...users[idx], name, phone, city };
  Store.set('users', users);
  currentUser = users[idx];
  document.getElementById('userNameSidebar').textContent      = name;
  document.getElementById('userAvatarSidebar').textContent    = name.charAt(0).toUpperCase();
  updateNavForAuth();
  showToast('Profile saved!', 'success');
}

function deleteAccount() {
  if (!confirm('Are you sure? This cannot be undone.')) return;
  Store.set('users', (Store.get('users') || []).filter(u => u.id !== currentUser.id));
  currentUser = null; currentRole = null;
  showToast('Account deleted.', 'info');
  updateNavForAuth();
  showPage('home');
}

// =============================================
// CONTACT FORM (Public)
// =============================================

function submitContact() {
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();
  if (!name || !email || !subject || !message) { showToast('Please fill all fields', 'error'); return; }
  const msgs = Store.get('messages') || [];
  msgs.push({ id: 'msg_' + Date.now(), name, email, subject, message, sentAt: new Date().toISOString(), type: 'public' });
  Store.set('messages', msgs);
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactSubject').value = '';
  document.getElementById('contactMessage').value = '';
  showToast('Message sent to admin! We\'ll reply shortly.', 'success');
}

// =============================================
// CONTACT ADMIN (User Dashboard)
// =============================================

function submitUserContact() {
  const subject = document.getElementById('userContactSubject').value;
  const message = document.getElementById('userContactMessage').value.trim();
  if (!subject || !message) { showToast('Please fill all fields', 'error'); return; }
  const msgs = Store.get('messages') || [];
  msgs.push({
    id: 'msg_' + Date.now(),
    name: currentUser.name,
    email: currentUser.email,
    subject, message,
    sentAt: new Date().toISOString(),
    type: 'user'
  });
  Store.set('messages', msgs);
  document.getElementById('userContactSubject').value = '';
  document.getElementById('userContactMessage').value = '';
  showToast('Message sent to admin!', 'success');
}

// =============================================
// USER DASHBOARD
// =============================================

function loadUserDashboard() {
  if (!currentUser) return;
  document.getElementById('userNameSidebar').textContent   = currentUser.name || 'User';
  document.getElementById('userAvatarSidebar').textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
  document.getElementById('profileName').value  = currentUser.name  || '';
  document.getElementById('profileEmail').value = currentUser.email || '';
  document.getElementById('profilePhone').value = currentUser.phone || '';
  document.getElementById('profileCity').value  = currentUser.city  || '';
  loadUserBookings();
  loadDashVehicles();
}

function loadUserBookings() {
  const bookings  = Store.get('bookings') || [];
  const myBookings = sortBy(filterByKey(bookings, 'userId', currentUser.id), Comparators.byDate);
  const container  = document.getElementById('userBookingsList');
  if (myBookings.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No bookings yet. Browse our fleet and book your first ride!</p></div>`;
    return;
  }
  container.innerHTML = myBookings.map(b => `
    <div class="booking-card">
      <div class="booking-card-header">
        <div class="booking-icon"><i class="fas fa-car"></i></div>
        <div class="booking-car-info">
          <h4>${b.vehicleName}</h4>
          <div class="booking-dates-row"><i class="fas fa-calendar"></i> ${b.startDate} → ${b.endDate} &nbsp;·&nbsp; ${b.days} day(s)</div>
        </div>
        <div class="booking-right">
          <div class="booking-price">₹${b.total.toLocaleString()}</div>
          <span class="vehicle-status-badge status-approved">${b.status}</span>
        </div>
      </div>
      <div class="booking-user-details">
        <div class="bud-title"><i class="fas fa-id-card"></i> Your Booking Details</div>
        <div class="bud-grid">
          <div class="bud-item"><span class="bud-label">Name</span><span class="bud-val">${b.userName}</span></div>
          <div class="bud-item"><span class="bud-label">Email</span><span class="bud-val">${b.userEmail || currentUser.email}</span></div>
          <div class="bud-item"><span class="bud-label">Phone</span><span class="bud-val">${b.userPhone || currentUser.phone || '—'}</span></div>
          <div class="bud-item"><span class="bud-label">City</span><span class="bud-val">${b.userCity || currentUser.city || '—'}</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadDashVehicles() {
  const vehicles = filterByKey(Store.get('vehicles') || [], 'status', 'approved');
  document.getElementById('dashVehiclesGrid').innerHTML = mapVehicleCards(vehicles);
}

function filterDashVehicles() {
  const query = document.getElementById('dashVehicleSearch').value;
  const type  = document.getElementById('dashTypeFilter').value;
  let vehicles = filterByKey(Store.get('vehicles') || [], 'status', 'approved');
  if (type)  vehicles = filterByKey(vehicles, 'type', type);
  if (query) vehicles = search(vehicles, ['name', 'type'], query);
  document.getElementById('dashVehiclesGrid').innerHTML = mapVehicleCards(vehicles);
}

function showDashTab(tabId, el) {
  document.querySelectorAll('#page-user-dashboard .dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-user-dashboard .sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  el.classList.add('active');
}

// =============================================
// PUBLIC VEHICLES PAGE WITH FILTER TAGS
// =============================================

function renderPublicVehicles() {
  let vehicles = filterByKey(Store.get('vehicles') || [], 'status', 'approved');
  if (currentTypeFilter) vehicles = filterByKey(vehicles, 'type', currentTypeFilter);
  document.getElementById('vehiclesGrid').innerHTML = mapVehicleCards(vehicles);
}

function filterByTag(el, type) {
  document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
  el.classList.add('active');
  currentTypeFilter = type;
  filterVehicles();
}

function filterVehicles() {
  const query = document.getElementById('vehicleSearch').value;
  const sort  = document.getElementById('sortFilter').value;
  let vehicles = filterByKey(Store.get('vehicles') || [], 'status', 'approved');
  if (currentTypeFilter) vehicles = filterByKey(vehicles, 'type', currentTypeFilter);
  if (query) vehicles = search(vehicles, ['name', 'type'], query);
  if (sort === 'name')       vehicles = sortBy(vehicles, Comparators.byName);
  else if (sort === 'price-asc')  vehicles = sortBy(vehicles, Comparators.byPriceAsc);
  else if (sort === 'price-desc') vehicles = sortBy(vehicles, Comparators.byPriceDesc);
  else if (sort === 'rating')     vehicles = sortBy(vehicles, Comparators.byRating);
  document.getElementById('vehiclesGrid').innerHTML = mapVehicleCards(vehicles);
}

// =============================================
// VEHICLE CARD
// =============================================

function renderVehicleCard(vehicle) {
  const isLoggedIn = currentUser && currentRole === 'user';
  const mainImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop';
  
  return `
    <div class="vehicle-card" onclick="openVehicleDetail('${vehicle.id}')">
      <div class="vehicle-card-img">
        <img src="${mainImage}" alt="${vehicle.name}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'"/>
        <span class="vehicle-type-badge">${vehicle.type}</span>
        ${vehicle.trending ? '<span class="vehicle-trending-badge"><i class="fas fa-fire"></i> HOT</span>' : ''}
      </div>
      <div class="vehicle-card-body">
        <div class="vehicle-card-name">${vehicle.name}</div>
        <div class="vehicle-card-meta">
          <span><i class="fas fa-users"></i> ${vehicle.seats} Seats</span>
          ${vehicle.rating ? `<span><i class="fas fa-star"></i> ${vehicle.rating}</span>` : ''}
          <span><i class="fas fa-store"></i> ${vehicle.vendorName}</span>
        </div>
        <div class="vehicle-card-footer">
          <div class="vehicle-price">₹${vehicle.price.toLocaleString()} <span>/ day</span></div>
          ${isLoggedIn
            ? `<button class="btn-small btn-book" onclick="event.stopPropagation(); openBookingModal('${vehicle.id}')"><i class="fas fa-calendar-plus"></i> Book</button>`
            : `<button class="btn-small btn-edit" onclick="event.stopPropagation(); openModal('signinModal')">Sign In</button>`}
        </div>
      </div>
    </div>
  `;
}

// =============================================
// VEHICLE DETAIL MODAL WITH IMAGE GALLERY
// =============================================

function openVehicleDetail(vehicleId) {
  const vehicle = (Store.get('vehicles') || []).find(v => v.id === vehicleId);
  if (!vehicle) return;
  
  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'];
  
  const isLoggedIn = currentUser && currentRole === 'user';
  
  const content = `
    <div style="padding-right:32px;">
      <h2 style="font-family: var(--font-display); font-size:2rem; letter-spacing:2px; margin-bottom:16px;">
        ${vehicle.name} <span class="accent">${vehicle.type.toUpperCase()}</span>
      </h2>
      
      <div style="margin-bottom:24px;">
        <img src="${images[0]}" alt="${vehicle.name}" 
          style="width:100%; height:400px; object-fit:cover; border-radius:16px; margin-bottom:12px;"
          onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'"/>
        
        ${images.length > 1 ? `
          <div class="vehicle-image-gallery">
            ${images.slice(1, 5).map(img => `
              <img src="${img}" alt="${vehicle.name}" class="gallery-thumb"
                onclick="this.parentElement.previousElementSibling.src = this.src"
                onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'"/>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-bottom:24px;">
        <div style="background:var(--surface); padding:16px; border-radius:12px; text-align:center;">
          <div style="color:var(--text3); font-size:0.75rem; margin-bottom:4px;">PRICE/DAY</div>
          <div style="color:var(--accent); font-size:1.5rem; font-weight:700;">₹${vehicle.price.toLocaleString()}</div>
        </div>
        <div style="background:var(--surface); padding:16px; border-radius:12px; text-align:center;">
          <div style="color:var(--text3); font-size:0.75rem; margin-bottom:4px;">SEATS</div>
          <div style="color:var(--text); font-size:1.5rem; font-weight:700;">${vehicle.seats}</div>
        </div>
        <div style="background:var(--surface); padding:16px; border-radius:12px; text-align:center;">
          <div style="color:var(--text3); font-size:0.75rem; margin-bottom:4px;">RATING</div>
          <div style="color:var(--text); font-size:1.5rem; font-weight:700;"><i class="fas fa-star" style="color:var(--accent2); font-size:0.9rem;"></i> ${vehicle.rating || 4.5}</div>
        </div>
      </div>
      
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:8px; color:var(--accent);">
          <i class="fas fa-info-circle"></i> Description
        </h3>
        <p style="color:var(--text2); line-height:1.8;">${vehicle.desc}</p>
      </div>
      
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:8px; color:var(--accent);">
          <i class="fas fa-store"></i> Vendor
        </h3>
        <p style="color:var(--text2);">${vehicle.vendorName}</p>
      </div>
      
      ${isLoggedIn ? `
        <button class="btn-primary btn-full" onclick="closeModal('vehicleDetailModal'); openBookingModal('${vehicle.id}')">
          <i class="fas fa-calendar-check"></i> Book This Vehicle
        </button>
      ` : `
        <button class="btn-primary btn-full" onclick="closeModal('vehicleDetailModal'); openModal('signinModal')">
          <i class="fas fa-sign-in-alt"></i> Sign In to Book
        </button>
      `}
    </div>
  `;
  
  document.getElementById('vehicleDetailContent').innerHTML = content;
  openModal('vehicleDetailModal');
}

// =============================================
// BOOKING
// =============================================

function openBookingModal(vehicleId) {
  const vehicle = (Store.get('vehicles') || []).find(v => v.id === vehicleId);
  if (!vehicle) return;
  bookingTarget = vehicle;
  document.getElementById('bookingVehicleName').textContent = `${vehicle.name} — ₹${vehicle.price.toLocaleString()}/day`;
  document.getElementById('bookingStart').value = '';
  document.getElementById('bookingEnd').value   = '';
  document.getElementById('bookingSummary').classList.remove('visible');
  openModal('bookingModal');
  ['bookingStart', 'bookingEnd'].forEach(id => {
    document.getElementById(id).onchange = updateBookingSummary;
  });
}

function updateBookingSummary() {
  const start = document.getElementById('bookingStart').value;
  const end   = document.getElementById('bookingEnd').value;
  if (!start || !end || !bookingTarget) return;
  const days  = Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000));
  const total = days * bookingTarget.price;
  const summary = document.getElementById('bookingSummary');
  summary.classList.add('visible');
  summary.innerHTML = `
    <strong>Vehicle:</strong> ${bookingTarget.name}<br/>
    <strong>Pickup:</strong> ${start} &nbsp;→&nbsp; <strong>Return:</strong> ${end}<br/>
    <strong>Duration:</strong> ${days} day(s)<br/>
    <strong>Total:</strong> <span style="color:var(--accent); font-weight:700;">₹${total.toLocaleString()}</span>
  `;
}

function confirmBooking() {
  const start = document.getElementById('bookingStart').value;
  const end   = document.getElementById('bookingEnd').value;
  if (!start || !end) { showToast('Please select pickup and return dates', 'error'); return; }
  if (new Date(end) <= new Date(start)) { showToast('Return date must be after pickup date', 'error'); return; }
  const days  = Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000));
  const total = days * bookingTarget.price;
  const bookings   = Store.get('bookings') || [];
  const newBooking = {
    id: 'bk_' + Date.now(),
    userId: currentUser.id, userName: currentUser.name,
    userEmail: currentUser.email, userPhone: currentUser.phone || '', userCity: currentUser.city || '',
    vehicleId: bookingTarget.id, vehicleName: bookingTarget.name, vendorId: bookingTarget.vendorId,
    startDate: start, endDate: end, days, total,
    status: 'confirmed', bookedAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  Store.set('bookings', bookings);
  closeModal('bookingModal');
  showToast(`Booking confirmed! ✅ Check "My Bookings" for details.`, 'success');
  loadUserBookings();
}

// =============================================
// ADMIN DASHBOARD
// =============================================

function loadAdminDashboard() {
  loadAdminBookings();
  loadAdminVendors();
  loadAdminVehicles();
  loadAdminUsers();
  loadAdminMessages();
}

function loadAdminBookings() {
  const bookings = sortBy(Store.get('bookings') || [], Comparators.byDate);
  const el = document.getElementById('adminBookingsList');
  if (bookings.length === 0) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No bookings yet.</p></div>`;
    return;
  }
  el.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div class="booking-card-header">
        <div class="booking-icon"><i class="fas fa-car"></i></div>
        <div class="booking-car-info">
          <h4>${b.vehicleName}</h4>
          <div class="booking-dates-row"><i class="fas fa-calendar"></i> ${b.startDate} → ${b.endDate} · ${b.days} day(s)</div>
        </div>
        <div class="booking-right">
          <div class="booking-price">₹${b.total.toLocaleString()}</div>
          <span class="vehicle-status-badge status-approved">${b.status}</span>
        </div>
      </div>
      <div class="booking-user-details">
        <div class="bud-title"><i class="fas fa-user"></i> Customer Details</div>
        <div class="bud-grid">
          <div class="bud-item"><span class="bud-label">Name</span><span class="bud-val">${b.userName}</span></div>
          <div class="bud-item"><span class="bud-label">Email</span><span class="bud-val">${b.userEmail || '—'}</span></div>
          <div class="bud-item"><span class="bud-label">Phone</span><span class="bud-val">${b.userPhone || '—'}</span></div>
          <div class="bud-item"><span class="bud-label">City</span><span class="bud-val">${b.userCity || '—'}</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadAdminVendors() { renderVendorTable(Store.get('vendors') || []); }

function renderVendorTable(vendors) {
  document.getElementById('adminVendorsList').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Vendor Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${vendors.map(v => `
        <tr>
          <td>${v.name}</td><td>${v.email}</td>
          <td><span class="vehicle-status-badge status-${v.status === 'approved' ? 'approved' : v.status === 'rejected' ? 'rejected' : 'pending'}">${v.status}</span></td>
          <td><div class="actions">
            ${v.status === 'pending' ? `
              <button class="btn-small btn-approve" onclick="updateVendorStatus('${v.id}','approved')">Approve</button>
              <button class="btn-small btn-reject"  onclick="updateVendorStatus('${v.id}','rejected')">Reject</button>` : ''}
            <button class="btn-small btn-delete" onclick="removeVendor('${v.id}')">Remove</button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function updateVendorStatus(vendorId, status) {
  const vendors = Store.get('vendors') || [];
  const idx = vendors.findIndex(v => v.id === vendorId);
  if (idx === -1) return;
  vendors[idx].status = status;
  Store.set('vendors', vendors);
  renderVendorTable(vendors);
  showToast(`Vendor ${status}`, 'success');
}

function removeVendor(vendorId) {
  if (!confirm('Remove this vendor?')) return;
  Store.set('vendors', (Store.get('vendors') || []).filter(v => v.id !== vendorId));
  loadAdminVendors();
  showToast('Vendor removed', 'info');
}

function sortVendors(key) {
  renderVendorTable(sortBy(Store.get('vendors') || [], key === 'name' ? Comparators.byName : Comparators.byStatus));
}

function loadAdminVehicles() {
  const vehicles = Store.get('vehicles') || [];
  document.getElementById('adminVehiclesList').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Type</th><th>Price/day</th><th>Vendor</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${vehicles.map(v => `
        <tr>
          <td>${v.name}</td>
          <td><span class="vehicle-type-badge" style="position:static">${v.type}</span></td>
          <td>₹${v.price.toLocaleString()}</td>
          <td>${v.vendorName}</td>
          <td><span class="vehicle-status-badge status-${v.status}">${v.status}</span></td>
          <td><div class="actions">
            ${v.status === 'pending' ? `<button class="btn-small btn-approve" onclick="approveVehicle('${v.id}')">Approve</button>` : ''}
            <button class="btn-small btn-delete" onclick="deleteVehicle('${v.id}')">Delete</button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function approveVehicle(vehicleId) {
  const vehicles = Store.get('vehicles') || [];
  const idx = vehicles.findIndex(v => v.id === vehicleId);
  if (idx === -1) return;
  vehicles[idx].status = 'approved';
  Store.set('vehicles', vehicles);
  loadAdminVehicles();
  showToast('Vehicle approved!', 'success');
}

function deleteVehicle(vehicleId) {
  if (!confirm('Delete this vehicle?')) return;
  Store.set('vehicles', (Store.get('vehicles') || []).filter(v => v.id !== vehicleId));
  loadAdminVehicles();
  showToast('Vehicle deleted', 'info');
}

function loadAdminUsers() { renderUserTable(Store.get('users') || []); }

function renderUserTable(users) {
  document.getElementById('adminUsersList').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Actions</th></tr></thead>
      <tbody>${users.map(u => `
        <tr>
          <td>${u.name}</td><td>${u.email}</td>
          <td>${u.phone || '—'}</td><td>${u.city || '—'}</td>
          <td><button class="btn-small btn-delete" onclick="removeUser('${u.id}')">Remove</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function removeUser(userId) {
  if (!confirm('Remove this user?')) return;
  Store.set('users', (Store.get('users') || []).filter(u => u.id !== userId));
  loadAdminUsers();
  showToast('User removed', 'info');
}

function sortUsers(key) {
  renderUserTable(sortBy(Store.get('users') || [], key === 'email' ? Comparators.byEmail : Comparators.byName));
}

function loadAdminMessages() {
  const msgs = sortBy(Store.get('messages') || [], (a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  const el   = document.getElementById('adminMessagesList');
  if (msgs.length === 0) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No messages yet.</p></div>`;
    return;
  }
  el.innerHTML = msgs.map(m => `
    <div class="booking-card">
      <div class="booking-card-header">
        <div class="booking-icon" style="background:rgba(14,165,233,0.12);color:var(--vendor)"><i class="fas fa-envelope"></i></div>
        <div class="booking-car-info">
          <h4>${m.subject}</h4>
          <div class="booking-dates-row"><i class="fas fa-user"></i> ${m.name} &nbsp;·&nbsp; ${m.email}</div>
        </div>
        <div class="booking-right">
          <span style="font-size:0.75rem;color:var(--text3);">${new Date(m.sentAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="booking-user-details">
        <div class="bud-title"><i class="fas fa-comment"></i> Message</div>
        <p style="font-size:0.88rem;color:var(--text2);margin-top:6px;">${m.message}</p>
      </div>
    </div>
  `).join('');
}

function showAdminTab(tabId, el) {
  document.querySelectorAll('#page-admin-dashboard .dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-admin-dashboard .sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  el.classList.add('active');
  if (tabId === 'adminMessages') loadAdminMessages();
}

// =============================================
// VENDOR DASHBOARD
// =============================================

function loadVendorDashboard() {
  if (!currentUser) return;
  document.getElementById('vendorNameSidebar').textContent   = currentUser.name || 'Vendor';
  document.getElementById('vendorAvatarSidebar').textContent = (currentUser.name || 'V').charAt(0).toUpperCase();
  loadVendorVehicles();
  loadVendorOrders();
}

function loadVendorVehicles() {
  const myVehicles = filterByKey(Store.get('vehicles') || [], 'vendorId', currentUser.id);
  const el = document.getElementById('vendorVehiclesList');
  if (myVehicles.length === 0) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-car-side"></i><p>No vehicles added yet.</p></div>`;
    return;
  }
  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Type</th><th>Price/day</th><th>Status</th></tr></thead>
      <tbody>${sortBy(myVehicles, Comparators.byName).map(v => `
        <tr>
          <td>${v.name}</td><td>${v.type}</td>
          <td>₹${v.price.toLocaleString()}</td>
          <td><span class="vehicle-status-badge status-${v.status}">${v.status}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function loadVendorOrders() {
  const vehicles    = Store.get('vehicles') || [];
  const myVehicleIds = vehicles.filter(v => v.vendorId === currentUser.id).map(v => v.id);
  const myOrders    = sortBy((Store.get('bookings') || []).filter(b => myVehicleIds.includes(b.vehicleId)), Comparators.byDate);
  const el = document.getElementById('vendorOrdersList');
  if (myOrders.length === 0) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-bell-slash"></i><p>No orders yet.</p></div>`;
    return;
  }
  el.innerHTML = myOrders.map(b => `
    <div class="booking-card">
      <div class="booking-card-header">
        <div class="booking-icon"><i class="fas fa-bell"></i></div>
        <div class="booking-car-info">
          <h4>${b.vehicleName}</h4>
          <div class="booking-dates-row"><i class="fas fa-calendar"></i> ${b.startDate} → ${b.endDate}</div>
        </div>
        <div class="booking-right">
          <div class="booking-price">₹${b.total.toLocaleString()}</div>
          <span class="vehicle-status-badge status-approved">${b.status}</span>
        </div>
      </div>
      <div class="booking-user-details">
        <div class="bud-title"><i class="fas fa-user"></i> Customer Contact</div>
        <div class="bud-grid">
          <div class="bud-item"><span class="bud-label">Name</span><span class="bud-val">${b.userName}</span></div>
          <div class="bud-item"><span class="bud-label">Email</span><span class="bud-val">${b.userEmail || '—'}</span></div>
          <div class="bud-item"><span class="bud-label">Phone</span><span class="bud-val">${b.userPhone || '—'}</span></div>
          <div class="bud-item"><span class="bud-label">City</span><span class="bud-val">${b.userCity || '—'}</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

function addVehicle() {
  const name  = document.getElementById('vehName').value.trim();
  const type  = document.getElementById('vehType').value;
  const price = parseInt(document.getElementById('vehPrice').value);
  const seats = parseInt(document.getElementById('vehSeats').value);
  const desc  = document.getElementById('vehDesc').value.trim();
  
  if (!name || !price || !seats) { showToast('Please fill all required fields', 'error'); return; }
  if (price <= 0 || seats <= 0) { showToast('Price and seats must be positive', 'error'); return; }
  
  // Use uploaded images or default
  const images = uploadedImages.length > 0 
    ? uploadedImages 
    : ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'];
  
  const vehicles = Store.get('vehicles') || [];
  vehicles.push({ 
    id: 'vh_' + Date.now(), 
    name, type, price, seats, desc, 
    status: 'pending', 
    vendorId: currentUser.id, 
    vendorName: currentUser.name, 
    images,
    trending: false,
    rating: 4.5,
    bookings: 0,
    addedAt: new Date().toISOString() 
  });
  Store.set('vehicles', vehicles);
  
  // Reset form
  document.getElementById('vehName').value = '';
  document.getElementById('vehPrice').value = '';
  document.getElementById('vehSeats').value = '';
  document.getElementById('vehDesc').value = '';
  document.getElementById('vehImages').value = '';
  document.getElementById('imagePreviewContainer').innerHTML = '';
  uploadedImages = [];
  
  showToast(`"${name}" submitted for admin approval!`, 'success');
  loadVendorVehicles();
  showVendorTab('vendorVehicles', document.querySelector('#page-vendor-dashboard .sidebar-link'));
}

function showVendorTab(tabId, el) {
  document.querySelectorAll('#page-vendor-dashboard .dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-vendor-dashboard .sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  if (el) el.classList.add('active');
}

// =============================================
// DATE MIN
// =============================================
(function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.addEventListener('click', () => {
    const s = document.getElementById('bookingStart');
    const e = document.getElementById('bookingEnd');
    if (s) s.min = today;
    if (e) e.min = today;
  });
})();