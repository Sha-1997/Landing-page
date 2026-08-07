/* BEM Navigation Controller - JovianeX Landing Page */
import { throttle } from './utils.js';

export class NavigationController {
  constructor() {
    this.header = document.querySelector('[data-header]');
    this.navToggle = document.querySelector('[data-nav-toggle]');
    this.navContainer = document.querySelector('.header__nav');
    this.menuLinks = document.querySelectorAll('.header__menu-link');
    this.body = document.body;

    if (this.header) {
      this.initStickyHeader();
    }

    if (this.navToggle && this.navContainer) {
      this.initMobileMenu();
    }

    this.initScrollSpy();
    this.initSmoothScroll();
  }

  /**
   * Sticky Header: Adds modifier on scroll. Throttled to 50ms.
   */
  initStickyHeader() {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        this.header.classList.add('header--sticky');
      } else {
        this.header.classList.remove('header--sticky');
      }
    };

    const throttledScroll = throttle(handleScroll, 50);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Check initially
  }

  /**
   * Mobile Slide-in Drawer interactions
   */
  initMobileMenu() {
    const toggleMenu = () => {
      const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
      this.navToggle.setAttribute('aria-expanded', !isExpanded);
      this.navContainer.classList.toggle('header__nav--open');
      this.body.classList.toggle('overflow-hidden');
    };

    const closeMenu = () => {
      this.navToggle.setAttribute('aria-expanded', 'false');
      this.navContainer.classList.remove('header__nav--open');
      this.body.classList.remove('overflow-hidden');
    };

    this.navToggle.addEventListener('click', toggleMenu);

    // Auto close menu when clicking menu link items
    this.menuLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of the drawer area
    document.addEventListener('click', (e) => {
      const isDrawerOpen = this.navContainer.classList.contains('header__nav--open');
      const clickedInsideDrawer = this.navContainer.contains(e.target);
      const clickedToggleButton = this.navToggle.contains(e.target);

      if (isDrawerOpen && !clickedInsideDrawer && !clickedToggleButton) {
        closeMenu();
      }
    });

    // Escape key closes open menu drawer and targets focus
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navContainer.classList.contains('header__nav--open')) {
        closeMenu();
        this.navToggle.focus();
      }
    });
  }

  /**
   * Smooth Scrolling triggers
   */
  initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          
          // Lock scrolling coordinates
          const offsetTop = targetSection.offsetTop - 80; // Offset for sticky navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Scroll Spy: Highlights active navigation link based on scroll position. Throttled to 100ms.
   */
  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + 120; // Offset for header buffer heights

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          this.menuLinks.forEach((link) => {
            link.classList.remove('header__menu-link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('header__menu-link--active');
            }
          });
        }
      });
    };

    const throttledSpy = throttle(onScroll, 100);
    window.addEventListener('scroll', throttledSpy, { passive: true });
    onScroll(); // Initial check
  }
}
