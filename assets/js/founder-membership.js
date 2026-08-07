/**
 * Founder Membership Showcase Controller - JovianeX Landing Page
 */
export class FounderMembershipController {
  constructor() {
    this.claimedEl = document.querySelector('[data-seats-claimed]');
    this.progressBar = document.querySelector('[data-progress-bar]');
    this.cardNumEl = document.querySelector('[data-founder-card-num]');
    
    this.daysEl = document.querySelector('[data-founder-days]');
    this.hoursEl = document.querySelector('[data-founder-hours]');
    this.minutesEl = document.querySelector('[data-founder-minutes]');
    this.secondsEl = document.querySelector('[data-founder-seconds]');
    
    this.countdownInterval = null;
    this.animated = false;

    if (this.daysEl) {
      this.initCountdownTimer();
    }

    if (this.progressBar) {
      this.initScrollTrigger();
    }
  }

  /**
   * Monitor scroll visibility to trigger progress animations.
   */
  initScrollTrigger() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately animate progress
      this.animateProgress();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.animated) {
          this.animateProgress();
          this.animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(this.progressBar);
  }

  /**
   * Animates seats progress bar and numerical counts.
   */
  animateProgress() {
    let startVal = 700;
    const targetVal = 842;
    const duration = 1500; // 1.5 seconds duration
    const intervalTime = 30;
    const step = (targetVal - startVal) / (duration / intervalTime);

    const counterInterval = setInterval(() => {
      startVal += step;
      if (startVal >= targetVal) {
        clearInterval(counterInterval);
        this.updateDisplay(targetVal);
      } else {
        this.updateDisplay(Math.floor(startVal));
      }
    }, intervalTime);
  }

  /**
   * Updates display coordinates for seats and digital cards.
   * 
   * @param {number} val - The numerical count to update.
   */
  updateDisplay(val) {
    if (this.claimedEl) this.claimedEl.textContent = String(val);
    if (this.cardNumEl) this.cardNumEl.textContent = String(val);
    if (this.progressBar) {
      const percentage = (val / 1000) * 100;
      this.progressBar.style.width = `${percentage}%`;
    }
  }

  /**
   * Timezone-Aware Campaign Countdown Clock: Targets August 1, 2026 (GST - UTC+4)
   */
  initCountdownTimer() {
    const targetDate = new Date("2026-08-01T00:00:00+04:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.daysEl.textContent = "00";
        this.hoursEl.textContent = "00";
        this.minutesEl.textContent = "00";
        this.secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.daysEl.textContent = String(days).padStart(2, '0');
      this.hoursEl.textContent = String(hours).padStart(2, '0');
      this.minutesEl.textContent = String(minutes).padStart(2, '0');
      this.secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer(); // Initial check
    this.countdownInterval = setInterval(updateTimer, 1000);
  }
}
