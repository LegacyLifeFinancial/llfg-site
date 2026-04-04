Generate AI video content for the LLFG portal. Combines free image generation with animation techniques for video-like hero experiences.

## Strategy: Image-to-Video Pipeline

Since free video generation APIs are limited, this skill uses a multi-step pipeline:

### Option 1: Animated Image Sequence (Free, No API Key)
Generate 3-5 images with progressive camera movement, then CSS-animate between them.

**Step 1: Generate a sequence**
```bash
# Same scene, different seeds = different angles/moments
for i in 1 2 3 4 5; do
  seed=$((RANDOM % 9999))
  curl -sL -o generated/seq_${i}.jpg \
    "https://image.pollinations.ai/prompt/{prompt}?width=1920&height=1080&seed=${seed}&model=flux&nologo=true&enhance=true" \
    --max-time 120
done
```

**Step 2: Create CSS crossfade animation in index.html**
```css
.hero-sequence {
  position: absolute; inset: 0;
}
.hero-sequence img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; opacity: 0;
  animation: heroSeq 20s ease-in-out infinite;
}
.hero-sequence img:nth-child(1) { animation-delay: 0s; }
.hero-sequence img:nth-child(2) { animation-delay: 4s; }
.hero-sequence img:nth-child(3) { animation-delay: 8s; }
.hero-sequence img:nth-child(4) { animation-delay: 12s; }
.hero-sequence img:nth-child(5) { animation-delay: 16s; }

@keyframes heroSeq {
  0%   { opacity: 0; transform: scale(1.1); }
  5%   { opacity: 1; transform: scale(1.05); }
  20%  { opacity: 1; transform: scale(1.0); }
  25%  { opacity: 0; transform: scale(0.98); }
  100% { opacity: 0; }
}
```

**Step 3: Update hero HTML**
```html
<div class="hero-bg">
  <div class="hero-sequence">
    <img src="generated/seq_1.jpg" alt=""/>
    <img src="generated/seq_2.jpg" alt=""/>
    <img src="generated/seq_3.jpg" alt=""/>
    <img src="generated/seq_4.jpg" alt=""/>
    <img src="generated/seq_5.jpg" alt=""/>
  </div>
  <div class="hero-glow"></div>
</div>
```

### Option 2: Ken Burns Effect (Single Image, Free)
Use one high-quality AI image with CSS animation that simulates camera movement:
- Slow zoom from 1.15x to 1.0x over 20 seconds
- Subtle pan left-to-right
- Loop infinitely

Already implemented in current hero. Can be enhanced with:
```css
@keyframes kenBurns {
  0%   { transform: scale(1.15) translate(0, 0); }
  25%  { transform: scale(1.1) translate(-1%, -0.5%); }
  50%  { transform: scale(1.05) translate(0.5%, 0.5%); }
  75%  { transform: scale(1.08) translate(-0.5%, -0.3%); }
  100% { transform: scale(1.15) translate(0, 0); }
}
```

### Option 3: Free Video Generation (Requires Account, No Payment)
Use these services that offer daily free credits:

**Kling AI (66 free credits/day):**
1. Go to klingai.com, sign in with Google
2. Paste the hero prompt from ai-config.json
3. Generate a 5-10 second clip
4. Download the MP4
5. Place in generated/ folder
6. Update hero HTML:
```html
<div class="hero-bg">
  <video class="hero-bg-img" autoplay muted loop playsinline style="object-fit:cover;">
    <source src="generated/hero-video.mp4" type="video/mp4"/>
  </video>
  <div class="hero-glow"></div>
</div>
```

**Google Flow (50 credits/day):**
1. Go to flow.google
2. Sign in with Google account
3. Use video generation with LLFG prompt
4. Download and integrate same as above

### Option 4: Paid API (Highest Quality)
If API keys are configured in .claude/ai-config.json:

**Runway Gen-4:**
```bash
curl -X POST "https://api.dev.runwayml.com/v1/text_to_video" \
  -H "Authorization: Bearer $RUNWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gen4_turbo","prompt":"[PROMPT]","duration":10,"ratio":"16:9"}'
```
Then poll task ID until complete and download.

## Quick Commands
- `/ai-video sequence` — Generate 5-image sequence and wire CSS crossfade animation
- `/ai-video kenburns` — Enhance current hero with Ken Burns infinite loop
- `/ai-video integrate [filepath]` — Take a manually downloaded video and wire it into the hero
- `/ai-video guide` — Show step-by-step for free Kling AI or Google Flow generation

## Integration Checklist
After generating or obtaining video content:
1. Place file in `generated/` directory
2. Update hero `<div class="hero-bg">` contents in index.html
3. Update hero CSS if switching from image to video
4. Test scroll animation still works
5. Test mobile (video may not autoplay — ensure poster fallback)
6. Run `/health-check` before deploy