document.addEventListener("DOMContentLoaded", function () {

    const RETURN_KEY = "stacklyErrorReturn";
    const RESTORE_KEY = "stacklyErrorRestore";

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const isErrorPage = currentPage === "error.html";

    function getValidReturnState() {

        try {

            const stored = sessionStorage.getItem(RETURN_KEY);

            if (!stored) return null;

            const state = JSON.parse(stored);

            if (!state.url || !state.timestamp) return null;

            if (Date.now() - state.timestamp > 30 * 60 * 1000) {
                sessionStorage.removeItem(RETURN_KEY);
                return null;
            }

            const returnURL = new URL(state.url, window.location.origin);

            if (returnURL.origin !== window.location.origin) {
                return null;
            }

            return state;

        } catch (error) {

            return null;

        }
    }

    function trackErrorNavigation(event) {

        const link = event.target.closest("a[href]");

        if (!link) return;

        if (link.target === "_blank") return;

        const destination = new URL(
            link.href,
            window.location.href
        );

        if (destination.origin !== window.location.origin) return;

        if (destination.pathname.split("/").pop().toLowerCase() !== "error.html") {
            return;
        }

        if (isErrorPage) return;

        const section = link.closest("section[id]");

        const state = {
            url: window.location.href,
            pathname: window.location.pathname,
            scrollY: window.scrollY,
            sectionId: section ? section.id : null,
            timestamp: Date.now()
        };

        sessionStorage.setItem(
            RETURN_KEY,
            JSON.stringify(state)
        );

    }

    document.addEventListener(
        "click",
        trackErrorNavigation,
        true
    );

    function restorePreviousPosition() {

        try {

            const stored = sessionStorage.getItem(RESTORE_KEY);

            if (!stored) return;

            const state = JSON.parse(stored);

            if (!state || !state.url) return;

            const destination = new URL(
                state.url,
                window.location.origin
            );

            if (destination.origin !== window.location.origin) {
                sessionStorage.removeItem(RESTORE_KEY);
                return;
            }

            if (
                destination.pathname !== window.location.pathname ||
                destination.search !== window.location.search
            ) {
                return;
            }

            sessionStorage.removeItem(RESTORE_KEY);

            let attempts = 0;

            function applyScrollPosition() {

                attempts++;

                if (state.sectionId) {

                    const section = document.getElementById(
                        state.sectionId
                    );

                    if (section) {

                        window.scrollTo({
                            top: state.scrollY || 0,
                            behavior: "instant"
                        });

                    }

                } else {

                    window.scrollTo({
                        top: state.scrollY || 0,
                        behavior: "instant"
                    });

                }

                if (attempts < 3) {
                    requestAnimationFrame(applyScrollPosition);
                }

            }

            requestAnimationFrame(applyScrollPosition);

        } catch (error) {

            sessionStorage.removeItem(RESTORE_KEY);

        }
    }

    window.addEventListener(
        "pageshow",
        restorePreviousPosition
    );

    restorePreviousPosition();

    const backButton = document.getElementById("goBackButton");

    if (backButton) {

        backButton.addEventListener("click", function () {

            const state = getValidReturnState();

            let sameOriginReferrer = false;

            try {

                if (document.referrer) {

                    const referrer = new URL(document.referrer);

                    sameOriginReferrer =
                        referrer.origin === window.location.origin &&
                        referrer.pathname.split("/").pop().toLowerCase() !== "error.html";

                }

            } catch (error) {

                sameOriginReferrer = false;

            }

            if (state) {

                sessionStorage.setItem(
                    RESTORE_KEY,
                    JSON.stringify(state)
                );

                sessionStorage.removeItem(RETURN_KEY);

            }

            if (sameOriginReferrer && window.history.length > 1) {

                window.history.back();

                return;
            }

            if (state) {

                window.location.replace(state.url);

                return;
            }

            if (sameOriginReferrer && window.history.length > 1) {

                window.history.back();

                return;
            }

            window.location.href = "index.html";

        });

    }

    const homeButton = document.getElementById("homeButton");

    if (homeButton) {

        homeButton.addEventListener("click", function () {

            sessionStorage.removeItem(RETURN_KEY);
            sessionStorage.removeItem(RESTORE_KEY);

        });

    }

    if (isErrorPage && typeof gsap !== "undefined") {

        const timeline = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });

        timeline
            .from(".error-header", {
                y: -30,
                autoAlpha: 0,
                duration: 0.8
            })
            .from(".error-label", {
                y: 20,
                autoAlpha: 0,
                duration: 0.6
            }, "-=0.3")
            .from(".error-small-heading", {
                y: 15,
                autoAlpha: 0,
                duration: 0.5
            }, "-=0.3")
            .from(".error-title span", {
                y: 35,
                autoAlpha: 0,
                stagger: 0.15,
                duration: 0.8
            }, "-=0.3")
            .from(".error-description", {
                y: 20,
                autoAlpha: 0,
                duration: 0.7
            }, "-=0.4")
            .from(".error-buttons .error-btn", {
                y: 20,
                autoAlpha: 1,
                stagger: 0.15,
                duration: 0.6
            }, "-=0.4")
            .from(".error-visual", {
                x: 45,
                autoAlpha: 0,
                scale: 0.94,
                duration: 1
            }, "-=1.1")
            .from(".error-bottom-text", {
                y: 15,
                autoAlpha: 0,
                duration: 0.6
            }, "-=0.3");

        gsap.to(".zero-ring-one", {
            rotation: 360,
            duration: 18,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".zero-ring-two", {
            rotation: -360,
            duration: 14,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".zero-ring-three", {
            rotation: 360,
            duration: 22,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".zero-chip", {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".zero-light", {
            opacity: 0.25,
            scale: 1.5,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".shape-one", {
            x: -35,
            y: 25,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".shape-two", {
            x: 40,
            y: -20,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }

});