/**
 * High-Performance Utility Helper Methods - JovianeX Landing Page
 */

/**
 * Throttles execution of a target function to prevent layout thrashing on scroll events.
 * 
 * @param {Function} func - The callback function to execute.
 * @param {number} limit - The throttle window in milliseconds.
 * @returns {Function} - Throttled wrapper function.
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounces execution of a target function to delay calls until after a set duration.
 * 
 * @param {Function} func - The callback function to execute.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - Debounced wrapper function.
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
