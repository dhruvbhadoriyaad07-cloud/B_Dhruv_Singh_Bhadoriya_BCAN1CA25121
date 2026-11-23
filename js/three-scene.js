/**
 * CodeCraft Society — 60FPS Three.js Cyber-Architecture Core & Node Mesh
 * Interactive 3D Sculpture: Wireframe Icosahedron Core, Dual Gyroscopic Rings & Data Constellation
 * Optimized with IntersectionObserver render loop freezing and zero shadow overhead.
 */

(function () {
  'use strict';

  // Guard against missing Three.js
  if (typeof THREE === 'undefined') {
    return;
  }

  const canvas = document.getElementById('sculpture-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  if (!container) return;

  // --------------------------------------------------------------------------
  // 1. SCENE, CAMERA & RENDERER SETUP
  // --------------------------------------------------------------------------
  const scene = new THREE.Scene();

  // Camera positioned with generous padding to prevent edge clipping during expansion
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
  );
  camera.position.set(0, 0, 8.4);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });

  // Strict 60FPS Performance Rules: Cap DPR at 1.5 max, disable shadows
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.shadowMap.enabled = false;

  // --------------------------------------------------------------------------
  // 2. LIGHTING (Direct + Ambient, Zero Shadow Pass)
  // --------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(6, 8, 10);
  scene.add(keyLight);

  const orangeFillLight = new THREE.DirectionalLight(0xff4d00, 0.8);
  orangeFillLight.position.set(-6, -6, -8);
  scene.add(orangeFillLight);

  // Master group containing all dynamic objects
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // --------------------------------------------------------------------------
  // 3. COLOR PALETTE & THEME MATERIALS
  // --------------------------------------------------------------------------
  const isDarkInitial = document.documentElement.classList.contains('dark');

  // Core Wireframe Materials
  const outerLineMat = new THREE.LineBasicMaterial({
    color: isDarkInitial ? 0xEAE8E1 : 0x0A0A0A,
    linewidth: 1.5
  });

  const outerFacetMat = new THREE.MeshStandardMaterial({
    color: isDarkInitial ? 0x222222 : 0xD5D3CB,
    transparent: true,
    opacity: isDarkInitial ? 0.22 : 0.14,
    roughness: 0.35,
    metalness: 0.65,
    side: THREE.DoubleSide
  });

  const innerLineMat = new THREE.LineBasicMaterial({
    color: 0xFF4D00,
    linewidth: 1.5
  });

  const innerFacetMat = new THREE.MeshStandardMaterial({
    color: 0xFF4D00,
    transparent: true,
    opacity: 0.25,
    roughness: 0.2,
    metalness: 0.4,
    side: THREE.DoubleSide
  });

  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0xFF4D00,
    emissive: 0xFF4D00,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.8
  });

  // Gyroscopic Ring Materials
  const ringMat = new THREE.MeshStandardMaterial({
    color: isDarkInitial ? 0xCCCCCC : 0x222222,
    roughness: 0.3,
    metalness: 0.8
  });

  const satNodeMat = new THREE.MeshStandardMaterial({
    color: 0xFF4D00,
    emissive: 0xFF4D00,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.5
  });

  // Constellation Materials
  const nodeNormalMat = new THREE.MeshStandardMaterial({
    color: isDarkInitial ? 0xEAE8E1 : 0x0A0A0A,
    roughness: 0.3,
    metalness: 0.7
  });

  const nodeAccentMat = new THREE.MeshStandardMaterial({
    color: 0xFF4D00,
    emissive: 0xFF4D00,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.5
  });

  const constellationLineMat = new THREE.LineBasicMaterial({
    color: isDarkInitial ? 0x555555 : 0xCCCCCC,
    transparent: true,
    opacity: isDarkInitial ? 0.55 : 0.45,
    linewidth: 1
  });

  // --------------------------------------------------------------------------
  // 4. CENTRAL CORE (Icosahedron + Faceted Inner Core + Nucleus)
  // --------------------------------------------------------------------------
  const coreGroup = new THREE.Group();
  rootGroup.add(coreGroup);

  // Outer Architectural Icosahedron (radius ~1.45)
  const outerIcoGeo = new THREE.IcosahedronGeometry(1.45, 0);
  const outerEdgesGeo = new THREE.EdgesGeometry(outerIcoGeo);
  const outerLineMesh = new THREE.LineSegments(outerEdgesGeo, outerLineMat);
  const outerFacetMesh = new THREE.Mesh(outerIcoGeo, outerFacetMat);
  coreGroup.add(outerFacetMesh);
  coreGroup.add(outerLineMesh);

  // Inner Faceted Core with Signal Orange Wireframe (radius ~0.88)
  const innerIcoGeo = new THREE.IcosahedronGeometry(0.88, 0);
  const innerEdgesGeo = new THREE.EdgesGeometry(innerIcoGeo);
  const innerLineMesh = new THREE.LineSegments(innerEdgesGeo, innerLineMat);
  const innerFacetMesh = new THREE.Mesh(innerIcoGeo, innerFacetMat);
  coreGroup.add(innerFacetMesh);
  coreGroup.add(innerLineMesh);

  // Solid Center Nucleus (radius 0.2)
  const nucleusGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
  coreGroup.add(nucleusMesh);

  // --------------------------------------------------------------------------
  // 5. DUAL GYROSCOPIC RINGS & SATELLITE NODES
  // --------------------------------------------------------------------------
  const ringsGroup = new THREE.Group();
  rootGroup.add(ringsGroup);

  // Ring 1 (Torus radius 2.15, tube 0.018)
  const ring1Geo = new THREE.TorusGeometry(2.15, 0.018, 16, 96);
  const ring1Mesh = new THREE.Mesh(ring1Geo, ringMat);

  const ring1Container = new THREE.Group();
  ring1Container.rotation.x = Math.PI * 0.35;
  ring1Container.rotation.y = Math.PI * 0.15;
  ring1Container.add(ring1Mesh);
  ringsGroup.add(ring1Container);

  // Satellite Nodes on Ring 1 (2 Signal Orange nodes)
  const satGeo = new THREE.SphereGeometry(0.08, 14, 14);
  const sat1a = new THREE.Mesh(satGeo, satNodeMat);
  sat1a.position.set(2.15, 0, 0);
  ring1Mesh.add(sat1a);

  const sat1b = new THREE.Mesh(satGeo, satNodeMat);
  sat1b.position.set(-2.15, 0, 0);
  ring1Mesh.add(sat1b);

  // Ring 2 (Torus radius 2.52, tube 0.018)
  const ring2Geo = new THREE.TorusGeometry(2.52, 0.018, 16, 96);
  const ring2Mesh = new THREE.Mesh(ring2Geo, ringMat);

  const ring2Container = new THREE.Group();
  ring2Container.rotation.x = -Math.PI * 0.30;
  ring2Container.rotation.z = Math.PI * 0.25;
  ring2Container.add(ring2Mesh);
  ringsGroup.add(ring2Container);

  // Satellite Node on Ring 2 (1 Signal Orange node)
  const sat2 = new THREE.Mesh(satGeo, satNodeMat);
  sat2.position.set(0, 2.52, 0);
  ring2Mesh.add(sat2);

  // --------------------------------------------------------------------------
  // 6. CONNECTED DATA CONSTELLATION (45 Geometric Nodes + Dynamic Lines)
  // --------------------------------------------------------------------------
  const constellationGroup = new THREE.Group();
  rootGroup.add(constellationGroup);

  const nodeCount = 45;
  const nodes = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  const nodeOctGeo = new THREE.OctahedronGeometry(0.065, 0);
  const nodeAccentOctGeo = new THREE.OctahedronGeometry(0.09, 0);

  for (let i = 0; i < nodeCount; i++) {
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
    // Spiral distribution between 2.35 and 3.65 radius
    const radius = 2.45 + ((i * 19) % 11) * 0.11;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const isAccent = (i % 9 === 0);
    const mesh = new THREE.Mesh(
      isAccent ? nodeAccentOctGeo : nodeOctGeo,
      isAccent ? nodeAccentMat : nodeNormalMat
    );

    const basePos = new THREE.Vector3(x, y, z);
    mesh.position.copy(basePos);
    constellationGroup.add(mesh);

    nodes.push({
      mesh: mesh,
      basePos: basePos,
      currentPos: basePos.clone(),
      isAccent: isAccent,
      phase: i * 0.45,
      rotSpeed: 0.01 + ((i % 5) * 0.004)
    });
  }

  // Precompute connection pairs for nearby nodes (distance < 1.75)
  const linePairs = [];
  for (let i = 0; i < nodeCount; i++) {
    let connections = 0;
    for (let j = i + 1; j < nodeCount; j++) {
      if (nodes[i].basePos.distanceTo(nodes[j].basePos) < 1.75 && connections < 3) {
        linePairs.push({ a: i, b: j });
        connections++;
      }
    }
  }

  // Dynamic Line Segments Geometry
  const linePositions = new Float32Array(linePairs.length * 2 * 3);
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineSegments = new THREE.LineSegments(linesGeo, constellationLineMat);
  constellationGroup.add(lineSegments);

  // --------------------------------------------------------------------------
  // 7. DYNAMIC THEME SYSTEM (Synchronized with html.dark)
  // --------------------------------------------------------------------------
  window.updateThreeTheme = function () {
    const isDark = document.documentElement.classList.contains('dark');

    // Outer Core
    outerLineMat.color.setHex(isDark ? 0xEAE8E1 : 0x0A0A0A);
    outerFacetMat.color.setHex(isDark ? 0x222222 : 0xD5D3CB);
    outerFacetMat.opacity = isDark ? 0.22 : 0.14;

    // Rings
    ringMat.color.setHex(isDark ? 0xCCCCCC : 0x222222);

    // Constellation
    nodeNormalMat.color.setHex(isDark ? 0xEAE8E1 : 0x0A0A0A);
    constellationLineMat.color.setHex(isDark ? 0x555555 : 0xCCCCCC);
    constellationLineMat.opacity = isDark ? 0.55 : 0.45;

    // Ambient illumination
    ambientLight.intensity = isDark ? 0.95 : 0.85;
  };

  // --------------------------------------------------------------------------
  // 8. INTERACTION STATE & SCROLL DYNAMICS
  // --------------------------------------------------------------------------
  let expansionFactor = 1.0;
  let targetExpansion = 1.0;
  let scrollExpansion = 0.0;
  let burstFactor = 1.0;

  let isHovered = false;
  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };
  let targetRotation = { x: 0.25, y: 0.45 };

  // Scroll-linked expansion hook (called by GSAP ScrollTrigger in js/main.js)
  window.setMatrixScrollExplosion = function (progress) {
    if (typeof progress === 'number') {
      // Smoothly expand network as hero scrolls out
      scrollExpansion = Math.max(0, Math.min(1.5, progress)) * 0.95;
    }
  };

  // Fallback scroll tracker if ScrollTrigger isn't active
  function onScroll() {
    if (!isCanvasInView) return;
    const hero = container.closest('.hero-split') || container;
    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;
    const progress = Math.max(0, Math.min(1.2, -rect.top / heroHeight));
    scrollExpansion = progress * 0.95;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mouse Hover Interactions
  container.addEventListener('mouseenter', () => {
    isHovered = true;
    targetExpansion = 1.35;
  }, { passive: true });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    isDragging = false;
    targetExpansion = 1.0;
  }, { passive: true });

  // Mouse Drag Interactions
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevPointer = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      rootGroup.rotation.y += dx * 0.007;
      rootGroup.rotation.x += dy * 0.007;
      prevPointer = { x: e.clientX, y: e.clientY };
    } else if (isHovered) {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        targetRotation.y = 0.45 + nx * 0.35;
        targetRotation.x = 0.25 - ny * 0.25;
      }
    }
  }, { passive: true });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      targetExpansion = targetExpansion <= 1.1 ? 1.4 : 1.0;
      prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - prevPointer.x;
      const dy = e.touches[0].clientY - prevPointer.y;
      rootGroup.rotation.y += dx * 0.008;
      rootGroup.rotation.x += dy * 0.008;
      prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Global trigger for CLI matrix command and button pulses
  window.explodeMatrix = function (factor) {
    if (typeof factor === 'number') {
      burstFactor = factor;
    } else {
      burstFactor = (burstFactor > 1.2) ? 1.0 : 1.85;
    }
    return burstFactor;
  };

  // --------------------------------------------------------------------------
  // 9. RESPONSIVE RESIZE
  // --------------------------------------------------------------------------
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener('resize', onResize, { passive: true });

  // --------------------------------------------------------------------------
  // 10. 60FPS RENDER LOOP (with IntersectionObserver Pausing)
  // --------------------------------------------------------------------------
  let animationFrameId = null;
  let isCanvasInView = true;

  function renderLoop(now) {
    animationFrameId = requestAnimationFrame(renderLoop);

    // 1. Damped continuous rotation & parallax
    if (!isDragging) {
      rootGroup.rotation.y += (targetRotation.y - rootGroup.rotation.y) * 0.05 + 0.0025;
      rootGroup.rotation.x += (targetRotation.x - rootGroup.rotation.x) * 0.05;
    }

    // 2. Gyroscopic rings dual counter-rotation
    const speedBoost = 1.0 + scrollExpansion * 1.6;
    ring1Mesh.rotation.z += 0.008 * speedBoost;
    ring2Mesh.rotation.z -= 0.006 * speedBoost;

    // 3. Inner core counter-rotation & subtle pulse
    innerLineMesh.rotation.y -= 0.007;
    innerLineMesh.rotation.x += 0.003;
    outerLineMesh.rotation.y += 0.002;

    const corePulse = 1.0 + Math.sin(now * 0.002) * 0.035;
    coreGroup.scale.setScalar(corePulse);

    // 4. Expansion factor interpolation (Hover + Burst + Scroll)
    const effectiveTarget = (isHovered ? 1.35 : targetExpansion) * burstFactor + scrollExpansion;
    expansionFactor += (effectiveTarget - expansionFactor) * 0.08;

    // Smoothly decay burst back to baseline
    if (burstFactor > 1.0) {
      burstFactor += (1.0 - burstFactor) * 0.04;
    }

    // 5. Expand Gyroscopic Rings slightly with network expansion
    const ringScale = 1.0 + (expansionFactor - 1.0) * 0.28;
    ringsGroup.scale.setScalar(ringScale);

    // 6. Expand & Animate Constellation Nodes
    const posAttr = linesGeo.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < nodeCount; i++) {
      const node = nodes[i];
      // Expand radially outward from center
      node.currentPos.copy(node.basePos).multiplyScalar(expansionFactor);

      // Subtle biological/data floating drift
      const driftY = Math.sin(now * 0.0016 + node.phase) * 0.07;
      const driftX = Math.cos(now * 0.0012 + node.phase) * 0.04;
      node.currentPos.y += driftY;
      node.currentPos.x += driftX;

      node.mesh.position.copy(node.currentPos);
      node.mesh.rotation.x += node.rotSpeed;
      node.mesh.rotation.y += node.rotSpeed * 1.2;
    }

    // 7. Update Hairline Connection Segments Buffer
    let ptr = 0;
    for (let k = 0; k < linePairs.length; k++) {
      const p1 = nodes[linePairs[k].a].currentPos;
      const p2 = nodes[linePairs[k].b].currentPos;

      array[ptr++] = p1.x;
      array[ptr++] = p1.y;
      array[ptr++] = p1.z;

      array[ptr++] = p2.x;
      array[ptr++] = p2.y;
      array[ptr++] = p2.z;
    }
    posAttr.needsUpdate = true;

    // 8. Render Frame
    renderer.render(scene, camera);
  }

  function startLoop() {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function stopLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Freeze render loop automatically whenever canvas leaves viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isCanvasInView = entry.isIntersecting;
        if (isCanvasInView) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.02 });

    observer.observe(canvas);
  } else {
    startLoop();
  }

  // Initial trigger & size check
  onResize();
  startLoop();

})();
