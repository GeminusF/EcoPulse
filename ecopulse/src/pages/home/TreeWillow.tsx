import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';

/**
 * TreeWillow — Solid 3D Low-Poly "Willow" Tree
 * Elegant, draping solid cones simulating weeping willow leaves.
 * Responsive to browser dims, dynamic Dark/Light theme switching.
 */
export default function TreeWillow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useSettings();
  const isDark = resolvedTheme === 'dark';
  const themeRef = useRef(isDark);

  useEffect(() => {
    themeRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 1, 2000);
    
    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(200, 500, 300);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-200, -100, -300);
    scene.add(backLight);

    // ── Materials ─────────────────────────────────────────────────────────────
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x2d1a11,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.7,
      metalness: 0.1,
      flatShading: true,
    });

    // ── Tree Construction ────────────────────────────────────────────────────
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    let _seed = 12345;
    const rng = () => {
      _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
      return _seed / 0x7fffffff;
    };

    const MAX_DEPTH = 6;
    const leaves: THREE.Group[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];

    const buildBranch = (x:number, y:number, z:number, angleY:number, angleZ:number, len:number, thick:number, depth:number) => {
      if (depth > MAX_DEPTH) return;

      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = angleY;
      group.rotation.z = angleZ;
      
      // Willow curve: bend downwards slightly as depth increases
      if (depth > 2) {
        group.rotation.z += (Math.abs(angleZ) > Math.PI / 2 ? -0.2 : 0.2); 
      }
      
      treeGroup.add(group);

      // Branch Segment (Low Poly)
      const geo = new THREE.CylinderGeometry(thick * 0.7, thick, len, 6);
      geo.translate(0, len / 2, 0); 
      geometriesToDispose.push(geo);

      const mesh = new THREE.Mesh(geo, trunkMat);
      group.add(mesh);

      // Willow "Leaves" (Draping Cones/Ribbons)
      if (depth >= 3) {
        if (rng() > 0.4 || depth === MAX_DEPTH) {
          // A leaf group that we pivot from its top
          const leafPivot = new THREE.Group();
          leafPivot.position.set(0, len * (0.5 + rng() * 0.5), 0);
          
          // Force rotation downwards (world down)
          // We don't have absolute world rotation easily in pure localized building, 
          // but we can rotate it generally outwards then animate it
          leafPivot.rotation.x = rng() * Math.PI * 2;
          leafPivot.rotation.z = Math.PI; // point down
          
          group.add(leafPivot);
          leaves.push(leafPivot);

          // Weeping geometry: long thin inverted cone
          const leafGeo = new THREE.ConeGeometry(thick * 1.5, thick * 12, 4); // 4 sides = diamond-like ribbon
          leafGeo.translate(0, thick * 6, 0); // shift so pivot is at top
          geometriesToDispose.push(leafGeo);
          
          const leafMesh = new THREE.Mesh(leafGeo, leafMat);
          leafPivot.add(leafMesh);
        }
      }

      const nextDepth = depth + 1;
      if (nextDepth <= MAX_DEPTH) {
        const spread = 0.4 + depth * 0.05; // Spreads wider as it grows
        
        buildBranch(0, len * 0.9, 0, rng() * Math.PI * 2, angleZ - spread - rng() * 0.2, len * 0.8, thick * 0.75, nextDepth);
        buildBranch(0, len * 0.9, 0, rng() * Math.PI * 2, angleZ + spread + rng() * 0.2, len * 0.8, thick * 0.75, nextDepth);
        if (depth < 4 && rng() > 0.4) {
          buildBranch(0, len * 0.9, 0, rng() * Math.PI * 2, angleZ + (rng() - 0.5) * 0.3, len * 0.8, thick * 0.75, nextDepth);
        }
      }
    };

    // Build the rooted tree
    buildBranch(0, 0, 0, 0, 0, 160, 22, 0);

    // ── Pre-calculate colors for themes
    const darkTrunkColor = new THREE.Color(0x1a0f0a);
    const lightTrunkColor = new THREE.Color(0x3e2723); // Darker brown for light mode
    
    // Soft mints & teals
    const darkLeafColor = new THREE.Color(0x1b4332);
    const lightLeafColor = new THREE.Color(0x8fbc8f);

    // ── Animation Loop ───────────────────────────────────────────────────────
    let raf: number;
    let time = 0;
    
    const getScrollProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    };

    const onScroll = () => {};
    window.addEventListener('scroll', onScroll, { passive: true });

    let currentScale = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      time += 0.01;

      // Theme Lerping
      const tTrunk = themeRef.current ? darkTrunkColor : lightTrunkColor;
      trunkMat.color.lerp(tTrunk, 0.05);

      const tLeaf = themeRef.current ? darkLeafColor : lightLeafColor;
      leafMat.color.lerp(tLeaf, 0.05);

      // Swaying whole tree
      treeGroup.rotation.y = Math.sin(time * 0.3) * 0.05;
      treeGroup.rotation.z = Math.sin(time * 0.5) * 0.02;

      // Make leaves sway gracefully (underwater effect)
      leaves.forEach((l, idx) => {
        // We use Math.sin offset by idx to create a wave through the leaves
        l.rotation.x = Math.sin(time * 1.5 + idx * 0.1) * 0.1;
        l.rotation.z = Math.PI + Math.cos(time * 1.2 + idx * 0.15) * 0.1; 
      });

      // Responsive positioning & Scroll Scale
      const targetScale = 0.5 + Math.pow(getScrollProgress(), 0.6) * 0.5;
      currentScale += (targetScale - currentScale) * 0.1;
      treeGroup.scale.setScalar(currentScale);

      const isMobile = W < 768;
      const xOffset = isMobile ? 0 : W * 0.25;
      
      treeGroup.position.set(xOffset, -H * 0.45, 0);
      camera.position.set(0, H * 0.15, 950); 

      renderer.render(scene, camera);
    };

    // ── Events ───────────────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      geometriesToDispose.forEach(g => g.dispose());
      trunkMat.dispose();
      leafMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 100, opacity: 0.9
      }}
    />
  );
}
