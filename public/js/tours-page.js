/**
 * tours-page.js - Interactive Tour Directory & Filter Controller
 * Inspired by On The Go Tours high-information layout & Tranoi Travel Brand System
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.getElementById('tour-filter-form');
  const fastSearchForm = document.getElementById('fast-search-form');
  const sortSelect = document.getElementById('tour-sort-select');
  const viewModeListBtn = document.getElementById('view-mode-list');
  const viewModeGridBtn = document.getElementById('view-mode-grid');
  const toursContainer = document.getElementById('tours-list-container');
  const visibleCountElem = document.getElementById('visible-count');
  const activeChipsContainer = document.getElementById('active-filter-chips');

  // 1. View Mode (List vs Grid) with LocalStorage persistence
  const savedViewMode = localStorage.getItem('tranoi_tour_view_mode') || 'list';
  setViewMode(savedViewMode);

  if (viewModeListBtn) {
    viewModeListBtn.addEventListener('click', () => {
      setViewMode('list');
      localStorage.setItem('tranoi_tour_view_mode', 'list');
    });
  }

  if (viewModeGridBtn) {
    viewModeGridBtn.addEventListener('click', () => {
      setViewMode('grid');
      localStorage.setItem('tranoi_tour_view_mode', 'grid');
    });
  }

  function setViewMode(mode) {
    if (!toursContainer) return;
    if (mode === 'grid') {
      toursContainer.classList.add('tours-grid-mode');
      toursContainer.classList.remove('tours-list-mode');
      if (viewModeGridBtn) viewModeGridBtn.classList.add('active');
      if (viewModeListBtn) viewModeListBtn.classList.remove('active');
    } else {
      toursContainer.classList.add('tours-list-mode');
      toursContainer.classList.remove('tours-grid-mode');
      if (viewModeListBtn) viewModeListBtn.classList.add('active');
      if (viewModeGridBtn) viewModeGridBtn.classList.remove('active');
    }
  }

  // 2. Sort Dropdown Trigger
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('sort', e.target.value);
      window.location.href = currentUrl.toString();
    });
  }

  // 3. Fast Finder Form Synchronization
  if (fastSearchForm) {
    fastSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUrl = new URL(window.location.origin + '/tours');
      
      const destination = document.getElementById('fast-destination')?.value;
      const departure = document.getElementById('fast-departure')?.value;
      const adults = document.getElementById('fast-adults')?.value;
      const search = document.getElementById('fast-search')?.value;

      if (destination && destination !== 'all') currentUrl.searchParams.set('region', destination);
      if (departure && departure !== 'anytime') currentUrl.searchParams.set('anytime', 'false');
      else currentUrl.searchParams.set('anytime', 'true');
      if (adults) currentUrl.searchParams.set('numberOfAdults', adults);
      if (search && search.trim() !== '') currentUrl.searchParams.set('search', search.trim());

      window.location.href = currentUrl.toString();
    });
  }

  // 4. Quick Enquiry Modal Population
  const quickEnquiryModalElem = document.getElementById('quickEnquiryModal');
  if (quickEnquiryModalElem) {
    quickEnquiryModalElem.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (!button) return;

      const tourName = button.getAttribute('data-tour-name') || '';
      const tourSlug = button.getAttribute('data-tour-slug') || '';
      const tourDuration = button.getAttribute('data-tour-duration') || '';
      const defaultFormat = button.getAttribute('data-tour-format') || 'partial-guided';
      const defaultGuests = button.getAttribute('data-tour-guests') || '2';

      const modalTitleTour = quickEnquiryModalElem.querySelector('#modal-tour-title-display');
      const modalDurationBadge = quickEnquiryModalElem.querySelector('#modal-tour-duration-badge');
      const inputTourName = quickEnquiryModalElem.querySelector('#enquiry-tour-name');
      const inputTourSlug = quickEnquiryModalElem.querySelector('#enquiry-tour-slug');
      const inputFormat = quickEnquiryModalElem.querySelector('#enquiry-format');
      const inputGuests = quickEnquiryModalElem.querySelector('#enquiry-guests');

      if (modalTitleTour) modalTitleTour.textContent = tourName;
      if (modalDurationBadge) modalDurationBadge.textContent = tourDuration;
      if (inputTourName) inputTourName.value = tourName;
      if (inputTourSlug) inputTourSlug.value = tourSlug;
      if (inputFormat) inputFormat.value = defaultFormat;
      if (inputGuests) inputGuests.value = defaultGuests;
    });
  }

  // 5. Active Filter Chips Removal
  if (activeChipsContainer) {
    activeChipsContainer.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.active-chip-remove');
      if (!removeBtn) return;
      const paramName = removeBtn.getAttribute('data-param');
      if (paramName) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete(paramName);
        window.location.href = currentUrl.toString();
      }
    });
  }
});
