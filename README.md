# CodeCraft Society — University Coding Club
> **ITM University, Gwalior**  
> **Track B Competition Entry** | **Theme: "Code. Create. Collaborate."**

---

### Author Information
* **Lead Developer & Designer**: Dhruv Singh Bhadoriya
* **Student Roll No / PRN**: BCAN1CA25121
* **Institution**: ITM University, Gwalior (School of Engineering & Technology — SOET)
* **Department**: Department of Computer Science & Engineering
* **Project Repository / Workspace**: `CodeCraft-Competition`

---

## 1. Project Overview

**CodeCraft Society** is the premier student-led technical guild and computer science society at ITM University, Gwalior. Engineered with a **Swiss Editorial / Architectural Brutalist** aesthetic, this dual-page platform provides a unified digital headquarters for collegiate competitive programmers, systems builders, AI researchers, and open-source contributors.

The platform is built as a zero-dependency, ultra-fast client-side application that functions directly via the `file://` protocol in any browser with smooth 60fps animations, hardware-accelerated scrolling, and interactive 3D WebGL sculptures.

---

## 2. Key Features & Innovations

### A. Swiss Editorial / Architectural Brutalist Design System
* **Dual Palette Engine (PAPER vs INK)**:
  * **PAPER Mode (Default)**: Warm architectural parchment (`--bg-primary: #F4F3EF`, `--bg-surface: #FFFFFF`, `--bg-subtle: #EAE8E1`, `--ink-primary: #0A0A0A`).
  * **INK Mode (`html.dark`)**: High-contrast obsidian dark mode (`--bg-primary: #0A0A0A`, `--bg-surface: #141414`, `--bg-subtle: #1C1C1C`, `--ink-primary: #F4F3EF`).
  * **Signal Orange Accent**: `#FF4D00` applied to active tabs, scroll progress bar, focus rings, and badges.
* **Top 2px GPU Scroll Progress Bar**:
  * Driven via `transform: scaleX(...)` with `transform-origin: left` and `will-change: transform`, avoiding continuous layout reflows.
* **Typography Stack**:
  * **Space Grotesk**: Geometric display headlines with brutalist letter-spacing.
  * **Inter**: Clear, legible editorial body copy.
  * **JetBrains Mono**: Technical metadata, coordinates, IDs, and code blocks.
* **Blueprint Dot Grid**: Subtle architectural dot pattern with corner crosshairs (`+`) on cards.
* **Official CodeCraft Society Logo**: Integrated official split cryptographic emblem (`img/codecraft-logo.jpg`) across header and footer, responsive across PAPER and INK dark themes.

### B. 60FPS Three.js Cyber-Architecture Core & Node Mesh (`js/three-scene.js`)
* Renders an interactive architectural sculpture inside `#sculpture-canvas` in the Hero section.
* **Central Core**: Crisp wireframe Icosahedron (radius ~1.45) with ink-responsive lines that switch dynamically between PAPER and INK dark mode, wrapping an inner faceted core with Signal Orange (`#FF4D00`) wireframe accents and an emissive central nucleus.
* **Dual Gyroscopic Rings**: Two thin architectural torus rings orbiting the core at counter-angled planes, rotating in opposite directions, carrying 3 locked Signal Orange satellite nodes.
* **Connected Data Constellation**: 45 floating geometric nodes connected by subtle dynamic hairline segments (`THREE.LineSegments`) for nearby peers.
* **Performance Rule**: Pixel ratio capped to `Math.min(devicePixelRatio, 1.5)` and shadow maps disabled.
* **IntersectionObserver Auto-Pausing**: When the user scrolls down, the Three.js `requestAnimationFrame` loop automatically pauses, freeing 100% of GPU resources for scrolling through subsequent sections.
* **Interactions**: Smooth mouse/touch drag-to-rotate, hover parallax, and scroll-linked network expansion.

### C. Teenage Engineering Style Hardware CLI Modal (`Ctrl+K`)
* Industrial hardware terminal chassis with pulsating status LED, command chips, and synthesized Web Audio mechanical key clicks.
* Accessible via `Ctrl+K` (or `Cmd+K` on Mac), top header button, hero button, or footer button.
* **Supported Commands**:
  * `help` — Lists all available terminal commands.
  * `home` / `index` — Navigates to Home Base (`index.html`).
  * `events` — Scrolls/routes to the Upcoming Events sprint matrix.
  * `domains` — Scrolls/routes to the 7 Technical Domains.
  * `stats` — Displays telemetry statistics.
  * `join` / `register` — Launches the Event Registration Gateway modal.
  * `mode` — Toggles between PAPER and INK dark themes.
  * `matrix` — Triggers 3D burst & dispersion on the Cyber-Architecture Core & Node Mesh.
  * `about` — Navigates to About & Explore (`about.html`).
  * `clear` — Clears the terminal screen buffer.
  * `exit` / `quit` — Closes the terminal modal.

### D. Interactive Digital Pass Registration Gateway
* Modal form supporting event reservations or general club membership intake.
* Form validation for Full Name, Student Roll No / PRN, University Email, Major, Academic Year, and Phone.
* **Instant Confirmation State**: Swaps into a brutalist boarding pass / developer credential with simulated barcode, ticket ID (`CC-2026-XXXX`), attendee metadata, and a working "COPY PASS ID" button.

### E. Interactive Event & Showcase Filter Systems
* **Page 1 (`index.html`)**: Instant tabbed filtering for Upcoming Events (`ALL`, `HACKATHONS`, `CONTESTS`, `WORKSHOPS`, `BOOTCAMPS`) with pre-filled modal registration.
* **Page 2 (`about.html`)**:
  * **Explore Hub**: 6 switchable category tabs (`STUDENT PROJECTS`, `HACKATHONS & CONTESTS`, `WORKSHOPS & SESSIONS`, `OPEN-SOURCE INITIATIVES`, `LEARNING ROADMAPS`, `PAST EVENT HIGHLIGHTS`).
  * **Showcase Matrix**: Multi-tag filtering (`ALL`, `WEB/SYSTEMS`, `AI/ML`, `OPEN SOURCE`, `PAST EVENTS`).

### F. Signature 60FPS Swiss Editorial Scroll Animations (GSAP + Lenis)
* **Scroll-Expanding 3D Network**: Cyber-architecture rings and constellation nodes smoothly expand outward with accelerated rotation as user scrolls past hero, and reassemble when scrolling up.
* **Kinetic Hero Split Headline**: "CODE. / CREATE." scrubs left (`x: -40`) while "COLLABORATE." scrubs right (`x: +40`) via ScrollTrigger (`scrub: 0.6`).
* **Sticky 3D Stacking Domain Cards**: Desktop deck stack where underlying cards gently scale down (`scale: 0.94`) and dim (`opacity: 0.75`) as next cards glide over.
* **Clip-Path Portal Reveal**: Scrubbed entrance for `#stats` expanding from `clip-path: inset(0% 5% 0% 5%)` to `inset(0% 0% 0% 0%)`.
* **Masked Heading Reveals**: Clean staggered entrances (`y: 36, opacity: 0` -> `y: 0, opacity: 1`, `ease: power3.out`) for section headings, cards, and timeline entries.
* **Velocity Marquee**: Signal Orange banner dynamically accelerates and skews with Lenis scroll velocity.

---

## 3. Page Structure

### Page 1: `index.html` (Home Base)
1. **Sticky Grid-Cell Header**: Official CodeCraft Society logo, GPS coordinates, desktop navigation, CLI trigger, theme toggle, and mobile drawer.
2. **Asymmetric Split 3D Hero Section (100vh)**:
   * Left (58%): Coordinates metadata, kinetic headline `"CODE. CREATE. COLLABORATE."`, mission intro, primary & secondary CTAs, micro status ticker.
   * Right (42%): Three.js Cyber-Architecture Core & Node Mesh canvas with architectural HUD overlays.
3. **Upcoming Events Section (`#events`)**: 6 realistic event cards with date badges, venues, formats, seats remaining, and working registration buttons.
4. **Technical Domains (`#domains`)**: 7 stacking domain studio cards (Web Dev, AI/ML, CP, Cybersecurity, Mobile, Open Source, Cloud/DevOps).
5. **Club Highlights / Stats Portal (`#stats`)**: High-contrast dark section with 4 GSAP ScrollTrigger count-up counters (500+ Members, 25+ Events, 40+ Projects, 15+ National Wins).
6. **Call-to-Action Block**: Signal Orange banner with running ticker tape marquee and action buttons.
7. **Architectural Footer**: Full ITM University Gwalior address, community links, diagnostics status, and live IST clock.

### Page 2: `about.html` (About & Explore)
1. **About Hero & Dossier**: Historical overview of the club's charter and role at ITM University Gwalior.
2. **Vision & Mission**: 2-column architectural split block detailing educational philosophy and peer-review culture.
3. **Interactive Explore Hub**: 6 dynamic tabbed panes covering campus projects, competitions, workshops, OSS fellowships, roadmaps, and event archives.
4. **Achievements & Milestones**: Structured Swiss timeline ledger covering achievements from 2022 to 2026 (SIH podiums, GSoC scholars, ICPC qualifiers, CTF wins).
5. **Our Community**: 10 brutalist profile cards for Faculty Advisors, Club President, Technical Leads, and Mentors with initials badges.
6. **Project & Event Showcase**: 6 standout project cards with filterable tags.
7. **Contact & Community Headquarters**: Official department directory, channel cards, and membership intake CTA.

---

## 4. Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Markup** | HTML5 | Semantic, accessible DOM structure |
| **Styling** | CSS3 & Tailwind CSS (CDN) | Custom CSS properties, grid/flexbox layouts, Swiss brutalist aesthetics |
| **Typography** | Google Fonts | Space Grotesk, Inter, JetBrains Mono |
| **Logic** | Vanilla JavaScript (ES6+) | Modular, zero-framework, DOM event-driven code |
| **3D Graphics** | Three.js (r128) | WebGL Cyber-Architecture Core, Gyroscopic Rings & Node Mesh |
| **Animation** | GSAP (3.12.5) & ScrollTrigger | Smooth stat counters and scroll listeners |
| **Smooth Scroll** | Lenis (1.1.18) | Virtual smooth scroll synchronized with GSAP ticker |
| **Audio** | Web Audio API | Synthesized mechanical keyboard sound effects |

---

## 5. How to Run

1. Clone or download this project directory:
   ```bash
   cd CodeCraft-Competition
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari):
   * **Directly via File System**: Double-click `index.html` or open via `file:///path/to/index.html`.
   * **Optional Local Server**:
     ```bash
     npx serve .
     # or
     python -m http.server 8000
     ```
3. Navigate seamlessly between **Home Base** (`index.html`) and **About & Explore** (`about.html`).
4. Press `Ctrl+K` (or `Cmd+K` on Mac) at any time to launch the Hardware CLI Terminal.
5. Click `MODE: PAPER / INK` in the top right to toggle between Paper and Ink dark mode.

---

## 6. Verification & Quality Assurance

* **60FPS Scroll Performance**: No `scroll-smooth` conflicts, `transform`-only scroll progress bar, and Three.js paused automatically when off-screen.
* **100% Mobile Responsive**: Tested across smartphone (375px), tablet (768px), laptop (1024px), and desktop (1440px+) breakpoints with zero horizontal overflow.
* **Zero Console Errors**: All DOM queries are safely guarded across both pages.
* **Clean Asset Structure**: Official society identity (`img/codecraft-logo.jpg`) with zero external CDNs required for images.

---

*CodeCraft Society — "Code. Create. Collaborate."*  
*Department of Computer Science & Engineering, ITM University, Gwalior.*
