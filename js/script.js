/**
 * UNIITED SECURITY FORCE - Official Site Scripts
 * Handles mobile drawer navigation, sticky header scroll effects,
 * active link highlighting, and contact form interactions.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle & Backdrop
  const hamburgerIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const closeIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (toggleBtn && mobileDrawer) {
    // Inject Backdrop Dimmer if not present
    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    function setDrawerState(open) {
      if (open) {
        mobileDrawer.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.innerHTML = closeIcon;
        navBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = hamburgerIcon;
        navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const willOpen = !mobileDrawer.classList.contains('open');
      setDrawerState(willOpen);
    });

    // Close when tapping the dimmed backdrop
    navBackdrop.addEventListener('click', function () {
      setDrawerState(false);
    });
    navBackdrop.addEventListener('touchend', function () {
      setDrawerState(false);
    }, { passive: true });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileDrawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        setDrawerState(false);
      }
    });

    // Close when clicking any nav link inside drawer
    mobileDrawer.querySelectorAll('.nav-link, .btn-nav-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        setDrawerState(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        setDrawerState(false);
      }
    });
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2b. Floating Quick-Connect Stack (Mobile Hero Fold Elegance)
  // Hide floating stack on mobile while on the initial hero fold of index.html
  // so the bottom USF Operations card is 100% clean and unobstructed.
  const floatingStack = document.querySelector('.floating-contact-stack');
  const heroCinematic = document.querySelector('.hero-cinematic');
  if (floatingStack && heroCinematic) {
    function updateFloatingVisibility() {
      if (window.innerWidth <= 768) {
        if (window.scrollY < 110) {
          floatingStack.classList.add('mobile-hero-hidden');
        } else {
          floatingStack.classList.remove('mobile-hero-hidden');
        }
      } else {
        floatingStack.classList.remove('mobile-hero-hidden');
      }
    }
    window.addEventListener('scroll', updateFloatingVisibility, { passive: true });
    window.addEventListener('resize', updateFloatingVisibility, { passive: true });
    updateFloatingVisibility();
  }

  // 3. Highlight Active Page Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Contact / Quote Form Handler -> WhatsApp Integration (+91 90421 72141)
  const contactForm = document.querySelector('.contact-form-panel form');
  const feedbackMsg = document.querySelector('.form-feedback-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const orgName = (document.getElementById('orgName')?.value || '').trim();
      const phone = (document.getElementById('phone')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();

      const serviceSelect = document.getElementById('serviceType');
      const serviceText = serviceSelect && serviceSelect.selectedIndex >= 0 && serviceSelect.options[serviceSelect.selectedIndex].value
        ? serviceSelect.options[serviceSelect.selectedIndex].text.trim()
        : 'Not Specified';

      const sectorSelect = document.getElementById('sector');
      const sectorText = sectorSelect && sectorSelect.selectedIndex >= 0 && sectorSelect.options[sectorSelect.selectedIndex].value
        ? sectorSelect.options[sectorSelect.selectedIndex].text.trim()
        : 'Not Specified';

      const siteLocation = (document.getElementById('siteLocation')?.value || '').trim();
      const message = (document.getElementById('message')?.value || '').trim();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span style="display:inline-flex; align-items:center; gap:6px;">Connecting to WhatsApp...</span>';

      // Build formatted WhatsApp message for +91 90421 72141
      const waNumber = '919042172141';
      let waMessage = 
        `🚨 *NEW SECURITY INQUIRY - USF WEBSITE*\n` +
        `*UNIITED SECURITY FORCE*\n\n` +
        `👤 *Client Name:* ${fullName}\n` +
        `🏢 *Organization:* ${orgName}\n` +
        `📞 *Direct Phone:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `🛡️ *Service Required:* ${serviceText}\n` +
        `🏭 *Industry / Sector:* ${sectorText}\n` +
        `📍 *Site Location:* ${siteLocation}\n`;

      if (message) {
        waMessage += `📝 *Requirements / Specifications:*\n${message}\n`;
      }
      waMessage += `\n_Inquiry routed via USF Official Web Portal_`;

      const whatsappUrl = 'https://api.whatsapp.com/send?phone=' + waNumber + '&text=' + encodeURIComponent(waMessage);

      // Open WhatsApp in a new tab / app
      const waWindow = window.open(whatsappUrl, '_blank');
      if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = '✓ Forwarded to WhatsApp';
      submitBtn.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
      submitBtn.style.color = '#FFFFFF';

      if (feedbackMsg) {
        feedbackMsg.style.display = 'block';
        feedbackMsg.innerHTML = 
          `<div style="background: rgba(37, 211, 102, 0.12); border: 1px solid rgba(37, 211, 102, 0.45); border-radius: 12px; padding: 18px 20px; color: #FFFFFF; margin-top: 18px;">` +
            `<div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: #25D366; margin-bottom: 6px;">` +
              `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.777-.876-2.052-.976-.275-.1-.475-.15-.676.15-.2.301-.776.976-.952 1.177-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.897-.8-1.503-1.789-1.68-2.09-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.375-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.109.15.2 2.122 3.24 5.141 4.542.719.31 1.28.495 1.718.635.722.23 1.378.197 1.897.12.577-.087 1.777-.726 2.027-1.428.251-.702.251-1.303.176-1.428-.075-.125-.276-.2-.577-.351zm-5.419 7.458c-1.802 0-3.567-.484-5.116-1.401l-.367-.218-3.801.996 1.014-3.705-.24-.382c-1.008-1.603-1.54-3.469-1.539-5.385.003-5.508 4.484-9.989 9.995-9.989 2.667.001 5.174 1.04 7.058 2.926 1.884 1.886 2.921 4.394 2.92 7.062-.003 5.509-4.484 9.99-9.924 9.99zM20.52 3.449C18.256 1.183 15.244-.002 12.049 0 5.461 0 .097 5.362.094 11.954c-.001 2.106.549 4.161 1.595 5.973L0 24l6.235-1.636a11.91 11.91 0 0 0 5.81 1.503h.005c6.586 0 11.95-5.364 11.954-11.956 0-3.195-1.245-6.199-3.484-8.462z"/></svg>` +
              `<span>Inquiry Forwarded to WhatsApp (+91 90421 72141)</span>` +
            `</div>` +
            `<p style="margin: 0 0 12px 0; font-size: 13.5px; color: #E2E8F0; line-height: 1.5;">` +
              `Thank you, <strong>${fullName}</strong>! Your inquiry details have been formatted for our Operations Director. If WhatsApp did not open automatically, click the button below to send your details directly:` +
            `</p>` +
            `<a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #09101D; font-weight: 700; padding: 9px 20px; border-radius: 9999px; text-decoration: none; font-size: 13px;">` +
              `Open in WhatsApp Chat &nbsp;→` +
            `</a>` +
          `</div>`;
      }

      contactForm.reset();

      setTimeout(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 8000);
    });
  }

  // 5. FAQ Accordion & Category Filter (about.html)
  const faqAccordion = document.getElementById('faqAccordion');
  if (faqAccordion) {
    const faqItems = faqAccordion.querySelectorAll('.faq-item');

    // Ensure all items start closed by default (clients must click to open)
    faqItems.forEach(function (item) {
      item.classList.remove('active');
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (questionBtn) questionBtn.setAttribute('aria-expanded', 'false');
      if (answer) answer.style.maxHeight = null;

      if (questionBtn && answer) {
        questionBtn.addEventListener('click', function () {
          const isActive = item.classList.contains('active');

          // Close all other items (strict accordion behavior)
          faqItems.forEach(function (otherItem) {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              const otherBtn = otherItem.querySelector('.faq-question');
              if (otherAnswer) otherAnswer.style.maxHeight = null;
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle clicked item
          if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
            questionBtn.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });

    // Category Filter Navigation (all items remain closed when switching categories)
    const filterBtns = document.querySelectorAll('.faq-filter-btn');
    if (filterBtns.length > 0) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const targetCategory = btn.getAttribute('data-category');

          filterBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          faqItems.forEach(function (item) {
            const itemCat = item.getAttribute('data-category');
            const answer = item.querySelector('.faq-answer');
            const questionBtn = item.querySelector('.faq-question');

            // Close any currently open item when filtering
            item.classList.remove('active');
            if (questionBtn) questionBtn.setAttribute('aria-expanded', 'false');
            if (answer) answer.style.maxHeight = null;

            if (targetCategory === 'all' || itemCat === targetCategory) {
              item.classList.remove('faq-hidden');
            } else {
              item.classList.add('faq-hidden');
            }
          });
        });
      });
    }
  }

  // 6. Horizontal Scroll Tracks with Continuous, Smooth Automatic Running & Infinite Loop
  function setupAutoHorizontalScroll(trackId, leftBtnSelector, rightBtnSelector, customSpeed) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const scrollLeftBtn = leftBtnSelector ? document.querySelector(leftBtnSelector) : null;
    const scrollRightBtn = rightBtnSelector ? document.querySelector(rightBtnSelector) : null;
    const baseSpeed = customSpeed || 0.85; // pixels per frame at 60fps

    function getScrollStep() {
      const firstItem = track.firstElementChild;
      if (firstItem) {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
        return firstItem.offsetWidth + gap;
      }
      return 340;
    }

    // Clone child items to create a continuous, seamless infinite loop
    const originalChildren = Array.from(track.children);
    if (originalChildren.length > 0) {
      originalChildren.forEach(function (child) {
        const clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    let isInteracting = false;
    let isHovered = false;
    let resumeTimeout = null;
    let startX = 0;
    let startScroll = 0;
    let scrollPos = track.scrollLeft || 0;
    let isVisible = true;

    // Detect if hover is supported by device
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    // On mouse enter: slow down gently rather than freezing, matching Eight Pillars
    if (canHover) {
      track.addEventListener('mouseenter', function () {
        isHovered = true;
      });
      track.addEventListener('mouseleave', function () {
        isHovered = false;
      });
    }

    // Manual navigation buttons (smooth scroll by step)
    function handleManualNav(direction) {
      isInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      const halfWidth = track.scrollWidth / 2;
      const step = getScrollStep();

      if (halfWidth > 0) {
        if (direction < 0 && track.scrollLeft < step) {
          track.scrollLeft += halfWidth;
          scrollPos = track.scrollLeft;
        } else if (direction > 0 && track.scrollLeft >= halfWidth - step) {
          track.scrollLeft -= halfWidth;
          scrollPos = track.scrollLeft;
        }
      }

      scrollPos = track.scrollLeft + direction * step;
      track.scrollTo({ left: scrollPos, behavior: 'smooth' });

      resumeTimeout = setTimeout(function () {
        scrollPos = track.scrollLeft;
        isInteracting = false;
      }, 650);
    }

    if (scrollLeftBtn) {
      scrollLeftBtn.addEventListener('click', function () {
        handleManualNav(-1);
      });
    }

    if (scrollRightBtn) {
      scrollRightBtn.addEventListener('click', function () {
        handleManualNav(1);
      });
    }

    // Keyboard navigation when track has focus
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleManualNav(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleManualNav(1);
      }
    });

    // Mouse drag to scroll
    track.addEventListener('mousedown', function (e) {
      isInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      startX = e.pageX - track.offsetLeft;
      startScroll = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', function () {
      if (isInteracting) {
        track.style.cursor = 'grab';
        scrollPos = track.scrollLeft;
        resumeTimeout = setTimeout(function () {
          isInteracting = false;
        }, 300);
      }
    });

    track.addEventListener('mousemove', function (e) {
      if (!isInteracting || track.style.cursor !== 'grabbing') return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = startScroll - walk;
      scrollPos = track.scrollLeft;
    });

    // Touch events for mobile / tablets (never locks up)
    track.addEventListener('touchstart', function () {
      isInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    }, { passive: true });

    track.addEventListener('touchend', function () {
      scrollPos = track.scrollLeft;
      resumeTimeout = setTimeout(function () {
        scrollPos = track.scrollLeft;
        isInteracting = false;
      }, 400);
    }, { passive: true });

    track.addEventListener('touchcancel', function () {
      scrollPos = track.scrollLeft;
      isInteracting = false;
    }, { passive: true });

    // Sync scrollPos on ANY native scroll (trackpad gestures, momentum, buttons, drag)
    track.addEventListener('scroll', function () {
      scrollPos = track.scrollLeft;
      if (!isInteracting) {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(function () {
          scrollPos = track.scrollLeft;
        }, 500);
      }
    }, { passive: true });

    // Trackpad horizontal swiping & shift+wheel handler
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        // User is intentionally scrolling horizontally
        isInteracting = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
        scrollPos = track.scrollLeft;
        resumeTimeout = setTimeout(function () {
          scrollPos = track.scrollLeft;
          isInteracting = false;
        }, 600);
      }
      // If vertical scroll (deltaY > deltaX), do not intercept so page vertical scroll remains fluid!
    }, { passive: true });

    // Run animation when track is in or near the viewport (generous 350px margin)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
        });
      }, { rootMargin: '350px 0px 350px 0px', threshold: 0 });
      observer.observe(track);
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Continuous Animation Loop
    let lastTime = performance.now();

    function autoScrollLoop(currentTime) {
      const deltaTime = Math.min(currentTime - lastTime, 40);
      lastTime = currentTime;

      if (!prefersReducedMotion && isVisible && !isInteracting) {
        const speedMultiplier = isHovered ? 0.35 : 1.0;
        const speed = (baseSpeed * speedMultiplier) * (deltaTime / 16.67);
        scrollPos += speed;

        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (scrollPos >= halfWidth) {
            scrollPos -= halfWidth;
            track.scrollLeft = scrollPos;
          } else if (scrollPos <= 0) {
            scrollPos += halfWidth;
            track.scrollLeft = scrollPos;
          } else {
            track.scrollLeft = scrollPos;
          }
        }
      }

      requestAnimationFrame(autoScrollLoop);
    }

    requestAnimationFrame(autoScrollLoop);
  }

  // 1. Home page: Sectors We Secure (slow running showcase)
  setupAutoHorizontalScroll('sectorsTrack', null, null, 0.75);

  // 3. Services: Environments We Secure (continuous running cards)
  setupAutoHorizontalScroll('environmentsTrack', '.scroll-left', '.scroll-right', 0.85);

  // 4. Home page: Trusted by Organizations (smooth client logo showcase)
  setupAutoHorizontalScroll('clientShowcaseTrack', '#clientPrevBtn', '#clientNextBtn', 0.85);

  // 7. Subtle Corporate Scroll-Reveal & Card Stagger System
  const gridContainers = document.querySelectorAll(
    '.vp-grid, .difference-zigzag-grid, .services-full-grid, .team-gallery-grid, .vm-grid, .why-grid, .horizontal-scroll-track, .client-showcase-track, .hero-actions'
  );
  gridContainers.forEach(function (grid) {
    grid.classList.add('stagger-parent');
  });

  const revealElements = document.querySelectorAll(
    '.glass-card:not(.faq-item), .vp-card, .difference-card, .why-card, .service-card-detailed, .team-card, .vm-card, .hero-stat-card, .section-header-centered, .section-header-split, .cta-box, .hero-trust-bar'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal-on-scroll');
  });

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(function () {
          el.classList.add('is-revealed');
        }, 80);
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  // Dedicated Section Entrance Stagger for Environments We Secure
  const envTrack = document.getElementById('environmentsTrack');
  if (envTrack && 'IntersectionObserver' in window) {
    const envSectionObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const cards = envTrack.querySelectorAll('.environment-card');
          cards.forEach(function (card, index) {
            setTimeout(function () {
              card.classList.add('is-revealed');
            }, Math.min(index, 8) * 55);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    envSectionObserver.observe(envTrack);
  }

  // Full-Size Image Lightbox Modal
  const lightboxTriggers = document.querySelectorAll('[data-full-src]');
  if (lightboxTriggers.length > 0) {
    let modal = document.querySelector('.image-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'image-lightbox-modal';
      modal.innerHTML = '<div class="image-lightbox-content"><button class="image-lightbox-close" aria-label="Close image">&times;</button><img src="" alt="Full size view"></div>';
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('.image-lightbox-close');
      const closeLightbox = function () {
        modal.classList.remove('is-active');
      };
      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeLightbox();
      });
    }

    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const fullSrc = this.getAttribute('data-full-src');
        if (fullSrc && modal) {
          const modalImg = modal.querySelector('img');
          if (modalImg) modalImg.src = fullSrc;
          modal.classList.add('is-active');
        }
      });
    });
  }

  // 9. Precision Spine Pinning for The Foundation of Our Excellence (about.html)
  // Connects Node 1 to Node 4 with a clean, subtle lead-in and lead-out extension at top and bottom
  function updateZigzagSpine() {
    const grid = document.querySelector('.difference-zigzag-grid');
    if (!grid) return;
    const dots = grid.querySelectorAll('.zigzag-node-dot');
    if (dots.length < 2) return;
    const firstDot = dots[0];
    const lastDot = dots[dots.length - 1];
    const gridRect = grid.getBoundingClientRect();
    const firstRect = firstDot.getBoundingClientRect();
    const lastRect = lastDot.getBoundingClientRect();

    if (gridRect.height <= 0) return;
    const isMobile = window.innerWidth <= 768;
    const ext = isMobile ? 22 : 28;
    const topOffset = Math.max(0, (firstRect.top + firstRect.height / 2) - gridRect.top - ext);
    const bottomOffset = (lastRect.top + lastRect.height / 2) - gridRect.top + ext;
    const height = Math.max(0, bottomOffset - topOffset);

    grid.style.setProperty('--spine-top', `${topOffset}px`);
    grid.style.setProperty('--spine-height', `${height}px`);
  }

  updateZigzagSpine();
  window.addEventListener('resize', updateZigzagSpine, { passive: true });
  window.addEventListener('load', updateZigzagSpine, { passive: true });
  if ('ResizeObserver' in window) {
    const gridEl = document.querySelector('.difference-zigzag-grid');
    if (gridEl) {
      new ResizeObserver(updateZigzagSpine).observe(gridEl);
    }
  }

  // 10. Hover & Touch Interactive Effects for "The Foundation of Our Excellence" (about.html)
  // Activates strictly while mouse hovers or user touches; immediately deactivates after hover/touch ends
  const foundationCards = document.querySelectorAll('.difference-card');
  if (foundationCards.length > 0) {
    const clearAllHighlights = () => {
      foundationCards.forEach(c => {
        c.classList.remove('card-hovered', 'card-touching');
      });
    };

    foundationCards.forEach((card) => {
      // Remove tabindex so cards cannot hold persistent focus
      card.removeAttribute('tabindex');

      // Pointer / Mouse Hover Enter (desktop or phone extension with pointer)
      card.addEventListener('pointerenter', function(e) {
        if (e.pointerType !== 'touch') {
          clearAllHighlights();
          this.classList.add('card-hovered');
        }
      });

      // Pointer / Mouse Hover Leave (immediately deactivate when cursor moves off)
      card.addEventListener('pointerleave', function() {
        this.classList.remove('card-hovered', 'card-touching');
      });

      // Touch Start (Mobile touchscreens / phone extensions)
      card.addEventListener('touchstart', function() {
        clearAllHighlights();
        this.classList.add('card-touching');
      }, { passive: true });

      // Touch End / Release (immediately deactivate when finger is lifted)
      card.addEventListener('touchend', function() {
        const self = this;
        self.classList.remove('card-touching', 'card-hovered');
        if (typeof self.blur === 'function') self.blur();
      }, { passive: true });

      // Touch Move (if user begins scrolling away, immediately deactivate)
      card.addEventListener('touchmove', function() {
        this.classList.remove('card-touching', 'card-hovered');
      }, { passive: true });

      // Touch Cancel (interrupted gesture)
      card.addEventListener('touchcancel', function() {
        this.classList.remove('card-touching', 'card-hovered');
      }, { passive: true });
    });

    // Window scroll immediately clears any highlights
    window.addEventListener('scroll', clearAllHighlights, { passive: true });

    // Tap/click outside clears any highlights
    document.addEventListener('pointerdown', function(e) {
      if (!e.target.closest('.difference-card')) {
        clearAllHighlights();
      }
    }, { passive: true });
  }

  // 11. Operations In Action Manual Carousel (team.html)
  const opsTrack = document.getElementById('opsCarouselTrack');
  const opsPrevBtn = document.getElementById('opsPrevBtn');
  const opsNextBtn = document.getElementById('opsNextBtn');
  const opsFloatPrev = document.getElementById('opsFloatPrevBtn');
  const opsFloatNext = document.getElementById('opsFloatNextBtn');
  const opsCounter = document.getElementById('opsCounter');

  if (opsTrack) {
    const cards = opsTrack.querySelectorAll('.team-card');
    const total = cards.length;

    function getScrollStep() {
      if (cards.length > 0) {
        return cards[0].offsetWidth + 22; // card width + gap
      }
      return 360;
    }

    function updateCarouselState() {
      const scrollLeft = opsTrack.scrollLeft;
      const maxScroll = opsTrack.scrollWidth - opsTrack.clientWidth - 10;
      const cardWidth = getScrollStep();
      const currentIndex = Math.min(total, Math.round(scrollLeft / cardWidth) + 1);

      if (opsCounter) {
        opsCounter.textContent = `${currentIndex} / ${total}`;
      }

      const isStart = scrollLeft <= 15;
      const isEnd = scrollLeft >= maxScroll;

      if (opsPrevBtn) opsPrevBtn.disabled = isStart;
      if (opsFloatPrev) opsFloatPrev.disabled = isStart;
      if (opsNextBtn) opsNextBtn.disabled = isEnd;
      if (opsFloatNext) opsFloatNext.disabled = isEnd;
    }

    function scrollNext() {
      opsTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    }

    function scrollPrev() {
      opsTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    }

    if (opsNextBtn) opsNextBtn.addEventListener('click', scrollNext);
    if (opsFloatNext) opsFloatNext.addEventListener('click', scrollNext);
    if (opsPrevBtn) opsPrevBtn.addEventListener('click', scrollPrev);
    if (opsFloatPrev) opsFloatPrev.addEventListener('click', scrollPrev);

    opsTrack.addEventListener('scroll', updateCarouselState, { passive: true });
    window.addEventListener('resize', updateCarouselState);
    // Initial check
    setTimeout(updateCarouselState, 200);
  }

  // 12. Mobile Responsive Content Truncation & "Read More" Engine (<= 768px)
  // Minimizes vertical scroll time by truncating content blocks longer than 5 lines
  function initMobileReadMore() {
    if (window.innerWidth > 768) return;

    const selectors = [
      '.service-card-detailed > p',
      '.about-story-card p',
      '.team-info p',
      '.location-presence-card p',
      '.difference-card .diff-card-answer p',
      '.cert-card p'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    if (!elements.length) return;

    elements.forEach(function (el) {
      if (el.closest('.mobile-expandable-wrap')) return;
      if (el.closest('.site-header') || el.closest('.footer-bottom') || el.closest('.contact-detail-row')) return;

      const lh = parseFloat(window.getComputedStyle(el).lineHeight) || 22;
      const lines = Math.round(el.offsetHeight / lh);

      if (lines >= 5 || el.offsetHeight >= 105) {
        const wrap = document.createElement('div');
        wrap.className = 'mobile-expandable-wrap is-collapsed';

        el.classList.add('mobile-expandable-text');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mobile-read-more-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span>Read More</span> <span class="toggle-icon">↓</span>';

        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const isCollapsed = wrap.classList.contains('is-collapsed');
          if (isCollapsed) {
            wrap.classList.remove('is-collapsed');
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<span>Show Less</span> <span class="toggle-icon">↑</span>';
          } else {
            wrap.classList.add('is-collapsed');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<span>Read More</span> <span class="toggle-icon">↓</span>';
          }
        });

        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
        wrap.appendChild(btn);
      }
    });
  }

  initMobileReadMore();
  setTimeout(initMobileReadMore, 250);
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      initMobileReadMore();
    }
  }, { passive: true });
});
