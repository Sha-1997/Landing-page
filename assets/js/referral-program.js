/**
 * Enterprise Referral Clipboard Share and Dashboard Progress Controller - JovianeX Landing Page
 */
export class ReferralController {
  constructor() {
    this.totalInvitesEl = document.querySelector('[data-ref-total-invites]');
    this.qualifiedInvitesEl = document.querySelector('[data-ref-qualified-invites]');
    this.progressTextEl = document.querySelector('[data-ref-progress-text]');
    this.rewardStatusEl = document.querySelector('[data-ref-reward-status]');
    this.progressBarEl = document.getElementById('ref-progress-bar');

    this.copyCodeBtn = document.getElementById('copy-ref-code');
    this.copyLinkBtn = document.getElementById('copy-ref-link');
    
    this.codeInput = document.getElementById('ref-code-text');
    this.linkInput = document.getElementById('ref-link-text');

    // Configurable API-ready dashboard parameters
    this.config = {
      totalInvites: 8,
      qualifiedInvites: 5,
      milestoneTarget: 10,
      rewardStatus: 'Ambassador Silver'
    };

    this.initDashboard();
  }

  /**
   * Load referral configurations and hook copy sharing actions.
   */
  initDashboard() {
    // 1. Populate stats labels
    if (this.totalInvitesEl) this.totalInvitesEl.textContent = String(this.config.totalInvites);
    if (this.qualifiedInvitesEl) this.qualifiedInvitesEl.textContent = String(this.config.qualifiedInvites);
    if (this.rewardStatusEl) this.rewardStatusEl.textContent = this.config.rewardStatus;
    
    if (this.progressTextEl) {
      this.progressTextEl.textContent = `${this.config.qualifiedInvites} / ${this.config.milestoneTarget} Referrals`;
    }

    // 2. Adjust progress indicator bar gauge width ratio
    if (this.progressBarEl) {
      const percentage = (this.config.qualifiedInvites / this.config.milestoneTarget) * 100;
      this.progressBarEl.style.width = `${Math.min(percentage, 100)}%`;
    }

    // 3. Register sharing buttons clipboard handles
    const handleCopy = (inputEl, buttonEl, originalText) => {
      if (!inputEl || !buttonEl) return;

      navigator.clipboard.writeText(inputEl.value).then(() => {
        // success transitions feedback
        buttonEl.textContent = 'Copied!';
        inputEl.classList.add('referral__input--copied');

        setTimeout(() => {
          buttonEl.textContent = originalText;
          inputEl.classList.remove('referral__input--copied');
        }, 2000);
      }).catch(err => {
        console.error('[JovianeX] Failed to copy code:', err);
      });
    };

    if (this.copyCodeBtn) {
      this.copyCodeBtn.addEventListener('click', () => {
        handleCopy(this.codeInput, this.copyCodeBtn, 'Copy Code');
      });
    }

    if (this.copyLinkBtn) {
      this.copyLinkBtn.addEventListener('click', () => {
        handleCopy(this.linkInput, this.copyLinkBtn, 'Copy Link');
      });
    }
  }
}
