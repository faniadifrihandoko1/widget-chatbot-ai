// Helper functions untuk Altius Chat Widget
import { ANIMATION_NAMES } from '../config/constants.js';

/**
 * Menyuntikkan CSS styles ke dalam head dokumen
 * @param {string} styles - CSS styles yang akan disuntikkan
 */
export function injectStyles(styles) {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

/**
 * Membuat elemen DOM dengan class dan innerHTML
 * @param {string} className - Class name untuk elemen
 * @param {string} innerHTML - Inner HTML content
 * @returns {HTMLElement} Elemen DOM yang dibuat
 */
export function createElement(className, innerHTML = '') {
  const element = document.createElement('div');
  element.className = className;
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}

/**
 * Menambahkan efek ripple pada tombol
 * @param {HTMLElement} button - Tombol yang akan ditambahkan efek ripple
 */
export function addRippleEffect(button) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    transform: scale(0);
    animation: ${ANIMATION_NAMES.RIPPLE} 0.6s linear;
    pointer-events: none;
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
  `;
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

/**
 * Memformat waktu ke format yang readable
 * @param {Date} date - Tanggal yang akan diformat
 * @returns {string} Waktu yang sudah diformat
 */
export function formatTime(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Scroll ke bawah dengan animasi smooth
 * @param {HTMLElement} element - Elemen yang akan di-scroll
 */
export function scrollToBottom(element) {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth',
  });
}

/**
 * Reset animasi pada elemen
 * @param {HTMLElement} element - Elemen yang animasinya akan direset
 */
export function resetAnimation(element) {
  element.style.animation = 'none';
  element.offsetHeight; // Trigger reflow
  element.style.animation = null;
}

/**
 * Menambahkan event listener dengan error handling
 * @param {HTMLElement} element - Elemen target
 * @param {string} event - Jenis event
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 */
export function addEventListenerSafe(element, event, handler, options = {}) {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener(event, handler, options);
  } else {
    console.warn(`Cannot add event listener to element:`, element);
  }
}

/**
 * Menghapus event listener dengan error handling
 * @param {HTMLElement} element - Elemen target
 * @param {string} event - Jenis event
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 */
export function removeEventListenerSafe(element, event, handler, options = {}) {
  if (element && typeof element.removeEventListener === 'function') {
    element.removeEventListener(event, handler, options);
  }
}

/**
 * Memeriksa apakah elemen ada di dalam viewport
 * @param {HTMLElement} element - Elemen yang akan diperiksa
 * @returns {boolean} True jika elemen ada di viewport
 */
export function isElementInViewport(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function untuk mengoptimalkan performa
 * @param {Function} func - Function yang akan di-debounce
 * @param {number} wait - Waktu tunggu dalam milidetik
 * @returns {Function} Function yang sudah di-debounce
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function untuk mengoptimalkan performa
 * @param {Function} func - Function yang akan di-throttle
 * @param {number} limit - Batas waktu dalam milidetik
 * @returns {Function} Function yang sudah di-throttle
 */
export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memeriksa apakah device adalah mobile
 * @returns {boolean} True jika device adalah mobile
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Memeriksa apakah device mendukung touch
 * @returns {boolean} True jika device mendukung touch
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Memeriksa apakah browser mendukung CSS Grid
 * @returns {boolean} True jika browser mendukung CSS Grid
 */
export function supportsCSSGrid() {
  return CSS.supports('display', 'grid');
}

/**
 * Memeriksa apakah browser mendukung CSS Flexbox
 * @returns {boolean} True jika browser mendukung CSS Flexbox
 */
export function supportsFlexbox() {
  return CSS.supports('display', 'flex');
}

/**
 * Mendapatkan ukuran viewport
 * @returns {Object} Object berisi width dan height viewport
 */
export function getViewportSize() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Mendapatkan ukuran elemen
 * @param {HTMLElement} element - Elemen yang ukurannya akan diambil
 * @returns {Object} Object berisi width dan height elemen
 */
export function getElementSize(element) {
  if (!element) return { width: 0, height: 0 };

  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

export default {
  injectStyles,
  createElement,
  addRippleEffect,
  formatTime,
  scrollToBottom,
  resetAnimation,
  addEventListenerSafe,
  removeEventListenerSafe,
  isElementInViewport,
  debounce,
  throttle,
  isMobileDevice,
  isTouchDevice,
  supportsCSSGrid,
  supportsFlexbox,
  getViewportSize,
  getElementSize,
};
