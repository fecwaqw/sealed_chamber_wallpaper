# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

Wallpaper Engine WebGL 3D animated wallpaper using Three.js. Renders a sealed chamber scene with a floating translucent panel displaying a Leafer-UI audio spectrum analyzer. Integrates with Wallpaper Engine's media APIs for audio visualization and playback controls.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Vite dev server
pnpm build            # Build for production (outputs to dist/)
pnpm preview          # Preview production build
```

## Architecture

**Entry Point:** [src/main.js](src/main.js) - Scene setup, renderer, animation loop, post-processing pipeline

**Module Responsibilities:**
- `main.js` - Scene setup, renderer, animation loop, EffectComposer with RenderPass → VignetteShader → GlowShader → SMAA → OutputPass
- `camera.js` - PerspectiveCamera at z=1.5
- `background.js` - Background texture with aspect ratio correction, exports VignetteShader and GlowShader for post-processing effects
- `panel/panel.js` - Plane mesh with CanvasTexture, mouse parallax rotation via quaternion slerp (base rotation: -30° X, 45° Y)
- `panel/panel-canvas.js` - Three.js CanvasTexture wrapping Leafer UI instance, Wallpaper Engine API integration
- `panel/elements.js` - Leafer UI components: 15x11 spectrum analyzer grid, 116-segment peak program meters (L/R), playback controls, animated disk panels
- `images.js` - Base64-encoded images (disk, cycle, speaker, infinity icons) and background image path
- `config.js` - `debug` and `wallpaper` flags for development modes
- `style.css` - Custom font face definitions (MensuraBoldW01, Bebas-Regular, TT Lakes Neue, etc.)

**Wallpaper Engine Integration:**
- `wallpaper` flag in [config.js](src/config.js) controls integration (disabled by default, set to `true` for Wallpaper Engine)
- `audioListener(audioArray)` - Receives 128-band frequency data (64 left + 64 right), computes average per frequency band for spectrum display
- `mediaPlaybackListener(event)` - Toggles play/pause icon, starts/stops disk rotation animations
- `mediaTimelineListener(event)` - Updates 3-segment progress bar (fills segments 0-2 based on position/duration)
- `mediaStatusListener(event)` - Enables play mode when media is disabled
- Build output (`dist/`) includes `project.json` and `preview.jpg` for Wallpaper Engine packaging

**Debug Mode:**
- `debug` flag in [config.js](src/config.js) enables standalone Leafer UI rendering (skip Wallpaper Engine APIs)
- When debug=true, UI is rendered to a canvas element and fake spectrum bars animate automatically

**Data Flow:**
1. `main.js` imports modules, sets up EffectComposer with post-processing chain
2. Animation loop capped at 60 FPS (configurable via Wallpaper Engine FPS property) calls `panel.update()` each frame
3. `panel.update()` calls `updateTexture()` to redraw Leafer UI, then performs mouse parallax rotation
4. `updateTexture()` redraws UI tree and sets `texture.needsUpdate = true` for GPU upload
5. Mouse movement updates rotation target, mesh quaternion slerps toward target (smoothing factor: 0.15)

**Tech Stack:** Three.js r182, Vite 7.x, Leafer UI 2.x, Wallpaper Engine API
