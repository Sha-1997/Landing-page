/**
 * Naming Challenge Characters Count Tracker Controller - JovianeX Landing Page
 */
export class NameChallengeController {
  constructor() {
    this.nameInput = document.getElementById('challenge-name');
    this.descInput = document.getElementById('challenge-desc');
    
    this.nameCountEl = document.querySelector('[data-challenge-name-cnt]');
    this.descCountEl = document.querySelector('[data-challenge-desc-cnt]');

    this.initCounter();
  }

  /**
   * Listen to keyup and input events to display character limits.
   */
  initCounter() {
    const updateCount = (inputEl, countEl, limit) => {
      if (!inputEl || !countEl) return;
      
      const length = inputEl.value.length;
      countEl.textContent = String(length);

      if (length >= limit) {
        countEl.classList.add('name-challenge__input-warning');
      } else {
        countEl.classList.remove('name-challenge__input-warning');
      }
    };

    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => {
        updateCount(this.nameInput, this.nameCountEl, 30);
      });
    }

    if (this.descInput) {
      this.descInput.addEventListener('input', () => {
        updateCount(this.descInput, this.descCountEl, 150);
      });
    }
  }
}
