/**
 * WanderLust Tours - Dynamic Client Motion & Interactive System
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchAutocomplete();
  initWishlistButtons();
  initNewsletterForm();
  initCouponHandler();
  initScrollReveal();
  initNumberCounters();
  initHeroParallax();
});

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

/* 5. Search Autocomplete with Live Motion Animation */
function initSearchAutocomplete() {
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('search-results-dropdown');

  if (!searchInput || !resultsContainer) return;

  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 1) {
      resultsContainer.classList.add('d-none');
      resultsContainer.classList.remove('show-animated');
      resultsContainer.innerHTML = '';
      return;
    }

    // Show quick loading state
    resultsContainer.innerHTML = `
      <div class="p-3 text-center text-muted small">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        Searching tours for "${escapeHtml(query)}"...
      </div>
    `;
    resultsContainer.classList.remove('d-none');
    resultsContainer.classList.add('show-animated');

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if ((!data.tours || data.tours.length === 0) && (!data.destinations || data.destinations.length === 0)) {
          resultsContainer.innerHTML = `
            <div class="p-3 text-center text-muted small">
              <i class="bi bi-search me-1 text-secondary"></i> No matching tours found for "<strong>${escapeHtml(query)}</strong>".
            </div>
          `;
        } else {
          let html = '';
          if (data.tours && data.tours.length > 0) {
            html += '<div class="px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small border-bottom bg-light"><i class="bi bi-compass me-1 text-primary"></i> Tour Packages (' + data.tours.length + ')</div>';
            data.tours.forEach(tour => {
              const displayPrice = tour.discountPrice || tour.price;
              html += `
                <a href="/tours/${tour.slug}" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 border-bottom search-item-hover">
                  <img src="${tour.featuredImage || '/images/default-tour.jpg'}" class="rounded-3 shadow-sm" width="48" height="48" style="object-fit:cover;">
                  <div class="flex-grow-1 overflow-hidden">
                    <div class="fw-bold text-dark text-truncate small mb-0">${escapeHtml(tour.name)}</div>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="badge bg-primary-subtle text-primary fw-semibold" style="font-size:0.75rem;">${escapeHtml(tour.duration || 'Flexible')}</span>
                      <span class="fw-bold text-success small">$${displayPrice}</span>
                    </div>
                  </div>
                  <i class="bi bi-chevron-right text-muted small"></i>
                </a>
              `;
            });
          }

          if (data.destinations && data.destinations.length > 0) {
            html += '<div class="px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small border-bottom bg-light mt-1"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> Destinations</div>';
            data.destinations.forEach(dest => {
              html += `
                <a href="/destinations/${dest.slug}" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 search-item-hover">
                  <img src="${dest.banner || '/images/default-dest.jpg'}" class="rounded-circle shadow-sm" width="36" height="36" style="object-fit:cover;">
                  <div class="flex-grow-1">
                    <div class="fw-bold text-dark small mb-0">${escapeHtml(dest.name)}</div>
                    <small class="text-muted">${escapeHtml(dest.country || '')}</small>
                  </div>
                  <i class="bi bi-arrow-right-short fs-5 text-muted"></i>
                </a>
              `;
            });
          }

          resultsContainer.innerHTML = html;
        }
        resultsContainer.classList.remove('d-none');
        resultsContainer.classList.add('show-animated');
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 180);
  });

  // Handle Enter Key press
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        window.location.href = `/tours?search=${encodeURIComponent(query)}`;
      }
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add('d-none');
      resultsContainer.classList.remove('show-animated');
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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
