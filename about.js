document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-about-hero");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.aboutHeroInit === "true") return;

    section.dataset.aboutHeroInit = "true";

    const image = section.querySelector(".about-hero-image");

    const eyebrow = section.querySelector(".about-hero-eyebrow");

    const title = section.querySelector(".about-hero-title");

    const description = section.querySelector(".about-hero-description");

    const bottom = section.querySelector(".about-hero-bottom");

    const scrollIndicator = section.querySelector(".about-hero-scroll");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    gsap.set(image, {
        scale: 1.2,
        opacity: 0.65
    });

    gsap.set(eyebrow, {
        y: 25,
        autoAlpha: 0
    });

    gsap.set(title, {
        y: 65,
        autoAlpha: 0,
        filter: "blur(10px)"
    });

    gsap.set(description, {
        y: 30,
        autoAlpha: 0
    });

    gsap.set(bottom, {
        y: 20,
        autoAlpha: 0
    });

    gsap.set(scrollIndicator, {
        y: 15,
        autoAlpha: 0
    });

    timeline

        .to(image, {
            scale: 1.05,
            opacity: 1,
            duration: 2,
            ease: "power2.out"
        })

        .to(eyebrow, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8
        }, "-=1.4")

        .to(title, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.3
        }, "-=0.65")

        .to(description, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9
        }, "-=0.75")

        .to(bottom, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7
        }, "-=0.5")

        .to(scrollIndicator, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7
        }, "-=0.3");


    /* SUBTLE BACKGROUND PARALLAX */

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        section.addEventListener("pointermove", function (event) {

            const rect = section.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;

            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(image, {
                x: x * -12,
                y: y * -8,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        section.addEventListener("pointerleave", function () {

            gsap.to(image, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "power3.out",
                overwrite: "auto"
            });

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-pillars");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.pillarsInitialized === "true") return;

    section.dataset.pillarsInitialized = "true";

    const cards = section.querySelectorAll(".pillar-card");
    const header = section.querySelector(".pillars-header");
    const manifesto = section.querySelector(".pillars-manifesto");
    const footer = section.querySelector(".pillars-bottom");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const elements = [
        header,
        ...cards,
        manifesto,
        footer
    ].filter(Boolean);

    const timelines = new Map();

    elements.forEach(function (element, index) {

        let from;

        if (element.classList.contains("pillars-header")) {

            from = {
                y: 50,
                opacity: 0,
                filter: "blur(8px)"
            };

        } else if (element.classList.contains("pillar-card")) {

            const direction = index % 2 === 0 ? -65 : 65;

            from = {
                x: direction,
                y: 65,
                opacity: 0,
                scale: 0.9,
                rotationY: direction > 0 ? 8 : -8,
                filter: "blur(7px)"
            };

        } else {

            from = {
                y: 40,
                opacity: 0
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
                rotationY: 0,
                filter: "blur(0px)",
                duration: element.classList.contains("pillar-card")
                    ? 1
                    : 0.85,
                ease: "power3.out"
            }
        );

        timelines.set(element, timeline);

    });


    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                const timeline = timelines.get(entry.target);

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

    elements.forEach(function (element) {
        observer.observe(element);
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const icon = card.querySelector(".pillar-icon");
            const glow = card.querySelector(".pillar-card-glow");
            const link = card.querySelector(".pillar-link i");

            card.addEventListener("pointermove", function (event) {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY = (x / rect.width - 0.5) * 5;
                const rotateX = (y / rect.height - 0.5) * -5;

                card.style.setProperty("--pillar-x", x + "px");
                card.style.setProperty("--pillar-y", y + "px");

                gsap.to(card, {
                    rotationY: rotateY,
                    rotationX: rotateX,
                    transformPerspective: 1100,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                if (glow) {

                    glow.style.left = x + "px";
                    glow.style.top = y + "px";

                    gsap.to(glow, {
                        opacity: 1,
                        duration: 0.3
                    });

                }

            });

            card.addEventListener("pointerenter", function () {

                gsap.to(icon, {
                    rotation: -12,
                    scale: 1.12,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });

                gsap.to(card, {
                    y: -7,
                    duration: 0.35,
                    ease: "power2.out"
                });

                if (link) {
                    gsap.to(link, {
                        x: 6,
                        duration: 0.3
                    });
                }

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });

                gsap.to(icon, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.4
                });

                if (glow) {
                    gsap.to(glow, {
                        opacity: 0,
                        duration: 0.4
                    });
                }

                if (link) {
                    gsap.to(link, {
                        x: 0,
                        duration: 0.3
                    });
                }

            });

        });

    }


    gsap.to(".manifesto-symbol", {
        rotation: 180,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    window.addEventListener("pagehide", function () {
        observer.disconnect();
    });

    window.addEventListener("pageshow", function () {

        if (!observer) return;

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-team");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const header = section.querySelector(".team-header");
    const cards = section.querySelectorAll(".team-card");
    const footer = section.querySelector(".team-bottom");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const elements = [
        header,
        ...cards,
        footer
    ].filter(Boolean);

    const animations = new Map();

    elements.forEach(function (element, index) {

        let from = {};

        if (element.classList.contains("team-header")) {

            from = {
                y: 45,
                opacity: 0,
                filter: "blur(7px)"
            };

        } else if (element.classList.contains("team-card")) {

            const direction = index % 2 === 0 ? -65 : 65;

            from = {
                x: direction,
                y: 65,
                opacity: 0,
                scale: 0.9,
                rotationY: direction > 0 ? 9 : -9,
                filter: "blur(8px)"
            };

        } else {

            from = {
                y: 30,
                opacity: 0
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
                rotationY: 0,
                filter: "blur(0px)",
                duration: 0.95,
                ease: "power3.out"
            }
        );

        animations.set(element, timeline);

    });


    const observer = new IntersectionObserver(
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

    elements.forEach(function (element) {
        observer.observe(element);
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const image = card.querySelector(".team-image");
            const social = card.querySelector(".team-social-overlay");
            const links = card.querySelectorAll(".team-social-links a");

            card.addEventListener("pointerenter", function () {

                gsap.to(card, {
                    y: -8,
                    duration: 0.35,
                    ease: "power2.out"
                });

                gsap.to(image, {
                    scale: 1.09,
                    duration: 0.7,
                    ease: "power2.out"
                });

                gsap.fromTo(
                    links,
                    {
                        y: 18,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.35,
                        stagger: 0.07,
                        ease: "back.out(1.5)"
                    }
                );

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(card, {
                    y: 0,
                    duration: 0.45,
                    ease: "power3.out"
                });

                gsap.to(image, {
                    scale: 1,
                    duration: 0.65,
                    ease: "power2.out"
                });

            });

        });

    }

    cards.forEach(function (card) {

        const image = card.querySelector(".team-image");
        const fallback = card.querySelector(".team-image-wrapper");

        image.addEventListener("error", function () {
            fallback.classList.add("team-image-unavailable");
        });

    });


    window.addEventListener("pagehide", function () {
        observer.disconnect();
    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-manifesto");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const header = section.querySelector(".manifesto-header");
    const intro = section.querySelector(".manifesto-intro");
    const cards = [...section.querySelectorAll(".manifesto-step")];
    const quote = section.querySelector(".manifesto-quote");
    const footer = section.querySelector(".manifesto-bottom");
    const progress = section.querySelector(".manifesto-track-fill");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const timelines = new Map();

    let observer;

    let progressFrame = null;

    function createTimeline(element, index, type) {

        let from = {};

        if (type === "header") {

            from = {
                y: 55,
                opacity: 0,
                filter: "blur(8px)"
            };

        } else if (type === "intro") {

            from = {
                y: 30,
                opacity: 0,
                filter: "blur(5px)"
            };

        } else if (type === "card") {

            const desktop = window.innerWidth > 900;
            const direction = index % 2 === 0 ? -1 : 1;

            from = {
                x: desktop ? direction * 90 : 0,
                y: desktop ? 55 : 65,
                opacity: 0,
                scale: 0.91,
                rotationY: desktop ? direction * 9 : 0,
                filter: "blur(7px)"
            };

        } else {

            from = {
                y: 45,
                opacity: 0,
                scale: 0.96
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
                rotationY: 0,
                filter: "blur(0px)",
                duration: type === "card" ? 1.05 : 0.85,
                ease: "power3.out"
            }
        );

        if (type === "card") {

            const icon = element.querySelector(".manifesto-step-icon");
            const content = element.querySelector(".manifesto-step-content");
            const details = element.querySelectorAll(".manifesto-detail > div");
            const cardFooter = element.querySelector(".manifesto-step-footer");

            timeline

                .fromTo(
                    icon,
                    {
                        scale: 0.4,
                        rotation: -35,
                        opacity: 0
                    },
                    {
                        scale: 1,
                        rotation: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "back.out(1.8)"
                    },
                    0.25
                )

                .fromTo(
                    content.querySelector("h3"),
                    {
                        y: 25,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55
                    },
                    0.35
                )

                .fromTo(
                    details,
                    {
                        x: -15,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.45,
                        stagger: 0.08
                    },
                    0.6
                )

                .fromTo(
                    cardFooter,
                    {
                        y: 15,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.45
                    },
                    0.8
                );

        }

        timelines.set(element, timeline);

    }


    createTimeline(header, 0, "header");

    createTimeline(intro, 0, "intro");

    cards.forEach(function (card, index) {

        createTimeline(card, index, "card");

    });

    createTimeline(quote, 0, "quote");

    createTimeline(footer, 0, "footer");


    const elements = [
        header,
        intro,
        ...cards,
        quote,
        footer
    ].filter(Boolean);


    observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                const timeline = timelines.get(entry.target);

                if (!timeline) return;

                if (entry.isIntersecting) {

                    timeline.play();

                } else {

                    timeline.reverse();

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -5% 0px"
        }
    );

    elements.forEach(function (element) {
        observer.observe(element);
    });


    /* SCROLL PROGRESS */

    function updateProgress() {

        progressFrame = null;

        if (!progress) return;

        const rect = section.getBoundingClientRect();

        const viewportHeight = window.innerHeight;

        const totalDistance = rect.height + viewportHeight;

        const travelled = viewportHeight - rect.top;

        const value = Math.max(
            0,
            Math.min(1, travelled / totalDistance)
        );

        const isMobile = window.innerWidth <= 767;

        gsap.set(progress, {

            scaleX: isMobile ? 1 : value,

            scaleY: isMobile ? value : 1,

            transformOrigin: isMobile
                ? "top center"
                : "left center"

        });

    }

    function requestProgressUpdate() {

        if (progressFrame !== null) return;

        progressFrame = requestAnimationFrame(updateProgress);

    }

    window.addEventListener(
        "scroll",
        requestProgressUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestProgressUpdate,
        { passive: true }
    );

    updateProgress();


    /* CARD HOVER EFFECT */

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const icon = card.querySelector(".manifesto-step-icon");

            const cardGlow = card.querySelector(".manifesto-step-footer i");

            card.addEventListener("pointermove", function (event) {

                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;

                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 5;

                const rotateX = (y - 0.5) * -5;

                gsap.to(card, {

                    rotationY: rotateY,

                    rotationX: rotateX,

                    transformPerspective: 1100,

                    duration: 0.35,

                    ease: "power2.out",

                    overwrite: "auto"

                });

            });

            card.addEventListener("pointerenter", function () {

                gsap.to(card, {

                    y: -7,

                    duration: 0.35,

                    ease: "power2.out",

                    overwrite: "auto"

                });

                gsap.to(icon, {

                    rotation: -10,

                    scale: 1.12,

                    duration: 0.4,

                    ease: "back.out(1.7)"

                });

                gsap.to(cardGlow, {

                    x: 5,

                    duration: 0.3

                });

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(card, {

                    y: 0,

                    rotationX: 0,

                    rotationY: 0,

                    duration: 0.55,

                    ease: "power3.out",

                    overwrite: "auto"

                });

                gsap.to(icon, {

                    rotation: 0,

                    scale: 1,

                    duration: 0.4

                });

                gsap.to(cardGlow, {

                    x: 0,

                    duration: 0.3

                });

            });

        });

    }


    /* QUOTE ICON MOTION */

    const quoteIcon = section.querySelector(".manifesto-quote-symbol");

    gsap.to(quoteIcon, {

        rotation: 360,

        duration: 18,

        repeat: -1,

        ease: "none"

    });



    window.addEventListener("pageshow", requestProgressUpdate);

    window.addEventListener("pagehide", function () {

        if (observer) {
            observer.disconnect();
        }

        if (progressFrame !== null) {
            cancelAnimationFrame(progressFrame);
        }

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-pricing");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const cards = [...section.querySelectorAll(".pricing-card")];
    const header = section.querySelector(".pricing-header");
    const bottom = section.querySelector(".pricing-bottom");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const animatedElements = [
        header,
        ...cards,
        bottom
    ].filter(Boolean);

    const timelines = new Map();

    function createAnimation(element, index) {

        let startPosition = {
            x: 0,
            y: 60,
            scale: 0.94,
            rotationY: 0
        };

        if (element.classList.contains("pricing-card")) {

            const direction = index % 2 === 0 ? -1 : 1;

            startPosition = {
                x: direction * 65,
                y: 75,
                scale: 0.91,
                rotationY: direction * 7
            };

            if (element.classList.contains("pricing-featured")) {

                startPosition = {
                    x: 0,
                    y: 100,
                    scale: 0.85,
                    rotationY: 0
                };

            }

        }

        const timeline = gsap.timeline({
            paused: true
        });

        timeline.fromTo(
            element,
            {
                x: startPosition.x,
                y: startPosition.y,
                scale: startPosition.scale,
                rotationY: startPosition.rotationY,
                opacity: 0,
                filter: "blur(8px)"
            },
            {
                x: 0,
                y: 0,
                scale: 1,
                rotationY: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out"
            }
        );

        if (element.classList.contains("pricing-card")) {

            const icon = element.querySelector(".pricing-icon");
            const price = element.querySelector(".pricing-price");
            const features = element.querySelectorAll(".pricing-features li");
            const button = element.querySelector(".pricing-button");

            timeline
                .fromTo(
                    icon,
                    {
                        scale: 0.5,
                        rotation: -35,
                        opacity: 0
                    },
                    {
                        scale: 1,
                        rotation: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "back.out(1.7)"
                    },
                    0.2
                )
                .fromTo(
                    price,
                    {
                        y: 25,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6
                    },
                    0.3
                )
                .fromTo(
                    features,
                    {
                        x: -15,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.45,
                        stagger: 0.09
                    },
                    0.5
                )
                .fromTo(
                    button,
                    {
                        y: 15,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55
                    },
                    0.8
                );

        }

        timelines.set(element, timeline);

    }

    animatedElements.forEach(function (element, index) {
        createAnimation(element, index);
    });


    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                const timeline = timelines.get(entry.target);

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

    animatedElements.forEach(function (element) {
        observer.observe(element);
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        cards.forEach(function (card) {

            const icon = card.querySelector(".pricing-icon");

            const button = card.querySelector(".pricing-button");

            card.addEventListener("pointermove", function (event) {

                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;

                const y = (event.clientY - rect.top) / rect.height;

                gsap.to(card, {
                    rotationY: (x - 0.5) * 5,
                    rotationX: (y - 0.5) * -5,
                    transformPerspective: 1100,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });

            });

            card.addEventListener("pointerenter", function () {

                gsap.to(card, {
                    y: -7,
                    duration: 0.35,
                    ease: "power2.out"
                });

                gsap.to(icon, {
                    rotation: -10,
                    scale: 1.1,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(card, {
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.55,
                    ease: "power3.out",
                    overwrite: "auto"
                });

                gsap.to(icon, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.4
                });

            });

        });

    }

    window.addEventListener("pagehide", function () {
        observer.disconnect();
    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-seal");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const commitments = section.querySelectorAll(".seal-commitment");
    const stats = section.querySelectorAll(".seal-stat");
    const medallion = section.querySelector(".seal-medallion");
    const certificate = section.querySelector(".seal-certificate-card");
    const visual = section.querySelector(".seal-visual");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    let played = false;

    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power3.out"
        }
    });

    gsap.set(".seal-eyebrow", {
        x: -40,
        autoAlpha: 0
    });

    gsap.set(".seal-title", {
        y: 55,
        autoAlpha: 0,
        filter: "blur(8px)"
    });

    gsap.set(".seal-description", {
        y: 30,
        autoAlpha: 0
    });

    gsap.set(commitments, {
        x: -35,
        y: 20,
        autoAlpha: 0
    });

    gsap.set(medallion, {
        scale: 0.55,
        rotation: -20,
        autoAlpha: 0
    });

    gsap.set(certificate, {
        x: 65,
        y: 25,
        autoAlpha: 0
    });

    gsap.set(stats, {
        y: 30,
        autoAlpha: 0
    });


    timeline

        .to(".seal-eyebrow", {
            x: 0,
            autoAlpha: 1,
            duration: 0.7
        })

        .to(".seal-title", {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9
        }, "-=0.4")

        .to(".seal-description", {
            y: 0,
            autoAlpha: 1,
            duration: 0.7
        }, "-=0.45")

        .to(commitments, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.16
        }, "-=0.3")

        .to(medallion, {
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "back.out(1.4)"
        }, "-=0.8")

        .to(certificate, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "back.out(1.3)"
        }, "-=0.5")

        .to(stats, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.12
        }, "-=0.35");


    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting || played) return;

                played = true;

                timeline.play();

                animateStatistics();

                gsap.to(".seal-mini-progress span", {
                    width: "100%",
                    duration: 1.5,
                    stagger: 0.25,
                    delay: 0.5,
                    ease: "power2.out"
                });

                observer.disconnect();

            });

        },
        {
            threshold: 0.15
        }
    );

    observer.observe(section);


    function animateStatistics() {

        section.querySelectorAll(".seal-counter").forEach(function (counter) {

            const target = Number(counter.dataset.target);

            if (!Number.isFinite(target)) return;

            const state = {
                value: 0
            };

            gsap.to(state, {

                value: target,

                duration: 1.8,

                ease: "power2.out",

                onUpdate: function () {

                    counter.textContent = Math.round(state.value);

                }

            });

        });

    }


    gsap.to(".seal-orb-one", {
        x: 50,
        y: 30,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".seal-orb-two", {
        x: -40,
        y: -25,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        section.querySelectorAll(".seal-commitment").forEach(function (card) {

            const icon = card.querySelector(".seal-commitment-heading i");

            card.addEventListener("pointerenter", function () {

                gsap.to(icon, {
                    rotation: -12,
                    scale: 1.2,
                    duration: 0.35,
                    ease: "back.out(1.7)"
                });

            });

            card.addEventListener("pointerleave", function () {

                gsap.to(icon, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.35
                });

            });

        });


        visual.addEventListener("pointermove", function (event) {

            const rect = visual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;

            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(medallion, {
                x: x * 12,
                y: y * 12,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        visual.addEventListener("pointerleave", function () {

            gsap.to(medallion, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                overwrite: "auto"
            });

        });

    }


    window.addEventListener("pagehide", function () {

        observer.disconnect();

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-final-cta");

    if (!section) return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || typeof gsap === "undefined") return;

    const eyebrow = section.querySelector(".final-cta-eyebrow");
    const title = section.querySelector(".final-cta-title");
    const description = section.querySelector(".final-cta-description");
    const buttons = section.querySelector(".final-cta-actions");
    const trust = section.querySelector(".final-cta-trust");
    const bottom = section.querySelector(".final-cta-bottom");

    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power3.out"
        }
    });

    gsap.set(eyebrow, {
        y: 25,
        autoAlpha: 0
    });

    gsap.set(title, {
        y: 55,
        scale: 0.94,
        autoAlpha: 0,
        filter: "blur(7px)"
    });

    gsap.set(description, {
        y: 25,
        autoAlpha: 0
    });

    gsap.set(buttons, {
        y: 30,
        autoAlpha: 0
    });

    gsap.set(trust, {
        y: 20,
        autoAlpha: 0
    });

    gsap.set(bottom, {
        y: 15,
        autoAlpha: 0
    });

    timeline
        .to(eyebrow, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65
        })
        .to(title, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out"
        }, "-=0.35")
        .to(description, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7
        }, "-=0.5")
        .to(buttons, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "back.out(1.3)"
        }, "-=0.35")
        .to(trust, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65
        }, "-=0.35")
        .to(bottom, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
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
            threshold: 0.15
        }
    );

    observer.observe(section);


    gsap.to(".final-glow-one", {
        x: 35,
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".final-glow-two", {
        x: -30,
        y: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        const primary = section.querySelector(".final-cta-primary");

        const secondary = section.querySelector(".final-cta-secondary");

        primary.addEventListener("pointerenter", function () {

            gsap.to(primary, {
                y: -4,
                scale: 1.035,
                duration: 0.3,
                ease: "power2.out"
            });

        });

        primary.addEventListener("pointerleave", function () {

            gsap.to(primary, {
                y: 0,
                scale: 1,
                duration: 0.35,
                ease: "power2.out"
            });

        });

        secondary.addEventListener("pointerenter", function () {

            gsap.to(secondary, {
                x: 4,
                duration: 0.3,
                ease: "power2.out"
            });

        });

        secondary.addEventListener("pointerleave", function () {

            gsap.to(secondary, {
                x: 0,
                duration: 0.3
            });

        });

    }

    window.addEventListener("pagehide", function () {

        observer.disconnect();

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