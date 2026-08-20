/**
 * ============================================================
 * Pricing Timeline Controller
 * ============================================================
 *
 * Responsibilities:
 * - Fetch membership plans from API
 * - Normalize API response
 * - Render left pricing timeline
 * - Populate comparison dropdown
 * - Update active timeline plan
 * - Update founder savings section
 * - Update payment / membership summary card
 * - Keep selected plan synchronized across the UI
 *
 * Requires:
 * - getMembershipPlans() to be available globally
 *
 * ============================================================
 */

export class PricingTimelineController {
  constructor() {
    // ---------------------------------------------------------
    // Pricing comparison dropdown
    // ---------------------------------------------------------
    this.selectEl = document.getElementById(
      "pricing-compare-select"
    );

    // ---------------------------------------------------------
    // Founder savings section
    // ---------------------------------------------------------
    this.savingsAmtEl = document.querySelector(
      "[data-pricing-savings-amt]"
    );

    this.savingsYearsEl = document.querySelector(
      "[data-pricing-savings-years]"
    );

    // ---------------------------------------------------------
    // Timeline
    // ---------------------------------------------------------
    this.timelineContainer =
      document.getElementById("pricing-timeline");

    // ---------------------------------------------------------
    // Payment / selected plan card
    // ---------------------------------------------------------
    this.planNameEl =
      document.getElementById("membership-plan-name");

    this.planDurationLabelEl =
      document.getElementById(
        "membership-plan-duration-label"
      );

    this.planPriceEl =
      document.getElementById(
        "membership-plan-price"
      );

    this.membershipNameEl =
      document.getElementById(
        "membership-membership-name"
      );

    this.membershipDurationEl =
      document.getElementById(
        "membership-duration"
      );

    this.annualRateEl =
      document.getElementById(
        "membership-annual-rate"
      );

    this.totalPriceEl =
      document.getElementById(
        "membership-total"
      );

    this.payButtonTextEl =
      document.getElementById(
        "membership-pay-btn-text"
      );

    // ---------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------
    this.plans = [];

    this.selectedPlan = null;

    // ---------------------------------------------------------
    // Initialize
    // ---------------------------------------------------------
    this.init();
  }

  /**
   * ==========================================================
   * INIT
   * ==========================================================
   */
  async init() {
    try {
      /**
       * getMembershipPlans() must already be available
       * from your existing membership API script.
       */
      if (
        typeof window.getMembershipPlans !==
        "function"
      ) {
        console.error(
          "getMembershipPlans() is not available."
        );

        return;
      }

      this.plans =
        await window.getMembershipPlans();

      if (
        !Array.isArray(this.plans) ||
        !this.plans.length
      ) {
        console.warn(
          "No membership plans returned from API."
        );

        return;
      }

      // -------------------------------------------------------
      // Normalize API data
      // -------------------------------------------------------
      this.normalizePlans();

      // -------------------------------------------------------
      // Render timeline
      // -------------------------------------------------------
      this.renderTimeline();

      // -------------------------------------------------------
      // Render comparison dropdown
      // -------------------------------------------------------
      this.renderSelectOptions();

      // -------------------------------------------------------
      // Register dropdown event
      // -------------------------------------------------------
      this.registerEvents();

      // -------------------------------------------------------
      // Initial selected plan
      // -------------------------------------------------------
      this.setInitialSelectedPlan();

      // -------------------------------------------------------
      // Make controller globally accessible
      // -------------------------------------------------------
      window.pricingTimelineController = this;

      console.log(
        "Pricing timeline initialized:",
        this.plans
      );
    } catch (error) {
      console.error(
        "PricingTimelineController initialization failed:",
        error
      );
    }
  }

  /**
   * ==========================================================
   * SET PLANS
   * ==========================================================
   *
   * This is useful if another existing script already fetched
   * membershipPlans and wants to pass them into this controller.
   */
  setPlans(plans) {
    if (
      !Array.isArray(plans) ||
      !plans.length
    ) {
      console.warn(
        "setPlans() received invalid plans."
      );

      return;
    }

    this.plans = plans;

    this.normalizePlans();

    this.renderTimeline();

    this.renderSelectOptions();

    this.setInitialSelectedPlan();
  }

  /**
   * ==========================================================
   * NORMALIZE PLANS
   * ==========================================================
   */
  normalizePlans() {
    this.plans = this.plans.map(
      (plan, index) => {
        const phase = String(
          plan.code ||
            plan.phase ||
            plan.slug ||
            plan.key ||
            ""
        ).trim();

        const name = String(
          plan.name ||
            plan.title ||
            ""
        ).trim();

        const price = Number(
          plan.price ??
            plan.amount ??
            0
        );

        const currency =
          plan.currency || "AED";

        const description = String(
          plan.description || ""
        ).trim();

        const duration = Number(
          plan.duration ??
            plan.durationYears ??
            plan.membershipDuration ??
            plan.years ??
            0
        );

        return {
          ...plan,

          phase,
          name,
          price,
          currency,
          description,
          duration,

          index
        };
      }
    );
  }

  /**
   * ==========================================================
   * RENDER TIMELINE
   * ==========================================================
   */
  renderTimeline() {
    if (!this.timelineContainer) {
      console.warn(
        "pricing-timeline container not found."
      );

      return;
    }

    this.timelineContainer.innerHTML = `
      <div
        class="pricing__timeline-line"
        aria-hidden="true"
      ></div>

      ${this.plans
        .map((plan, index) => {
          const isActive =
            index === 0;

          return `
            <div
              class="
                pricing__timeline-item
                ${
                  isActive
                    ? "pricing__timeline-item--active"
                    : ""
                }
              "
              data-phase="${this.escapeHtml(
                plan.phase
              )}"
            >

              <div
                class="pricing__timeline-marker"
              ></div>

              <div
                class="
                  pricing__timeline-content
                  flex
                  justify-between
                  align-center
                "
              >

                <div>

                  <h4
                    class="text-small"
                    style="
                      font-weight:var(--fw-bold);
                      margin:0;
                    "
                  >

                    ${this.escapeHtml(
                      plan.name
                    )}

                    ${
                      isActive
                        ? `
                          <span
                            class="badge"
                            style="
                              background-color:
                                var(--color-secondary-glow);
                              color:
                                var(--color-secondary);
                              font-size:0.6rem;
                              vertical-align:middle;
                              margin-left:
                                var(--space-4);
                            "
                          >
                            Active
                          </span>
                        `
                        : ""
                    }

                  </h4>

                  <p
                    class="
                      text-muted
                      text-xs
                    "
                    style="
                      margin:0;
                      margin-top:var(--space-4);
                    "
                  >
                    ${this.escapeHtml(
                      plan.description
                    )}
                  </p>

                </div>

                <div class="text-right">

                  <span
                    class="pricing__timeline-price"
                  >
                    ${this.escapeHtml(
                      String(plan.price)
                    )}
                    ${this.escapeHtml(
                      plan.currency
                    )}/yr
                  </span>

                  <span
                    class="block text-muted"
                    style="
                      font-size:0.6rem;
                    "
                  >
                    VAT Inclusive
                  </span>

                </div>

              </div>

            </div>
          `;
        })
        .join("")}
    `;
  }

  /**
   * ==========================================================
   * RENDER SELECT OPTIONS
   * ==========================================================
   */
  renderSelectOptions() {
    if (!this.selectEl) {
      console.warn(
        "pricing-compare-select not found."
      );

      return;
    }

    /**
     * Keep the current selection if possible.
     */
    const previousValue =
      this.selectEl.value;

    this.selectEl.innerHTML = "";

    /**
     * Founder should not be shown as a comparison option.
     */
    const comparisonPlans =
      this.plans.filter(
        (plan) =>
          !this.isFounderPlan(plan)
      );

    comparisonPlans.forEach(
      (plan) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          plan.phase;

        const durationText =
          plan.duration > 0
            ? `, ${plan.duration}-Yr`
            : "";

        option.textContent =
          `${plan.name} ` +
          `(${plan.price} ${plan.currency}/yr` +
          `${durationText}) ` +
          `- VAT Inclusive`;

        this.selectEl.appendChild(
          option
        );
      }
    );

    /**
     * Restore previous value if it still exists.
     */
    if (
      previousValue &&
      comparisonPlans.some(
        (plan) =>
          plan.phase ===
          previousValue
      )
    ) {
      this.selectEl.value =
        previousValue;

      return;
    }

    /**
     * Default:
     * Standard Membership if available.
     */
    const standardPlan =
      comparisonPlans.find(
        (plan) =>
          plan.phase ===
          "standard"
      );

    if (standardPlan) {
      this.selectEl.value =
        standardPlan.phase;

      return;
    }

    /**
     * Otherwise use the first comparison plan.
     */
    if (comparisonPlans.length) {
      this.selectEl.value =
        comparisonPlans[0].phase;
    }
  }

  /**
   * ==========================================================
   * REGISTER EVENTS
   * ==========================================================
   */
  registerEvents() {
    if (!this.selectEl) {
      return;
    }

    /**
     * Avoid registering the event multiple times.
     */
    if (
      this.selectEl.dataset
        .pricingListenerAttached ===
      "true"
    ) {
      return;
    }

    this.selectEl.addEventListener(
      "change",
      () => {
        this.updateActivePlan();
      }
    );

    this.selectEl.dataset
      .pricingListenerAttached =
      "true";
  }

  /**
   * ==========================================================
   * INITIAL SELECTED PLAN
   * ==========================================================
   */
  setInitialSelectedPlan() {
    if (!this.selectEl) {
      return;
    }

    /**
     * If dropdown has a valid value,
     * use that plan.
     */
    let selectedPlan =
      this.getSelectedPlan();

    /**
     * If nothing is selected,
     * use Standard.
     */
    if (!selectedPlan) {
      selectedPlan =
        this.plans.find(
          (plan) =>
            plan.phase ===
            "standard"
        );
    }

    /**
     * If still nothing,
     * use first non-founder plan.
     */
    if (!selectedPlan) {
      selectedPlan =
        this.plans.find(
          (plan) =>
            !this.isFounderPlan(
              plan
            )
        );
    }

    /**
     * Final fallback:
     * first API plan.
     */
    if (!selectedPlan) {
      selectedPlan =
        this.plans[0];
    }

    if (selectedPlan) {
      this.selectEl.value =
        selectedPlan.phase;

      this.updateActivePlan();
    }
  }

  /**
   * ==========================================================
   * GET SELECTED PLAN
   * ==========================================================
   */
  getSelectedPlan() {
    if (!this.selectEl) {
      return null;
    }

    const selectedPhase =
      String(
        this.selectEl.value || ""
      ).trim();

    if (!selectedPhase) {
      return null;
    }

    return (
      this.plans.find(
        (plan) =>
          plan.phase ===
          selectedPhase
      ) || null
    );
  }

  /**
   * ==========================================================
   * UPDATE ACTIVE PLAN
   * ==========================================================
   */
  updateActivePlan() {
    if (!this.selectEl) {
      return;
    }

    const selectedPlan =
      this.getSelectedPlan();

    if (!selectedPlan) {
      console.warn(
        "Could not find selected plan:",
        this.selectEl.value
      );

      return;
    }

    this.selectedPlan =
      selectedPlan;

    /**
     * --------------------------------------------------------
     * Update left timeline active status
     * --------------------------------------------------------
     */
    const timelineItems =
      document.querySelectorAll(
        ".pricing__timeline-item"
      );

    timelineItems.forEach(
      (item) => {
        const itemPhase =
          (
            item.getAttribute(
              "data-phase"
            ) || ""
          ).trim();

        const existingBadge =
          item.querySelector(
            ".badge"
          );

        const heading =
          item.querySelector("h4");

        if (
          itemPhase ===
          selectedPlan.phase
        ) {
          item.classList.add(
            "pricing__timeline-item--active"
          );

          if (
            !existingBadge &&
            heading
          ) {
            heading.insertAdjacentHTML(
              "beforeend",
              `
                <span
                  class="badge"
                  style="
                    background-color:
                      var(--color-secondary-glow);
                    color:
                      var(--color-secondary);
                    font-size:0.6rem;
                    vertical-align:middle;
                    margin-left:
                      var(--space-4);
                  "
                >
                  Active
                </span>
              `
            );
          }
        } else {
          item.classList.remove(
            "pricing__timeline-item--active"
          );

          if (existingBadge) {
            existingBadge.remove();
          }
        }
      }
    );

    /**
     * --------------------------------------------------------
     * Update savings section
     * --------------------------------------------------------
     */
    this.updateSavings(
      selectedPlan
    );

    /**
     * --------------------------------------------------------
     * Update payment / membership card
     * --------------------------------------------------------
     */
    this.updateMembershipPaymentCard(
      selectedPlan
    );

    /**
     * --------------------------------------------------------
     * Debug
     * --------------------------------------------------------
     */
    console.log(
      "Selected membership plan:",
      selectedPlan
    );
  }

  /**
   * ==========================================================
   * UPDATE SAVINGS
   * ==========================================================
   */
  updateSavings(selectedPlan) {
    if (!selectedPlan) {
      return;
    }

    /**
     * Founder is the baseline.
     */
    const founderPlan =
      this.plans.find(
        (plan) =>
          this.isFounderPlan(plan)
      );

    if (!founderPlan) {
      console.warn(
        "Founder plan not found."
      );

      /**
       * Still show selected price/duration
       * if savings elements exist.
       */
      if (this.savingsAmtEl) {
        this.savingsAmtEl.textContent =
          String(
            selectedPlan.price
          );
      }

      if (this.savingsYearsEl) {
        this.savingsYearsEl.textContent =
          String(
            selectedPlan.duration
          );
      }

      return;
    }

    /**
     * Founder total price.
     */
    const founderPrice =
      Number(
        founderPlan.price || 0
      );

    /**
     * Selected plan price.
     */
    const selectedPrice =
      Number(
        selectedPlan.price || 0
      );

    /**
     * Selected duration.
     */
    const selectedDuration =
      Number(
        selectedPlan.duration || 0
      );

    /**
     * Current UI labels say:
     *
     * Annual Savings
     * Extra Membership Duration
     *
     * So calculate actual difference.
     */
    const savings =
      selectedPrice -
      founderPrice;

    const extraDuration =
      selectedDuration -
      Number(
        founderPlan.duration || 0
      );

    /**
     * --------------------------------------------------------
     * IMPORTANT
     *
     * If your business definition of "Annual Savings"
     * is different, this calculation can be changed here.
     * --------------------------------------------------------
     */
    if (this.savingsAmtEl) {
      this.savingsAmtEl.textContent =
        String(
          Math.max(
            savings,
            0
          )
        );
    }

    if (this.savingsYearsEl) {
      this.savingsYearsEl.textContent =
        String(
          Math.max(
            extraDuration,
            0
          )
        );
    }
  }

  /**
   * ==========================================================
   * UPDATE MEMBERSHIP PAYMENT CARD
   * ==========================================================
   *
   * This is the important part for your new section.
   *
   * It updates:
   *
   * - Plan name
   * - Duration label
   * - Main price
   * - Membership name
   * - Duration
   * - Equivalent annual rate
   * - Total
   * - Pay button
   */
  updateMembershipPaymentCard(
    plan
  ) {
    if (!plan) {
      return;
    }

    const name =
      plan.name ||
      plan.title ||
      "Membership";

    const phase =
      String(
        plan.phase ||
          plan.code ||
          plan.slug ||
          ""
      ).toLowerCase();

    const duration =
      Number(
        plan.duration ||
          0
      );

    const price =
      Number(
        plan.price ||
          0
      );

    const currency =
      plan.currency ||
      "AED";

    /**
     * --------------------------------------------------------
     * Calculate annual rate
     * --------------------------------------------------------
     */
    const annualRate =
      duration > 0
        ? price / duration
        : price;

    /**
     * --------------------------------------------------------
     * Determine whether this is Founder
     * --------------------------------------------------------
     */
    const isFounder =
      this.isFounderPlan(
        plan
      );

    /**
     * --------------------------------------------------------
     * Plan title
     * --------------------------------------------------------
     */
    if (this.planNameEl) {
      this.planNameEl.textContent =
        name;
    }

    /**
     * --------------------------------------------------------
     * Duration label under title
     * --------------------------------------------------------
     */
    if (
      this.planDurationLabelEl
    ) {
      if (duration > 0) {
        this.planDurationLabelEl.textContent =
          `${duration}-Year ${name}`;
      } else {
        this.planDurationLabelEl.textContent =
          name;
      }
    }

    /**
     * --------------------------------------------------------
     * Main price
     * --------------------------------------------------------
     */
    if (this.planPriceEl) {
      this.planPriceEl.textContent =
        `${this.formatNumber(
          price
        )} ${currency}`;
    }

    /**
     * --------------------------------------------------------
     * Membership name
     * --------------------------------------------------------
     */
    if (
      this.membershipNameEl
    ) {
      this.membershipNameEl.textContent =
        name;
    }

    /**
     * --------------------------------------------------------
     * Duration
     * --------------------------------------------------------
     */
    if (
      this.membershipDurationEl
    ) {
      this.membershipDurationEl.textContent =
        duration > 0
          ? `${duration} Years`
          : "—";
    }

    /**
     * --------------------------------------------------------
     * Equivalent Annual Rate
     * --------------------------------------------------------
     */
    if (
      this.annualRateEl
    ) {
      this.annualRateEl.textContent =
        `${this.formatNumber(
          annualRate
        )} ${currency} / year`;
    }

    /**
     * --------------------------------------------------------
     * Total
     * --------------------------------------------------------
     */
    if (
      this.totalPriceEl
    ) {
      this.totalPriceEl.textContent =
        `${this.formatNumber(
          price
        )} ${currency}`;
    }

    /**
     * --------------------------------------------------------
     * Payment button
     * --------------------------------------------------------
     */
    if (
      this.payButtonTextEl
    ) {
      const actionText =
        isFounder
          ? "Become a Founder"
          : "Continue with Membership";

      this.payButtonTextEl.textContent =
        `Pay ${this.formatNumber(
          price
        )} ${currency} & ${actionText}`;
    }

    /**
     * --------------------------------------------------------
     * Store selected plan data on payment button
     *
     * This is useful later when Stripe checkout is created.
     * --------------------------------------------------------
     */
    const payButton =
      document.getElementById(
        "membership-pay-btn"
      );

    if (payButton) {
      payButton.dataset.planId =
        plan.id || "";

      payButton.dataset.planPhase =
        plan.phase || "";

      payButton.dataset.planName =
        name;

      payButton.dataset.planPrice =
        String(price);

      payButton.dataset.planCurrency =
        currency;

      payButton.dataset.planDuration =
        String(duration);
    }

    /**
     * --------------------------------------------------------
     * Also expose selected plan globally
     *
     * Your payment script can read:
     *
     * window.selectedMembershipPlan
     * --------------------------------------------------------
     */
    window.selectedMembershipPlan =
      plan;
  }

  /**
   * ==========================================================
   * IS FOUNDER PLAN
   * ==========================================================
   */
  isFounderPlan(plan) {
    if (!plan) {
      return false;
    }

    const phase =
      String(
        plan.phase ||
          plan.code ||
          plan.slug ||
          ""
      )
        .trim()
        .toLowerCase();

    const name =
      String(
        plan.name ||
          plan.title ||
          ""
      )
        .trim()
        .toLowerCase();

    return (
      phase === "founder" ||
      name.includes("founder")
    );
  }

  /**
   * ==========================================================
   * FORMAT NUMBER
   * ==========================================================
   */
  formatNumber(value) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    /**
     * Avoid unnecessary .00
     */
    if (
      Number.isInteger(number)
    ) {
      return String(number);
    }

    return number.toFixed(2);
  }

  /**
   * ==========================================================
   * ESCAPE HTML
   * ==========================================================
   */
  escapeHtml(value) {
    const div =
      document.createElement(
        "div"
      );

    div.textContent =
      String(
        value ?? ""
      );

    return div.innerHTML;
  }
}

/**
 * ============================================================
 * INITIALIZE
 * ============================================================
 */

function initPricingTimeline() {
  /**
   * Prevent duplicate initialization.
   */
  if (
    window.pricingTimelineController
  ) {
    return;
  }

  const controller =
    new PricingTimelineController();

  /**
   * Expose globally.
   */
  window.pricingTimelineController =
    controller;
}

/**
 * DOM ready
 */
if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initPricingTimeline,
    {
      once: true
    }
  );
} else {
  initPricingTimeline();
}