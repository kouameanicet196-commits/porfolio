(function () {
  "use strict";


  // ========== 0. INITIALISATION AOS (animations au scroll) ==========
  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }

  // ========== 1. PRELOADER ==========
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (!loader) return;
    loader.classList.add("hidden");
    setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 1000);
  });

  // ========== 2. CURSEUR PERSONNALISÉ ==========
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  if (cursor && follower && window.innerWidth > 768) {
    let mouseX = 0,
      mouseY = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      follower.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`;
    });
  }

  // ========== 3. CATALOGUE OVERLAY (ouverture/fermeture) ==========
  const catalogOverlay = document.getElementById("catalog-overlay");
  const catalogCloseBtn = document.getElementById("catalog-close");
  const catalogOpenButtons = document.querySelectorAll("[data-action='open-catalog']");

  function setCatalogOpen(isOpen) {
    if (!catalogOverlay) return;
    catalogOverlay.style.display = isOpen ? "block" : "none";
    catalogOverlay.setAttribute("aria-hidden", String(!isOpen));
  }

  function toggleCatalog() {
    if (!catalogOverlay) return;
    const isOpen = catalogOverlay.style.display === "block";
    setCatalogOpen(!isOpen);
  }

  catalogOpenButtons.forEach((btn) => {
    btn.addEventListener("click", () => setCatalogOpen(true));
  });

  if (catalogCloseBtn) {
    catalogCloseBtn.addEventListener("click", () => setCatalogOpen(false));
  }

  window.toggleCatalog = toggleCatalog;

  // ========== 4. GSAP ANIMATIONS (galerie horizontale) ==========
  if (window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
      const galleryWrapper = document.querySelector(".horizontal-gallery-wrapper");
      if (galleryWrapper) {
        const strip = document.querySelector(".gallery-strip");
        if (strip) {
          const isMobile =
            window.matchMedia &&
            window.matchMedia("(max-width: 768px)").matches;

          if (!isMobile) {
            window.gsap.to(strip, {
              x: () => -(strip.scrollWidth - window.innerWidth),
              ease: "none",
              scrollTrigger: {
                trigger: galleryWrapper,
                start: "top top",
                end: () => "+=" + (strip.scrollWidth - window.innerWidth),
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn("GSAP init failed", err);
    }
  }

  // ========== 5. FORMULAIRE DE CONTACT (validation + simulation) ==========
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectSelect = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const submitBtn = contactForm.querySelector(".btn-submit");
    const loaderSpan = submitBtn ? submitBtn.querySelector(".btn-loader") : null;
    const successMsg = document.getElementById("form-success");

    function showError(input, errorSpan, message) {
      if (!input || !errorSpan) return;
      errorSpan.textContent = message;
      errorSpan.classList.add("show");
      input.style.borderColor = "#e74c3c";
    }

    function clearError(input, errorSpan) {
      if (!input || !errorSpan) return;
      errorSpan.textContent = "";
      errorSpan.classList.remove("show");
      input.style.borderColor = "rgba(196, 164, 132, 0.3)";
    }

    function validateName() {
      const err = document.getElementById("name-error");
      if (!nameInput || !err) return false;
      if (nameInput.value.trim() === "") {
        showError(nameInput, err, "Champ requis");
        return false;
      }
      clearError(nameInput, err);
      return true;
    }

    function validateEmail() {
      const err = document.getElementById("email-error");
      if (!emailInput || !err) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === "") {
        showError(emailInput, err, "Champ requis");
        return false;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, err, "Format email invalide");
        return false;
      }
      clearError(emailInput, err);
      return true;
    }

    function validateSubject() {
      const err = document.getElementById("subject-error");
      if (!subjectSelect) return false;
      if (!err) return subjectSelect.value !== "";
      if (subjectSelect.value === "") {
        showError(subjectSelect, err, "Veuillez choisir un sujet");
        return false;
      }
      clearError(subjectSelect, err);
      return true;
    }

    function validateMessage() {
      const err = document.getElementById("message-error");
      if (!messageInput || !err) return false;
      if (messageInput.value.trim() === "") {
        showError(messageInput, err, "Champ requis");
        return false;
      }
      clearError(messageInput, err);
      return true;
    }

    if (nameInput) nameInput.addEventListener("input", validateName);
    if (emailInput) emailInput.addEventListener("input", validateEmail);
    if (subjectSelect) subjectSelect.addEventListener("change", validateSubject);
    if (messageInput) messageInput.addEventListener("input", validateMessage);

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const okName = validateName();
      const okEmail = validateEmail();
      const okSubject = validateSubject();
      const okMessage = validateMessage();

      if (okName && okEmail && okSubject && okMessage) {
        if (loaderSpan) loaderSpan.classList.add("show");
        if (submitBtn) submitBtn.disabled = true;

        setTimeout(() => {
          if (loaderSpan) loaderSpan.classList.remove("show");
          if (successMsg) successMsg.classList.add("show");
          if (submitBtn) submitBtn.disabled = false;

          contactForm.reset();

          setTimeout(() => {
            if (successMsg) successMsg.classList.remove("show");
          }, 5000);
        }, 1500);
      }
    });
  }

  // ========== 6. BOUTON WHATSAPP DÉPLAÇABLE ==========
  const whatsappBtn = document.getElementById("whatsapp-float");
  if (whatsappBtn) {
    let isDragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const DRAG_THRESHOLD_PX = 8;

    const onDragStart = (e) => {
      isDragging = true;
      moved = false;
      whatsappBtn.classList.add("dragging");

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rect = whatsappBtn.getBoundingClientRect();
      startX = clientX;
      startY = clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      document.body.style.userSelect = "none";
    };

    const getEdgeGap = () => {
      const raw = getComputedStyle(whatsappBtn).getPropertyValue("--edge-gap");
      const value = parseFloat(raw);
      return Number.isFinite(value) ? value : 24;
    };

    const snapToGap = (value, gap) => {
      if (!gap) return value;
      return Math.round(value / gap) * gap;
    };

    const computeEdgeGap = () => {
      const gap = getEdgeGap();
      return Math.max(20, Math.min(30, gap));
    };

    const applyPosition = (left, top, edgeGap) => {
      const btnWidth = whatsappBtn.offsetWidth;
      const btnHeight = whatsappBtn.offsetHeight;

      const clampedLeft = Math.max(edgeGap, Math.min(window.innerWidth - btnWidth - edgeGap, left));
      const clampedTop = Math.max(edgeGap, Math.min(window.innerHeight - btnHeight - edgeGap, top));

      whatsappBtn.style.left = clampedLeft + "px";
      whatsappBtn.style.top = clampedTop + "px";
      whatsappBtn.style.right = "auto";
      whatsappBtn.style.bottom = "auto";
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      const newLeft = initialLeft + dx;
      const newTop = initialTop + dy;

      const edgeGap = computeEdgeGap();
      applyPosition(newLeft, newTop, edgeGap);
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      whatsappBtn.classList.remove("dragging");
      document.body.style.userSelect = "";

      const edgeGap = computeEdgeGap();
      const rect = whatsappBtn.getBoundingClientRect();

      let left = rect.left;
      let top = rect.top;

      left = snapToGap(left, edgeGap);
      top = snapToGap(top, edgeGap);

      applyPosition(left, top, edgeGap);
    };

    // Moved detection for tap vs drag (mobile)
    let movedDuringGesture = false;
    const markMovedIfNeeded = () => {
      const rect = whatsappBtn.getBoundingClientRect();
      movedDuringGesture = moved ||
        Math.abs(rect.left - initialLeft) > DRAG_THRESHOLD_PX ||
        Math.abs(rect.top - initialTop) > DRAG_THRESHOLD_PX;
    };

    whatsappBtn.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", (e) => {
      markMovedIfNeeded();
      onDragMove(e);
    });
    document.addEventListener("mouseup", () => {
      onDragEnd();
    });

    whatsappBtn.addEventListener("touchstart", onDragStart, { passive: false });
    document.addEventListener("touchmove", (e) => {
      markMovedIfNeeded();
      onDragMove(e);
    }, { passive: false });
    document.addEventListener("touchend", onDragEnd);

    whatsappBtn.addEventListener("click", function (e) {
      if (movedDuringGesture) e.preventDefault();
    });
  }

  // ========== 7. CHATBOT ==========
  const chatBubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const chatClose = document.getElementById("chat-close");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  if (chatBubble && chatWindow && chatClose && chatMessages && chatInput && chatSend) {
    const normalizeText = (text) => {
      return (text || "")
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s+@._-]/gi, " ")
        .replace(/\s+/g, " ");
    };

    const knowledgeBase = [
      {
        id: "horaires",
        patterns: [/(heure|horaires|ouverture|fermeture|disponibilite|disponibilit)/i],
        answer: "Nous sommes disponibles du lundi au samedi, de 8h à 19h. Les séances se font sur rendez-vous.",
      },
      {
        id: "tarifs",
        patterns: [/(tarif|prix|cout|devis|budget|combien)/i],
        answer:
          "Nos tarifs varient selon le projet (mariage, événementiel, studio). Dites-moi le type de prestation + la date, et je vous guide pour obtenir un devis.",
      },
      {
        id: "contact",
        patterns: [/(contact|telephone|tel|appeler|email|joindre)/i],
        answer:
          "Vous pouvez nous joindre au +225 07 79 34 80 64 (WhatsApp ou appel) ou passer par le formulaire de contact sur le site.",
      },
      {
        id: "delais",
        patterns: [/(livraison|delai|delais|retouche|retouch|delai de livraison)/i],
        answer: "Nous livrons les photos retouchées sous 48h ouvrées après l’événement.",
      },
      {
        id: "annulation",
        patterns: [/(annulation|remboursement|retour|resilier)/i],
        answer: "Les conditions d’annulation et de remboursement sont précisées dans le contrat. N’hésitez pas à nous écrire.",
      },
      {
        id: "mariage",
        patterns: [/(mariage|noce|traditionnel|traditionnelle|noces)/i],
        answer:
          "Nous couvrons tous types de mariages (civil, religieux, traditionnel) avec une approche artistique unique.",
      },
      {
        id: "studio",
        patterns: [/(studio|seance photo|seance|portrait|book|marque)/i],
        answer:
          "Nous disposons d’un studio équipé pour des portraits professionnels, photos de marque ou book.",
      },
      {
        id: "evenement",
        patterns: [/(evenement|evenementiel|conference|concert|festival|can|femua|primud)/i],
        answer:
          "Couverture événementielle : CAN, FEMUA, PRIMUD… Nous sommes habitués aux grands rendez-vous.",
      },
      {
        id: "materiel",
        patterns: [/(materiel|appareil|boitier|boit|optique|objectif|camera)/i],
        answer:
          "Nous utilisons des boîtiers hybrides dernière génération et un parc optique complet.",
      },
      {
        id: "agence",
        patterns: [/(partenaire|collaboration|agence|shoot by tik tak|1xbet|caf)/i],
        answer:
          "Shoot By Tik Tak Agency est partenaire de marques comme 1xBet, CAF, et bien d’autres.",
      },
    ];

    const findBestMatch = (message) => {
      const raw = (message || "").toString();
      const msg = normalizeText(raw);

      let best = { score: 0, answer: null, id: null };

      for (const item of knowledgeBase) {
        let score = 0;
        for (const pattern of item.patterns) {
          if (pattern.test(raw) || pattern.test(msg)) score += 70;
        }

        const keywords = item.id === "horaires" ? ["horaire", "heure", "ouverture", "fermeture"] : [];
        score += keywords.some((k) => msg.includes(normalizeText(k))) ? 10 : 0;

        if (score > best.score) {
          best = { score, answer: item.answer, id: item.id };
        }
      }

      if (best.score >= 50 && best.answer) return { answer: best.answer, id: best.id };

      return {
        answer:
          "Je suis en train de vous répondre, mais je n’ai pas trouvé de correspondance exacte. Pouvez-vous préciser : (1) Horaires / (2) Tarifs / (3) Services ?",
        id: "fallback",
      };
    };

    const quickActions = [
      "Horaires",
      "Tarifs",
      "Services (mariage / studio / événement)",
      "Délais de livraison",
      "Contact",
    ];

    const generateContextualIntro = () => {
      return "Bonjour ! Je peux vous aider sur : Horaires, Tarifs, Services (mariage/studio/événement), Délais de livraison et Contact.";
    };

    const findAnswer = (message) => {
      const { answer } = findBestMatch(message);
      return answer;
    };

    const addMessage = (text, sender) => {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message " + sender;
      msgDiv.textContent = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return msgDiv;
    };

    const showTypingIndicator = () => {
      const typingDiv = document.createElement("div");
      typingDiv.className = "typing-indicator";
      for (let i = 0; i < 3; i++) {
        typingDiv.appendChild(document.createElement("span"));
      }
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return typingDiv;
    };

    const removeTypingIndicator = (indicator) => {
      if (indicator) indicator.remove();
    };

    const renderQuickActions = () => {
      const container = document.createElement("div");
      container.className = "chat-quick-actions";

      for (const label of quickActions) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chat-quick-action";
        btn.textContent = label;
        btn.addEventListener("click", () => {
          processUserMessage(label);
        });
        container.appendChild(btn);
      }

      const existing = chatMessages.querySelector(".chat-quick-actions");
      if (existing) existing.remove();
      chatMessages.appendChild(container);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    let chatBusy = false;

    const processUserMessage = (text) => {
      if (chatBusy) return;

      const trimmed = (text || "").toString().trim();
      if (!trimmed) return;

      chatBusy = true;
      addMessage(trimmed, "user");

      const typing = showTypingIndicator();
      const delay = 650 + Math.random() * 650;

      setTimeout(() => {
        removeTypingIndicator(typing);

        let answer;
        try {
          answer = findAnswer(trimmed);
        } catch (err) {
          console.error("Chatbot error:", err);
          answer = "Désolé, je n’arrive pas à traiter votre demande. Réessayez ou choisissez une option ci-dessous.";
        }

        addMessage(answer, "bot");

        if (answer && (answer.includes("Pouvez-vous préciser") || answer.includes("Réessayez"))) {
          renderQuickActions();
        }

        chatBusy = false;
      }, delay);
    };

    addMessage(generateContextualIntro(), "bot");
    renderQuickActions();

    const setChatOpen = (open) => {
      chatWindow.classList.toggle("active", open);
      chatBubble.setAttribute("aria-expanded", String(open));
      if (!open) chatWindow.blur();
    };

    chatBubble.addEventListener("click", () => {
      const isOpen = chatWindow.classList.contains("active");
      setChatOpen(!isOpen);
    });

    chatClose.addEventListener("click", () => {
      setChatOpen(false);
    });

    chatSend.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (text) {
        processUserMessage(text);
        chatInput.value = "";
      }
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        chatSend.click();
      }
    });
  }

  // ========== 8. FOND DE PARTICULES ANIMÉ (canvas) ==========
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("particles-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let rafId = 0;

    const particles = [];
    const maxParticles = prefersReducedMotion ? 30 : 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(196, 164, 132, 0.6)";
        ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    let paused = false;

    const animate = () => {
      if (prefersReducedMotion || paused) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      rafId = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      animate();
    }

    const onVisibilityChange = () => {
      paused = document.hidden;
      if (!paused && !prefersReducedMotion) {
        animate();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", resize);
    void rafId;
  }
})();

