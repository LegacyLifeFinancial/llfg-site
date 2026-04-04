Generate complete websites with AI-powered 3D visuals, scroll animations, and modern design — from a single prompt. Built for developers who want production-ready sites fast.

## What This Skill Does

Takes a business description and generates a full single-page website with:
- AI-generated hero images and section backgrounds (Pollinations.ai — free, no key)
- 3D CSS transforms, parallax, and scroll-stop animations
- Responsive mobile-first layout
- Dark/light theme support
- Ready to deploy (Netlify, Vercel, GitHub Pages, or raw HTML)

## Workflow

### Step 1: Gather Requirements
Ask the user for (or infer from context):
- **Business name** and tagline
- **What it does** (1-2 sentences)
- **Target audience** (developers, consumers, businesses)
- **Vibe** (tech-forward, luxury, playful, minimal, brutalist, glassmorphic)
- **Sections needed** (hero, features, pricing, testimonials, CTA, footer)
- **CTA** (Sign Up, Download, Join Waitlist, Buy, Book Demo)
- **Color scheme** (or auto-generate from vibe)

### Step 2: Generate AI Visuals
Use Pollinations.ai to create images inline via URL:
```
https://image.pollinations.ai/prompt/{url_encoded_prompt}?width={w}&height={h}&nologo=true
```

**Image generation rules:**
- Hero banner: 1280x720, cinematic, wide-angle
- Section backgrounds: 1920x600, abstract/textural
- Feature icons: 512x512, minimal, icon-style
- Testimonial avatars: 256x256, professional headshot style
- Logo/emblem: 512x512, clean vector-style

**Prompt engineering for best results:**
- Always include: art style, lighting, color palette, composition
- For tech: `futuristic interface UI dark background neon glow 3D render`
- For luxury: `luxury dark background gold accents cinematic lighting professional`
- For playful: `colorful vibrant 3D render isometric playful modern clean`
- For minimal: `minimal clean white background subtle shadows professional`

### Step 3: Build the HTML
Generate a single `index.html` file with embedded CSS and JS. Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Business Name}</title>
  <meta name="description" content="{tagline}">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>/* All CSS here */</style>
</head>
<body>
  <!-- Nav -->
  <!-- Hero with parallax + 3D elements -->
  <!-- Features with tilt cards -->
  <!-- How It Works with scroll reveals -->
  <!-- Pricing/Plans (if applicable) -->
  <!-- Testimonials with flip cards -->
  <!-- CTA section with particle effects -->
  <!-- Footer -->
  <script>/* All JS here — scroll stops, 3D, counters */</script>
</body>
</html>
```

### Step 4: Wire 3D + Scroll Effects
Apply from /3d-assets and /scroll-stop skills:

#### Required Effects (always include):
1. **Scroll progress bar** — thin accent-color bar at top
2. **Scroll reveal animations** — sections fade/slide in on scroll
3. **Smooth scroll** — `scroll-behavior: smooth` on html

#### Recommended Effects (include based on vibe):
4. **Hero parallax** — background moves slower than foreground
5. **Counter tickers** — stats count up when visible
6. **3D tilt cards** — feature cards track mouse cursor
7. **Text type reveal** — headline types in character by character
8. **Gold/accent particle burst** — on CTA hover or section enter
9. **Floating 3D element** — CSS animated logo or icon
10. **Glassmorphic cards** — frosted glass effect with backdrop-filter

## Design System

### Typography Scale
```css
--font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--h1: clamp(2.5rem, 5vw, 4.5rem);
--h2: clamp(1.8rem, 3.5vw, 3rem);
--h3: clamp(1.2rem, 2vw, 1.6rem);
--body: clamp(0.9rem, 1.2vw, 1.1rem);
--small: 0.78rem;
--micro: 0.62rem;
```

### Spacing
```css
--section-pad: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 6rem);
--card-pad: clamp(1.5rem, 3vw, 2.5rem);
--gap: clamp(1rem, 2vw, 2rem);
```

### Color Palettes (auto-select from vibe)

**Tech Dark:**
```css
--bg: #0a0a0f; --surface: #12121a; --border: rgba(255,255,255,0.06);
--text: #e8e8ed; --muted: #6b6b80; --accent: #6c5ce7; --accent2: #00cec9;
```

**Luxury Black/Gold:**
```css
--bg: #080808; --surface: #111; --border: rgba(201,168,76,0.1);
--text: #f0ece2; --muted: #8a8472; --accent: #c9a84c; --accent2: #e8d5a3;
```

**Clean Minimal:**
```css
--bg: #fafafa; --surface: #fff; --border: rgba(0,0,0,0.06);
--text: #1a1a2e; --muted: #6c6c80; --accent: #2563eb; --accent2: #7c3aed;
```

**Neon Cyber:**
```css
--bg: #0d0d0d; --surface: #1a1a2e; --border: rgba(108,92,231,0.15);
--text: #e8e8f0; --muted: #5a5a7a; --accent: #ff6b6b; --accent2: #feca57;
```

**Nature/Organic:**
```css
--bg: #f5f0e8; --surface: #fff; --border: rgba(46,125,50,0.1);
--text: #2d3436; --muted: #6b7b6e; --accent: #2e7d32; --accent2: #c9a84c;
```

### Component Library

#### Nav Bar
```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 1rem 2rem;
  background: rgba(var(--bg-rgb), 0.8);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
```

#### Hero Section
```css
.hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  padding: var(--section-pad);
}
.hero-bg {
  position: absolute; inset: 0;
  background: url('pollinations-url') center/cover;
  filter: brightness(0.4);
}
```

#### Feature Cards (3D Tilt)
```css
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--gap); }
.feature-card {
  background: var(--surface); border: 1px solid var(--border);
  padding: var(--card-pad); border-radius: 16px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  transform-style: preserve-3d;
}
.feature-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
```

#### Glassmorphic Panel
```css
.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
}
```

#### CTA Button
```css
.cta-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.9rem 2rem; border: none; border-radius: 12px;
  background: var(--accent); color: #fff;
  font-weight: 600; font-size: 1rem; cursor: pointer;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(var(--accent-rgb), 0.4); }
```

#### Scroll Reveal
```css
.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```

## Section Templates

### Hero Variants
1. **Centered** — Title + subtitle + CTA centered, bg image behind
2. **Split** — Text left, 3D visual/mockup right
3. **Video bg** — Looping video or animated gradient background
4. **Particle** — Dark bg with floating particle canvas

### Feature Variants
1. **Icon grid** — 3-4 column grid with icon + title + description
2. **Alternating** — Image left, text right, then swap
3. **Bento grid** — Mixed-size cards in masonry-like layout
4. **Cards with hover** — 3D tilt on mouse with glow effect

### Social Proof Variants
1. **Logo wall** — Client/partner logos in a row
2. **Testimonial cards** — Quote + avatar + name, carousel or grid
3. **Stats bar** — Counter tickers in a horizontal strip
4. **Case study** — Before/after with slider

### CTA Variants
1. **Simple** — Headline + button, dark/accent background
2. **Email capture** — Input + button inline
3. **Pricing table** — 2-3 tier columns with highlight on recommended
4. **Waitlist** — Countdown timer + email signup

## AI Image Prompts by Section

### Hero Backgrounds
```
Tech: "futuristic abstract dark background blue purple neon light rays 3D render cinematic wide"
Luxury: "luxury dark black background gold light streaks abstract elegant professional"
Playful: "colorful abstract gradient 3D shapes floating clean modern vibrant"
SaaS: "clean minimal dashboard mockup on dark background floating UI elements 3D"
```

### Feature Icons
```
"minimal flat icon {concept} single color on transparent background simple geometric"
```

### Section Dividers
```
"abstract wave gradient {color1} to {color2} minimal clean wide banner"
```

## Output Rules

1. **Single file** — Everything in one `index.html` (CSS in `<style>`, JS in `<script>`)
2. **No dependencies** — Only Google Fonts CDN. No frameworks, no npm.
3. **Mobile-first** — Design for 375px, scale up with clamp() and media queries
4. **Performance** — Lazy load images, passive scroll listeners, requestAnimationFrame for animations
5. **Accessibility** — Semantic HTML, alt text on images, focus states, reduced-motion support
6. **SEO** — meta description, Open Graph tags, structured heading hierarchy
7. **Deploy-ready** — Drop the file on Netlify/Vercel/GitHub Pages and it works

## Example Prompt → Output

**User says:** "Build a landing page for Nanno Banana 2 — an AI-powered 3D website builder for developers. Futuristic tech vibe."

**You generate:**
1. AI hero image: futuristic 3D interface builder dark neon
2. AI feature icons: code editor, 3D cube, rocket, palette
3. Full index.html with:
   - Frosted glass nav
   - Hero with parallax + type-reveal headline + particle canvas
   - 3-column feature grid with 3D tilt cards
   - How it works (3 steps with scroll reveal)
   - Stats bar with counter tickers
   - CTA with email capture
   - Footer with links
4. All scroll-stop effects wired in
5. Dark neon color palette auto-applied

## Validation
- HTML passes W3C validation (no unclosed tags)
- Responsive at 375px, 768px, 1024px, 1440px
- All images load from Pollinations URLs
- Scroll animations fire correctly
- 3D effects work on Chrome, Safari, Firefox
- Lighthouse score > 90 for Performance
- No console errors
