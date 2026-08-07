/* Hero Behavior Controller - JovianeX Landing Page */

export class HeroController {
  constructor() {
    this.daysTile = document.querySelector('[data-countdown-days]');
    this.hoursTile = document.querySelector('[data-countdown-hours]');
    this.minutesTile = document.querySelector('[data-countdown-minutes]');
    this.secondsTile = document.querySelector('[data-countdown-seconds]');
    this.countdownLabel = document.querySelector('.hero__countdown-label');
    
    this.countdownInterval = null;

    if (this.daysTile) {
      this.initCountdownTimer();
    }

    this.animateMetrics();
  }

  /**
   * Timezone-Aware Countdown Timer: Target August 1, 2026, 00:00:00 Gulf Standard Time (GST - UTC+4)
   */
  initCountdownTimer() {
    const targetDate = new Date("2026-08-01T00:00:00+04:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // Handle countdown completion gracefully
      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.daysTile.textContent = "00";
        this.hoursTile.textContent = "00";
        this.minutesTile.textContent = "00";
        this.secondsTile.textContent = "00";
        if (this.countdownLabel) {
          this.countdownLabel.textContent = "Launch Active - Welcome Founders!";
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.daysTile.textContent = String(days).padStart(2, '0');
      this.hoursTile.textContent = String(hours).padStart(2, '0');
      this.minutesTile.textContent = String(minutes).padStart(2, '0');
      this.secondsTile.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer(); // Run initially to avoid 1s visual delay
    this.countdownInterval = setInterval(updateTimer, 1000);
  }

  /**
   * Simulated interactive registered member count milestone loader
   */
  animateMetrics() {
    const counterEl = document.querySelector('[data-member-counter]');
    if (!counterEl) return;

    let currentVal = 780;
    const targetVal = 942;
    const duration = 2000; // 2 seconds duration
    const intervalTime = 30;
    const step = (targetVal - currentVal) / (duration / intervalTime);

    const counterInterval = setInterval(() => {
      currentVal += step;
      if (currentVal >= targetVal) {
        counterEl.textContent = String(targetVal);
        clearInterval(counterInterval);
      } else {
        counterEl.textContent = String(Math.floor(currentVal));
      }
    }, intervalTime);
  }
}
