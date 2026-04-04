Generate AI content for the LLFG portal. Uses Pollinations.ai — completely free, no API key, no signup. Supports multiple models and advanced prompt engineering for photorealistic results.

## Available Models (Pollinations.ai)

| Model | Best For | Speed |
|-------|----------|-------|
| `flux` | Photorealistic, detailed scenes (DEFAULT) | ~15s |
| `turbo` | Fast drafts, iteration | ~5s |
| `stable-diffusion` | Artistic, stylized | ~10s |
| `kontext` | Image-to-image transforms | ~15s |

## How to Generate

### Step 1: Craft the Prompt
Use this formula for maximum photorealism:

**[Subject] + [Action] + [Environment] + [Lighting] + [Camera] + [Mood] + [Quality Tags]**

#### Quality Tags (ALWAYS append these for realism):
```
photorealistic, hyperrealistic, 8K UHD, RAW photo, highly detailed, 
sharp focus, volumetric lighting, cinematic color grading, 
shot on Canon EOS R5 85mm f/1.4, shallow depth of field,
film grain, Kodak Portra 800, golden hour, dramatic shadows
```

#### LLFG Brand Anchors (always include):
```
dark moody atmosphere, rich gold and black color palette, 
luxury financial aesthetic, no text overlay, no watermark
```

#### Camera & Lens Specifications (pick one per generation):
- Close-up power shot: `85mm f/1.4, shallow depth of field, bokeh background`
- Wide cinematic: `24mm anamorphic, wide angle, cinematic aspect ratio`
- Drone/aerial: `aerial photography, drone shot, tilt-shift lens`
- Street-level drama: `35mm street photography, low angle, leading lines`

#### Lighting Directives:
- `volumetric lighting, god rays through buildings`
- `neon reflections on wet pavement`
- `rim lighting, backlit silhouette`
- `golden hour, warm amber tones`
- `high contrast, chiaroscuro lighting`

### Step 2: URL-Encode & Download
```bash
curl -L -o generated/{filename}.jpg \
  "https://image.pollinations.ai/prompt/{url_encoded_prompt}?width=1920&height=1080&seed={1-9999}&model=flux&nologo=true&enhance=true" \
  --max-time 120
```

URL-encode: replace spaces with `%20`, remove quotes and special chars.
Use `enhance=true` to let the AI improve your prompt automatically.

### Step 3: Verify Quality
1. Check file size > 10KB (small = error)
2. Run `file {filename}` to confirm valid JPEG
3. Use Read tool to visually preview
4. If bad quality: retry with different seed, or refine prompt

### Step 4: Integrate into Portal
- **Hero**: update `<img class="hero-bg-img" src="generated/{filename}.jpg"/>` in index.html
- **Section bg**: add `background-image: url('generated/{filename}.jpg')` to section CSS
- **Card image**: reference in HTML `<img>` tag

## Pre-Built LLFG Prompts

### HERO — Lion on Wall Street (Primary)
```
Cinematic photorealistic nighttime photograph, a powerful majestic male African lion walking confidently down the center of an empty Wall Street financial district, hundred dollar bills flying and swirling through the air all around the lion caught in wind, wet asphalt street reflecting warm golden light from towering glass skyscrapers on both sides, money raining down, dark moody dramatic atmosphere, rich gold and black color palette, volumetric fog, neon reflections on wet ground, shot on ARRI Alexa 65mm anamorphic lens, cinematic color grading, film grain, Kodak Vision3 500T, hyperrealistic, 8K UHD, no people, no text
```

### HERO — Lion Close-Up Power Shot
```
Extreme close-up photorealistic portrait of a majestic male lion face, intense golden eyes staring directly at camera, dramatic rim lighting in gold and amber tones, dark city lights bokeh in background suggesting Wall Street at night, shallow depth of field, 85mm f/1.2, wet fur detail, breath visible in cold air, volumetric light rays, cinematic color grading, hyperrealistic, RAW photo, 8K
```

### HERO — Lion Walking Toward Camera
```
Cinematic low angle photograph of a majestic male lion walking directly toward the camera down the center of a dark empty city street at night, Wall Street financial district, hundred dollar bills scattered on wet ground and floating in air, golden street lights creating long shadows, towering dark skyscrapers with lit windows, wet reflective pavement, 24mm wide angle anamorphic lens, dramatic volumetric lighting, film noir mood, hyperrealistic, 8K, Kodak Vision3, no people, no text
```

### SECTION — Abstract Financial Growth
```
Abstract dark background, flowing streams of golden light particles forming an upward trending chart shape, gold dust and ember particles floating, deep black background, subtle grid lines, luxury minimal aesthetic, financial technology feel, volumetric particles, 8K, no text, ultra wide 21:9 aspect ratio
```

### SECTION — City Skyline Panorama
```
Panoramic aerial photograph of Manhattan financial district skyline at night, golden warm lights from thousands of windows, dark moody sky, wet rooftops reflecting light, Hudson river reflections, cinematic color grading rich gold and deep black, drone shot, tilt-shift effect, 8K UHD, no text
```

## Multi-Generation Strategy

For the best results, generate 3-4 variations and pick the best:
```bash
for seed in 42 77 156 999; do
  curl -L -o generated/hero_v${seed}.jpg "https://image.pollinations.ai/prompt/{prompt}?width=1920&height=1080&seed=${seed}&model=flux&nologo=true&enhance=true" --max-time 120
done
```

Then visually compare all 4 and pick the winner.

## Image-to-Image Refinement

If you have a good base image but want to modify it:
```
https://image.pollinations.ai/prompt/{modification_prompt}?model=kontext&image={url_of_source_image}
```
Example: Take the generated hero and add more money flying, change the lighting, or adjust the lion's position.

## Quick Commands
- `/ai-generate hero` — Generate hero image using the primary lion prompt, pick best of 3 seeds
- `/ai-generate hero-closeup` — Generate lion close-up power shot
- `/ai-generate hero-walkcam` — Generate lion walking toward camera
- `/ai-generate section [name]` — Generate section background
- `/ai-generate [any description]` — Custom generation with LLFG branding auto-applied
- `/ai-generate batch [prompt] [count]` — Generate multiple variations
- `/ai-generate refine [filename] [changes]` — Image-to-image refinement via kontext model
- `/ai-generate compare` — Show all images in generated/ folder for comparison

## Upgrading to Paid (Optional)
For video generation or higher quality, add API keys to `.claude/ai-config.json`:
- **Runway** (runwayml.com) — cinematic video, ~$0.05/sec
- **OpenAI** (platform.openai.com) — DALL-E 3 / Sora
- **Stability AI** (platform.stability.ai) — budget option

Free alternatives for video: Kling AI (66 credits/day), Google Flow (50/day)