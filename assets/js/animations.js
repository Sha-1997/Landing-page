/* Scroll reveal & micro-interactions - JovianeX Landing Page */

export class AnimationController {
  constructor() {
    document.documentElement.classList.add('js-active');
    this.revealElements = document.querySelectorAll('.reveal');
    this.initScrollReveal();
  }

  /**
   * Intersection Observer for scroll-driven triggers
   */
  initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: instantly activate elements if browser doesn't support Observer
      this.revealElements.forEach((el) => el.classList.add('active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15, // Elements activate when 15% visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    this.revealElements.forEach((el) => observer.observe(el));
  }
}
