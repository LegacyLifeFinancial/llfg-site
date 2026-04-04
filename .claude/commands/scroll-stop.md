Build scroll-stopping visual moments on the LLFG landing page and portal. Combines 3D assets, parallax, micro-animations, and attention hooks to make users pause and engage. Works with the /3d-assets skill for rich visuals.

## Philosophy
A "scroll stop" is a visual pattern that breaks the user's scroll momentum and forces attention. On social media this is the thumbnail. On a website, it's a combination of motion, contrast, and unexpected depth that makes the eye lock in.

## Scroll Stop Types

### 1. Hero Parallax Reveal
The hero section layers move at different speeds as the user scrolls, creating depth.

```javascript
// Add to landing page — parallax on scroll
window.addEventListener('scroll', function() {
  var y = window.scrollY;
  var hero = document.getElementById('hero');
  if (!hero || y > window.innerHeight) return;
  // Background moves slow, text moves fast = depth
  var bg = hero.querySelector('.hero-bg');
  var text = hero.querySelector('.hero-text');
  if (bg) bg.style.transform = 'translateY(' + (y * 0.3) + 'px) scale(' + (1 + y * 0.0003) + ')';
  if (text) text.style.transform = 'translateY(' + (y * -0.15) + 'px)';
  hero.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.8));
}, { passive: true });
```

### 2. Counter Ticker (Numbers Rolling Up)
Stats that count up from 0 when they scroll into view. Instant credibility + motion.

```javascript
function animateCounter(el, target, duration) {
  var start = 0, startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// Trigger on scroll into view
var counterObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target, parseInt(e.target.dataset.target), 2000);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(function(el) { counterObs.observe(el); });
```

**HTML:**
```html
<div data-counter data-target="35" style="font-size:3rem;font-weight:800;color:var(--gold);">0</div>
<div>Carrier Partners</div>
```

### 3. 3D Tilt Card on Mouse Move
Cards that track the cursor and tilt in 3D space. Impossible not to play with.

```javascript
function enableTilt(selector, intensity) {
  intensity = intensity || 12;
  document.querySelectorAll(selector).forEach(function(card) {
    card.style.transition = 'transform 0.15s ease';
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * intensity) + 'deg) rotateX(' + (-y * intensity) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
  });
}
// Usage: enableTilt('.pillar', 10);
```

### 4. Text Reveal Character-by-Character
Headlines that type in or reveal letter by letter with a gold glow.

```javascript
function typeReveal(el, speed) {
  speed = speed || 40;
  var text = el.textContent;
  el.textContent = '';
  el.style.visibility = 'visible';
  var i = 0;
  var interval = setInterval(function() {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// Trigger on scroll
var typeObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && !e.target.dataset.typed) {
      e.target.dataset.typed = '1';
      typeReveal(e.target, 35);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.type-reveal').forEach(function(el) { typeObs.observe(el); });
```

### 5. Floating 3D Logo (CSS Only)
A constantly floating, rotating LLFG logo that draws the eye.

```css
@keyframes logoFloat {
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  25% { transform: translateY(-12px) rotateY(5deg); }
  50% { transform: translateY(-6px) rotateY(0deg); }
  75% { transform: translateY(-14px) rotateY(-5deg); }
}
@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(201,168,76,0.3)); }
  50% { filter: drop-shadow(0 0 20px rgba(201,168,76,0.6)); }
}
.floating-logo {
  animation: logoFloat 6s ease-in-out infinite, logoGlow 4s ease-in-out infinite;
  transform-style: preserve-3d;
}
```

### 6. Scroll-Triggered 3D Flip Cards
Sections that flip from a teaser to full content as you scroll past them.

```css
.scroll-flip {
  perspective: 1200px;
  height: 300px;
}
.scroll-flip-inner {
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; width: 100%; height: 100%;
}
.scroll-flip.flipped .scroll-flip-inner {
  transform: rotateX(180deg);
}
.scroll-flip-front, .scroll-flip-back {
  position: absolute; inset: 0;
  backface-visibility: hidden;
}
.scroll-flip-back { transform: rotateX(180deg); }
```

```javascript
var flipObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    e.target.classList.toggle('flipped', e.isIntersecting);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.scroll-flip').forEach(function(el) { flipObs.observe(el); });
```

### 7. Gold Particle Burst (Canvas)
Lightweight particle explosion for celebrations or section entrances.

```javascript
function goldBurst(x, y, container) {
  var canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:10;';
  container.style.position = 'relative';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var particles = [];
  for (var i = 0; i < 40; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      size: Math.random() * 4 + 1,
      alpha: 1,
      color: Math.random() > 0.5 ? '#c9a84c' : '#ffd700'
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var alive = false;
    particles.forEach(function(p) {
      if (p.alpha <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.alpha -= 0.015;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    if (alive) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}
```

### 8. Sticky Scroll Progress Bar
A thin gold bar at the top that fills as you scroll down the page.

```javascript
(function() {
  var bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#c9a84c,#ffd700);z-index:9999;transition:width 0.1s;width:0;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });
})();
```

## Combining with /3d-assets

| Scroll Stop | 3D Asset to Pair |
|-------------|-----------------|
| Hero parallax | Floating 3D LLFG logo |
| Counter ticker | 3D bar chart behind numbers |
| Tilt cards | Metallic texture from Pollinations |
| Section reveals | Gold particle burst on enter |
| Income calculator | 3D coin stack that grows |
| Testimonial cards | 3D flip front/back |
| Apply section | Pulsing 3D CTA button |

## Landing Page Scroll Stop Sequence

Ideal order for maximum engagement:

1. **Hero** — Parallax bg + floating logo + gold shimmer headline
2. **Stats bar** — Counter tickers (35+ Carriers, $500K+ Top Income, 50 States)
3. **Pillars** — 3D tilt cards that track mouse
4. **Income calc** — Slider with animated result + particle burst
5. **Testimonials** — Scroll-triggered flip cards
6. **Carriers** — Logo wall with stagger fade-in
7. **Apply CTA** — Sticky bottom bar + pulsing button + progress bar

## Portal Scroll Stops

For inside the agent portal (after login):

1. **Overview dashboard** — Stat cards with counter animation on load
2. **Leaderboard** — 3D podium for top 3 agents
3. **Deal logged** — Gold particle burst celebration
4. **Level up** — Full-screen confetti + trophy animation
5. **Business card** — 3D flip preview
6. **Commission chart** — Animated bar growth

## Performance Rules
- Use `IntersectionObserver` (not scroll events) for triggering
- Add `{ passive: true }` to any scroll listeners
- Use `will-change: transform` only on actively animating elements
- Canvas particles: max 50 particles, auto-cleanup on completion
- Disable heavy animations on `prefers-reduced-motion: reduce`
```css
@media (prefers-reduced-motion: reduce) {
  .floating-logo, .tilt-card, .scroll-flip-inner { animation: none !important; transition: none !important; }
}
```

## Built-in CSS Animation Classes (Already in index.html)
Use these classes directly — no extra CSS needed:

| Class | Effect |
|-------|--------|
| `.llfg-anim-up` | Slide up + fade in |
| `.llfg-anim-down` | Slide down + fade in |
| `.llfg-anim-in` | Slide left + fade in |
| `.llfg-anim-right` | Slide right + fade in |
| `.llfg-anim-fade` | Simple fade in |
| `.llfg-anim-scale` | Scale up + fade in |
| `.llfg-anim-flip` | 3D flip in (perspective) |
| `.llfg-anim-bounce` | Bouncy entrance |
| `.llfg-anim-swing` | Swing down from top |
| `.llfg-anim-blur` | Blur → sharp focus |
| `.llfg-anim-float` | Gentle infinite float |
| `.llfg-anim-rotate` | Slight rotate entrance |
| `.llfg-anim-ripple` | Pulsing gold ripple |
| `.llfg-shimmer-text` | Gold shimmer on text |
| `.llfg-border-glow` | Pulsing gold border |
| `.llfg-count-pop` | Number pop effect |
| `.llfg-stagger` | Children animate sequentially (up to 8) |
| `.llfg-tilt` | 3D mouse-tracking tilt (needs JS) |
| `.llfg-flip-card` | Full flip card container |

## Auto-Optimizer Integration
The `Auto-Optimizer` agent (runs every 5 min) automatically:
- Reduces animations on low-end devices (<4 cores)
- Cleans orphaned chart instances
- Lazy-loads offscreen images
- Adds preconnect hints for CDN speed
- Respects `prefers-reduced-motion: reduce`

## Validation
- All IntersectionObservers fire correctly
- Animations run at 60fps (Auto-Optimizer monitors this)
- No layout shift from delayed reveals
- Mobile: tilt disabled (no mousemove), counters still work
- Reduced motion preference respected
- Canvas elements clean up (no memory leaks)
- Auto-Optimizer cleans stale toasts and DOM artifacts
