import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';

/**
 * TreeAnimation — Particle-based tree with scroll-driven growth
 *
 * Three distinct visual layers:
 *  1. TRUNK   — thick, dense, dark-green column of large particles
 *  2. BRANCHES — recursive fractal branches, medium particles, tapering
 *  3. LEAVES  — fluffy scattered clouds at every branch tip, small bright particles
 *
 * Scroll 0%   → tiny sprout, top-left corner
 * Scroll 100% → full tree, bottom-right corner
 *
 * Install: npm install three @types/three
 * Place at: src/pages/home/TreeAnimation.tsx
 */
export default function TreeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useSettings();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    // Orthographic camera: origin = screen centre, +Y = up, +X = right
    // 1 world unit = 1 CSS pixel
    const camera = new THREE.OrthographicCamera(
      -W / 2,  W / 2,
       H / 2, -H / 2,
      -100, 100
    );
    camera.position.z = 10;

    // ── Deterministic LCG RNG ────────────────────────────────────────────────
    let _seed = 7331;
    const rng = () => {
      _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
      return _seed / 0x7fffffff;
    };

    // ── Tree skeleton ─────────────────────────────────────────────────────────
    const TRUNK_HEIGHT = 230; // Taller trunk
    const MAX_DEPTH    = 10;  // Extra branches and leaves

    interface Seg {
      x1: number; y1: number;
      x2: number; y2: number;
      depth: number;
    }

    const trunkSegs:  Seg[] = [];
    const branchSegs: Seg[] = [];

    // TRUNK — 24 small segments, slightly s-curved
    const TRUNK_DIV = 24;
    for (let i = 0; i < TRUNK_DIV; i++) {
      const t1 = i       / TRUNK_DIV;
      const t2 = (i + 1) / TRUNK_DIV;
      const curve = Math.sin(t1 * Math.PI) * 6;
      trunkSegs.push({
        x1: curve * t1 * 0.4, y1: TRUNK_HEIGHT * t1,
        x2: curve * t2 * 0.4, y2: TRUNK_HEIGHT * t2,
        depth: -1,
      });
    }

    // BRANCHES — recursive fractal from trunk top + lateral branches
    const growBranch = (
      x: number, y: number,
      angle: number, len: number, depth: number
    ) => {
      if (depth > MAX_DEPTH || len < 4) return;
      const ex = x + Math.sin(angle) * len;
      const ey = y + Math.cos(angle) * len;
      branchSegs.push({ x1: x, y1: y, x2: ex, y2: ey, depth });

      // Wider spread prevents the unnatural "stacking" look.
      // Removed the central 3rd branch which caused the tree to repeat itself vertically.
      const spread = 0.55 - depth * 0.02;
      growBranch(ex, ey, angle - spread + (rng() - 0.5) * 0.15, len * 0.74, depth + 1);
      growBranch(ex, ey, angle + spread + (rng() - 0.5) * 0.15, len * 0.74, depth + 1);
    };

    // Main canopy splits immediately at trunk top to prevent a tall central spike
    growBranch(0, TRUNK_HEIGHT, -0.35, TRUNK_HEIGHT * 0.40, 0);
    growBranch(0, TRUNK_HEIGHT,  0.35, TRUNK_HEIGHT * 0.40, 0);
    // Asymmetrical lateral branches that blend perfectly into the taller trunk
    growBranch(0, TRUNK_HEIGHT * 0.45, -0.70, TRUNK_HEIGHT * 0.26, 2);
    growBranch(0, TRUNK_HEIGHT * 0.62,  0.65, TRUNK_HEIGHT * 0.24, 2);
    growBranch(0, TRUNK_HEIGHT * 0.80, -0.55, TRUNK_HEIGHT * 0.20, 3);

    // Sort shallow → deep so reveal flows from trunk outward
    branchSegs.sort((a, b) => a.depth - b.depth);

    // ── Particle arrays ───────────────────────────────────────────────────────
    const trunkPos:  number[] = [];
    const trunkCol:  number[] = [];
    const branchPos: number[] = [];
    const branchCol: number[] = [];
    const leafPos:   number[] = [];
    const leafCol:   number[] = [];

    // ── TRUNK particles — thick, tapered, dense ───────────────────────────────
    trunkSegs.forEach((seg) => {
      const t       = seg.y1 / TRUNK_HEIGHT;      // 0 = root, 1 = top
      const thick   = 22 - t * 14;                // ±22px at root, ±8px at top (thicker for taller tree)
      const density = Math.floor(thick * 2 * 5);  // very dense

      for (let i = 0; i < density; i++) {
        const pct   = rng();
        const angle = rng() * Math.PI * 2;
        const r     = rng() * thick;

        trunkPos.push(
          seg.x1 + (seg.x2 - seg.x1) * pct + Math.cos(angle) * r,
          seg.y1 + (seg.y2 - seg.y1) * pct + Math.sin(angle) * r * 0.35,
          0
        );
        // Dark brown trunk: distinct from branches, warm and elegant
        if (isDark) {
          trunkCol.push(0.23 + t * 0.08, 0.15 + t * 0.05, 0.10 + t * 0.03);
        } else {
          // Extremely dark, warm wood for light theme
          trunkCol.push(0.15 + t * 0.04, 0.08 + t * 0.03, 0.04 + t * 0.01);
        }
      }
    });

    // ── BRANCH particles — taper in thickness and color by depth ─────────────
    branchSegs.forEach((seg) => {
      const depthT = seg.depth / MAX_DEPTH;
      const thick  = Math.max(1.2, 8.5 - seg.depth * 0.75); // thicker branches to match trunk
      const segLen = Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1);
      const count  = Math.max(6, Math.floor(segLen / 2.0));

      for (let i = 0; i < count; i++) {
        const pct   = rng();
        const angle = rng() * Math.PI * 2;
        const r     = rng() * thick;

        branchPos.push(
          seg.x1 + (seg.x2 - seg.x1) * pct + Math.cos(angle) * r,
          seg.y1 + (seg.y2 - seg.y1) * pct + Math.sin(angle) * r * 0.4,
          0
        );
        // Transition from brown trunk color to lush green branch tips
        if (isDark) {
          branchCol.push(
            0.31 - depthT * 0.16,
            0.20 + depthT * 0.27,
            0.13 + depthT * 0.06
          );
        } else {
          // Much darker, warmer greens for branch tips
          branchCol.push(
            0.12 - depthT * 0.04,
            0.12 + depthT * 0.08,
            0.03 + depthT * 0.02
          );
        }
      }
    });

    // ── LEAF particles — fluffy clouds at all terminal branch tips ────────────
    const LEAF_THRESHOLD = MAX_DEPTH - 2;
    branchSegs.forEach((seg) => {
      if (seg.depth < LEAF_THRESHOLD) return;

      const cloudRadius = 34 - (seg.depth - LEAF_THRESHOLD) * 5;
      const count       = 60 + Math.floor(rng() * 55);

      for (let i = 0; i < count; i++) {
        // Polar with sqrt for natural radial falloff
        const a = rng() * Math.PI * 2;
        const r = Math.sqrt(rng()) * cloudRadius;

        leafPos.push(
          seg.x2 + Math.cos(a) * r,
          seg.y2 + Math.sin(a) * r * 0.82,
          0
        );
        // Range of spring greens + occasional yellow-green
        if (isDark) {
          leafCol.push(
            0.16 + rng() * 0.24,
            0.70 + rng() * 0.26,
            0.18 + rng() * 0.22
          );
        } else {
          // Very dark, warm olive/pine greens for light theme
          leafCol.push(
            0.08 + rng() * 0.08,  // Add red for warmth
            0.18 + rng() * 0.12,  // Deep green
            0.02 + rng() * 0.02   // Very low blue
          );
        }
      }
    });

    // ── Build Three.js Points layers ──────────────────────────────────────────
    const buildLayer = (positions: number[], colors: number[], size: number) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors,    3));
      const mat = new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true,
        opacity: 1.0, sizeAttenuation: true,
      });
      return { pts: new THREE.Points(geo, mat), geo, mat };
    };

    const trunk  = buildLayer(trunkPos,  trunkCol,  6.2);
    const branch = buildLayer(branchPos, branchCol, 3.8);
    const leaf   = buildLayer(leafPos,   leafCol,   2.6);

    const TRUNK_TOTAL  = trunkPos.length  / 3;
    const BRANCH_TOTAL = branchPos.length / 3;
    const LEAF_TOTAL   = leafPos.length   / 3;

    const treeGroup = new THREE.Group();
    treeGroup.add(trunk.pts);
    treeGroup.add(branch.pts);
    treeGroup.add(leaf.pts);
    scene.add(treeGroup);

    // ── Scroll helpers ────────────────────────────────────────────────────────
    const getScrollProgress = (): number => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    };

    // Responsive positioning: Center on mobile, Bottom right on desktop
    const getRootPos = () => {
      const isMobile = W < 768;
      return {
        x: isMobile ? 0 : Math.min(W * 0.3, W / 2 - 150),
        y: -H / 2 - (isMobile ? 100 : 20), // Push down further on mobile so content isn't blocked
      };
    };

    // Eased phase helper: maps global progress [start,end] → [0,1]
    const phase = (p: number, start: number, end: number) =>
      Math.min(1, Math.max(0, (p - start) / (end - start)));

    // ── Animation loop ────────────────────────────────────────────────────────
    let targetProgress  = getScrollProgress();
    let currentProgress = targetProgress;
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      currentProgress += (targetProgress - currentProgress) * 0.065;

      // Staged reveal: trunk first → branches → leaves
      trunk.geo.setDrawRange( 0, Math.ceil(phase(currentProgress, 0.00, 0.35) * TRUNK_TOTAL));
      branch.geo.setDrawRange(0, Math.ceil(phase(currentProgress, 0.25, 0.75) * BRANCH_TOTAL));
      leaf.geo.setDrawRange(  0, Math.ceil(phase(currentProgress, 0.60, 1.00) * LEAF_TOTAL));

      // Fixed elegant position
      const { x, y } = getRootPos();
      treeGroup.position.set(x, y, 0);

      // Gentle natural sway based on time
      const time = performance.now() * 0.001;
      treeGroup.rotation.z = Math.sin(time * 0.8) * 0.015;

      // Responsive scalable tree
      const isMobile = W < 768;
      const baseScale = isMobile ? 0.55 : 0.85; // Smaller base on mobile screens
      
      // Smooth, elegant scaling from sprout to full tree
      const scale = (0.2 + Math.pow(currentProgress, 0.7) * baseScale);
      treeGroup.scale.setScalar(scale);

      renderer.render(scene, camera);
    };

    // ── Event listeners ───────────────────────────────────────────────────────
    const onScroll = () => { targetProgress = getScrollProgress(); };
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      renderer.setSize(W, H);
      camera.left = -W / 2; camera.right  =  W / 2;
      camera.top  =  H / 2; camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      [trunk, branch, leaf].forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:          0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',   // never blocks clicks or text selection
        zIndex:         100,     // above content (z-20), below navbar (z-9999)
        opacity:        isDark ? 0.55 : 0.85,    // significantly reduced transparency in light theme
      }}
    />
  );
}
