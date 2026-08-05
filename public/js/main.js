/**
 * WanderLust Tours - Dynamic Client Motion & Interactive System
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSearchAutocomplete();
  initWishlistButtons();
  initNewsletterForm();
  initCouponHandler();
  initScrollReveal();
  initNumberCounters();
  initHeroParallax();
});

/* 1. Theme Toggle (Dark / Light) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('wanderlust_theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);

  if (toggleBtn) {
    toggleBtn.innerHTML = currentTheme === 'dark' ? '<i class="bi bi-sun-fill text-warning fs-5"></i>' : '<i class="bi bi-moon-stars-fill fs-5"></i>';

    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('wanderlust_theme', newTheme);
      toggleBtn.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun-fill text-warning fs-5"></i>' : '<i class="bi bi-moon-stars-fill fs-5"></i>';
    });
  }
}

/* 2. Scroll Reveal Animations via IntersectionObserver */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
    revealObserver.observe(el);
  });
}

/* 3. Animated Statistics Counter Numbers */
function initNumberCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (counters.length === 0) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            counter.innerText = target.toFixed(decimals) + suffix;
            clearInterval(timer);
          } else {
            counter.innerText = start.toFixed(decimals) + suffix;
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

/* 4. Hero Background Subtle Parallax */
function initHeroParallax() {
  const hero = document.querySelector('.hero-wrapper');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos < 1000) {
      hero.style.backgroundPositionY = `${scrollPos * 0.4}px`;
    }
  });
}

/* 5. Search Autocomplete */
function initSearchAutocomplete() {
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('search-results-dropdown');

  if (!searchInput || !resultsContainer) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      resultsContainer.classList.add('d-none');
      resultsContainer.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.tours.length === 0 && data.destinations.length === 0) {
          resultsContainer.innerHTML = '<div class="p-3 text-muted">No matching tours or destinations found.</div>';
        } else {
          let html = '';
          if (data.tours.length > 0) {
            html += '<div class="px-3 pt-2 text-uppercase text-muted fw-bold small">Tours</div>';
            data.tours.forEach(tour => {
              html += `
                <a href="/tours/${tour.slug}" class="dropdown-item d-flex align-items-center gap-2 py-2">
                  <img src="${tour.featuredImage}" class="rounded" width="40" height="40" style="object-fit:cover;">
                  <div>
                    <div class="fw-bold text-truncate" style="max-width:250px;">${tour.name}</div>
                    <div class="small text-primary">$${tour.price}</div>
                  </div>
                </a>
              `;
            });
          }
          if (data.destinations.length > 0) {
            html += '<div class="px-3 pt-2 text-uppercase text-muted fw-bold small">Destinations</div>';
            data.destinations.forEach(dest => {
              html += `
                <a href="/destinations/${dest.slug}" class="dropdown-item d-flex align-items-center gap-2 py-2">
                  <i class="bi bi-geo-alt-fill text-danger fs-5"></i>
                  <div class="fw-bold">${dest.name}</div>
                </a>
              `;
            });
          }
          resultsContainer.innerHTML = html;
        }
        resultsContainer.classList.remove('d-none');
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add('d-none');
    }
  });
}

/* 6. Wishlist Toggle with Pulse Animation */
function initWishlistButtons() {
  document.querySelectorAll('.btn-toggle-wishlist').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const tourId = btn.getAttribute('data-tour-id');

      // Heartbeat pulse animation
      btn.classList.add('heart-beat-active');
      setTimeout(() => btn.classList.remove('heart-beat-active'), 800);

      try {
        const res = await fetch('/api/v1/wishlist/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId })
        });
        const data = await res.json();

        if (res.status === 401) {
          window.location.href = '/login?error=' + encodeURIComponent('Please log in to save wishlist items.');
          return;
        }

        if (data.success) {
          const icon = btn.querySelector('i');
          if (icon) {
            if (data.added) {
              icon.classList.remove('bi-heart');
              icon.classList.add('bi-heart-fill', 'text-danger');
            } else {
              icon.classList.remove('bi-heart-fill', 'text-danger');
              icon.classList.add('bi-heart');
            }
          }
          showToast(data.message, 'success');
        }
      } catch (err) {
        console.error('Wishlist toggle error:', err);
      }
    });
  });
}

/* 7. Newsletter Form */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]');
    const email = emailInput.value.trim();

    try {
      const res = await fetch('/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message, 'success');
        emailInput.value = '';
      } else {
        showToast(data.message, 'danger');
      }
    } catch (err) {
      showToast('Could not subscribe. Please try again.', 'danger');
    }
  });
}

/* 8. Checkout Coupon Handler */
function initCouponHandler() {
  const applyBtn = document.getElementById('btn-apply-coupon');
  if (!applyBtn) return;

  applyBtn.addEventListener('click', async () => {
    const codeInput = document.getElementById('coupon-code-input');
    const totalAmountInput = document.getElementById('checkout-total-amount');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountValueEl = document.getElementById('checkout-discount-value');
    const finalTotalEl = document.getElementById('checkout-final-total');
    const hiddenCouponInput = document.getElementById('hidden-coupon-code');

    const code = codeInput.value.trim();
    const totalAmount = parseFloat(totalAmountInput.value || 0);

    if (!code) {
      showToast('Please enter a valid coupon code.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/v1/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, totalAmount })
      });
      const data = await res.json();

      if (data.success) {
        discountRow.classList.remove('d-none');
        discountValueEl.innerText = '-$' + data.discountAmount.toFixed(2);
        finalTotalEl.innerText = '$' + data.finalAmount.toFixed(2);
        hiddenCouponInput.value = data.couponCode;
        showToast(data.message, 'success');
      } else {
        showToast(data.message, 'danger');
      }
    } catch (err) {
      showToast('Failed to validate coupon code.', 'danger');
    }
  });
}

/* Helper: Animated Toast Notifications */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-animate-in align-items-center text-white bg-${type === 'danger' ? 'danger' : type === 'success' ? 'success' : 'primary'} border-0 show`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  container.appendChild(toastEl);
  setTimeout(() => {
    toastEl.remove();
  }, 4000);
}
