Generate 3D assets, animations, and interactive visuals for the LLFG portal using CSS 3D transforms, Three.js CDN, and AI-generated textures via Pollinations.ai. No API keys needed.

## Capabilities

### 1. CSS 3D Objects (No Dependencies)
Pure CSS 3D transforms for lightweight interactive elements:
- **3D Card Flips** — Business cards, deal cards, agent profiles that flip on hover/click
- **3D Rotating Logo** — LLFG hexagon logo with perspective rotation
- **3D Tier Badges** — Gamification badges with depth and lighting
- **Parallax Panels** — Dashboard sections with layered depth on scroll/mouse
- **3D Buttons** — Press-effect buttons with translateZ depth

#### CSS 3D Implementation Pattern
```css
.flip-card {
  perspective: 1000px;
  width: 380px; height: 220px;
}
.flip-card-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back {
  position: absolute; width: 100%; height: 100%;
  backface-visibility: hidden;
}
.flip-card-back { transform: rotateY(180deg); }
```

### 2. Three.js 3D Scenes (CDN — No Install)
For rich interactive 3D in the portal, use ES module import maps (modern, tree-shakeable):
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@v0.172.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.172.0/examples/jsm/"
  }
}
</script>
```
**Fallback (legacy, simpler):** `<script src="https://cdn.jsdelivr.net/npm/three@v0.172.0/build/three.min.js"></script>`

#### Scene Types
- **Rotating LLFG Logo** — Gold hexagon with metallic material, auto-rotates
- **3D Globe** — Shows agent locations across US states
- **Trophy/Award Scene** — Animated trophy for gamification milestones
- **Particle System** — Gold particles for celebration effects (deal closed, level up)
- **3D Bar Chart** — AP/sales data as extruded 3D bars with camera orbit

#### Three.js Integration Pattern
```javascript
function init3DScene(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for GPU performance
  container.appendChild(renderer.domElement);
  // ... add geometry based on type
  camera.position.z = 5;
  function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
  animate();
}
```

### 2b. Advanced Three.js Techniques (from Three.js GitHub)

#### Particle Systems (Single Draw Call — Thousands of Points)
Ultra-lightweight floating particles behind hero or dashboard sections:
```javascript
function createGoldParticles(scene, count) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.05, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(geo, mat));
}
```

#### GLTF Model Loading (Compressed .glb — <50KB)
Load detailed 3D models (lion, shield, trophy) with Draco compression:
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@v0.172.0/examples/jsm/libs/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('assets/llfg-lion.glb', (gltf) => { scene.add(gltf.scene); });
```

#### Post-Processing (Cinematic Bloom/Glow)
Add UnrealBloomPass for cinematic glow on 3D elements:
```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85)); // strength, radius, threshold
// In animate loop: composer.render() instead of renderer.render()
```

#### GSAP + Three.js Scroll Integration
Drive Three.js camera/particles from GSAP ScrollTrigger (already loaded in portal):
```javascript
gsap.to(camera.position, {
  z: 2,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});
// Or drive shader uniforms for distortion effects
gsap.to(shaderMaterial.uniforms.uProgress, {
  value: 1.0,
  scrollTrigger: { trigger: '#stats-section', scrub: true }
});
```

#### Hero Canvas Pattern (Layer Behind Existing CSS 3D)
```html
<div id="hero" style="position:relative;">
  <canvas id="hero-3d" style="position:absolute;inset:0;z-index:0;"></canvas>
  <!-- Existing hero content sits on top at z-index:1+ -->
</div>
```

### 3. AI-Generated Textures (Pollinations.ai — Free)
Generate textures and materials for 3D objects:
```
https://image.pollinations.ai/prompt/{description}?width=512&height=512&nologo=true
```

Useful prompts:
- `gold metallic brushed texture seamless tileable` — For logo/badge materials
- `dark luxury marble texture black gold veins` — For card backgrounds
- `abstract gold particle explosion black background` — For celebration effects
- `professional headshot silhouette gold rim light` — For placeholder avatars

### 4. CSS Animation Library
Pre-built animations for 3D feel without Three.js:

```css
/* Floating effect */
@keyframes float3d {
  0%, 100% { transform: translateY(0) rotateX(0) rotateY(0); }
  25% { transform: translateY(-8px) rotateX(2deg) rotateY(-2deg); }
  75% { transform: translateY(-4px) rotateX(-1deg) rotateY(1deg); }
}

/* Gold shimmer */
@keyframes goldShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, #c9a84c 0%, #fff8dc 50%, #c9a84c 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: goldShimmer 3s ease infinite;
}

/* 3D card tilt on mouse */
.tilt-card {
  transition: transform 0.15s ease;
  transform-style: preserve-3d;
}
/* Apply via JS: el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)` */
```

## Where to Insert 3D Assets

| Location | Asset Type | Purpose |
|----------|-----------|---------|
| Login screen | CSS 3D rotating logo | Brand impact |
| Dashboard overview | Floating stat cards | Visual depth |
| Business card tab | 3D flip card | Front/back preview |
| Gamification | 3D trophy/badge | Achievement unlock |
| Deal logged | Particle celebration | Reward feedback |
| Leaderboard | 3D podium | Top agent display |
| Command Center | 3D globe or network | Agent map |

## Implementation Steps

### Adding a 3D Asset
1. **Choose type**: CSS-only (lightweight) or Three.js (rich)
2. **Create container**: `<div id="scene3d" style="width:100%;height:300px;"></div>`
3. **Initialize**: Call setup function in the tab's render logic
4. **Cleanup**: Dispose renderer on tab switch to prevent memory leaks

### Performance Rules
- Only render 3D when the containing tab is visible
- Use `requestAnimationFrame` and cancel on tab switch
- Prefer CSS 3D for simple effects (flips, tilts, floats)
- Use Three.js only for complex scenes (globe, particles, charts)
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to cap GPU load
- Always use `alpha: true` on renderer for transparent backgrounds

### Mobile Considerations
- Disable Three.js scenes on screens < 768px (fallback to static image)
- CSS 3D works well on mobile but reduce animation complexity
- Use `will-change: transform` sparingly to hint GPU acceleration
- Touch events: map touch to mouse for orbit controls

## Validation
- 3D scenes render without console errors
- Animations run at 60fps (check with DevTools Performance tab)
- Memory doesn't leak on tab switches (dispose renderer)
- Mobile fallback displays correctly
- No layout shift when 3D loads
