(function () {
    "use strict";


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


  // v0.10: en modo edición dejamos que Odoo seleccione imágenes dentro de tarjetas
  // sin navegar accidentalmente a otra página.
  document.addEventListener('click', function (event) {
    if (!document.body.classList.contains('editor_enable')) return;
    var link = event.target.closest('.ds-service-card, .ds-project a');
    if (link) event.preventDefault();
  }, true);


  // v0.22 — Intro Loader coordinated with the native Odoo background video.
  // It stays visible briefly while the first video frame is decoded, then fades.
  (function initDsolutionIntroLoader() {
    var loader = document.querySelector('.ds-intro-loader');
    if (!loader) return;
    if (document.body.classList.contains('editor_enable')) { loader.remove(); return; }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var minVisible = reduceMotion ? 120 : 900;
    var maxVisible = reduceMotion ? 300 : 1800;
    var startedAt = performance.now();
    var videoReady = false;
    var leaving = false;
    var hero = document.querySelector('.ds-hero.o_background_video');

    function leave() {
      if (leaving) return;
      var elapsed = performance.now() - startedAt;
      if (elapsed < minVisible) {
        window.setTimeout(leave, minVisible - elapsed);
        return;
      }
      if (!videoReady && elapsed < maxVisible) return;
      leaving = true;
      loader.classList.add('is-leaving');
      window.setTimeout(function () { loader.remove(); }, reduceMotion ? 60 : 320);
    }

    function watchVideo(video) {
      if (!video || video.dataset.dsIntroWatched === '1') return;
      video.dataset.dsIntroWatched = '1';
      video.preload = 'auto';
      if ('fetchPriority' in video) video.fetchPriority = 'high';
      if (video.readyState >= 2) {
        videoReady = true;
        leave();
        return;
      }
      var ready = function () {
        videoReady = true;
        leave();
      };
      video.addEventListener('loadeddata', ready, { once: true });
      video.addEventListener('canplay', ready, { once: true });
    }

    if (!hero) {
      videoReady = true;
    } else {
      watchVideo(hero.querySelector('.o_bg_video_file'));
      var observer = new MutationObserver(function () {
        var video = hero.querySelector('.o_bg_video_file');
        if (video) {
          watchVideo(video);
          observer.disconnect();
        }
      });
      observer.observe(hero, { childList: true, subtree: true });
      window.setTimeout(function () { observer.disconnect(); }, maxVisible + 500);
    }

    window.setTimeout(leave, minVisible);
    window.setTimeout(function () {
      videoReady = true;
      leave();
    }, maxVisible);
  })();

})();
