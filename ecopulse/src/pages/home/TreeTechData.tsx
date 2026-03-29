import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';

/**
 * TreeTechData — Solid 3D Low-Poly "Tech/Data" Tree
 * No particles. Uses solid geometry with glowing data nodes.
 * Responsive to browser dims, dynamic Dark/Light theme switching.
 */
export default function TreeTechData() {
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

    // Perspective camera for a premium 3D feel
    const camera = new THREE.PerspectiveCamera(45, W / H, 1, 2000);
    
    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(200, 500, 300);
    scene.add(dirLight);

    // ── Materials ─────────────────────────────────────────────────────────────
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.6,
      metalness: 0.4,
      flatShading: true,
    });

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      emissive: 0x004433,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
    });

    // ── Tree Construction ────────────────────────────────────────────────────
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    let _seed = 7331;
    const rng = () => {
      _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
      return _seed / 0x7fffffff;
    };

    const MAX_DEPTH = 6;
    const nodes: THREE.Mesh[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];

    const buildBranch = (x:number, y:number, z:number, angleY:number, angleZ:number, len:number, thick:number, depth:number) => {
      if (depth > MAX_DEPTH) return;

      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = angleY;
      group.rotation.z = angleZ;
      treeGroup.add(group);

      // Branch Segment (Low Poly)
      const geo = new THREE.CylinderGeometry(thick * 0.65, thick, len, 5); // 5 radial segments for low-poly look
      geo.translate(0, len / 2, 0); // origin to bottom
      geometriesToDispose.push(geo);

      const mesh = new THREE.Mesh(geo, trunkMat);
      group.add(mesh);

      // Data Nodes (Leaves)
      if (depth >= 3) {
        // Chance to spawn a data node at the end of this branch
        if (rng() > 0.3 || depth === MAX_DEPTH) {
          const nodeGeo = new THREE.IcosahedronGeometry(thick * 3.5, 0); // 0 detail = 20 polygons (sharp)
          geometriesToDispose.push(nodeGeo);
          const node = new THREE.Mesh(nodeGeo, nodeMat);
          node.position.set(0, len, 0);
          
          // Random initial spin
          node.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
          group.add(node);
          nodes.push(node);
        }
      }

      const nextDepth = depth + 1;
      if (nextDepth <= MAX_DEPTH) {
        const spread = 0.5 - depth * 0.05;
        // Branch 1
        buildBranch(0, len * 0.95, 0, rng() * Math.PI * 2, angleZ - spread - rng() * 0.2, len * 0.75, thick * 0.7, nextDepth);
        // Branch 2
        buildBranch(0, len * 0.95, 0, rng() * Math.PI * 2, angleZ + spread + rng() * 0.2, len * 0.75, thick * 0.7, nextDepth);
        // Branch 3 (occasional core continuation)
        if (depth < 4 && rng() > 0.5) {
          buildBranch(0, len * 0.95, 0, rng() * Math.PI * 2, angleZ + (rng() - 0.5) * 0.2, len * 0.8, thick * 0.75, nextDepth);
        }
      }
    };

    // Build the tree (Trunk)
    buildBranch(0, 0, 0, 0, 0, 160, 20, 0);

    // ── Pre-calculate colors for themes
    const darkTrunkColor = new THREE.Color(0x1a1a1a);
    const lightTrunkColor = new THREE.Color(0x999999);
    
    // Teal/emerald glowing
    const darkNodeColor = new THREE.Color(0x00ffcc);
    const darkNodeEmissive = new THREE.Color(0x004433);
    
    const lightNodeColor = new THREE.Color(0x00aa88);
    const lightNodeEmissive = new THREE.Color(0x003322);

    // ── Animation Loop ───────────────────────────────────────────────────────
    let raf: number;
    let time = 0;
    
    // Use scroll progress for scaling
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

      // Theme transitions (Smoothly Lerp)
      const tTrunk = themeRef.current ? darkTrunkColor : lightTrunkColor;
      trunkMat.color.lerp(tTrunk, 0.05);

      const tNode = themeRef.current ? darkNodeColor : lightNodeColor;
      const tEmissive = themeRef.current ? darkNodeEmissive : lightNodeEmissive;
      nodeMat.color.lerp(tNode, 0.05);
      nodeMat.emissive.lerp(tEmissive, 0.05);

      // Swaying
      treeGroup.rotation.y += 0.001; // very slow spin
      treeGroup.rotation.z = Math.sin(time * 0.7) * 0.015;

      // Spin nodes and pulse
      const pulseRate = time * 2;
      nodes.forEach((n, idx) => {
        n.rotation.x += 0.015;
        n.rotation.y += 0.01;
        const s = 1 + Math.sin(pulseRate + idx * 0.5) * 0.1;
        n.scale.setScalar(s);
      });

      // Responsive positioning & Scroll Scale
      const targetScale = 0.5 + Math.pow(getScrollProgress(), 0.5) * 0.6;
      currentScale += (targetScale - currentScale) * 0.1;
      treeGroup.scale.setScalar(currentScale);

      // Positioning: Always anchor bottom right
      const isMobile = W < 768;
      const xOffset = isMobile ? 0 : W * 0.25;
      
      treeGroup.position.set(xOffset, -H * 0.45, 0);
      camera.position.set(0, H * 0.1, 900); // Back up camera so the 3D space feels huge

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
      nodeMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 100, opacity: 0.8
      }}
    />
  );
}
