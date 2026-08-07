/**
 * Pricing Savings Calculator and Active Timeline Controller - JovianeX Landing Page
 */
export class PricingTimelineController {
  constructor() {
    this.selectEl = document.getElementById('pricing-compare-select');
    this.savingsAmtEl = document.querySelector('[data-pricing-savings-amt]');
    this.savingsYearsEl = document.querySelector('[data-pricing-savings-years]');
    this.timelineItems = document.querySelectorAll('.pricing__timeline-item');
    
    // Constant pricing configuration parameters mapped by stage keys
    this.pricingPlans = {
      'founder': { price: 49, duration: 3 },
      'early-growth': { price: 99, duration: 3 },
      'growth': { price: 199, duration: 3 },
      'expansion': { price: 249, duration: 3 },
      'standard-phase': { price: 299, duration: 2 },
      'standard': { price: 499, duration: 1 }
    };

    if (this.selectEl) {
      this.initCalculator();
    }
  }

  /**
   * Register change events on select inputs and compute dynamic calculations.
   */
  initCalculator() {
    const calculateSavings = () => {
      const selectedValue = this.selectEl.value;
      const targetPlan = this.pricingPlans[selectedValue];
      const founderPlan = this.pricingPlans['founder'];

      if (targetPlan) {
        // Calculate savings differentials based on launch rate policy
        const priceSavings = targetPlan.price - founderPlan.price;
        const durationSavings = founderPlan.duration - targetPlan.duration;

        // Update DOM display content
        if (this.savingsAmtEl) {
          this.savingsAmtEl.textContent = String(priceSavings);
        }
        if (this.savingsYearsEl) {
          this.savingsYearsEl.textContent = String(durationSavings);
        }

        // Synchronize vertical timeline item active statuses
        this.timelineItems.forEach((item) => {
          const itemPhase = item.getAttribute('data-phase');
          if (itemPhase === selectedValue || itemPhase === 'founder') {
            item.classList.add('pricing__timeline-item--active');
          } else {
            item.classList.remove('pricing__timeline-item--active');
          }
        });
      }
    };

    this.selectEl.addEventListener('change', calculateSavings);
    calculateSavings(); // Initial run
  }
}
