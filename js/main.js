/**
 * CodeCraft Society — Main Application Script (60FPS Optimized)
 * ITM University, Gwalior
 * Swiss Editorial / Architectural Brutalist Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER SYNC (60FPS NO-STUTTER)
  // =========================================================================
  let lenis = null;
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgressBar(progressVal) {
    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${progressVal})`;
    }
  }

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Update scroll progress bar on Lenis scroll tick
    lenis.on('scroll', ({ progress }) => {
      updateScrollProgressBar(progress);
    });

    // Synchronize with GSAP ScrollTrigger if present
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } else {
    // Native fallback
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTotal > 0 ? window.scrollY / scrollTotal : 0;
      updateScrollProgressBar(progress);
    }, { passive: true });
  }

  // Helper function for smooth scrolling via Lenis or fallback
  function smoothScrollTo(target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.0 });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // =========================================================================
  // 2. THEME TOGGLE (PAPER MODE vs INK DARK MODE)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeNameSpan = document.getElementById('theme-name');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('codecraft-theme');
  if (savedTheme === 'ink') {
    htmlEl.classList.add('dark');
    if (themeNameSpan) themeNameSpan.textContent = 'INK';
  } else {
    htmlEl.classList.remove('dark');
    if (themeNameSpan) themeNameSpan.textContent = 'PAPER';
  }

  function toggleTheme() {
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    localStorage.setItem('codecraft-theme', isDark ? 'ink' : 'paper');
    if (themeNameSpan) {
      themeNameSpan.textContent = isDark ? 'INK' : 'PAPER';
    }
    if (typeof window.updateThreeTheme === 'function') {
      window.updateThreeTheme();
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // =========================================================================
  // 3. MOBILE MENU DRAWER (#mobile-menu-btn & #mobile-drawer)
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  function toggleMobileMenu() {
    if (!mobileDrawer) return;
    const isHidden = mobileDrawer.classList.contains('hidden');
    if (isHidden) {
      mobileDrawer.classList.remove('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      mobileDrawer.classList.add('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Auto-close mobile drawer when any link is clicked
  document.querySelectorAll('#mobile-drawer a, .mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
        toggleMobileMenu();
      }
    });
  });

  // =========================================================================
  // 4. EVENT CATEGORY FILTER TABS (.filter-tab on #events-grid)
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const eventCards = document.querySelectorAll('.event-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      eventCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      // Notify ScrollTrigger of height changes
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // =========================================================================
  // 4B. EXPLORE HUB TABS & SHOWCASE FILTER (about.html)
  // =========================================================================
  const exploreTabs = document.querySelectorAll('.explore-tab');
  const explorePanes = document.querySelectorAll('.explore-pane');

  exploreTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      exploreTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetPaneId = tab.getAttribute('data-target-pane');
      explorePanes.forEach((pane) => {
        if (pane.id === targetPaneId) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  const showcaseFilterBtns = document.querySelectorAll('.showcase-filter-btn');
  const showcaseCards = document.querySelectorAll('.showcase-card');

  showcaseFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showcaseFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-showcase-filter');
      showcaseCards.forEach((card) => {
        const cats = (card.getAttribute('data-showcase-category') || '').split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // =========================================================================
  // 5. STAT COUNTERS (.counter-number via GSAP ScrollTrigger)
  // =========================================================================
  const statsSection = document.getElementById('stats');
  const counterElements = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  function triggerCountUpAnimation() {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (typeof gsap !== 'undefined') {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(obj.val);
          },
          onComplete: () => {
            el.textContent = target;
          }
        });
      } else {
        // Fallback step count
        let current = 0;
        const step = () => {
          current += Math.ceil(target / 30);
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = current;
            requestAnimationFrame(step);
          }
        };
        step();
      }
    });
  }

  if (typeof ScrollTrigger !== 'undefined' && statsSection) {
    ScrollTrigger.create({
      trigger: statsSection,
      start: 'top 85%',
      once: true,
      onEnter: triggerCountUpAnimation
    });
  } else if ('IntersectionObserver' in window && statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        triggerCountUpAnimation();
        statsObserver.disconnect();
      }
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  } else {
    triggerCountUpAnimation();
  }

  // =========================================================================
  // 5B. SIGNATURE 60FPS SWISS EDITORIAL SCROLL ANIMATIONS (GSAP + SCROLLTRIGGER)
  // =========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // 1. Kinetic Hero Split Headline (index.html)
    const heroSection = document.querySelector('.hero-split');
    const heroLeft = document.querySelector('.hero-split-left');
    const heroRight = document.querySelector('.hero-split-right');

    if (heroSection && heroLeft && heroRight) {
      gsap.to(heroLeft, {
        x: -40,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.to(heroRight, {
        x: 40,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    // 2. Scroll-Expanding 3D Cyber-Architecture Core & Node Mesh via ScrollTrigger (index.html)
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          if (typeof window.setMatrixScrollExplosion === 'function') {
            window.setMatrixScrollExplosion(self.progress);
          }
        }
      });
    }

    // 3. Sticky 3D Stacking Domain Cards (#domains)
    const domainCards = document.querySelectorAll('#domains .domain-card');
    if (domainCards.length > 1 && window.innerWidth >= 1024) {
      domainCards.forEach((card, i) => {
        if (i < domainCards.length - 1) {
          const nextCard = domainCards[i + 1];
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.75,
            ease: 'none',
            force3D: true,
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 240px',
              end: 'top 120px',
              scrub: true
            }
          });
        }
      });
    }

    // 4. Clip-Path Portal Reveal (#stats)
    if (statsSection) {
      gsap.fromTo(statsSection,
        { clipPath: 'inset(0% 5% 0% 5%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power1.out',
          force3D: true,
          scrollTrigger: {
            trigger: statsSection,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 0.5
          }
        }
      );
    }

    // 5. Masked Heading Reveals & Staggered Entrance (index.html & about.html)
    const revealSelectors = [
      'main section h2',
      '#events-grid .event-card',
      '.timeline-item',
      '.showcase-card'
    ];

    revealSelectors.forEach((selector) => {
      const els = document.querySelectorAll(selector);
      if (!els.length) return;
      els.forEach((el) => {
        gsap.fromTo(el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true
            }
          }
        );
      });
    });

    // 6. Velocity Marquee Acceleration via Lenis scroll callback
    const marqueeTrack = document.querySelector('.marquee-track');
    if (lenis && marqueeTrack) {
      lenis.on('scroll', (e) => {
        const vel = Math.max(-12, Math.min(12, e.velocity || 0));
        gsap.to(marqueeTrack, {
          x: `+=${vel * 2.5}`,
          skewX: vel * 0.12,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto',
          force3D: true
        });
      });
    }

    // 7. Refresh ScrollTrigger when web fonts are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }

  // =========================================================================
  // 6. REGISTRATION / JOIN CLUB MODAL (#registration-modal)
  // =========================================================================
  const regModal = document.getElementById('registration-modal');
  const closeRegModalBtn = document.getElementById('close-reg-modal-btn');
  const regForm = document.getElementById('registration-form');
  const regFormContainer = document.getElementById('registration-form-container');
  const regTicketState = document.getElementById('registration-ticket-state');
  const regTargetSelect = document.getElementById('reg-target');

  const heroJoinBtn = document.getElementById('hero-join-btn');
  const ctaJoinBtn = document.getElementById('cta-join-btn');
  const mobileJoinBtn = document.getElementById('mobile-join-btn');
  const aboutHeroJoinBtn = document.getElementById('about-hero-join-btn');
  const contactJoinBtn = document.getElementById('contact-join-btn');

  function openRegistrationModal(preselectedEvent) {
    if (!regModal) return;

    if (preselectedEvent && regTargetSelect) {
      let matched = false;
      for (let i = 0; i < regTargetSelect.options.length; i++) {
        if (regTargetSelect.options[i].value.toLowerCase().includes(preselectedEvent.toLowerCase())) {
          regTargetSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        regTargetSelect.value = preselectedEvent;
      }
    }

    if (regFormContainer) regFormContainer.classList.remove('hidden');
    if (regTicketState) regTicketState.classList.add('hidden');

    regModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const firstInput = document.getElementById('reg-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  }

  function closeRegistrationModal() {
    if (!regModal) return;
    regModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (heroJoinBtn) heroJoinBtn.addEventListener('click', () => openRegistrationModal());
  if (ctaJoinBtn) ctaJoinBtn.addEventListener('click', () => openRegistrationModal());
  if (aboutHeroJoinBtn) aboutHeroJoinBtn.addEventListener('click', () => openRegistrationModal());
  if (contactJoinBtn) contactJoinBtn.addEventListener('click', () => openRegistrationModal());
  if (mobileJoinBtn) {
    mobileJoinBtn.addEventListener('click', () => {
      toggleMobileMenu();
      openRegistrationModal();
    });
  }

  // Event card registration buttons
  document.querySelectorAll('.register-event-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const title = e.currentTarget.getAttribute('data-event-title');
      openRegistrationModal(title);
    });
  });

  // Domain card registration buttons
  document.querySelectorAll('.join-domain-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const domain = e.currentTarget.getAttribute('data-domain-name');
      openRegistrationModal(`Domain: ${domain}`);
    });
  });

  if (closeRegModalBtn) closeRegModalBtn.addEventListener('click', closeRegistrationModal);

  if (regModal) {
    regModal.addEventListener('click', (e) => {
      if (e.target === regModal) closeRegistrationModal();
    });
  }

  // Handle Form Submission -> Generates Architectural Ticket Pass
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value.trim();
      const roll = document.getElementById('reg-roll').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const branch = document.getElementById('reg-branch').value;
      const year = document.getElementById('reg-year').value;
      const target = document.getElementById('reg-target').value;

      const holderNameEl = document.getElementById('ticket-holder-name');
      const holderPrnEl = document.getElementById('ticket-holder-prn');
      const holderBranchEl = document.getElementById('ticket-holder-branch');
      const ticketEventEl = document.getElementById('ticket-event-name');
      const ticketPassIdEl = document.getElementById('ticket-pass-id');

      const passNumber = Math.floor(1000 + Math.random() * 9000);
      const generatedPassId = `CC-2026-${passNumber}`;

      const now = new Date();
      const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

      if (holderNameEl) holderNameEl.textContent = name.toUpperCase();
      if (holderPrnEl) holderPrnEl.textContent = roll.toUpperCase();
      if (holderBranchEl) holderBranchEl.textContent = `${branch} (${year})`;
      if (ticketEventEl) ticketEventEl.textContent = target;
      if (ticketPassIdEl) ticketPassIdEl.textContent = `${generatedPassId} // ${timeString}`;

      if (regFormContainer) regFormContainer.classList.add('hidden');
      if (regTicketState) regTicketState.classList.remove('hidden');

      playMechanicalClick(650);
    });
  }

  const copyTicketBtn = document.getElementById('copy-ticket-id-btn');
  if (copyTicketBtn) {
    copyTicketBtn.addEventListener('click', () => {
      const ticketPassIdEl = document.getElementById('ticket-pass-id');
      const passText = ticketPassIdEl ? ticketPassIdEl.textContent.split('//')[0].trim() : 'CC-2026';
      navigator.clipboard.writeText(passText).then(() => {
        copyTicketBtn.textContent = 'COPIED!';
        setTimeout(() => {
          copyTicketBtn.textContent = 'COPY PASS ID';
        }, 1800);
      });
    });
  }

  const doneTicketBtn = document.getElementById('done-ticket-btn');
  if (doneTicketBtn) {
    doneTicketBtn.addEventListener('click', () => {
      closeRegistrationModal();
      if (regForm) regForm.reset();
    });
  }

  // =========================================================================
  // 7. HARDWARE CLI MODAL (#cli-modal, Ctrl+K)
  // =========================================================================
  const cliModal = document.getElementById('cli-modal');
  const cliInput = document.getElementById('cli-input');
  const cliScreen = document.getElementById('cli-screen');
  const headerCliBtn = document.getElementById('header-cli-btn');
  const heroCliTrigger = document.getElementById('hero-cli-trigger');
  const heroTerminalCliBtn = document.getElementById('hero-terminal-cli-btn');
  const aboutHeroCliBtn = document.getElementById('about-hero-cli-btn');
  const footerCliBtn = document.getElementById('footer-cli-btn');
  const mobileCliBtn = document.getElementById('mobile-cli-btn');
  const closeCliModalBtn = document.getElementById('close-cli-modal-btn');
  const soundStatusEl = document.getElementById('sound-status');
  const cliSoundToggle = document.getElementById('cli-sound-toggle');

  let audioClicksEnabled = true;
  let audioCtx = null;

  function playMechanicalClick(freq = 520) {
    if (!audioClicksEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch (e) {
      // AudioContext unavailable
    }
  }

  if (cliSoundToggle) {
    cliSoundToggle.addEventListener('click', () => {
      audioClicksEnabled = !audioClicksEnabled;
      if (soundStatusEl) soundStatusEl.textContent = audioClicksEnabled ? 'ON' : 'OFF';
      playMechanicalClick(750);
    });
  }

  function openCliModal() {
    if (!cliModal) return;
    cliModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playMechanicalClick(440);
    if (cliInput) {
      setTimeout(() => {
        cliInput.focus();
        cliInput.select();
      }, 60);
    }
  }

  function closeCliModal() {
    if (!cliModal) return;
    cliModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (headerCliBtn) headerCliBtn.addEventListener('click', openCliModal);
  if (heroCliTrigger) heroCliTrigger.addEventListener('click', openCliModal);
  if (heroTerminalCliBtn) heroTerminalCliBtn.addEventListener('click', openCliModal);
  if (aboutHeroCliBtn) aboutHeroCliBtn.addEventListener('click', openCliModal);
  if (footerCliBtn) footerCliBtn.addEventListener('click', openCliModal);
  if (mobileCliBtn) {
    mobileCliBtn.addEventListener('click', () => {
      toggleMobileMenu();
      openCliModal();
    });
  }
  if (closeCliModalBtn) closeCliModalBtn.addEventListener('click', closeCliModal);

  if (cliModal) {
    cliModal.addEventListener('click', (e) => {
      if (e.target === cliModal) closeCliModal();
    });
  }

  // Ctrl+K / Cmd+K and Esc Key listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cliModal && cliModal.classList.contains('active')) {
        closeCliModal();
      } else {
        openCliModal();
      }
    }
    if (e.key === 'Escape') {
      if (cliModal && cliModal.classList.contains('active')) closeCliModal();
      if (regModal && regModal.classList.contains('active')) closeRegistrationModal();
    }
  });

  const commandHistory = [];
  let historyIndex = -1;

  function appendCliOutput(html) {
    if (!cliScreen) return;
    const entry = document.createElement('div');
    entry.className = 'cli-log-entry';
    entry.innerHTML = html;
    cliScreen.appendChild(entry);
    cliScreen.scrollTop = cliScreen.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m]));
  }

  function executeCliCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    appendCliOutput(`<div class="text-white"><span class="text-[#FF4D00]">user@codecraft:~$</span> ${escapeHtml(cmdRaw)}</div>`);
    playMechanicalClick(600);

    switch (cmd) {
      case 'help':
        appendCliOutput(`
          <div class="text-[#A3A3A3] space-y-1 my-1">
            <div class="text-[#00FF66] font-bold">AVAILABLE COMMANDS:</div>
            <div><strong class="text-white">home</strong>      - Navigate to Home Base (index.html)</div>
            <div><strong class="text-white">events</strong>    - Jump to calendar & sprint tournaments</div>
            <div><strong class="text-white">domains</strong>   - Jump to 7 specialized technical domains</div>
            <div><strong class="text-white">stats</strong>     - Jump to telemetry metrics & council wins</div>
            <div><strong class="text-white">join</strong>      - Open registration gate for events & cohort 2026</div>
            <div><strong class="text-white">mode</strong>      - Switch between PAPER and INK dark mode</div>
            <div><strong class="text-white">matrix</strong>    - Trigger 3D Cyber-Architecture Core & Node Mesh burst</div>
            <div><strong class="text-white">about</strong>     - Navigate to About & Explore (about.html)</div>
            <div><strong class="text-white">clear</strong>     - Clear terminal buffer</div>
            <div><strong class="text-white">exit</strong>      - Close hardware terminal</div>
          </div>
        `);
        break;

      case 'home':
      case 'index':
        appendCliOutput('<div class="text-[#00FF66]">Navigating to Home Base (index.html)...</div>');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 250);
        break;

      case 'events':
        const eventsSec = document.getElementById('events');
        if (eventsSec) {
          appendCliOutput('<div class="text-[#FF4D00]">Scrolling to Events Matrix...</div>');
          closeCliModal();
          smoothScrollTo('#events');
        } else {
          appendCliOutput('<div class="text-[#FF4D00]">Navigating to Events on Home Base...</div>');
          setTimeout(() => {
            window.location.href = 'index.html#events';
          }, 250);
        }
        break;

      case 'domains':
        const domainsSec = document.getElementById('domains');
        if (domainsSec) {
          appendCliOutput('<div class="text-[#00FF66]">Scrolling to Technical Domains...</div>');
          closeCliModal();
          smoothScrollTo('#domains');
        } else {
          appendCliOutput('<div class="text-[#00FF66]">Navigating to Domains on Home Base...</div>');
          setTimeout(() => {
            window.location.href = 'index.html#domains';
          }, 250);
        }
        break;

      case 'stats':
        const statsSec = document.getElementById('stats');
        if (statsSec) {
          appendCliOutput('<div class="text-[#FF4D00]">Scrolling to Telemetry Stats...</div>');
          closeCliModal();
          smoothScrollTo('#stats');
        } else {
          appendCliOutput('<div class="text-[#FF4D00]">Navigating to Stats on Home Base...</div>');
          setTimeout(() => {
            window.location.href = 'index.html#stats';
          }, 250);
        }
        break;

      case 'join':
      case 'register':
        appendCliOutput('<div class="text-[#00FF66]">Opening Registration Gateway...</div>');
        closeCliModal();
        openRegistrationModal();
        break;

      case 'mode':
        toggleTheme();
        const mode = htmlEl.classList.contains('dark') ? 'INK (Dark)' : 'PAPER (Light)';
        appendCliOutput(`<div class="text-[#00FF66]">Theme switched to: <strong class="text-white">${mode}</strong></div>`);
        break;

      case 'matrix':
        if (typeof window.explodeMatrix === 'function') {
          const factor = window.explodeMatrix();
          appendCliOutput(`<div class="text-[#FF4D00]">Neural Core & Node Mesh dispersion: ${factor.toFixed(2)}x</div>`);
        } else {
          appendCliOutput('<div class="text-yellow-400">3D Cyber-Architecture scene not initialized.</div>');
        }
        break;

      case 'about':
        appendCliOutput('<div class="text-[#00FF66]">Navigating to about.html...</div>');
        setTimeout(() => {
          window.location.href = 'about.html';
        }, 300);
        break;

      case 'clear':
        if (cliScreen) {
          cliScreen.innerHTML = `
            <div class="text-[#FF4D00] font-bold">
              CODECRAFT SOCIETY TERMINAL // BUFFER CLEARED
            </div>
          `;
        }
        break;

      case 'exit':
      case 'quit':
      case 'close':
        closeCliModal();
        break;

      default:
        appendCliOutput(`
          <div class="text-red-400">
            command not found: '${escapeHtml(cmdRaw)}'. Type <span class="text-[#00FF66] font-bold">'help'</span> for reference.
          </div>
        `);
        break;
    }
  }

  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value;
        cliInput.value = '';
        executeCliCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          cliInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          cliInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          cliInput.value = '';
        }
      }
    });
  }

  // Clickable CLI Chips
  document.querySelectorAll('.cli-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCliCommand(cmd);
        if (cliInput) cliInput.focus();
      }
    });
  });

  // =========================================================================
  // 8. BACK TO TOP BUTTON (#back-to-top-btn) & LIVE CLOCK (#footer-utc-clock)
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      smoothScrollTo(0);
    });
  }

  const footerUtcClock = document.getElementById('footer-utc-clock');
  function updateLiveClock() {
    if (!footerUtcClock) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    footerUtcClock.textContent = `${timeStr} IST`;
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

});
