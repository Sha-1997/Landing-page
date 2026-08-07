/**
 * Client-Side Registration Validator and Password Strength Controller - JovianeX Landing Page
 */
export class RegistrationController {
  constructor() {
    this.form = document.getElementById('registration-form');
    this.nameInput = document.getElementById('reg-name');
    this.emailInput = document.getElementById('reg-email');
    this.countrySelect = document.getElementById('reg-country');
    this.mobileInput = document.getElementById('reg-mobile');
    this.passwordInput = document.getElementById('reg-password');
    this.confirmInput = document.getElementById('reg-confirm');
    this.termsCheckbox = document.getElementById('reg-terms');
    
    this.strengthBar = document.getElementById('reg-strength-bar');
    this.strengthLabel = document.getElementById('reg-strength-label');
    this.successBanner = document.getElementById('reg-success-banner');

    if (this.form) {
      this.initValidation();
    }
  }

  /**
   * Register keyup, blur, and submit event listeners for form validation.
   */
  initValidation() {
    // 1. Password complexity strength meter event
    this.passwordInput.addEventListener('input', () => this.evaluatePasswordStrength());

    // 2. Form submission interceptor
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = this.validateAll();

      if (isValid) {
        this.displaySuccessState();
      }
    });

    // 3. Clear warnings on input focus/type
    const inputs = [this.nameInput, this.emailInput, this.countrySelect, this.mobileInput, this.passwordInput, this.confirmInput, this.termsCheckbox];
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        this.clearError(input);
      });
    });
  }

  /**
   * Run validation rules across all form input elements.
   * 
   * @returns {boolean} - True if form is valid, false otherwise.
   */
  validateAll() {
    let isValid = true;

    // Full Name
    if (!this.nameInput.value.trim() || this.nameInput.value.trim().length < 2) {
      this.showError(this.nameInput, 'err-name', 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    }

    // Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.emailInput.value.trim() || !emailRegex.test(this.emailInput.value.trim())) {
      this.showError(this.emailInput, 'err-email', 'Please enter a valid email address.');
      isValid = false;
    }

    // Country Selector
    if (!this.countrySelect.value) {
      this.showError(this.countrySelect, 'err-country', 'Please select your country.');
      isValid = false;
    }

    // Mobile Number
    const mobileRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (!this.mobileInput.value.trim() || !mobileRegex.test(this.mobileInput.value.trim()) || this.mobileInput.value.trim().length < 7) {
      this.showError(this.mobileInput, 'err-mobile', 'Please enter a valid mobile phone number.');
      isValid = false;
    }

    // Password Length
    if (!this.passwordInput.value || this.passwordInput.value.length < 8) {
      this.showError(this.passwordInput, 'err-password', 'Password must be at least 8 characters long.');
      isValid = false;
    }

    // Password Match
    if (this.passwordInput.value !== this.confirmInput.value) {
      this.showError(this.confirmInput, 'err-confirm', 'Passwords do not match.');
      isValid = false;
    }

    // Terms Acceptance
    if (!this.termsCheckbox.checked) {
      this.showError(this.termsCheckbox, 'err-terms', 'You must agree to the Terms of Service and Privacy Policy.');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Helper to display an error outline and trigger ARIA messages.
   * 
   * @param {HTMLElement} inputEl - The input element with the error.
   * @param {string} errId - The ID of the error display span.
   * @param {string} message - The text error message to display.
   */
  showError(inputEl, errId, message) {
    inputEl.classList.add('registration__input--error');
    const errSpan = document.getElementById(errId);
    if (errSpan) {
      errSpan.textContent = message;
      errSpan.style.display = 'block';
    }
  }

  /**
   * Clear error formatting from input tags.
   * 
   * @param {HTMLElement} inputEl - The input element to clear error formatting from.
   */
  clearError(inputEl) {
    inputEl.classList.remove('registration__input--error');
    
    // Auto-resolve error span IDs based on input tags
    const inputId = inputEl.getAttribute('id');
    const errId = `err-${inputId.replace('reg-', '')}`;
    
    const errSpan = document.getElementById(errId);
    if (errSpan) {
      errSpan.style.display = 'none';
      errSpan.textContent = '';
    }
  }

  /**
   * Computes password complexity score and updates progress displays.
   */
  evaluatePasswordStrength() {
    const val = this.passwordInput.value;
    let score = 0;

    if (!val) {
      this.strengthBar.style.width = '0%';
      this.strengthLabel.textContent = 'None';
      this.strengthLabel.style.color = 'var(--text-muted)';
      return;
    }

    // 1. Length check
    if (val.length >= 8) score++;
    // 2. Numbers check
    if (/\d/.test(val)) score++;
    // 3. Capital letters check
    if (/[A-Z]/.test(val)) score++;
    // 4. Special character symbols check
    if (/[^A-Za-z0-9]/.test(val)) score++;

    // Translate score to bar colors and widths
    if (score <= 1) {
      this.strengthBar.style.width = '25%';
      this.strengthBar.style.backgroundColor = '#ef4444'; // Red
      this.strengthLabel.textContent = 'Weak';
      this.strengthLabel.style.color = '#ef4444';
    } else if (score <= 3) {
      this.strengthBar.style.width = '60%';
      this.strengthBar.style.backgroundColor = '#eab308'; // Yellow
      this.strengthLabel.textContent = 'Medium';
      this.strengthLabel.style.color = '#eab308';
    } else {
      this.strengthBar.style.width = '100%';
      this.strengthBar.style.backgroundColor = '#22c55e'; // Green
      this.strengthLabel.textContent = 'Strong';
      this.strengthLabel.style.color = '#22c55e';
    }
  }

  /**
   * Clears form inputs and demonstrates verification pending status banner.
   */
  displaySuccessState() {
    if (this.successBanner) {
      this.successBanner.style.display = 'block';
    }

    // Clear inputs values
    this.form.reset();
    
    // Clear strength displays
    this.strengthBar.style.width = '0%';
    this.strengthLabel.textContent = 'None';
    this.strengthLabel.style.color = 'var(--text-muted)';

    // Scroll display down slightly to focus on banner
    this.successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
