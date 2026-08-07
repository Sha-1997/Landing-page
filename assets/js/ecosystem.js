/**
 * Interactive Ecosystem Connections Controller - JovianeX Landing Page
 */
export class EcosystemController {
  constructor() {
    this.moduleCards = document.querySelectorAll('.ecosystem__module-card');
    this.activeInterval = null;
    this.activeIndex = 0;

    if (this.moduleCards.length > 0) {
      this.initModuleCycler();
      this.initHoverHandlers();
    }
  }

  /**
   * Cycles active module card and updates corresponding connection paths.
   */
  initModuleCycler() {
    const cycle = () => {
      // Clear previous active states
      this.clearActiveStates();

      // Set new active card
      const activeCard = this.moduleCards[this.activeIndex];
      activeCard.classList.add('ecosystem__module-card--active');

      // Set corresponding active connection path
      const moduleName = activeCard.getAttribute('data-module');
      const activePath = document.getElementById(`path-${moduleName}`);
      if (activePath) {
        activePath.classList.add('ecosystem__connection-path--active');
      }

      // Increment cycle index
      this.activeIndex = (this.activeIndex + 1) % this.moduleCards.length;
    };

    cycle(); // Initial run
    this.activeInterval = setInterval(cycle, 3000);
  }

  /**
   * Hover Handlers: Pauses auto-cycle and manual highlights card on hover.
   */
  initHoverHandlers() {
    this.moduleCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        clearInterval(this.activeInterval);
        this.clearActiveStates();

        card.classList.add('ecosystem__module-card--active');
        const moduleName = card.getAttribute('data-module');
        const activePath = document.getElementById(`path-${moduleName}`);
        if (activePath) {
          activePath.classList.add('ecosystem__connection-path--active');
        }
      });

      card.addEventListener('mouseleave', () => {
        // Resume cycle from the current item
        const index = Array.from(this.moduleCards).indexOf(card);
        this.activeIndex = (index + 1) % this.moduleCards.length;
        
        clearInterval(this.activeInterval);
        this.initModuleCycler();
      });
    });
  }

  /**
   * Clears active visual outlines and line connection animation states.
   */
  clearActiveStates() {
    this.moduleCards.forEach((card) => {
      card.classList.remove('ecosystem__module-card--active');
    });

    const paths = document.querySelectorAll('.ecosystem__connection-path');
    paths.forEach((path) => {
      path.classList.remove('ecosystem__connection-path--active');
    });
  }
}
