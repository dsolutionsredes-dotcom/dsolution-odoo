(function () {
    "use strict";


    // v20.1.6 — Ecosystem master logos -> runtime marquee clones.
    // XML stores one editable master per tool. Public copies are created only in the browser,
    // so changing one logo/text updates every repetition without duplicating editable content.
    function initDsolutionToolLogos() {
        const tracks = document.querySelectorAll(".ds-marquee-track");
        if (!tracks.length) return;

        const isEditing = () => document.body.classList.contains("editor_enable");

        const prepareClone = (source) => {
            const clone = source.cloneNode(true);
            clone.classList.add("ds-tool-clone");
            clone.setAttribute("aria-hidden", "true");
            clone.querySelectorAll(".o_we_custom_image").forEach((img) => {
                img.classList.remove("o_we_custom_image", "js_ds_tool_logo_source");
                img.classList.add("js_ds_tool_logo_clone");
            });
            clone.querySelectorAll("[contenteditable]").forEach((node) => node.removeAttribute("contenteditable"));
            return clone;
        };

        const rebuildTrack = (track) => {
            track.querySelectorAll(":scope > .ds-tool-clone").forEach((clone) => clone.remove());
            track.classList.remove("is-runtime-cloned");
            if (isEditing()) return;

            const masters = Array.from(track.querySelectorAll(":scope > .ds-tool:not(.ds-tool-clone)"));
            if (!masters.length) return;

            // Three equal groups (master + 2 copies) preserve the existing 33.333% marquee loop.
            for (let repeat = 0; repeat < 2; repeat += 1) {
                masters.forEach((master) => track.appendChild(prepareClone(master)));
            }
            track.classList.add("is-runtime-cloned");
        };

        tracks.forEach((track) => {
            rebuildTrack(track);
            Array.from(track.querySelectorAll(":scope > .ds-tool:not(.ds-tool-clone)")).forEach((master) => {
                const observer = new MutationObserver(() => rebuildTrack(track));
                observer.observe(master, {
                    subtree: true,
                    childList: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ["src", "srcset", "alt", "class"],
                });
            });
        });

        const bodyObserver = new MutationObserver(() => tracks.forEach(rebuildTrack));
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
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

// v20.1.8 — Desarrollo Web: one editable long screenshot per type + slow vertical scroll.
(function () {
    "use strict";

    function initDsolutionWebShowcase() {
        const page = document.querySelector(".dsolution-web-page");
        if (!page || page.dataset.dsWebReady === "2") return;
        page.dataset.dsWebReady = "2";

        const buttons = Array.from(page.querySelectorAll("[data-web-target]"));
        const details = Array.from(page.querySelectorAll("[data-web-detail]"));
        const masters = Array.from(page.querySelectorAll("[data-web-master]"));
        const previews = Array.from(page.querySelectorAll(".js_ds_web_preview"));
        const editing = document.body.classList.contains("editor_enable");
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let activeType = "corporativa";

        function masterFor(type) {
            return masters.find((node) => node.dataset.webMaster === type);
        }

        function buttonFor(type) {
            return buttons.find((node) => node.dataset.webTarget === type);
        }

        function detailFor(type) {
            return details.find((node) => node.dataset.webDetail === type);
        }

        function sourceFor(type) {
            return masterFor(type)?.querySelector("img")?.src || "";
        }

        function iconFor(type) {
            return buttonFor(type)?.querySelector(".ds-web-type-icon img")?.src || "";
        }

        function configurePreview(img) {
            const frame = img.closest(".ds-web-preview-window");
            if (!frame) return;
            img.classList.remove("is-scrolling");
            img.style.removeProperty("--ds-scroll-distance");
            img.style.removeProperty("--ds-scroll-duration");

            const apply = () => {
                const distance = Math.max(0, img.getBoundingClientRect().height - frame.clientHeight);
                img.style.setProperty("--ds-scroll-distance", `${Math.round(distance)}px`);
                const duration = Math.max(20, Math.min(42, 20 + distance / 85));
                img.style.setProperty("--ds-scroll-duration", `${duration.toFixed(1)}s`);
                if (!editing && !reduceMotion && distance > 12) {
                    void img.offsetWidth;
                    img.classList.add("is-scrolling");
                }
            };

            if (img.complete) {
                requestAnimationFrame(apply);
            } else {
                img.addEventListener("load", () => requestAnimationFrame(apply), { once: true });
            }
        }

        function syncDetailIcon(type) {
            const src = iconFor(type);
            const detail = detailFor(type);
            const img = detail?.querySelector(".js_ds_web_detail_icon");
            if (src && img && img.src !== src) img.src = src;
        }

        function syncPreviews(type) {
            const src = sourceFor(type);
            if (!src) return;
            previews.forEach((img) => {
                img.classList.remove("is-scrolling");
                if (img.src !== src) {
                    img.src = src;
                }
                configurePreview(img);
            });
        }

        function activate(type) {
            activeType = type;
            buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.webTarget === type));
            details.forEach((detail) => detail.classList.toggle("is-active", detail.dataset.webDetail === type));
            syncDetailIcon(type);
            syncPreviews(type);
        }

        buttons.forEach((button) => {
            button.addEventListener("click", () => activate(button.dataset.webTarget));
        });

        const mediaObserver = new MutationObserver((mutations) => {
            let shouldSync = false;
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && ["src", "srcset"].includes(mutation.attributeName)) {
                    shouldSync = true;
                }
            });
            if (shouldSync) {
                syncDetailIcon(activeType);
                syncPreviews(activeType);
            }
        });

        masters.forEach((master) => {
            const img = master.querySelector("img");
            if (img) mediaObserver.observe(img, { attributes: true, attributeFilter: ["src", "srcset"] });
        });
        buttons.forEach((button) => {
            const img = button.querySelector(".ds-web-type-icon img");
            if (img) mediaObserver.observe(img, { attributes: true, attributeFilter: ["src", "srcset"] });
        });

        let resizeTimer = null;
        window.addEventListener("resize", () => {
            if (resizeTimer) window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => previews.forEach(configurePreview), 160);
        }, { passive: true });

        activate(activeType);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDsolutionWebShowcase);
    } else {
        initDsolutionWebShowcase();
    }
})();
