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