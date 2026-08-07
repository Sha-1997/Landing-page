/* Master Application Bootstrapper - JovianeX Landing Page */
import { NavigationController } from './navigation.js';
import { AnimationController } from './animations.js';
import { HeroController } from './hero.js';
import { EcosystemController } from './ecosystem.js';
import { JobsShowcaseController } from './ai-jobs.js';
import { FounderMembershipController } from './founder-membership.js';
import { PricingTimelineController } from './pricing-timeline.js';
import { RegistrationController } from './free-registration.js';
import { NameChallengeController } from './name-challenge.js';
import { FounderGiveawayController } from './founder-giveaway.js';
import { ReferralController } from './referral-program.js';
import { RoadmapController } from './ecosystem-roadmap.js';
import { FAQController } from './faq.js';
import { FooterController } from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[JovianeX] Bootstrapping interactive behavior engine...');

  try {
    // 1. Initialize Navigation Controller (Sticky headers, mobile toggles, spy)
    const navigation = new NavigationController();

    // 2. Initialize Animation Controller (Intersection scroll reveals)
    const animations = new AnimationController();

    // 3. Initialize Hero Controller (GST Countdowns, metrics increment counters)
    const hero = new HeroController();

    // 4. Initialize Ecosystem Controller (Module connection cycler highlights)
    const ecosystem = new EcosystemController();

    // 5. Initialize Jobs Showcase Controller (Candidate/Employer mockups tab selector)
    const jobsShowcase = new JobsShowcaseController();

    // 6. Initialize Founder Membership Controller (Seats incrementer, secondary countdown clock)
    const founderMembership = new FounderMembershipController();

    // 7. Initialize Pricing Timeline Controller (Savings calculator dropdown trigger)
    const pricingTimeline = new PricingTimelineController();

    // 8. Initialize Registration Controller (Client validations & strength estimators)
    const registration = new RegistrationController();

    // 9. Initialize Name Challenge Controller (Dynamic characters limit preview)
    const nameChallenge = new NameChallengeController();

    // 10. Initialize Founder Giveaway Controller (GST campaign deadlines & dynamic config details)
    const founderGiveaway = new FounderGiveawayController();

    // 11. Initialize Referral Controller (Ambassador clipboards sharing & dynamic statistics)
    const referral = new ReferralController();

    // 12. Initialize Roadmap Controller (Phased milestones timeline details switcher)
    const roadmap = new RoadmapController();

    // 13. Initialize FAQ Controller (Dynamic accordion list & local search queries)
    const faq = new FAQController();

    // 14. Initialize Footer Controller (Dynamic copyright years, back-to-top floating buttons)
    const footer = new FooterController();
    
    console.log('[JovianeX] Behavior modules started successfully.');
  } catch (error) {
    console.error('[JovianeX] Error during initialization:', error);
  }
});
