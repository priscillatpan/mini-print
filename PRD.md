# Polaroid Creator — Product Requirements Document

## The Vibe
Turn any photo into a cute, shareable digital polaroid. Inspired by the real-world trend of polaroid walls, string lights, and fridge photos — but make it digital, instant, and sendable.

## Why This is Fun (and not just another photo editor)

The magic isn't "apply a filter." The magic is the **artifact you create** — a little digital object that *feels* like something physical. A few things that separate this from generic:

1. **It's a gift, not an edit.** You're not editing your photo for Instagram. You're making a little thing to *send someone*. That reframes the whole experience.
2. **Constraints are the feature.** Polaroids are small, square-ish, one-off. You don't get 47 filter options. You get a few intentional ones. The limitation makes it feel crafted.
3. **The frame is the personality.** The handwritten caption, the frame color, the slight tilt — that's where expression lives. Not in the photo itself.
4. **It's fast.** Photo in, polaroid out, share. Under 30 seconds. No account, no onboarding.

---

## MVP (v1) — The Core Loop

### Flow
1. **Capture / Upload** — Take a photo (phone camera or webcam) or upload from galleryle
2. **Crop & Frame** — Auto-crop to polaroid aspect ratio (roughly square with bottom margin for caption). User can adjust.
3. **Style It** — Pick a frame color + optional filter
4. **Caption It** — Add a handwritten-style caption on the bottom strip
5. **Download & Share** — Save as image or share directly

### Feature Breakdown

#### 1. Photo Input
- **Mobile**: Open native camera or pick from photo library
- **Desktop**: Webcam capture or file upload
- Accept common formats (jpg, png, heic, webp)

#### 2. Polaroid Framing
- Auto-crop photo to Instax Mini portrait aspect ratio (~4:3 vertical, user can pan/zoom to adjust)
- Render inside an Instax Mini-style vertical frame with:
  - Slightly rounded corners
  - Subtle shadow/depth (feels like a real photo sitting on a surface)
  - Thin even borders on top and sides, wide bottom margin for the caption area (matching Instax Mini proportions)
  - Very subtle paper texture on the frame (not overdone)

#### 3. Styling Options
Keep it intentional and limited — NOT a full editor.

**Frame colors** (pick one):
- Classic white (default)
- Cream / off-white
- Black
- Pastel pink
- Pastel blue
- Pastel mint
- Pastel lavender

**Photo filters** (pick one, all subtle):
- None (original)
- Warm vintage (slightly yellow/warm, mild fade)
- Cool film (slight blue tint, lifted blacks)
- Black & white
- Faded Polaroid (washed highlights, warm shadows — the classic look)

#### 4. Caption
- Text input that renders in a handwritten-style font on the bottom strip
- Keep it short — maybe 30-40 character limit to preserve the vibe
- A few font choices (2-3 handwritten styles max)
- Optional: date stamp (auto or manual) in small text

#### 5. Output & Sharing
- **Download** as PNG (high-res enough for printing, ~1200px wide)
- **Share** via native share sheet (mobile) or copy-to-clipboard (desktop)
- Output should look good on its own — transparent or styled background

---

## Nice-to-Haves (v1.5 — if MVP feels too thin)

These are low-effort additions that increase delight:

- **Stickers/doodles**: Small set of hand-drawn stickers (hearts, stars, arrows, smiley) you can place on the polaroid
- **Tilt/rotation**: Slight random tilt on the polaroid for a more natural "pinned to wall" look (or let user adjust)
- **Background scenes**: Instead of just the polaroid floating, place it on a surface — cork board, fridge, wooden table, string lights
- **Batch mode**: Make 2-4 polaroids at once, arranged in a cute collage/grid

---

## Future Vision (v2+) — The Polaroid Wall

This is where it gets interesting beyond a one-off tool:

### Polaroid Wall
- A digital "wall" where you collect and arrange your polaroids
- Pin, tilt, overlap, string lights connecting them
- Shareable as a link (your own little gallery)
- Could be collaborative — friends add their polaroids to your wall

### Phone Widgets
- iOS/Android widget that shows a rotating polaroid from your collection
- Or a static "photo of the day" polaroid on your home screen
- Lock screen widget with your latest polaroid

### Social / Gifting
- Send a polaroid to a friend via link — they open it and it "develops" with an animation (starts dark, image slowly appears)
- "Polaroid exchange" — you and a friend each send one
- Reactions / flip the polaroid to see a message on the back

---

## Tech Considerations (for vibe coding)

### Recommended Stack
- **Next.js** (app router) — works on mobile browsers + desktop, no app store needed
- **Canvas API or HTML-to-image** (html2canvas / dom-to-image) — render the polaroid as a downloadable image
- **Tailwind CSS** — fast styling
- **No backend needed for MVP** — everything runs client-side
  - Photo processing happens in-browser
  - No accounts, no storage (keep it simple)

### Key Technical Decisions
- **Camera access**: Use `getUserMedia` API for webcam/phone camera
- **Image processing**: CSS filters for the photo effects (keeps it simple), or canvas-based if more control needed
- **Export**: Render the styled polaroid DOM element to a canvas, then export as PNG
- **PWA potential**: Add a manifest + service worker later to make it installable, which opens up widget possibilities

### Performance Notes
- Keep it snappy — no server round-trips for the core flow
- Lazy load camera APIs (not everyone will use webcam)
- Compress output images sensibly (high quality but not 10MB files)

---

## What "Done" Looks Like for MVP

A user can:
1. Open the app on their phone (or computer)
2. Take or upload a photo
3. See it instantly framed as a polaroid
4. Pick a frame color and filter
5. Add a caption
6. Download or share it

**Time from open to shared polaroid: under 30 seconds.**

No sign-up. No paywall. No tutorial. Just make a cute thing and send it.

---

## Open Questions

1. **Name?** "Polaroid Creator" is descriptive but trademark-adjacent. Alternatives: Pola, Instapola, SnapFrame, LittlePrint, FilmDrop
2. **Monetization (if ever)?** Premium frame colors/filters, custom fonts, wall feature as paid tier — but MVP should be completely free
3. **Animations?** Should the polaroid "develop" when created (the classic slow-reveal)? Fun but adds complexity. Could be a v1.5 thing.
4. **Aspect ratio?** Using Instax Mini proportions — vertical frame (8.6×5.4cm), photo area (6.2×4.6cm). Tall portrait orientation with a thick bottom strip.
