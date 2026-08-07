/**
 * Founder Giveaway Campaign Configuration Loader and Countdown Controller - JovianeX Landing Page
 */
export class FounderGiveawayController {
  constructor() {
    this.daysEl = document.querySelector('[data-giveaway-days]');
    this.hoursEl = document.querySelector('[data-giveaway-hours]');
    this.minutesEl = document.querySelector('[data-giveaway-minutes]');
    this.secondsEl = document.querySelector('[data-giveaway-seconds]');

    this.prizePoolEl = document.querySelector('[data-giveaway-prize-pool]');
    this.winnersCountEl = document.querySelector('[data-giveaway-winners-count]');

    // Configurable campaign data options (driven from configurations/JS properties)
    this.config = {
      // August 31, 2026 23:59:59 GST (UTC+4)
      targetDate: new Date('2026-08-31T23:59:59+04:00').getTime(),
      prizes: {
        prizePool: 'Premium AI Laptops & VIP Lifetime Licenses',
        winnersCount: '50 Selected Founders'
      }
    };

    this.initCampaign();
  }

  /**
   * Populate text elements from configurations and launch countdown update loop.
   */
  initCampaign() {
    // 1. Dynamic configuration loader
    if (this.prizePoolEl) {
      this.prizePoolEl.textContent = this.config.prizes.prizePool;
    }
    if (this.winnersCountEl) {
      this.winnersCountEl.textContent = this.config.prizes.winnersCount;
    }

    // 2. Countdown loop handler
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = this.config.targetDate - now;

      if (difference <= 0) {
        if (this.daysEl) this.daysEl.textContent = '00';
        if (this.hoursEl) this.hoursEl.textContent = '00';
        if (this.minutesEl) this.minutesEl.textContent = '00';
        if (this.secondsEl) this.secondsEl.textContent = '00';
        clearInterval(timerInterval);
        return;
      }

      // Calculate time metrics values
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // DOM updates formatting values
      if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
      if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
      if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
      if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown(); // Run instantly
    const timerInterval = setInterval(updateCountdown, 1000);
  }
}
