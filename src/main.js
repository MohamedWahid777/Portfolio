/* eslint-disable no-console */
(() => {
  const root = document.documentElement;

  // ================== THEME ==================
  const storageKey = "mw-theme";
  const getPreferredTheme = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
    // Default to dark theme on first visit
    return "dark";
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    localStorage.setItem(storageKey, theme);

    const icon = document.querySelector("#themeToggle i[data-lucide]");
    if (icon) icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    window.lucide?.createIcons?.();
  };

  const initTheme = () => applyTheme(getPreferredTheme());

  // ================== MOBILE MENU ==================
  const initMobileMenu = () => {
    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    if (!btn || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");

      const icon = btn.querySelector("i[data-lucide]");
      if (icon) icon.setAttribute("data-lucide", open ? "x" : "menu");
      window.lucide?.createIcons?.();
    };

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    menu.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });
  };

  // ================== REVEAL ANIMATIONS ==================
  const initRevealAnimations = () => {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");

          // Animate progress bars once visible
          entry.target
            .querySelectorAll?.(".progress[data-level]")
            ?.forEach((bar) => {
              const level = Number(bar.getAttribute("data-level") || "0");
              bar.style.setProperty(
                "--level",
                `${Math.max(0, Math.min(level, 100))}%`,
              );
              requestAnimationFrame(() => bar.classList.add("is-animated"));
            });

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );

    items.forEach((el) => observer.observe(el));
  };

  // ================== CONTACT FORM ==================
  const initContactForm = () => {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form || !note) return;

    const submitBtn = form.querySelector("button[type='submit']");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    const setNote = (type, msg) => {
      note.classList.remove("hidden");
      note.textContent = msg;
      note.dataset.type = type;
      note.style.color =
        type === "success"
          ? "rgba(34, 197, 94, 0.95)"
          : type === "error"
            ? "rgba(248, 113, 113, 0.95)"
            : "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        setNote("error", "Please fill in all required fields.");
        return;
      }
      if (!emailPattern.test(email)) {
        setNote("error", "Please enter a valid email address.");
        return;
      }

      const serviceId = "service_7wtibg4";
      const templateId = "template_3v28qml";
      const publicKey = "HmiS9EtTxjarRMNFj";

      // Initialize EmailJS
      emailjs.init(publicKey);

      submitBtn?.setAttribute("disabled", "true");
      submitBtn?.classList.add("opacity-80");
      setNote("info", "Sending your message...");

      emailjs
        .send(serviceId, templateId, {
          to_email: "wahadmomo@gmail.com",
          from_name: name,
          reply_to: email,
          message: message,
        })
        .then(() => {
          setNote("success", "Message sent successfully. Thank you!");
          form.reset();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          setNote(
            "error",
            "Failed to send message. Please check console for details.",
          );
        })
        .finally(() => {
          submitBtn?.removeAttribute("disabled");
          submitBtn?.classList.remove("opacity-80");
        });
    });
  };

  // ================== ACTIVE NAV LINKS ==================
  const initActiveNav = () => {
    const links = Array.from(
      document.querySelectorAll("a.nav-link[href^='#']"),
    );
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    const setActive = (id) => {
      links.forEach((a) => {
        const isActive = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("is-active", isActive);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];
        if (!visible) return;
        setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.01, 0.1, 0.25] },
    );

    sections.forEach((s) => observer.observe(s));
  };

  // ================== EXPANDABLE TEXT ==================
  window.toggleAboutText = () => {
    const expandableText = document.getElementById("aboutExpandableText");
    const readMoreBtn = document.getElementById("readMoreBtn");
    const readMoreText = document.getElementById("readMoreText");
    const readMoreIcon = document.getElementById("readMoreIcon");

    if (!expandableText || !readMoreBtn || !readMoreText || !readMoreIcon)
      return;

    const isExpanded = expandableText.classList.contains("expanded");

    if (isExpanded) {
      expandableText.classList.remove("expanded");
      readMoreText.textContent = "Read More";
      readMoreIcon.classList.remove("rotated");
    } else {
      expandableText.classList.add("expanded");
      readMoreText.textContent = "Read Less";
      readMoreIcon.classList.add("rotated");
    }
  };

  // ================== TYPING ANIMATION ==================
  const initTypingAnimation = () => {
    const typingElements = document.querySelectorAll(".typing-text");

    typingElements.forEach((element) => {
      const text = element.getAttribute("data-text");
      if (!text) return;

      const typeText = () => {
        element.textContent = "";
        let index = 0;

        const typeChar = () => {
          if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 100);
          } else {
            // Wait a bit then restart
            setTimeout(() => {
              const deleteChar = () => {
                if (element.textContent.length > 0) {
                  element.textContent = element.textContent.slice(0, -1);
                  setTimeout(deleteChar, 50);
                } else {
                  setTimeout(typeText, 500); // Pause before retyping
                }
              };
              deleteChar();
            }, 2000);
          }
        };

        typeChar();
      };

      // Start typing after a short delay
      setTimeout(typeText, 800);
    });
  };

  // ================== LUCIDE ICONS ==================
  const initIcons = () => window.lucide?.createIcons?.();

  // ================== DOM CONTENT LOADED ==================
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initIcons();
    initMobileMenu();
    initRevealAnimations();
    initContactForm();
    initActiveNav();
    initTypingAnimation();

    const toggle = document.getElementById("themeToggle");
    toggle?.addEventListener("click", () => {
      applyTheme(root.classList.contains("dark") ? "light" : "dark");
    });
  });
})();
let btn = document.querySelector(".btTOP");
document.onscroll = function () {
  if (scrollY >= 500) {
    btn.style.cssText = "display: block";
  } else {
    btn.style.cssText = "display: none";
  }
};
btn.onclick = function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
};
