# Project memory

## Product intent & audience

- **"Pausa"** — single-page mindfulness micro-habits app for brief 2–5 minute stress-relief breaks.
- Target audience: Mexican youth/adults 18–40 experiencing stress, seeking calm, clarity, and approachability.
- Language: Mexican Spanish (es-MX).
- Sections: hero, guided breathing animation, meditation timer, daily mood check (5 emojis + weekly summary via `localStorage`), random mindfulness quote with "Otra frase" button, subscription/contact form, footer.

## Brand personality & voice

- Emotional wellness brand; tone conveys calm, clarity, closeness.
- Minimal, intentional copy; no aggressive CTAs or high-energy language.
- Wellness-app UX conventions (soft transitions, unhurried pacing, generous breathing room).

## Visual design & UX direction

- **Color palette:** sage green, muted blue, beige. Soft, desaturated, calming.
- **Typography:** highly legible; ample white space throughout.
- **Layout:** mobile-first, fully responsive.
- **Dark mode:** functional toggle remembering user preference via `localStorage`.
- **Breathing animation:** central circle expanding/contracting with "inhala / sostén / exhala" labels; start/stop controls. Timing: inhale 4s, hold 4s, exhale 6s.
- **Meditation timer:** ring that depletes as time progresses; 1/3/5-min options (3 min default); start/stop controls; subtle bell sound on completion that fades over a few seconds. Section title: "Medita sin mirar el reloj".
- **Mood tracking:** 5 emoji buttons, persistent via `localStorage`, weekly summary view.
- **Form:** required fields + email validation, confirmation message on submit (no backend; no email sent).
- Aesthetic direction: beautiful, production-quality, not cookie-cutter (per `.bolt/prompt`).

## Decisions, constraints & rationale

- **Framework:** vanilla static HTML/CSS/JS — `index.html`, `styles.css`, `script.js` at project root. React/JSX, Tailwind, Lucide, and `@/` path alias no longer apply.
- **No backend / no Supabase:** `localStorage` only for mood data and dark mode persistence.
- **Static deployment:** GitHub Pages — no server-side code.
- **Form limitation:** subscription form shows confirmation client-side but does not send emails; would need external service for real submissions.
- **Meditation bell:** generated via Web Audio API (no external audio files needed); fades out gracefully.
- **Navigation:** "Meditar" link added to desktop menu, mobile menu, and footer.
- **No browser testing done:** user advised to open and review site manually; meditation bell sound and ring animation pending verification.

## Open questions & assumptions

- **External form service:** if user wants to receive real subscriptions, an external service (e.g., Formspree, Google Forms) needs integration.
- **Breathing pattern timing:** implemented as 4-4-6 (inhale-hold-exhale); user has not requested changes.
- **Mindfulness quotes:** a curated Spanish-language array is included in `script.js`; user has not requested specific quotes.
- **Unverified:** site functionality (including meditation timer/bell) not tested in browser; visual and interaction correctness pending user review.