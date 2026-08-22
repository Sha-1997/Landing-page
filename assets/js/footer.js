/**
 * Enterprise Footer Dynamic Configs and Back-to-Top Controller - JovianeX Landing Page
 */
export class FooterController {
  constructor() {
    this.yearEl = document.getElementById('footer-year');
    
    this.socialX = document.getElementById('footer-social-x');
    this.socialLinkedin = document.getElementById('footer-social-linkedin');
    this.socialInstagram = document.getElementById('footer-social-instagram');

    this.contactAddressEl = document.getElementById('footer-contact-address');
    this.contactEmailEl = document.getElementById('footer-contact-email');
    this.contactPhoneEl = document.getElementById('footer-contact-phone');
    this.contactHoursEl = document.getElementById('footer-contact-hours');
    
    this.backToTopBtn = document.getElementById('back-to-top');

    this.newsletterForm = document.getElementById('footer-newsletter');
    this.newsletterEmail = document.getElementById('footer-newsletter-email');
    this.newsletterStatus = document.getElementById('footer-newsletter-status');

    // Configurable corporate contact & social coordinates
    this.config = {
      socials: {
        x: 'https://x.com/jovianex',
        linkedin: 'https://linkedin.com/company/jovianex',
        instagram: 'https://instagram.com/jovianex'
      },
      contact: {
        email: '📧 Email: info@jovianex.com',
        phone: '📞 +971 50 306 2031',
        address: '📍 Ajman Free Zone United Arab Emirates',
        hours: '🕒 Monday - Friday: 9:00 AM - 6:00 PM (GST)'
      }
    };

    this.initFooter();
  }

  /**
   * Inject dynamic company information and bind interactions.
   */
  initFooter() {
    // 1. Dynamic copyright year loader
    if (this.yearEl) {
      this.yearEl.textContent = String(new Date().getFullYear());
    }

    // 2. Load social coordinates targets
    if (this.socialX) this.socialX.href = this.config.socials.x;
    if (this.socialLinkedin) this.socialLinkedin.href = this.config.socials.linkedin;
    if (this.socialInstagram) this.socialInstagram.href = this.config.socials.instagram;

    // 3. Inject address & schedule working hours
    if (this.contactAddressEl) {
      this.contactAddressEl.textContent = `${this.config.contact.address}`;
    }
    if (this.contactEmailEl) {
      this.contactEmailEl.textContent = this.config.contact.email;
    }
     if (this.contactPhoneEl) {
      this.contactPhoneEl.textContent = this.config.contact.phone;
    }
     if (this.contactHoursEl) {
      this.contactHoursEl.textContent = this.config.contact.hours;
    }

    // 4. Back-to-Top scroll event triggers
    if (this.backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          this.backToTopBtn.classList.add('back-to-top--visible');
        } else {
          this.backToTopBtn.classList.remove('back-to-top--visible');
        }
      });

      this.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 5. Future-ready Newsletter signup form validation
    if (this.newsletterForm) {
      this.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailVal = this.newsletterEmail.value.trim();
        if (emailVal && this.newsletterStatus) {
          this.newsletterStatus.style.display = 'block';
          this.newsletterStatus.style.color = 'var(--color-success)';
          this.newsletterStatus.textContent = '✓ Subscribed successfully!';
          this.newsletterEmail.value = '';

          setTimeout(() => {
            this.newsletterStatus.style.display = 'none';
          }, 4000);
        }
      });
    }
  }
}
