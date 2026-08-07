/**
 * Enterprise FAQ Accordion Dynamic Renderer and Local Search Engine - JovianeX Landing Page
 */
export class FAQController {
  constructor() {
    this.container = document.getElementById('faq-accordion-container');
    this.searchInput = document.getElementById('faq-search-input');

    // CMS-ready configurable list of FAQ resources
    this.faqData = [
      {
        question: 'What is Founder Membership?',
        answer: 'Founder Membership is a premium early-adopter membership that secures lifetime access benefits across the JovianeX AI ecosystem modules, starting at just 49 AED during launch.'
      },
      {
        question: 'Can I upgrade to Founder status later?',
        answer: 'Yes, but early-stage promotional pricing (49 AED) is capped to the initial launch window. Subsequent growth phases will lock in at higher price increments.'
      },
      {
        question: 'What is included in the AI Jobs MVP?',
        answer: 'The launch MVP features automated talent profiling, verified qualification portfolios, and dynamic evaluation matching for recruiter pipelines.'
      },
      {
        question: 'How does ecosystem identity work?',
        answer: 'Your verified account generates a Unified ID, mapping credentials and referral milestones across AI Jobs, AI Delivery, AI Travel, and future logistics modules.'
      },
      {
        question: 'What payment methods are secure?',
        answer: 'We support all major secure online transaction gateways and credit/debit card processors. Payments are verified by certified SSL endpoints.'
      }
    ];

    if (this.container) {
      this.renderFAQs();
      this.initAccordion();
    }
  }

  /**
   * Render accordion templates dynamically into container landmark.
   */
  renderFAQs() {
    this.container.innerHTML = ''; // Clear loading indicator

    this.faqData.forEach((item, index) => {
      const itemHtml = `
        <div class="faq__accordion-item" data-faq-index="${index}">
          <button type="button" class="faq__accordion-btn" aria-expanded="false" aria-controls="faq-content-${index}">
            <span>${item.question}</span>
            <span class="faq__accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq-content-${index}" class="faq__accordion-content" role="region">
            <p class="faq__accordion-text">${item.answer}</p>
          </div>
        </div>
      `;
      this.container.insertAdjacentHTML('beforeend', itemHtml);
    });
  }

  /**
   * Bind event handles to toggle accordion items and filter search inputs.
   */
  initAccordion() {
    const items = this.container.querySelectorAll('.faq__accordion-item');

    // 1. Accordion click expanders
    items.forEach((item) => {
      const btn = item.querySelector('.faq__accordion-btn');
      const content = item.querySelector('.faq__accordion-content');

      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('faq__accordion-item--active');

        // Collapse all other accordion items
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('faq__accordion-item--active');
            otherItem.querySelector('.faq__accordion-btn').setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.faq__accordion-content').style.maxHeight = '0';
          }
        });

        if (isActive) {
          item.classList.remove('faq__accordion-item--active');
          btn.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('faq__accordion-item--active');
          btn.setAttribute('aria-expanded', 'true');
          // set height dynamically based on inner scroll bounds
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });
    });

    // 2. Real-time Search input query filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        const query = this.searchInput.value.toLowerCase().trim();

        items.forEach((item, index) => {
          const data = this.faqData[index];
          const matches = data.question.toLowerCase().includes(query) || data.answer.toLowerCase().includes(query);

          if (matches) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }
  }
}
