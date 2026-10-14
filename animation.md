# Forensic Frontend Animation Audit

## 1. Executive Summary
This document provides a comprehensive inventory of all visual motion, animation, and dynamic behaviors in the codebase.

**Critical Finding**: Use of scroll-linked continuous variables (`opacity`, `scale`) on text containers exists in `LivingItem.tsx`, posing a high risk for text jitter.

---

## 2. Animation Inventory

### Component: `LivingItem` (CORE RISK)
- **Location**: `src/components/experimental/LivingItem.tsx` (Line 22)
- **Type**: `Framer Motion` + `Scroll-Linked`
- **Mechanism**:
    - `opacity`: Continuous interpolation [0, 1] based on scroll progress.
    - `scale`: Continuous interpolation [0.92, 1] based on scroll progress.
    - `y` (Translate): continuous "breathing" loop `[0, -4, 0]` when `isResting` is true.
- **Triggers**: Scroll position & Idle state (`useScrollIntelligence`).
- **Risk Level**: 🔴 **HIGH RISK**
    - Directly animates wrapper of children (often text).
    - Causes sub-pixel rendering shifts during scroll.
    - "Breathing" moves text vertically without user input.

### Component: `ScrollReveal`
- **Location**: `src/components/public/ScrollReveal.tsx` (Line 12)
- **Type**: `Framer Motion`
- **Mechanism**:
    - `opacity`: 0 -> 1
    - `filter`: `blur(5px)` -> `blur(0px)`
- **Triggers**: `whileInView` (Intersection Observer).
- **Configuration**:
    - `viewport={{ once: true }}`: Locks after trigger.
    - `will-change: opacity, filter`: GPU hint present.
- **Risk Level**: 🟢 **SAFE**
    - Runs once.
    - No layout-affecting properties (`y` translation was observed to be removed in favor of strict opacity/blur).
    - GPU accelerated.

### Component: `Navbar`
- **Location**: `src/components/public/Navbar.tsx` (Line 9)
- **Type**: `Framer Motion`
- **Mechanism**:
    - Header Hide/Show: `y: 0` <-> `y: -20` based on scroll direction.
    - Mobile Menu: `opacity` & `scale` transition.
- **Triggers**: Scroll Event (`useMotionValueEvent`), Click state.
- **Configuration**:
    - `will-change-transform`: Class present.
- **Risk Level**: 🟢 **SAFE**
    - `fixed` position element, distinct layer.
    - Does not cause layout reflows for document flow.

### Component: `HiggsfieldBackground`
- **Location**: `src/components/public/HiggsfieldBackground.tsx` (Line 13)
- **Type**: `CSS Animation` + `Pulse/Float`
- **Mechanism**:
    - Blobs: `animate-pulse-slow` (opacity/scale pulse) + `transform: translate3d(0,0,0)`.
    - `animate-float`: Defined in `globals.css` (translate x/y).
- **Triggers**: Continuous CSS loop.
- **Configuration**:
    - `pointer-events-none`: Interaction safe.
    - `will-change-transform`: GPU hint present.
    - Client-only check (`mounted` state) prevents hydration mismatch.
- **Risk Level**: 🟢 **SAFE**
    - Isolated visual layer.

### Component: `ProcessTimeline`
- **Location**: `src/components/public/ProcessTimeline.tsx` (Line 35)
- **Type**: `Framer Motion`
- **Mechanism**:
    - Connecting Line: `scaleX` linked to scroll.
    - Cards: `opacity: 0, y: 20` -> `opacity: 1, y: 0` (Staggered entrance).
- **Triggers**: Scroll (`useScroll`), Viewport (`whileInView`).
- **Risk Level**: 🟡 **SUSPICIOUS**
    - Entrance animation involves `y` translation on cards containing text.
    - However, uses `viewport={{ once: true }}`, minimizing persistent jitter.

### Component: `SmoothScroll`
- **Location**: `src/components/public/SmoothScroll.tsx` (Line 6)
- **Type**: `JS-Based Scroll Hijack` (Lenis)
- **Mechanism**:
    - Intercepts wheel/touch events.
    - Applies transforms to `html` or `body` to simulate inertia.
- **Risk Level**: 🟢 **SAFE**
    - Standard implementation.

---

## 3. Background & Atmospheric Effects

**Layers**:
1.  **Solid Base**: `bg-slate-50` (Static).
2.  **Blobs**: 3 large gradients (`cyan`, `violet`, `indigo`) moving via CSS `float` and `pulse`.
3.  **Noise**: SVG overlay (`mix-blend-overlay`), static opacity.
4.  **Vignette**: Radial gradient, static.

**Movement**:
- **Server**: Renders base color only.
- **Client**: Hydrates blobs causing an appearance shift (handled by `useEffect`), then continuous CSS floating.

---

## 4. Text Motion & Typography Behavior

**Sources of "Floating / Unstable" Text**:
1.  **LivingItem.tsx**: The primary suspect. It wraps text blocks (Hero, Philosophy, etc.) and continuously applies:
    - `scale` changes as you scroll.
    - `opacity` changes as you scroll.
    - `y` (vertical) breathing motion when you stop scrolling.
    - **Result**: Browser forces continuous rasterization, leading to sub-pixel snapping (jitter) and blurry text edges.

2.  **ProcessTimeline.tsx**:
    - Cards slide up (`y: 20 -> 0`) on entry.

---

## 5. Render Timeline Analysis

1.  **Server (SSR)**:
    - Renders strict HTML structure.
    - `HiggsfieldBackground` renders empty `div` (no blobs).
    - `Navbar` renders in "visible" state default.
2.  **Hydration**:
    - `HiggsfieldBackground` mounts -> Blobs appear.
3.  **Post-Hydration (Client)**:
    - `LivingItem` attaches scroll listeners -> Immediately modifies opacity/scale of wrapped content.
    - `ScrollReveal` hides content (`opacity: 0`) then fades in.

---

## 6. Special Tracking / Forensics

- **`Math.random()`**:
    - Found in `middleware.ts` (Removed in previous optimization, now deterministic).
    - Not found in UI components.
- **`Date.now()`**:
    - Used in `middleware.ts` (Safe).
    - Used in `Footer.tsx` (Copyright year - Safe).
- **`window / scrollY`**:
    - `Navbar.tsx`: `useMotionValueEvent(scrollY, ...)` for hide/show logic.
    - `useScrollIntelligence.ts`: `useScroll()` & `useVelocity()` for nervous system logic.
- **`requestAnimationFrame`**:
    - `SmoothScroll.tsx`: Drives Lenis loop.
    - `HiggsfieldBackground` (implicitly via CSS animations, but harmless).

---

## 7. Confirmation Checklist

- [x] All animation sources listed
- [x] All text motion sources identified (Primary: `LivingItem.tsx`)
- [x] All scroll-based effects listed
- [x] All hydration-risk areas marked
