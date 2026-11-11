
document.addEventListener("DOMContentLoaded", function () {

    const mobileMenu = document.getElementById("stacklyMobileMenu");

    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;



    if (typeof gsap !== "undefined" && !prefersReducedMotion) {

        const headerTimeline = gsap.timeline();

        headerTimeline
            .from(".stackly-header", {
                y: -80,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out"
            })
            .from(".stackly-logo", {
                x: -30,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.3")
            .from(".desktop-navigation .nav-item", {
                y: -15,
                opacity: 0,
                stagger: 0.12,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.2")
            .from(".header-actions > *", {
                y: -15,
                opacity: 0,
                stagger: 0.15,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.3")
            .from(".mobile-header-actions", {
                y: -15,
                opacity: 0,
                duration: 0.4
            }, "-=0.3");

    }



    mobileMenu.addEventListener("show.bs.offcanvas", function () {

        if (typeof gsap !== "undefined" && !prefersReducedMotion) {

            gsap.set(
                ".drawer-logo, .mobile-search, .mobile-nav-link, .mobile-account-links a",
                {
                    clearProps: "all"
                }
            );

        }

    });



mobileMenu.addEventListener("shown.bs.offcanvas", function () {

    if (typeof gsap !== "undefined" && !prefersReducedMotion) {

        gsap.killTweensOf(".mobile-nav-link");

        gsap.fromTo(
            ".mobile-nav-link",
            {
                x: 25,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "transform,opacity"
            }
        );

    }

});

    mobileNavLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const offcanvasInstance = bootstrap.Offcanvas.getInstance(mobileMenu);

            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }

        });

    });



    mobileMenu.addEventListener("show.bs.offcanvas", function () {

        document.body.classList.add("mobile-menu-active");

    });


    mobileMenu.addEventListener("hidden.bs.offcanvas", function () {

        document.body.classList.remove("mobile-menu-active");

    });



    window.addEventListener("resize", function () {

        if (window.innerWidth >= 1200 && mobileMenu.classList.contains("show")) {

            const offcanvasInstance = bootstrap.Offcanvas.getInstance(mobileMenu);

            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }

        }

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";

    document.querySelectorAll(
        ".mobile-navigation .mobile-nav-link"
    ).forEach(function (link) {

        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const linkPage = href.split("/").pop().toLowerCase();

        link.classList.toggle(
            "active",
            linkPage === currentPage
        );

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";

    document.querySelectorAll(
        ".navbar-nav .nav-link, .mobile-navigation .mobile-nav-link"
    ).forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (!linkPage || linkPage === "#") return;

        const page = linkPage.split("/").pop().toLowerCase();

        link.classList.toggle("active", page === currentPage);

    });

});







document.addEventListener("DOMContentLoaded", function () {

    if (typeof gsap === "undefined") return;

    const hero = document.querySelector(".stackly-hero");

    if (!hero) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    gsap.set([
        ".hero-label",
        ".hero-title",
        ".hero-description",
        ".hero-buttons"
    ], {
        y: 35,
        autoAlpha: 0
    });

    gsap.set(".hero-image-wrapper", {
        autoAlpha: 0,
        scale: 0.92,
        x: 35,
        clipPath: "inset(0 0 0 100%)"
    });

    timeline
        .to(".hero-label", {
            y: 0,
            autoAlpha: 1,
            duration: 0.65
        })
        .to(".hero-title", {
            y: 0,
            autoAlpha: 1,
            duration: 1
        }, "-=0.35")
        .to(".hero-description", {
            y: 0,
            autoAlpha: 1,
            duration: 0.75
        }, "-=0.55")
        .to(".hero-buttons", {
            y: 0,
            autoAlpha: 1,
            duration: 0.65
        }, "-=0.4")
        .to(".hero-image-wrapper", {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            clipPath: "inset(0 0 0 0)",
            duration: 1.3,
            ease: "power3.inOut"
        }, "-=1");

    gsap.to(".hero-image-wrapper", {
        y: -8,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".hero-image-glow", {
        scale: 1.2,
        opacity: 0.7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.from(".hero-image-decoration", {
        opacity: 0,
        scale: 0.5,
        duration: 1.2,
        delay: 0.8,
        ease: "power2.out"
    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-curation");

    if (!section || typeof gsap === "undefined") return;

    const cards = section.querySelectorAll(".curation-card");
    const heading = section.querySelector(".curation-header");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        gsap.from(heading, {
            y: 35,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true
            }
        });

        gsap.from(cards, {
            y: 65,
            opacity: 0,
            scale: 0.96,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".curation-grid",
                start: "top 85%",
                once: true
            }
        });

        gsap.from(".curation-bottom", {
            y: 20,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: {
                trigger: ".curation-bottom",
                start: "top 95%",
                once: true
            }
        });

    } else {

        gsap.from(cards, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });

    }

    const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    cards.forEach(function (card) {

        const image = card.querySelector(".curation-image");
        const content = card.querySelector(".curation-content");
        const category = card.querySelector(".curation-category");
        const extra = card.querySelector(".curation-extra");
        const index = card.querySelector(".curation-index");
        const corner = card.querySelector(".curation-corner");

        let hoverTimeline;

        card.addEventListener("mouseenter", function () {

            if (hoverTimeline) hoverTimeline.kill();

            hoverTimeline = gsap.timeline();

            hoverTimeline
                .to(image, {
                    scale: 1.1,
                    duration: 0.8,
                    ease: "power2.out"
                }, 0)
                .to(content, {
                    y: -7,
                    duration: 0.45,
                    ease: "power3.out"
                }, 0)
                .to([category, index, extra, corner], {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.35,
                    stagger: 0.06,
                    ease: "power2.out"
                }, 0.08);

        });

        card.addEventListener("mouseleave", function () {

            if (hoverTimeline) hoverTimeline.kill();

            hoverTimeline = gsap.timeline();

            hoverTimeline
                .to(image, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                }, 0)
                .to(content, {
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                }, 0)
                .to([category, index, extra, corner], {
                    y: 12,
                    autoAlpha: 0,
                    duration: 0.25,
                    stagger: 0.03,
                    ease: "power2.in"
                }, 0);

        });

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-vanguard");

    if (!section || typeof gsap === "undefined") return;

    const image = section.querySelector(".vanguard-image");
    const rating = section.querySelector(".vanguard-rating");
    const content = section.querySelector(".vanguard-content");
    const features = section.querySelectorAll(".vanguard-feature");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const revealSettings = {
        trigger: section,
        start: "top 75%",
        once: true
    };

    gsap.from(".vanguard-image-wrapper", {
        x: -65,
        opacity: 0,
        scale: 0.94,
        duration: 1.25,
        ease: "power3.out",
        scrollTrigger: revealSettings
    });

    gsap.from(".vanguard-content > *", {
        x: 45,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: revealSettings
    });

    gsap.from(features, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".vanguard-features",
            start: "top 85%",
            once: true
        }
    });

    gsap.from(rating, {
        y: 40,
        x: 15,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 0.35,
        ease: "back.out(1.4)",
        scrollTrigger: revealSettings
    });

    gsap.from(".rating-progress span", {
        scaleX: 0,
        duration: 1.5,
        delay: 0.8,
        ease: "power3.out",
        scrollTrigger: revealSettings
    });

    gsap.to(rating, {
        y: -9,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".vanguard-image-glow", {
        scale: 1.18,
        opacity: 0.7,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        section.addEventListener("pointermove", function (event) {

            const rect = section.getBoundingClientRect();

            const relativeX =
                (event.clientX - rect.left) / rect.width - 0.5;

            const relativeY =
                (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(image, {
                x: relativeX * 9,
                y: relativeY * 9,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });

            gsap.to(content, {
                x: relativeX * -4,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        section.addEventListener("pointerleave", function () {

            gsap.to([image, content], {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
            });

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-performance");

    if (!section || typeof gsap === "undefined") return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = section.querySelectorAll(".performance-card");

    const line = section.querySelector(".thermal-line");

    const area = section.querySelector(".thermal-area-path");

    const points = section.querySelectorAll(".thermal-point");

    const bars = section.querySelectorAll(".velocity-bar");

    const counter = section.querySelector(".counter-value");

    if (reducedMotion) {

        bars.forEach(function (bar) {
            bar.style.transform = "scaleY(1)";
        });

        if (area) area.style.opacity = "1";

        points.forEach(function (point) {
            point.style.opacity = "1";
        });

        return;
    }

    const animatedElements = [
        ".performance-header",
        ".velocity-card",
        ".thermal-card",
        ".specs-card"
    ];

    animatedElements.forEach(function (selector, index) {

        const element = section.querySelector(selector);

        if (!element) return;

        gsap.fromTo(
            element,
            {
                y: 55,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                delay: index === 0 ? 0 : index * 0.12,
                ease: "power3.out",
                scrollTrigger: typeof ScrollTrigger !== "undefined" ? {
                    trigger: section,
                    start: "top 78%",
                    once: true
                } : undefined
            }
        );

    });

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const chartTrigger = {
        trigger: section,
        start: "top 75%",
        once: true
    };

    bars.forEach(function (bar) {

        const height = Number(bar.dataset.height);

        if (!Number.isFinite(height)) return;

        bar.style.setProperty("--bar-height", height);

        gsap.fromTo(
            bar,
            {
                scaleY: 0
            },
            {
                scaleY: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: typeof ScrollTrigger !== "undefined"
                    ? chartTrigger
                    : undefined
            }
        );

    });

    if (line) {

        const length = line.getTotalLength();

        gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? chartTrigger
                : undefined
        });

    }

    if (area) {

        gsap.to(area, {
            opacity: 1,
            duration: 1.4,
            delay: 0.5,
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? chartTrigger
                : undefined
        });

    }

    if (points.length) {

        gsap.to(points, {
            opacity: 1,
            stagger: 0.16,
            duration: 0.35,
            delay: 0.9,
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? chartTrigger
                : undefined
        });

    }

    if (counter) {

        const target = Number(counter.dataset.value);
        const state = { value: 0 };

        gsap.to(state, {
            value: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? chartTrigger
                : undefined,
            onUpdate: function () {
                counter.textContent = Math.round(state.value);
            }
        });

    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            card.addEventListener("mouseenter", function () {

                gsap.to(card, {
                    y: -7,
                    duration: 0.35,
                    ease: "power2.out"
                });

            });

            card.addEventListener("mouseleave", function () {

                gsap.to(card, {
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });

            });

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-care");

    if (!section || typeof gsap === "undefined") return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = section.querySelectorAll(".care-card");

    if (reduceMotion) return;

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const triggerSettings = typeof ScrollTrigger !== "undefined"
        ? {
            trigger: section,
            start: "top 78%",
            once: true
        }
        : undefined;

    gsap.fromTo(
        ".care-eyebrow",
        {
            y: 22,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: triggerSettings
        }
    );

    gsap.fromTo(
        ".care-heading-content h2",
        {
            y: 35,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: triggerSettings
        }
    );

    gsap.fromTo(
        ".care-heading-content > p",
        {
            y: 20,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.25,
            ease: "power2.out",
            scrollTrigger: triggerSettings
        }
    );

    gsap.fromTo(
        cards,
        {
            y: 65,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: ".care-grid",
                    start: "top 82%",
                    once: true
                }
                : undefined
        }
    );

    gsap.fromTo(
        ".care-trust-strip",
        {
            y: 35,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: typeof ScrollTrigger !== "undefined"
                ? {
                    trigger: ".care-trust-strip",
                    start: "top 90%",
                    once: true
                }
                : undefined
        }
    );

    gsap.to(".care-badge-icon", {
        rotation: 12,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const icon = card.querySelector(".care-icon");
            const glow = card.querySelector(".care-card-glow");
            const link = card.querySelector(".care-learn-link i");

            card.addEventListener("mouseenter", function () {

                gsap.to(card, {
                    y: -8,
                    duration: 0.4,
                    ease: "power2.out"
                });

                gsap.to(icon, {
                    rotation: -8,
                    scale: 1.08,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });

                gsap.to(glow, {
                    opacity: 1,
                    duration: 0.4
                });

                gsap.to(link, {
                    x: 5,
                    duration: 0.3
                });

            });

            card.addEventListener("mouseleave", function () {

                gsap.to(card, {
                    y: 0,
                    duration: 0.45,
                    ease: "power2.out"
                });

                gsap.to(icon, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.4
                });

                gsap.to(glow, {
                    opacity: 0,
                    duration: 0.4
                });

                gsap.to(link, {
                    x: 0,
                    duration: 0.3
                });

            });

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-testimonials");

    if (!section) {
        console.error("Stackly testimonials section not found.");
        return;
    }

    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded. Load GSAP before testimonials.js.");
        return;
    }

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const header = section.querySelector(".testimonials-header");
    const cards = [...section.querySelectorAll(".testimonial-card")];
    const footer = section.querySelector(".testimonial-footer");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    let observer = null;
    let timelines = [];
    let currentMode = "";

    const hasHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    function getScreenMode() {

        const width = window.innerWidth;

        if (width >= 1200) return "desktop";
        if (width >= 768) return "tablet";

        return "mobile";
    }

    function getInitialCardPosition(index, mode) {

        if (mode === "desktop") {

            return {
                x: index % 2 === 0 ? -140 : 140,
                y: 75,
                rotationY: index % 2 === 0 ? -12 : 12,
                rotationX: 10,
                scale: 0.85
            };

        }

        if (mode === "tablet") {

            return {
                x: index % 2 === 0 ? -70 : 70,
                y: 65,
                rotationY: index % 2 === 0 ? -6 : 6,
                rotationX: 5,
                scale: 0.9
            };

        }

        return {
            x: 0,
            y: 85,
            rotationY: 0,
            rotationX: 6,
            scale: 0.93
        };
    }

    function registerTimeline(element, timeline) {

        element._stacklyTimeline = timeline;

        timelines.push(timeline);
    }

    function createHeaderAnimation() {

        if (!header) return;

        const eyebrow = header.querySelector(".testimonial-eyebrow");
        const title = header.querySelector("h2");
        const subtitle = header.querySelector(":scope > p");
        const decoration = header.querySelector(
            ".testimonial-header-decoration"
        );

        const tl = gsap.timeline({
            paused: true
        });

        gsap.set(eyebrow, {
            autoAlpha: 0,
            y: 35,
            letterSpacing: "7px"
        });

        gsap.set(title, {
            autoAlpha: 0,
            y: 65,
            scale: 0.85,
            rotationX: 12,
            transformOrigin: "center bottom"
        });

        gsap.set(subtitle, {
            autoAlpha: 0,
            y: 25
        });

        gsap.set(decoration, {
            autoAlpha: 0,
            scale: 0.5,
            rotation: -40
        });

        tl.to(eyebrow, {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "2.5px",
            duration: 0.7,
            ease: "power3.out"
        })

        .to(title, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.35")

        .to(subtitle, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out"
        }, "-=0.6")

        .to(decoration, {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.5");

        registerTimeline(header, tl);
    }

    function createCardAnimation(card, index, mode) {

        const position = getInitialCardPosition(index, mode);

        const top = card.querySelector(".testimonial-card-top");
        const quote = card.querySelector(".testimonial-quote-icon");
        const blockquote = card.querySelector("blockquote");
        const avatar = card.querySelector(".testimonial-avatar");
        const author = card.querySelector(".testimonial-author-info");
        const rating = card.querySelector(".testimonial-rating");
        const bottom = card.querySelector(".testimonial-card-bottom");
        const image = card.querySelector(".testimonial-avatar img");

        const tl = gsap.timeline({
            paused: true,
            defaults: {
                ease: "power3.out"
            }
        });

        gsap.set(card, {
            autoAlpha: 0,
            x: position.x,
            y: position.y,
            scale: position.scale,
            rotationY: position.rotationY,
            rotationX: position.rotationX,
            transformPerspective: 1200,
            transformOrigin: "center center",
            filter: "blur(8px)"
        });

        gsap.set(top, {
            autoAlpha: 0,
            y: -20
        });

        gsap.set(quote, {
            autoAlpha: 0,
            scale: 0.2,
            rotation: -55
        });

        gsap.set(blockquote, {
            autoAlpha: 0,
            y: 35,
            filter: "blur(4px)"
        });

        gsap.set(avatar, {
            autoAlpha: 0,
            scale: 0.5,
            x: -25,
            rotation: -20
        });

        gsap.set(author, {
            autoAlpha: 0,
            x: 30
        });

        gsap.set(rating, {
            autoAlpha: 0,
            y: -15
        });

        gsap.set(bottom, {
            autoAlpha: 0,
            y: 20
        });

        if (image) {
            gsap.set(image, {
                scale: 1.35
            });
        }

        tl.to(card, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.1
        })

        .to(top, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65
        }, "-=0.75")

        .to(quote, {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.8)"
        }, "-=0.55")

        .to(blockquote, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8
        }, "-=0.45")

        .to(avatar, {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.7)"
        }, "-=0.45")

        .to(author, {
            autoAlpha: 1,
            x: 0,
            duration: 0.6
        }, "-=0.55")

        .to(rating, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5
        }, "-=0.8")

        .to(bottom, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6
        }, "-=0.4");

        if (image) {

            tl.to(image, {
                scale: 1,
                duration: 1,
                ease: "power2.out"
            }, 0.2);

        }

        registerTimeline(card, tl);

        return tl;
    }

    function createFooterAnimation() {

        if (!footer) return;

        const tl = gsap.timeline({
            paused: true
        });

        gsap.set(footer, {
            autoAlpha: 0,
            y: 45
        });

        tl.to(footer, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        registerTimeline(footer, tl);
    }

    function setupObserver() {

        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    const element = entry.target;
                    const timeline = element._stacklyTimeline;

                    if (!timeline) return;

                    if (entry.isIntersecting) {

                        timeline.play();

                    } else if (
                        entry.boundingClientRect.top > 0
                    ) {

                        timeline.reverse();

                    }

                });

            },
            {
                root: null,
                rootMargin: "0px 0px -7% 0px",
                threshold: 0.08
            }
        );

        [header, ...cards, footer]
            .filter(Boolean)
            .forEach(function (element) {

                observer.observe(element);

            });
    }

    function destroyAnimations() {

        if (observer) {
            observer.disconnect();
            observer = null;
        }

        timelines.forEach(function (timeline) {
            timeline.kill();
        });

        timelines = [];

        const elements = section.querySelectorAll(
            ".testimonials-header, .testimonial-eyebrow, " +
            ".testimonials-header h2, .testimonials-header > p, " +
            ".testimonial-header-decoration, .testimonial-card, " +
            ".testimonial-card-top, .testimonial-quote-icon, " +
            ".testimonial-card blockquote, .testimonial-avatar, " +
            ".testimonial-avatar img, .testimonial-author-info, " +
            ".testimonial-rating, .testimonial-card-bottom, " +
            ".testimonial-footer"
        );

        gsap.killTweensOf(elements);

        gsap.set(elements, {
            clearProps: "all"
        });
    }

    function initializeAnimations() {

        const mode = getScreenMode();

        if (mode === currentMode) return;

        currentMode = mode;

        destroyAnimations();

        createHeaderAnimation();

        cards.forEach(function (card, index) {

            createCardAnimation(card, index, mode);

        });

        createFooterAnimation();

        setupObserver();

        console.log(
            "STACKLY Testimonials animations initialized:",
            mode
        );
    }

    initializeAnimations();


   
    let resizeTimer;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {

            initializeAnimations();

        }, 250);

    });


    window.addEventListener("orientationchange", function () {

        setTimeout(initializeAnimations, 350);

    });



    window.addEventListener("pageshow", function () {

        if (!observer) {
            initializeAnimations();
        }

    });



    if (hasHover.matches) {

        cards.forEach(function (card) {

            const glow = card.querySelector(
                ".testimonial-card-glow"
            );

            card.addEventListener("pointermove", function (event) {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty(
                    "--mouse-x",
                    x + "px"
                );

                card.style.setProperty(
                    "--mouse-y",
                    y + "px"
                );

                const rotateY = (x / rect.width - 0.5) * 4;
                const rotateX = (y / rect.height - 0.5) * -4;

                gsap.to(card, {
                    rotationY: rotateY,
                    rotationX: rotateX,
                    transformPerspective: 1200,
                    duration: 0.35,
                    overwrite: "auto"
                });

                if (glow) {
                    gsap.to(glow, {
                        opacity: 1,
                        duration: 0.3
                    });
                }

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });

                if (glow) {
                    gsap.to(glow, {
                        opacity: 0,
                        duration: 0.4
                    });
                }

            });

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-insights");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.insightsInitialized === "true") return;

    section.dataset.insightsInitialized = "true";

    const cards = section.querySelectorAll(".insight-card");
    const header = section.querySelector(".insights-header");
    const footer = section.querySelector(".insights-footer");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let observer;

    function createAnimation(element, index, type) {

        const isDesktop = window.innerWidth > 767;

        let from = {};

        if (type === "header") {

            from = {
                y: 50,
                opacity: 0,
                filter: "blur(8px)"
            };

        } else if (type === "footer") {

            from = {
                y: 35,
                opacity: 0
            };

        } else {

            from = {
                y: 65,
                x: isDesktop && index % 2 === 0 ? -35 :
                   isDesktop ? 35 : 0,
                opacity: 0,
                scale: 0.94,
                filter: "blur(8px)"
            };

        }

        const timeline = gsap.timeline({
            paused: true
        });

        timeline.fromTo(
            element,
            from,
            {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: type === "header" ? 1 : 0.85,
                ease: "power3.out"
            }
        );

        return timeline;
    }

    const elements = [
        {
            element: header,
            type: "header",
            index: 0
        },
        ...Array.from(cards).map(function (card, index) {
            return {
                element: card,
                type: "card",
                index: index
            };
        }),
        {
            element: footer,
            type: "footer",
            index: 0
        }
    ].filter(function (item) {
        return item.element;
    });

    const animations = new Map();

    elements.forEach(function (item) {

        const timeline = createAnimation(
            item.element,
            item.index,
            item.type
        );

        animations.set(item.element, timeline);

        observer && observer.unobserve(item.element);

    });

    observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                const timeline = animations.get(entry.target);

                if (!timeline) return;

                if (entry.isIntersecting) {

                    timeline.play();

                } else if (entry.boundingClientRect.top > 0) {

                    timeline.reverse();

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -5% 0px"
        }
    );

    elements.forEach(function (item) {
        observer.observe(item.element);
    });


    

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const image = card.querySelector(".insight-image");
            const action = card.querySelector(".insight-image-action");

            card.addEventListener("mouseenter", function () {

                gsap.to(image, {
                    scale: 1.09,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                gsap.to(action, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.35,
                    ease: "back.out(1.7)"
                });

            });

            card.addEventListener("mouseleave", function () {

                gsap.to(image, {
                    scale: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                gsap.to(action, {
                    scale: 0.8,
                    rotation: -15,
                    duration: 0.3
                });

            });

        });

    }



    window.addEventListener("pagehide", function () {

        if (observer) {
            observer.disconnect();
        }

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-elite-cta");

    if (!section) return;

    const form = section.querySelector("#eliteSubscriptionForm");
    const emailInput = section.querySelector("#eliteEmail");
    const message = section.querySelector("#eliteEmailError");
    const subscribeButton = section.querySelector(".elite-subscribe-btn");
    const buttonText = subscribeButton.querySelector("span");

    if (!form || !emailInput || !message || !subscribeButton) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let redirectTimer = null;
    let isSubmitting = false;

    /* RESET SUBSCRIPTION FORM */

    function resetSubscriptionState() {

        if (redirectTimer) {
            clearTimeout(redirectTimer);
            redirectTimer = null;
        }

        isSubmitting = false;

        subscribeButton.disabled = false;
        buttonText.textContent = "SUBSCRIBE";

        message.textContent = "";
        message.className = "elite-form-message";

        emailInput.setAttribute("aria-invalid", "false");

        subscribeButton.style.opacity = "1";

        if (typeof gsap !== "undefined") {
            gsap.set(subscribeButton, {
                clearProps: "transform"
            });
        }
    }

    /* IMPORTANT: RESET WHEN RETURNING FROM ERROR PAGE */

    window.addEventListener("pageshow", function () {
        resetSubscriptionState();
    });

    window.addEventListener("pagehide", function () {
        resetSubscriptionState();
    });


    /* GSAP ENTRANCE ANIMATION */

    if (typeof gsap !== "undefined" && !reduceMotion) {

        const content = section.querySelector(".elite-content");

        const animatedElements = [
            ".elite-label",
            ".elite-crown",
            ".elite-title",
            ".elite-description",
            ".elite-benefits",
            ".elite-cta-form",
            ".elite-bottom"
        ];

        gsap.set(animatedElements.map(selector =>
            section.querySelector(selector)
        ), {
            y: 30,
            autoAlpha: 0
        });

        const timeline = gsap.timeline({
            scrollTrigger: typeof ScrollTrigger !== "undefined" ? {
                trigger: section,
                start: "top 85%",
                once: true
            } : {}
        });

        timeline
            .to(".elite-label", {
                y: 0,
                autoAlpha: 1,
                duration: 0.6,
                ease: "power3.out"
            })
            .to(".elite-crown", {
                y: 0,
                autoAlpha: 1,
                rotation: 360,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.3")
            .to(".elite-title", {
                y: 0,
                autoAlpha: 1,
                duration: 0.85,
                ease: "power3.out"
            }, "-=0.4")
            .to(".elite-description", {
                y: 0,
                autoAlpha: 1,
                duration: 0.7
            }, "-=0.4")
            .to(".elite-benefits", {
                y: 0,
                autoAlpha: 1,
                duration: 0.7
            }, "-=0.35")
            .to(".elite-cta-form", {
                y: 0,
                autoAlpha: 1,
                duration: 0.75,
                ease: "back.out(1.3)"
            }, "-=0.35")
            .to(".elite-bottom", {
                y: 0,
                autoAlpha: 1,
                duration: 0.65
            }, "-=0.3");

        gsap.to(".elite-glow-one", {
            x: 35,
            y: 25,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".elite-glow-two", {
            x: -30,
            y: -20,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".elite-crown", {
            y: -5,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

    }


    /* EMAIL VALIDATION */

    function validateEmail(email) {

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            return "Please enter your email address.";
        }

        if (normalizedEmail.length > 254) {
            return "Email address is too long.";
        }

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return "Please enter a valid email address.";
        }

        return "";
    }


    function showMessage(text, type) {

        message.textContent = text;

        message.className = "elite-form-message";

        if (type === "success") {
            message.classList.add("success");
        }

        emailInput.setAttribute(
            "aria-invalid",
            type === "error" ? "true" : "false"
        );

    }


    /* CLEAR VALIDATION WHILE TYPING */

    emailInput.addEventListener("input", function () {

        if (!isSubmitting) {
            showMessage("", "");
        }

    });


    /* SUBSCRIPTION FORM */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (isSubmitting) return;

        const email = emailInput.value.trim();

        const validationError = validateEmail(email);

        if (validationError) {

            showMessage(validationError, "error");

            emailInput.focus();

            return;
        }

        isSubmitting = true;

        subscribeButton.disabled = true;

        buttonText.textContent = "PROCESSING";

        showMessage(
            "Thank you! Redirecting...",
            "success"
        );

        const returnState = {
            url: window.location.href,
            pathname: window.location.pathname,
            scrollY: window.scrollY,
            sectionId: "elite-tier",
            timestamp: Date.now()
        };

        try {

            sessionStorage.setItem(
                "stacklyErrorReturn",
                JSON.stringify(returnState)
            );

        } catch (error) {

            console.warn("Return position could not be saved.", error);

        }


        if (typeof gsap !== "undefined" && !reduceMotion) {

            gsap.to(subscribeButton, {
                scale: 0.96,
                duration: 0.15,
                yoyo: true,
                repeat: 1
            });

        }


        redirectTimer = setTimeout(function () {

            window.location.href = "error.html";

        }, 650);

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const footer = document.querySelector(".stackly-footer");

    if (!footer) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || typeof gsap === "undefined") return;

    const brand = footer.querySelector(".footer-brand");
    const columns = footer.querySelectorAll(".footer-column");
    const bottom = footer.querySelector(".footer-bottom");

    gsap.set(brand, {
        opacity: 0,
        x: -35
    });

    gsap.set(columns, {
        opacity: 0,
        y: 35
    });

    gsap.set(bottom, {
        opacity: 0,
        y: 20
    });

    const timeline = gsap.timeline({
        paused: true
    });

    timeline
        .to(brand, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out"
        })
        .to(columns, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.4")
        .to(bottom, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out"
        }, "-=0.3");

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    timeline.play();
                    observer.disconnect();
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    observer.observe(footer);

});