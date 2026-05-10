gsap.registerPlugin(ScrollTrigger); 

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

// --- CURSEUR PERSONNALISÉ AMÉLIORÉ ---
if (window.innerWidth > 768) {
    // Suivi en temps réel avec des calculs séparés
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Animer le point central
        gsap.to(cursor, {
            x: mouseX - 4,
            y: mouseY - 4,
            duration: 0.1,
            overwrite: 'auto'
        });

        // Animer le cercle follower avec un délai
        gsap.to(follower, {
            x: mouseX - 20,
            y: mouseY - 20,
            duration: 0.3,
            ease: "power2.out",
            overwrite: 'auto'
        });
    });

    // Parallax doux sur les images flottantes
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) / 30;
        const moveY = (e.clientY - window.innerHeight / 2) / 30;
        gsap.utils.toArray(".floating-img-space").forEach(img => {
            const speed = parseFloat(img.getAttribute('data-speed')) || 1;
            gsap.to(img, {
                x: moveX * speed,
                y: moveY * speed,
                duration: 0.4,
                overwrite: 'auto'
            });
        });
    });

    // Effet hover sur les boutons et éléments interactifs
    document.addEventListener('mouseenter', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn-submit') || 
            e.target.classList.contains('btn-catalog-trigger') || e.target.tagName === 'A' ||
            e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            gsap.to(follower, { scale: 1.5, opacity: 0.8, borderColor: '#ffd700' });
            gsap.to(cursor, { scale: 0.5, opacity: 0.5 });
        }
    }, true);

    document.addEventListener('mouseleave', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn-submit') || 
            e.target.classList.contains('btn-catalog-trigger') || e.target.tagName === 'A' ||
            e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            gsap.to(follower, { scale: 1, opacity: 1, borderColor: 'var(--or-mat)' });
            gsap.to(cursor, { scale: 1, opacity: 1 });
        }
    }, true);
}

// --- FONCTION CATALOGUE ---
function toggleCatalog() {
    const overlay = document.getElementById('catalog-overlay');
    if (overlay.style.display === 'block') {
        gsap.to(overlay, { 
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => overlay.style.display = 'none' 
        });
        document.body.style.overflow = 'auto';
    } else {
        overlay.style.display = 'block';
        gsap.fromTo(overlay, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.3 }
        );
        document.body.style.overflow = 'hidden';
    }
}

// --- LOADER ---
window.addEventListener('load', () => {
    gsap.to("#loader", { 
        y: "-100%", 
        duration: 0.6, 
        ease: "expo.inOut", 
        delay: 0.2, 
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
        }
    });
});

// --- GALERIE HORIZONTALE ---
if (window.innerWidth > 768) {
    let sections = gsap.utils.toArray(".gallery-panel");
    gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-gallery-wrapper",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + document.querySelector(".horizontal-gallery").offsetWidth,
            markers: false
        }
    });
}

// --- ANIMATIONS FADE ---
gsap.utils.toArray(".anim-fade").forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 95%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// --- ANIMATION REVEAL ---
gsap.from(".anim-reveal", {
    scrollTrigger: {
        trigger: ".narrative",
        start: "top 80%"
    },
    clipPath: "inset(0 100% 0 0)",
    duration: 0.8,
    ease: "expo.inOut"
});

// --- GESTION DU FORMULAIRE ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const button = document.querySelector('.btn-submit');
    const originalText = button.textContent;
    
    // Animation de succès
    gsap.to(button, {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
    
    button.textContent = '✓ ENVOYÉ !';
    gsap.to(button, {
        backgroundColor: '#25d366',
        duration: 0.4
    });
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
        this.reset();
        button.textContent = originalText;
        gsap.to(button, {
            backgroundColor: 'var(--or-mat)',
            duration: 0.4
        });
    }, 2000);
});

// --- ANIMATIONS SUPPLÉMENTAIRES ---
// Animation des cartes expertise au scroll
gsap.utils.toArray(".exp-card").forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out"
    });

    // Hover effect
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            y: -10,
            boxShadow: '0 20px 40px rgba(196, 164, 132, 0.3)',
            duration: 0.4
        });
    });

    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            y: 0,
            boxShadow: 'none',
            duration: 0.4
        });
    });
});

// Animation des panneaux de galerie
gsap.utils.toArray(".gallery-panel").forEach(panel => {
    gsap.from(panel, {
        scrollTrigger: {
            trigger: panel,
            start: "left 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: -50,
        duration: 0.6,
        ease: "power2.out"
    });
});

// Effet parallax sur les images de la section narrative
const imageRevealBox = document.querySelector('.image-reveal-box');
if (imageRevealBox) {
    gsap.to(imageRevealBox, {
        scrollTrigger: {
            trigger: imageRevealBox,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            markers: false
        },
        scale: 1.05,
        ease: "none"
    });
}
