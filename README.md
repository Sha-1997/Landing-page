# JovianeX AI Ecosystem Launch Landing Page
## Frontend Foundation & Design System

This directory contains the production-ready responsive frontend foundation for the **JovianeX AI Ecosystem Launch Landing Page**. It establishes colors, layout systems, component buttons, and typography.

---

## 1. Project Directory Structure

```text
landing-page/
├── index.html               # Semantic HTML base layout & SEO metadata
├── README.md                # Project documentation & configuration guide
└── assets/
    ├── css/
    │   ├── reset.css        # Resets margin & padding defaults
    │   ├── variables.css    # HSL design tokens, spaces, shadows, radii
    │   ├── typography.css   # Outfit (Headings) and Inter (Body) rules
    │   ├── layout.css       # Grid systems, containers, flex alignments
    │   ├── components.css   # Reusable buttons, form controls, card boxes
    │   ├── animations.css   # Keyframe fades, scroll reveal observer states
    │   ├── responsive.css   # Screen breakpoints adaptations
    │   └── style.css        # Master aggregator stylesheet
    └── js/
        ├── app.js           # Bootstrapper entry point
        ├── navigation.js    # Sticky headers & mobile dropdown navigations
        └── animations.js    # Intersection Observer animations trigger
```

---

## 2. Design Tokens Variables

Styles are fully dynamic and controlled via CSS variables in [variables.css](file:///c:/Users/maria/OneDrive/ドキュメント/JovianeX%20AI%20Project%20Landing%20Page/landing-page/assets/css/variables.css):

* **Color Palette (HSL Spaces):**
  - Primary Theme: Dynamic Violet (`hsl(262, 80%, 50%)`)
  - Accent Theme: Vibrant Cyan (`hsl(190, 90%, 50%)`)
  - Background Layer: Deep Black (`hsl(220, 25%, 7%)`)
* **Typography:**
  - Headings Family: Google Font `'Outfit'`
  - Body Family: Google Font `'Inter'`
* **Spacing:**
  - Defined on an 8px grid scale (`--space-xs` to `--space-4xl`).

---

## 3. How to Run Locally

You can launch a local live server to preview the landing page:
1. Navigate to the `landing-page/` directory.
2. Run a local preview using your IDE's Live Server or via python command:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.
