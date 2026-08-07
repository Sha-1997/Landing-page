/**
 * AI Jobs MVP Preview Showcase Tabs Controller - JovianeX Landing Page
 */
export class JobsShowcaseController {
  constructor() {
    this.tabButtons = document.querySelectorAll('.jobs-showcase__tab-btn');
    this.panels = document.querySelectorAll('.jobs-showcase__panel');

    if (this.tabButtons.length > 0) {
      this.initTabs();
    }
  }

  /**
   * Initialize tab click handlers to toggle active panels.
   */
  initTabs() {
    this.tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Update active tab buttons visual status
        this.tabButtons.forEach((b) => {
          b.classList.remove('jobs-showcase__tab-btn--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('jobs-showcase__tab-btn--active');
        btn.setAttribute('aria-pressed', 'true');

        // Update active mockup display panel
        this.panels.forEach((panel) => {
          panel.classList.remove('jobs-showcase__panel--active');
        });

        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) {
          activePanel.classList.add('jobs-showcase__panel--active');
        }
      });
    });
  }
}
