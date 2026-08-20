/**
 * ============================================================
 * PRICING TIMELINE CONTROLLER
 * ============================================================
 *
 * Responsibilities:
 * - Fetch membership plans from API
 * - Normalize API response
 * - Render pricing timeline
 * - Render comparison dropdown
 * - Select Founder plan by default
 * - Update active plan
 * - Calculate total membership amount
 * - Update Registration Step 4
 *
 * IMPORTANT PRICING RULE
 * ------------------------------------------------------------
 *
 * plan.price    = ANNUAL PRICE
 * plan.duration = NUMBER OF YEARS
 *
 * Example:
 *
 * Founder:
 * 49 AED/year × 3 years = 147 AED total
 *
 * Standard:
 * 99 AED/year × 3 years = 297 AED total
 *
 * Therefore:
 *
 * annualRate = plan.price
 * total      = plan.price × plan.duration
 *
 * Payment amount = total
 * ============================================================
 */

export class PricingTimelineController {

    constructor() {

        this.selectEl =
            document.getElementById(
                "pricing-compare-select"
            );

        this.savingsAmtEl =
            document.querySelector(
                "[data-pricing-savings-amt]"
            );

        this.savingsYearsEl =
            document.querySelector(
                "[data-pricing-savings-years]"
            );

        this.timelineContainer =
            document.getElementById(
                "pricing-timeline"
            );

        this.plans = [];

        this.initialSelectedPlan = null;

        this.init();
    }


    /**
     * ============================================================
     * INITIALIZE
     * ============================================================
     */

    async init() {

        try {

            /**
             * ----------------------------------------------------
             * FETCH MEMBERSHIP PLANS
             * ----------------------------------------------------
             */

            this.plans =
                await getMembershipPlans();

            if (
                !Array.isArray(this.plans) ||
                !this.plans.length
            ) {

                console.warn(
                    "No membership plans returned from API"
                );

                return;
            }


            /**
             * ----------------------------------------------------
             * NORMALIZE PLANS
             * ----------------------------------------------------
             */

            this.normalizePlans();


            /**
             * ----------------------------------------------------
             * RENDER LEFT TIMELINE
             * ----------------------------------------------------
             */

            this.renderTimeline();


            /**
             * ----------------------------------------------------
             * RENDER DROPDOWN
             *
             * IMPORTANT:
             * Founder is INCLUDED.
             * This allows Founder to actually be selected
             * by default.
             * ----------------------------------------------------
             */

            this.renderSelectOptions();


            /**
             * ----------------------------------------------------
             * DROPDOWN CHANGE EVENT
             * ----------------------------------------------------
             */

            if (this.selectEl) {

                this.selectEl.addEventListener(
                    "change",
                    () => {

                        this.updateActivePlan();

                    }
                );

            }


            /**
             * ----------------------------------------------------
             * SET INITIAL PLAN
             *
             * Founder is preferred.
             * ----------------------------------------------------
             */

            this.setInitialPlan();


            /**
             * ----------------------------------------------------
             * APPLY INITIAL PLAN
             * ----------------------------------------------------
             */

            if (this.initialSelectedPlan) {

                this.updatePlanUI(
                    this.initialSelectedPlan
                );

            } else {

                this.updateActivePlan();

            }


            console.log(
                "Pricing Timeline initialized:",
                this.plans
            );

            console.log(
                "Initial selected plan:",
                this.initialSelectedPlan
            );


        } catch (error) {

            console.error(
                "PricingTimelineController initialization failed:",
                error
            );

        }
    }


    /**
     * ============================================================
     * NORMALIZE PLANS
     * ============================================================
     */

    normalizePlans() {

        this.plans =
            this.plans.map(
                (plan, index) => {

                    const phase =
                        String(
                            plan.code ||
                            plan.phase ||
                            plan.slug ||
                            plan.key ||
                            ""
                        ).trim();


                    const name =
                        String(
                            plan.name ||
                            plan.title ||
                            ""
                        ).trim();


                    /**
                     * IMPORTANT:
                     *
                     * plan.price = ANNUAL PRICE
                     */

                    const price =
                        Number(
                            plan.price ??
                            plan.amount ??
                            0
                        );


                    const currency =
                        plan.currency ||
                        "AED";


                    const description =
                        String(
                            plan.description ||
                            ""
                        ).trim();


                    /**
                     * Duration = number of years
                     */

                    const duration =
                        Number(
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

                        /**
                         * Annual price
                         */
                        price,

                        currency,
                        description,

                        /**
                         * Number of years
                         */
                        duration,

                        index
                    };

                }
            );


        console.log(
            "Normalized membership plans:",
            this.plans
        );
    }


    /**
     * ============================================================
     * SET INITIAL PLAN
     * ============================================================
     *
     * Founder MUST be selected on initial page load.
     *
     * Priority:
     *
     * 1. Founder
     * 2. Standard
     * 3. First available plan
     *
     * ============================================================
     */

    setInitialPlan() {

        if (!this.plans.length) {

            return;
        }


        /**
         * --------------------------------------------------------
         * 1. FIND FOUNDER PLAN
         * --------------------------------------------------------
         */

        const founderPlan =
            this.plans.find(
                (plan) => {

                    const phase =
                        String(
                            plan.phase || ""
                        )
                            .trim()
                            .toLowerCase();

                    const code =
                        String(
                            plan.code || ""
                        )
                            .trim()
                            .toLowerCase();

                    const slug =
                        String(
                            plan.slug || ""
                        )
                            .trim()
                            .toLowerCase();

                    const name =
                        String(
                            plan.name || ""
                        )
                            .trim()
                            .toLowerCase();


                    return (
                        phase === "founder" ||
                        code === "founder" ||
                        slug === "founder" ||
                        name.includes("founder")
                    );

                }
            );


        if (founderPlan) {

            this.initialSelectedPlan =
                founderPlan;


            /**
             * IMPORTANT:
             *
             * Founder now exists in the dropdown,
             * so explicitly select it.
             */

            if (this.selectEl) {

                this.selectEl.value =
                    founderPlan.phase;

            }


            console.log(
                "Default plan selected: Founder",
                founderPlan
            );


            return;
        }


        /**
         * --------------------------------------------------------
         * 2. FALLBACK TO STANDARD
         * --------------------------------------------------------
         */

        const standardPlan =
            this.plans.find(
                (plan) =>
                    String(
                        plan.phase || ""
                    )
                        .trim()
                        .toLowerCase() === "standard"
            );


        if (standardPlan) {

            this.initialSelectedPlan =
                standardPlan;


            if (this.selectEl) {

                this.selectEl.value =
                    standardPlan.phase;

            }


            console.log(
                "Default plan selected: Standard",
                standardPlan
            );


            return;
        }


        /**
         * --------------------------------------------------------
         * 3. FALLBACK TO FIRST PLAN
         * --------------------------------------------------------
         */

        const firstPlan =
            this.plans[0];


        if (firstPlan) {

            this.initialSelectedPlan =
                firstPlan;


            if (this.selectEl) {

                this.selectEl.value =
                    firstPlan.phase;

            }

        }

    }


    /**
     * ============================================================
     * RENDER LEFT PRICING TIMELINE
     * ============================================================
     */

    renderTimeline() {

        if (!this.timelineContainer) {

            console.warn(
                "pricing-timeline container not found"
            );

            return;
        }


        this.timelineContainer.innerHTML = `

            <div
                class="pricing__timeline-line"
                aria-hidden="true"
            ></div>

            ${this.plans
                .map((plan) => {

                    return `

                        <div
                            class="pricing__timeline-item"
                            data-phase="${this.escapeHtml(
                                plan.phase
                            )}"
                        >

                            <div
                                class="pricing__timeline-marker"
                            ></div>


                            <div
                                class="pricing__timeline-content flex justify-between align-center"
                            >

                                <div>

                                    <h4
                                        class="text-small"
                                        style="
                                            font-weight: var(--fw-bold);
                                            margin: 0;
                                        "
                                    >

                                        ${this.escapeHtml(
                                            plan.name
                                        )}

                                    </h4>


                                    <p
                                        class="text-muted text-xs"
                                        style="
                                            margin: 0;
                                            margin-top: var(--space-4);
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
                                            font-size: 0.6rem;
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
     * ============================================================
     * RENDER COMPARISON DROPDOWN
     * ============================================================
     *
     * IMPORTANT:
     *
     * Founder is NOT removed anymore.
     *
     * This is what allows:
     *
     * Founder → selected by default
     *
     * ============================================================
     */

    renderSelectOptions() {

        if (!this.selectEl) {

            console.warn(
                "pricing-compare-select not found"
            );

            return;
        }


        /**
         * ALL plans are included.
         */

        const comparisonPlans =
            this.plans;


        this.selectEl.innerHTML =
            comparisonPlans
                .map((plan) => {

                    return `

                        <option
                            value="${this.escapeHtml(
                                plan.phase
                            )}"
                        >

                            ${this.escapeHtml(
                                plan.name
                            )}

                            (
                                ${this.escapeHtml(
                                    String(plan.price)
                                )}

                                ${this.escapeHtml(
                                    plan.currency
                                )}/yr

                                ${
                                    plan.duration
                                        ? `, ${this.escapeHtml(
                                            String(
                                                plan.duration
                                            )
                                        )}-Yr`
                                        : ""
                                }

                            )

                            - VAT Inclusive

                        </option>

                    `;

                })
                .join("");


        /**
         * --------------------------------------------------------
         * IMPORTANT:
         *
         * Set Founder immediately after options are created.
         * --------------------------------------------------------
         */

        const founderPlan =
            this.plans.find(
                (plan) => {

                    const phase =
                        String(
                            plan.phase || ""
                        )
                            .trim()
                            .toLowerCase();

                    const code =
                        String(
                            plan.code || ""
                        )
                            .trim()
                            .toLowerCase();

                    const slug =
                        String(
                            plan.slug || ""
                        )
                            .trim()
                            .toLowerCase();

                    const name =
                        String(
                            plan.name || ""
                        )
                            .trim()
                            .toLowerCase();

                    return (
                        phase === "founder" ||
                        code === "founder" ||
                        slug === "founder" ||
                        name.includes("founder")
                    );

                }
            );


        if (founderPlan) {

            this.selectEl.value =
                founderPlan.phase;

        }

    }


    /**
     * ============================================================
     * UPDATE ACTIVE PLAN
     * ============================================================
     */

    updateActivePlan() {

        if (!this.selectEl) {

            return;
        }


        const selectedPhase =
            String(
                this.selectEl.value || ""
            ).trim();


        const selectedPlan =
            this.plans.find(
                (plan) =>
                    plan.phase === selectedPhase
            );


        if (!selectedPlan) {

            console.warn(
                "Selected plan not found:",
                selectedPhase
            );

            return;
        }


        this.updatePlanUI(
            selectedPlan
        );
    }


    /**
     * ============================================================
     * UPDATE PLAN UI
     * ============================================================
     */

    updatePlanUI(selectedPlan) {

        if (!selectedPlan) {

            return;
        }


        console.log(
            "Selected membership plan:",
            selectedPlan
        );


        /**
         * --------------------------------------------------------
         * UPDATE LEFT TIMELINE ACTIVE STATE
         * --------------------------------------------------------
         */

        const timelineItems =
            document.querySelectorAll(
                ".pricing__timeline-item"
            );


        timelineItems.forEach(
            (item) => {

                const itemPhase =
                    String(
                        item.getAttribute(
                            "data-phase"
                        ) || ""
                    ).trim();


                const existingBadge =
                    item.querySelector(
                        ".pricing-plan-active-badge"
                    );


                if (
                    itemPhase ===
                    selectedPlan.phase
                ) {

                    item.classList.add(
                        "pricing__timeline-item--active"
                    );


                    if (!existingBadge) {

                        const heading =
                            item.querySelector(
                                "h4"
                            );


                        if (heading) {

                            heading.insertAdjacentHTML(
                                "beforeend",
                                `

                                    <span
                                        class="badge pricing-plan-active-badge"
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
         * UPDATE SAVINGS / PLAN VALUES
         * --------------------------------------------------------
         */

        const selectedPrice =
            Number(
                selectedPlan.price || 0
            );


        const selectedDuration =
            Number(
                selectedPlan.duration || 0
            );


        if (this.savingsAmtEl) {

            this.savingsAmtEl.textContent =
                String(
                    selectedPrice
                );

        }


        if (this.savingsYearsEl) {

            this.savingsYearsEl.textContent =
                String(
                    selectedDuration
                );

        }


        /**
         * --------------------------------------------------------
         * UPDATE REGISTRATION STEP 4
         * --------------------------------------------------------
         */

        this.updateRegistrationStep4(
            selectedPlan
        );


        /**
         * --------------------------------------------------------
         * DISPATCH EVENT
         * --------------------------------------------------------
         */

        document.dispatchEvent(
            new CustomEvent(
                "membershipPlanChanged",
                {
                    detail: {
                        plan: selectedPlan
                    }
                }
            )
        );

    }


    /**
     * ============================================================
     * UPDATE REGISTRATION STEP 4
     * ============================================================
     *
     * PRICING RULE:
     *
     * annualRate = plan.price
     * total      = annualRate × duration
     *
     * Examples:
     *
     * 49 × 3 = 147
     * 80 × 3 = 240
     * 99 × 3 = 297
     *
     * ============================================================
     */

    updateRegistrationStep4(plan) {

        if (!plan) {

            return;
        }


        const step4 =
            document.getElementById(
                "registration-step-4"
            );


        if (!step4) {

            console.warn(
                "registration-step-4 not found"
            );

            return;
        }


        /**
         * --------------------------------------------------------
         * PRICING CALCULATION
         * --------------------------------------------------------
         */

        const annualRate =
            Number(
                plan.price ?? 0
            );


        const duration =
            Number(
                plan.duration ?? 0
            );


        const currency =
            plan.currency ||
            "AED";


        /**
         * TOTAL MEMBERSHIP PRICE
         *
         * Annual price × number of years
         */

        const total =
            duration > 0
                ? annualRate * duration
                : annualRate;


        console.log(
            "Step 4 pricing:",
            {
                planName:
                    plan.name,

                annualRate:
                    annualRate,

                duration:
                    duration,

                total:
                    total,

                currency:
                    currency
            }
        );


        /**
         * --------------------------------------------------------
         * PLAN NAME - HEADER
         * --------------------------------------------------------
         */

        const planNameEl =
            step4.querySelector(
                "#step4-plan-name"
            );


        if (planNameEl) {

            planNameEl.textContent =
                plan.name || "";

        }


        /**
         * --------------------------------------------------------
         * PLAN SUBTITLE - HEADER
         * --------------------------------------------------------
         */

        const planSubtitleEl =
            step4.querySelector(
                "#step4-plan-subtitle"
            );


        if (planSubtitleEl) {

            planSubtitleEl.textContent =
                duration > 0
                    ? `${duration}-Year ${
                        plan.name ||
                        "Membership"
                    }`
                    : `${
                        plan.name ||
                        "Membership"
                    }`;

        }


        /**
         * --------------------------------------------------------
         * HEADER PRICE
         *
         * This shows ANNUAL price.
         *
         * Example:
         *
         * 49 AED/yr
         * --------------------------------------------------------
         */

        const planPriceEl =
            step4.querySelector(
                "#step4-plan-price"
            );


        if (planPriceEl) {

            planPriceEl.textContent =
                `${annualRate} ${currency}/yr`;

        }


        /**
         * --------------------------------------------------------
         * MEMBERSHIP NAME
         * --------------------------------------------------------
         */

        const membershipNameEl =
            step4.querySelector(
                "#step4-membership-name"
            );


        if (membershipNameEl) {

            membershipNameEl.textContent =
                plan.name || "";

        }


        /**
         * --------------------------------------------------------
         * DURATION
         * --------------------------------------------------------
         */

        const durationEl =
            step4.querySelector(
                "#step4-membership-duration"
            );


        if (durationEl) {

            durationEl.textContent =
                duration > 0
                    ? `${duration} ${
                        duration === 1
                            ? "Year"
                            : "Years"
                    }`
                    : "—";

        }


        /**
         * --------------------------------------------------------
         * EQUIVALENT ANNUAL RATE
         *
         * IMPORTANT:
         *
         * This is already annual price.
         *
         * DO NOT divide total by duration here.
         *
         * Example:
         *
         * 49 AED/year
         * 3 years
         * Total = 147 AED
         *
         * Annual Rate remains:
         * 49 AED/year
         * --------------------------------------------------------
         */

        const annualRateEl =
            step4.querySelector(
                "#step4-annual-rate"
            );


        if (annualRateEl) {

            annualRateEl.textContent =
                `${annualRate} ${currency} / year`;

        }


        /**
         * --------------------------------------------------------
         * TOTAL
         *
         * Example:
         *
         * 49 × 3 = 147
         * --------------------------------------------------------
         */

        const totalEl =
            step4.querySelector(
                "#step4-total"
            );


        if (totalEl) {

            totalEl.textContent =
                `${total} ${currency}`;

        }


        /**
         * --------------------------------------------------------
         * PAYMENT BUTTON
         *
         * Payment amount MUST be total.
         * --------------------------------------------------------
         */

        const payButtonTextEl =
            step4.querySelector(
                "#membership-pay-btn-text"
            );


        if (payButtonTextEl) {

            payButtonTextEl.textContent =
                `Pay ${total} ${currency} & Become a Founder`;

        }


        /**
         * --------------------------------------------------------
         * STORE PLAN DATA ON STEP 4
         * --------------------------------------------------------
         */

        step4.dataset.planId =
            plan.id || "";


        step4.dataset.planCode =
            plan.phase || "";


        step4.dataset.planName =
            plan.name || "";


        /**
         * IMPORTANT:
         *
         * planPrice = TOTAL
         *
         * This should be used by payment logic.
         */

        step4.dataset.planPrice =
            String(total);


        /**
         * Annual price separately stored.
         */

        step4.dataset.planAnnualPrice =
            String(annualRate);


        step4.dataset.planCurrency =
            currency;


        step4.dataset.planDuration =
            String(duration);


        step4.dataset.planTotal =
            String(total);


        console.log(
            "Registration Step 4 updated:",
            {
                id:
                    plan.id,

                phase:
                    plan.phase,

                name:
                    plan.name,

                annualPrice:
                    annualRate,

                duration:
                    duration,

                total:
                    total,

                currency:
                    currency
            }
        );

    }


    /**
     * ============================================================
     * PUBLIC METHOD
     * ============================================================
     *
     * Can be called from another script:
     *
     * pricingTimelineController
     *     .setSelectedPlan("premium")
     *
     * ============================================================
     */

    setSelectedPlan(phase) {

        const normalizedPhase =
            String(
                phase || ""
            ).trim();


        /**
         * --------------------------------------------------------
         * FIND PLAN
         * --------------------------------------------------------
         */

        const plan =
            this.plans.find(
                (item) =>
                    String(
                        item.phase || ""
                    ).trim() ===
                    normalizedPhase
            );


        if (!plan) {

            console.warn(
                "Cannot select plan. Plan not found:",
                phase
            );

            return;
        }


        /**
         * --------------------------------------------------------
         * UPDATE DROPDOWN
         * --------------------------------------------------------
         */

        if (this.selectEl) {

            this.selectEl.value =
                plan.phase;

        }


        /**
         * --------------------------------------------------------
         * IMPORTANT:
         *
         * Don't rely only on select change event.
         * Directly update UI.
         * --------------------------------------------------------
         */

        this.updatePlanUI(
            plan
        );

    }


    /**
     * ============================================================
     * GET SELECTED PLAN
     * ============================================================
     */

    getSelectedPlan() {

        if (
            this.selectEl &&
            this.selectEl.value
        ) {

            return this.plans.find(
                (plan) =>
                    plan.phase ===
                    this.selectEl.value
            ) || null;

        }


        return this.initialSelectedPlan || null;
    }


    /**
     * ============================================================
     * ESCAPE HTML
     * ============================================================
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
 * GLOBAL CONTROLLER REFERENCE
 * ============================================================
 */

let pricingTimelineController =
    null;


/**
 * ============================================================
 * INITIALIZE
 * ============================================================
 */

function initPricingTimeline() {

    pricingTimelineController =
        new PricingTimelineController();


    /**
     * Make available globally.
     *
     * Other scripts can access:
     *
     * window.pricingTimelineController
     */

    window.pricingTimelineController =
        pricingTimelineController;
}


/**
 * ============================================================
 * DOM READY
 * ============================================================
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