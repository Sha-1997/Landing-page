/**
 * Ecosystem Phased Expansion Roadmap Controller - JovianeX Landing Page
 */
export class RoadmapController {
  constructor() {
    this.timelineItems = document.querySelectorAll('[data-roadmap-phase]');
    
    this.previewTitleEl = document.querySelector('[data-roadmap-preview-title]');
    this.previewStatusEl = document.querySelector('[data-roadmap-preview-status]');
    this.previewDescEl = document.querySelector('[data-roadmap-preview-desc]');
    this.previewBadgeEl = document.getElementById('roadmap-preview-badge');

    // Configurable milestones metadata mapping phase details
    this.milestones = {
      'phase1': {
        title: 'AI Jobs',
        status: 'Launching',
        badgeBg: 'var(--color-secondary-glow)',
        badgeColor: 'var(--color-secondary)',
        desc: 'Launching August 2026. The initial module of the JovianeX AI Ecosystem. A unified candidate evaluation portal matching verified local talent with automated enterprise recruitment pipelines.'
      },
      'phase2': {
        title: 'AI Delivery',
        status: 'Planned',
        badgeBg: 'rgba(255,255,255,0.05)',
        badgeColor: 'var(--text-muted)',
        desc: 'Planned expansion. Automated dispatch algorithms optimizing local delivery logistics and courier payouts.'
      },
      'phase3': {
        title: 'AI Travel',
        status: 'Planned',
        badgeBg: 'rgba(255,255,255,0.05)',
        badgeColor: 'var(--text-muted)',
        desc: 'Planned expansion. Predictive itinerary planning matching traveler profiles with flight databases and hospitality bookings.'
      },
      'phase4': {
        title: 'AI Logistics',
        status: 'Planned',
        badgeBg: 'rgba(255,255,255,0.05)',
        badgeColor: 'var(--text-muted)',
        desc: 'Planned expansion. Global routing nodes and fleet dispatch modules managing cargo shipments.'
      },
      'future': {
        title: 'Additional AI Modules',
        status: 'Future Vision',
        badgeBg: 'var(--color-primary-glow)',
        badgeColor: 'var(--color-primary)',
        desc: 'Future vision roadmap expansions. Continual updates driven by enterprise demands and community evaluations.'
      }
    };

    if (this.timelineItems.length > 0) {
      this.initRoadmap();
    }
  }

  /**
   * Bind click event listeners to timeline items and swap description elements.
   */
  initRoadmap() {
    this.timelineItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const phaseKey = btn.getAttribute('data-roadmap-phase');
        const phaseData = this.milestones[phaseKey];

        if (phaseData) {
          // Toggle active visual states
          this.timelineItems.forEach(item => {
            item.classList.remove('roadmap__timeline-item--active');
          });
          btn.classList.add('roadmap__timeline-item--active');

          // Dynamically load selected milestone values to preview block
          if (this.previewTitleEl) this.previewTitleEl.textContent = phaseData.title;
          if (this.previewStatusEl) this.previewStatusEl.textContent = phaseData.status;
          if (this.previewDescEl) this.previewDescEl.textContent = phaseData.desc;
          
          if (this.previewBadgeEl) {
            this.previewBadgeEl.style.backgroundColor = phaseData.badgeBg;
            this.previewBadgeEl.style.color = phaseData.badgeColor;
          }
        }
      });
    });
  }
}
