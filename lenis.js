(function () {
    "use strict";

    var LENIS_SRC = "https://unpkg.com/lenis@1.3.27/dist/lenis.min.js";
    var LOADER_FAILSAFE_MS = 10000;
    var RING_LENGTH = 144.5;

    var SPOT_SELECTOR = [
        ".curation-card",
        ".performance-card",
        ".care-card",
        ".testimonial-card",
        ".insight-card",
        ".vanguard-feature",
        ".team-card",
        ".showroom-card",
        ".pricing-card",
        ".pillar-card",
        ".shop-product-card",
        ".seal-certificate-card",
        ".contact-form-card",
        ".contact-floating-card",
        ".cart-floating-card",
        ".co-panel",
        ".co-summary-card",
        "[data-lenis-spotlight]"
    ].join(",");

    if (window.stacklyLenisGlobal) return;
    window.stacklyLenisGlobal = true;

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    var progressBar = null;
    var topButton = null;
    var ringValue = null;
    var parallaxItems = [];

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function headerOffset() {
        var header = document.querySelector(".stackly-header");
        var height = header ? Math.round(header.getBoundingClientRect().height) : 0;
        if (height > 0) return -height;
        return window.innerWidth < 768 ? -75 : -90;
    }

    function currentScroll(lenis) {
        var value = lenis && typeof lenis.scroll === "number" ? lenis.scroll : window.pageYOffset;
        return value || 0;
    }

    function scrollProgress(lenis) {
        var max = Math.max(1, root.scrollHeight - window.innerHeight);
        return Math.min(1, Math.max(0, currentScroll(lenis) / max));
    }

    function createLenis() {
        var lenis = new window.Lenis({
            autoRaf: false,
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1,
            syncTouch: false,
            allowNestedScroll: true,
            anchors: { offset: headerOffset(), duration: 1.4, easing: easeOutExpo },
            stopInertiaOnNavigate: true,
            respectReducedMotion: true
        });

        window.lenis = lenis;
        window.stacklyLenis = lenis;

        if (window.gsap) {
            if (window.ScrollTrigger) {
                window.gsap.registerPlugin(window.ScrollTrigger);
                lenis.on("scroll", window.ScrollTrigger.update);
            }
            window.gsap.ticker.add(function (time) {
                lenis.raf(time * 1000);
            });
            window.gsap.ticker.lagSmoothing(0);
        } else {
            (function loop(time) {
                lenis.raf(time);
                requestAnimationFrame(loop);
            })(performance.now());
        }

        return lenis;
    }

    function refreshAll(lenis) {
        if (lenis.options && lenis.options.anchors && typeof lenis.options.anchors === "object") {
            lenis.options.anchors.offset = headerOffset();
        }
        lenis.resize();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        updateUi(lenis);
    }

    function watchScrollLocks(lenis) {
        var body = document.body;
        var startedAt = Date.now();
        var locked = false;

        function isLocked() {
            var loading = body.classList.contains("stackly-loading") &&
                (Date.now() - startedAt < LOADER_FAILSAFE_MS);

            return loading ||
                body.classList.contains("mobile-menu-active") ||
                body.classList.contains("modal-open") ||
                body.style.overflow === "hidden" ||
                root.style.overflow === "hidden";
        }

        function sync() {
            var next = isLocked();
            if (next === locked) return;
            locked = next;
            if (locked) lenis.stop(); else lenis.start();
        }

        var observer = new MutationObserver(sync);
        observer.observe(body, { attributes: true, attributeFilter: ["class", "style"] });
        observer.observe(root, { attributes: true, attributeFilter: ["style"] });

        window.addEventListener("stackly:loader-hidden", function () {
            sync();
            refreshAll(lenis);
        });

        setTimeout(sync, LOADER_FAILSAFE_MS + 100);
        sync();
    }

    function watchLayout(lenis) {
        window.addEventListener("load", function () { refreshAll(lenis); });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { refreshAll(lenis); });
        }

        window.addEventListener("resize", function () {
            if (lenis.options && lenis.options.anchors && typeof lenis.options.anchors === "object") {
                lenis.options.anchors.offset = headerOffset();
            }
            updateUi(lenis);
        });

        window.addEventListener("pageshow", function (event) {
            if (event.persisted) refreshAll(lenis);
        });

        ["show.bs.modal", "show.bs.offcanvas"].forEach(function (name) {
            document.addEventListener(name, function () { lenis.stop(); });
        });

        ["hidden.bs.modal", "hidden.bs.offcanvas"].forEach(function (name) {
            document.addEventListener(name, function () {
                requestAnimationFrame(function () {
                    var stillOpen = document.querySelector(".modal.show, .offcanvas.show");
                    var bodyLocked = document.body.style.overflow === "hidden" ||
                        document.body.classList.contains("stackly-loading");
                    if (!stillOpen && !bodyLocked) lenis.start();
                });
            });
        });
    }

    function buildProgressBar() {
        progressBar = document.createElement("div");
        progressBar.className = "lenis-progress";
        progressBar.setAttribute("aria-hidden", "true");
        document.body.appendChild(progressBar);
    }

    function buildTopButton(lenis) {
        topButton = document.createElement("button");
        topButton.type = "button";
        topButton.className = "lenis-top";
        topButton.setAttribute("aria-label", "Back to top");
        topButton.innerHTML =
            '<svg class="lenis-top-ring" viewBox="0 0 54 54" aria-hidden="true">' +
            '<circle class="lenis-ring-track" cx="27" cy="27" r="23"></circle>' +
            '<circle class="lenis-ring-value" cx="27" cy="27" r="23"></circle>' +
            '</svg>' +
            '<svg class="lenis-top-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path>' +
            '</svg>';

        ringValue = topButton.querySelector(".lenis-ring-value");

        topButton.addEventListener("click", function () {
            if (lenis && !lenis.isStopped) {
                lenis.scrollTo(0, { duration: 1.6, easing: easeOutExpo });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        document.body.appendChild(topButton);
    }

    var lastDirection = 0;
    var lastScrolled = false;

    function updateUi(lenis) {
        var y = currentScroll(lenis);
        var progress = scrollProgress(lenis);

        if (progressBar) {
            progressBar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
        }

        if (ringValue) {
            ringValue.style.strokeDashoffset = (RING_LENGTH * (1 - progress)).toFixed(2);
        }

        if (topButton) {
            topButton.classList.toggle("is-visible", y > window.innerHeight * 0.6);
        }

        var scrolled = y > 40;
        if (scrolled !== lastScrolled) {
            lastScrolled = scrolled;
            root.classList.toggle("lenis-scrolled", scrolled);
        }

        var direction = lenis && lenis.direction ? lenis.direction : 0;
        if (direction !== 0 && direction !== lastDirection) {
            lastDirection = direction;
            root.classList.toggle("lenis-down", direction > 0);
            root.classList.toggle("lenis-up", direction < 0);
        }

        updateParallax();
    }

    function collectParallax() {
        parallaxItems = [].slice.call(document.querySelectorAll("[data-lenis-parallax]"));
        parallaxItems.forEach(function (el) {
            if (typeof el._lenisShift !== "number") el._lenisShift = 0;
        });
    }

    function updateParallax() {
        if (reduceMotion || !parallaxItems.length) return;

        var viewport = window.innerHeight;

        parallaxItems.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.bottom < -300 || rect.top > viewport + 300) return;

            var speed = parseFloat(el.getAttribute("data-lenis-parallax"));
            if (isNaN(speed)) speed = 0.12;

            var baseCenter = rect.top - el._lenisShift + rect.height / 2;
            var shift = (viewport / 2 - baseCenter) * speed;

            el._lenisShift = shift;
            el.style.translate = "0 " + shift.toFixed(2) + "px";
        });
    }

    function initSpotlight() {
        if (!finePointer) return;

        var pending = null;
        var ticking = false;
        var active = null;

        function prepare(card) {
            if (card._lenisSpot) return;

            var spot = document.createElement("span");
            spot.className = "lenis-spot";
            spot.setAttribute("aria-hidden", "true");

            if (window.getComputedStyle(card).position === "static") {
                card.style.position = "relative";
            }

            card.appendChild(spot);
            card._lenisSpot = spot;
        }

        function release() {
            if (active) {
                active.classList.remove("lenis-spotlit");
                active = null;
            }
        }

        function apply() {
            ticking = false;

            var event = pending;
            if (!event || !event.target || !event.target.closest) return;

            var card = event.target.closest(SPOT_SELECTOR);

            if (card !== active) {
                release();
                if (card) {
                    prepare(card);
                    card.classList.add("lenis-spotlit");
                    active = card;
                }
            }

            if (card) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty("--lx", (event.clientX - rect.left).toFixed(1) + "px");
                card.style.setProperty("--ly", (event.clientY - rect.top).toFixed(1) + "px");
            }
        }

        document.addEventListener("pointermove", function (event) {
            pending = event;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(apply);
            }
        }, { passive: true });

        root.addEventListener("mouseleave", release);
        window.addEventListener("blur", release);
    }

    function boot() {
        if (typeof window.Lenis !== "function" && !window.stacklyLenis) {
            console.error("Lenis library could not be loaded.");
            return;
        }

        var lenis = window.stacklyLenis || createLenis();

        buildProgressBar();
        buildTopButton(lenis);
        collectParallax();

        lenis.on("scroll", function () { updateUi(lenis); });

        watchScrollLocks(lenis);
        watchLayout(lenis);
        initSpotlight();
        updateUi(lenis);

        window.stacklyLenisRefresh = function () {
            collectParallax();
            refreshAll(lenis);
        };
    }

    function start() {
        if (!document.body) {
            document.addEventListener("DOMContentLoaded", start, { once: true });
            return;
        }

        if (typeof window.Lenis === "function" || window.stacklyLenis) {
            boot();
            return;
        }

        var script = document.createElement("script");
        script.src = LENIS_SRC;
        script.onload = boot;
        script.onerror = boot;
        document.head.appendChild(script);
    }

    start();
})();