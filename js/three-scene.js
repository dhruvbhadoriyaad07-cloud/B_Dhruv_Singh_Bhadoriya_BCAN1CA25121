/**
 * CodeCraft Society — 60FPS Three.js 3x3x3 Exploding Cube Matrix
 * Architectural Brutalist Interactive Sculpture (ITM University, Gwalior)
 * Optimized with IntersectionObserver pausing and zero shadow pass overhead.
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

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
  );
  camera.position.set(5.2, 4.2, 6.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });

  // Strict performance rules: Cap pixel ratio to 1.5 max, disable shadows
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.shadowMap.enabled = false;

  // 2. Optimized Lighting (Direct + Ambient, no shadow computing)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(8, 12, 8);
  scene.add(keyLight);

  const orangeAccentLight = new THREE.DirectionalLight(0xff4d00, 0.7);
  orangeAccentLight.position.set(-8, -6, -8);
  scene.add(orangeAccentLight);

  // Group for the 3x3x3 matrix
  const matrixGroup = new THREE.Group();
  scene.add(matrixGroup);

  // 3. Materials System (Matte Obsidian, Brushed Metallic Light Gray, 3-4 Signal Orange)
  const isDarkInitial = document.documentElement.classList.contains('dark');

  // Shared geometry for all 27 cubes
  const cubeGeometry = new THREE.BoxGeometry(0.85, 0.85, 0.85);
  const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);

  // Palette Materials
  const matObsidian = new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    roughness: 0.35,
    metalness: 0.15,
    flatShading: true
  });

  const matMetallicGray = new THREE.MeshStandardMaterial({
    color: 0xC6C4BD,
    roughness: 0.25,
    metalness: 0.55,
    flatShading: true
  });

  const matSignalOrange = new THREE.MeshStandardMaterial({
    color: 0xFF4D00,
    roughness: 0.2,
    metalness: 0.2,
    flatShading: true
  });

  // Wireframe Line Materials
  const lineDark = new THREE.LineBasicMaterial({ color: isDarkInitial ? 0x444444 : 0x0A0A0A, linewidth: 1.5 });
  const lineLight = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 1.5 });
  const lineOrange = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 1.5 });

  // 4. Assemble 27 Cubes (3x3x3 Grid)
  const cubes = [];
  const spacing = 1.05;

  // Coordinates designated for Signal Orange (#FF4D00) accent
  function isAccentCube(x, y, z) {
    return (
      (x === 0 && y === 0 && z === 0) || // Center core
      (x === 1 && y === 1 && z === 1) || // Top-front corner
      (x === -1 && y === 0 && z === 1) || // Left-front mid
      (x === 1 && y === -1 && z === -1)   // Bottom-back corner
    );
  }

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        let mat = matMetallicGray;
        let lineMat = lineDark;
        const isAccent = isAccentCube(x, y, z);

        if (isAccent) {
          mat = matSignalOrange;
          lineMat = lineOrange;
        } else if ((x + y + z) % 2 === 0) {
          mat = matObsidian;
          lineMat = lineLight;
        } else {
          mat = matMetallicGray;
          lineMat = lineDark;
        }

        const mesh = new THREE.Mesh(cubeGeometry, mat);
        const line = new THREE.LineSegments(edgesGeometry, lineMat);
        mesh.add(line);

        const basePos = new THREE.Vector3(x * spacing, y * spacing, z * spacing);
        mesh.position.copy(basePos);
        matrixGroup.add(mesh);

        cubes.push({
          mesh: mesh,
          line: line,
          basePos: basePos.clone(),
          currentPos: basePos.clone(),
          isAccent: isAccent,
          isCenter: (x === 0 && y === 0 && z === 0)
        });
      }
    }
  }

  // 5. Dynamic Theme Support
  window.updateThreeTheme = function () {
    const isDark = document.documentElement.classList.contains('dark');
    const defaultWire = isDark ? 0x555555 : 0x0A0A0A;
    cubes.forEach((item) => {
      if (!item.isAccent) {
        item.line.material.color.setHex(defaultWire);
      }
    });
  };

  // 6. Interaction State
  let explosionFactor = 1.0;
  let targetExplosion = 1.0;
  let scrollExplosion = 0.0;
  let isHovered = false;
  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };
  let targetRotation = { x: 0.35, y: 0.65 };

  // Scroll-linked explosion: track hero section scroll progress
  function updateScrollExplosion() {
    if (!isCanvasInView) return;
    const hero = container.closest('.hero-split') || container;
    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;
    const progress = Math.max(0, Math.min(1.2, -rect.top / heroHeight));
    scrollExplosion = progress * 1.6;
  }
  window.addEventListener('scroll', updateScrollExplosion, { passive: true });

  window.setMatrixScrollExplosion = function (progress) {
    if (typeof progress === 'number') {
      scrollExplosion = Math.max(0, Math.min(1.5, progress)) * 1.6;
    }
  };

  container.addEventListener('mouseenter', () => {
    isHovered = true;
    targetExplosion = 1.7;
  }, { passive: true });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    isDragging = false;
    targetExplosion = 1.0;
  }, { passive: true });

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
      matrixGroup.rotation.y += dx * 0.007;
      matrixGroup.rotation.x += dy * 0.007;
      prevPointer = { x: e.clientX, y: e.clientY };
    } else if (isHovered) {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        targetRotation.y = 0.65 + nx * 0.35;
        targetRotation.x = 0.35 - ny * 0.25;
      }
    }
  }, { passive: true });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      targetExplosion = targetExplosion <= 1.1 ? 1.75 : 1.0;
      prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - prevPointer.x;
      const dy = e.touches[0].clientY - prevPointer.y;
      matrixGroup.rotation.y += dx * 0.009;
      matrixGroup.rotation.x += dy * 0.009;
      prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Global trigger for CLI and buttons
  window.explodeMatrix = function (factor) {
    if (typeof factor === 'number') {
      targetExplosion = factor;
    } else {
      targetExplosion = targetExplosion > 1.2 ? 1.0 : 2.1;
    }
    return targetExplosion;
  };

  // 7. Responsive Resize
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener('resize', onResize, { passive: true });

  // 8. 60FPS Render Loop with IntersectionObserver Pausing
  let animationFrameId = null;
  let isCanvasInView = true;
  let lastTime = performance.now();

  function renderLoop(now) {
    animationFrameId = requestAnimationFrame(renderLoop);

    const delta = (now - lastTime) * 0.001;
    lastTime = now;

    // Smooth rotation lerp
    if (!isDragging) {
      matrixGroup.rotation.y += (targetRotation.y - matrixGroup.rotation.y) * 0.06 + 0.003;
      matrixGroup.rotation.x += (targetRotation.x - matrixGroup.rotation.x) * 0.06;
    }

    // Explosion dispersion lerp (combines hover, drag, and scroll-linked dispersion)
    const effectiveTarget = (isHovered ? 1.7 : targetExplosion) + scrollExplosion;
    explosionFactor += (effectiveTarget - explosionFactor) * 0.1;

    // Position updates and individual tumbling rotation on dispersion
    const dispersionDelta = Math.max(0, explosionFactor - 1.0);
    for (let i = 0; i < cubes.length; i++) {
      const c = cubes[i];
      if (c.isCenter) {
        c.mesh.position.y = Math.sin(now * 0.002) * 0.04;
      } else {
        const targetPos = c.basePos.clone().multiplyScalar(explosionFactor);
        c.mesh.position.lerp(targetPos, 0.14);

        // Smooth individual tumbling rotation that resets cleanly when reassembled
        const rotAmount = dispersionDelta * 0.35;
        c.mesh.rotation.x = c.basePos.x * rotAmount;
        c.mesh.rotation.y = c.basePos.y * rotAmount;
        c.mesh.rotation.z = c.basePos.z * rotAmount;
      }
    }

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (!animationFrameId) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function stopLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // IntersectionObserver to freeze Three.js when scrolled out of view
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

  // Initial render
  onResize();
  startLoop();

})();
