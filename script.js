// ─── LOADER ───
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
    }, 2000);
});

// ─── NAV TOGGLE ───
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ─── ACTIVE NAV ───
const sections = document.querySelectorAll("section[id]");
const navAs = document.querySelectorAll(".nav-links a");
function updateNav() {
    let cur = "";
    sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    navAs.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
    });
}
window.addEventListener("scroll", updateNav);

// ─── REVEAL on SCROLL ───
const reveals = document.querySelectorAll(
    ".reveal,.reveal-left,.reveal-right",
);
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                // animate skill bars when visible
                e.target
                    .querySelectorAll(".skill-fill[data-w]")
                    .forEach((bar) => {
                        setTimeout(() => {
                            bar.style.width = bar.dataset.w + "%";
                        }, 200);
                    });
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
);
reveals.forEach((el) => observer.observe(el));

// also trigger skill fills when parent card becomes visible
document.querySelectorAll(".skill-fill[data-w]").forEach((bar) => {
    const card = bar.closest(".reveal");
    if (!card) return;
    const cardObs = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    bar.style.width = bar.dataset.w + "%";
                }, 400);
                cardObs.disconnect();
            }
        },
        { threshold: 0.2 },
    );
    cardObs.observe(card);
});

// ─── TYPING EFFECT ───
const words = [
    "React Developer",
    "PHP Engineer",
    "Full-Stack Builder",
    "UI/UX Thinker",
    "Electron.js Dev",
    "MySQL Architect",
    "Auth System Builder",
];
let wi = 0,
    ci = 0,
    deleting = false;
const typEl = document.getElementById("typing-text");
function type() {
    const word = words[wi];
    if (deleting) {
        typEl.textContent = word.substring(0, ci--);
        if (ci < 0) {
            deleting = false;
            wi = (wi + 1) % words.length;
            setTimeout(type, 400);
            return;
        }
        setTimeout(type, 60);
    } else {
        typEl.textContent = word.substring(0, ci++);
        if (ci > word.length) {
            deleting = true;
            setTimeout(type, 2000);
            return;
        }
        setTimeout(type, 90);
    }
}
setTimeout(type, 2200);

// ─── COUNTER ANIMATION ───
function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (el.dataset.target === "100" ? "%" : "+");
        if (current >= target) clearInterval(timer);
    }, 30);
}
const counterObs = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                document.querySelectorAll("[data-target]").forEach((el) => {
                    animateCounter(el, parseInt(el.dataset.target));
                });
                counterObs.disconnect();
            }
        });
    },
    { threshold: 0.5 },
);
const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObs.observe(heroStats);

// ─── LIVE PREVIEW MODAL ───
function openPreview(url, name) {
    const modal = document.getElementById("preview-modal");
    document.getElementById("modal-url").textContent = url;
    document.getElementById("modal-ext").href = url;
    document.getElementById("modal-iframe").src = url;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}
function closePreview() {
    document.getElementById("preview-modal").classList.remove("open");
    document.getElementById("modal-iframe").src = "";
    document.body.style.overflow = "";
}
document
    .getElementById("preview-modal")
    .addEventListener("click", function (e) {
        if (e.target === this) closePreview();
    });
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePreview();
});

["wrap-fra", "wrap-dcc"].forEach((id) => {
    const fbId = "fb-" + id.replace("wrap-", "");
    const fb = document.getElementById(fbId);
    if (fb) {
        fb.classList.add("show");
    } 
});
function iframeLoaded(iframe, wrapId) {
    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body && doc.body.innerHTML.length > 100) {
            
            const fbId = "fb-" + wrapId.replace("wrap-", "");
            const fb = document.getElementById(fbId);
            if (fb) fb.classList.remove("show");
            iframe.style.display = "block";
        } else {
            throw new Error("empty");
        }
    } catch (e) {
        
        iframe.style.display = "none";
    }
}
function iframeError(wrapId) {
    const wrap = document.getElementById(wrapId);
    if (wrap) {
        const iframe = wrap.querySelector("iframe");
        if (iframe) iframe.style.display = "none";
    }
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        document
            .querySelectorAll(".filter-btn")
            .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.dataset.filter;
        document.querySelectorAll(".project-card").forEach((card) => {
            if (filter === "all" || card.dataset.cat === filter) {
                card.style.display = "block";
                card.style.opacity = "0";
                setTimeout(() => {
                    card.style.transition = "opacity .4s";
                    card.style.opacity = "1";
                }, 50);
            } else {
                card.style.display = "none";
            }
        });
    });
});