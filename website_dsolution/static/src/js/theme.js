(function () {
    "use strict";


    // v0.18 — Hero video performance.
    // The direct MP4 URL is attached only after the critical page load.
    // This lets text, CSS, images and the poster render first.
    function initDsolutionHeroVideo() {
        const videos = document.querySelectorAll(".js_ds_hero_video[data-video-url]");
        if (!videos.length) {
            return;
        }

        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = !!(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || "")));
        if (reduceMotion || slowConnection) {
            return;
        }

        const loadVideos = () => {
            videos.forEach((video) => {
                if (video.dataset.dsVideoLoaded === "1") {
                    return;
                }
                const url = (video.dataset.videoUrl || "").trim();
                if (!url) {
                    return;
                }

                video.dataset.dsVideoLoaded = "1";
                video.src = url;
                video.load();

                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // The poster remains visible if autoplay is blocked.
                    });
                }
            });
        };

        const schedule = () => {
            if ("requestIdleCallback" in window) {
                window.requestIdleCallback(loadVideos, { timeout: 2500 });
            } else {
                window.setTimeout(loadVideos, 900);
            }
        };

        if (document.readyState === "complete") {
            schedule();
        } else {
            window.addEventListener("load", schedule, { once: true });
        }
    }


    // v0.19.1 — Ecosystem logo sync.
    // Edit the first logo in Odoo; the moving duplicate mirrors it automatically.
    function initDsolutionToolLogos() {
        const sources = document.querySelectorAll(".js_ds_tool_logo_source[data-tool-key]");
        if (!sources.length) return;

        const sync = (source) => {
            const key = source.dataset.toolKey;
            if (!key) return;
            document.querySelectorAll(`.js_ds_tool_logo_clone[data-tool-key="${key}"]`).forEach((clone) => {
                clone.src = source.src;
                if (source.srcset) clone.srcset = source.srcset;
                else clone.removeAttribute("srcset");
            });
        };

        sources.forEach((source) => {
            sync(source);
            const observer = new MutationObserver(() => sync(source));
            observer.observe(source, { attributes: true, attributeFilter: ["src", "srcset"] });
        });
    }

    function initDsolutionTheme() {
        const page = document.querySelector(".dsolution-page");
        if (!page || page.dataset.dsReady === "1") {
            return;
        }
        page.dataset.dsReady = "1";
        initDsolutionToolLogos();

        const header = page.querySelector(".ds-header");
        const mobileToggle = page.querySelector(".js_ds_mobile_toggle");
        const mobileMenu = page.querySelector(".ds-mobile-menu");
        const servicesToggle = page.querySelector(".js_ds_services_toggle");
        const servicesMenu = page.querySelector(".ds-services-menu");

        const updateHeader = () => {
            if (header) {
                header.classList.toggle("is-scrolled", window.scrollY > 48);
            }
        };
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener("click", () => {
                const open = mobileMenu.classList.toggle("is-open");
                mobileToggle.setAttribute("aria-expanded", String(open));
                header?.classList.toggle("is-menu-open", open);
                mobileToggle.textContent = open ? "×" : "☰";
            });
        }

        if (servicesToggle && servicesMenu) {
            servicesToggle.addEventListener("click", (ev) => {
                ev.preventDefault();
                const open = servicesMenu.classList.toggle("is-open");
                servicesToggle.setAttribute("aria-expanded", String(open));
            });
            document.addEventListener("click", (ev) => {
                if (!servicesMenu.contains(ev.target) && !servicesToggle.contains(ev.target)) {
                    servicesMenu.classList.remove("is-open");
                    servicesToggle.setAttribute("aria-expanded", "false");
                }
            });
        }

        page.querySelectorAll(".ds-mobile-menu a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu?.classList.remove("is-open");
                header?.classList.remove("is-menu-open");
                if (mobileToggle) {
                    mobileToggle.setAttribute("aria-expanded", "false");
                    mobileToggle.textContent = "☰";
                }
            });
        });

        document.addEventListener("keydown", (ev) => {
            if (ev.key === "Escape") {
                servicesMenu?.classList.remove("is-open");
                servicesToggle?.setAttribute("aria-expanded", "false");
                mobileMenu?.classList.remove("is-open");
                header?.classList.remove("is-menu-open");
                if (mobileToggle) {
                    mobileToggle.setAttribute("aria-expanded", "false");
                    mobileToggle.textContent = "☰";
                }
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1100) {
                mobileMenu?.classList.remove("is-open");
                header?.classList.remove("is-menu-open");
                if (mobileToggle) {
                    mobileToggle.setAttribute("aria-expanded", "false");
                    mobileToggle.textContent = "☰";
                }
            }
        }, { passive: true });

        const revealItems = page.querySelectorAll(".ds-reveal");
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if ("IntersectionObserver" in window && !reduceMotion && revealItems.length) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.10, rootMargin: "0px 0px -24px 0px" }
            );
            revealItems.forEach((item) => observer.observe(item));
            document.documentElement.classList.add("ds-animate");
        } else {
            revealItems.forEach((item) => item.classList.add("is-visible"));
        }
    }

    window.addEventListener("error", () => {
        document.documentElement.classList.remove("ds-animate");
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDsolutionTheme);
    } else {
        initDsolutionTheme();
    }

    initDsolutionHeroVideo();

  // v0.10: en modo edición dejamos que Odoo seleccione imágenes dentro de tarjetas
  // sin navegar accidentalmente a otra página.
  document.addEventListener('click', function (event) {
    if (!document.body.classList.contains('editor_enable')) return;
    var link = event.target.closest('.ds-service-card, .ds-project a');
    if (link) event.preventDefault();
  }, true);


  // v0.15 — Intro Loader original: una vez por sesión del navegador.
  (function initDsolutionIntroLoader() {
    var loader = document.querySelector('.ds-intro-loader');
    if (!loader) return;
    if (document.body.classList.contains('editor_enable')) { loader.remove(); return; }
    var key = 'dsolution-intro-seen';
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      if (window.sessionStorage.getItem(key)) { loader.remove(); return; }
      window.sessionStorage.setItem(key, '1');
    } catch (e) {}
    loader.classList.add('is-visible');
    var visibleFor = reduceMotion ? 180 : 700;
    window.setTimeout(function () {
      loader.classList.add('is-leaving');
      window.setTimeout(function () { loader.remove(); }, reduceMotion ? 60 : 260);
    }, visibleFor);
  })();

})();
