document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("stacklyLoader");
    const progress = document.getElementById("loaderProgress");
    const percentage = document.getElementById("loaderPercentage");
    const status = document.getElementById("loaderStatus");
    const logo = document.querySelector(".loader-logo");

    if (!loader) return;

    const startTime = performance.now();
    const minimumDuration = 3000;

    document.body.classList.add("stackly-loading");

    const statusMessages = [
        "INITIALIZING SYSTEM",
        "CONNECTING TECHNOLOGY",
        "PREPARING YOUR EXPERIENCE",
        "ALMOST READY"
    ];

    let currentStatus = 0;
    let finished = false;

    const statusInterval = setInterval(function () {
        currentStatus++;

        if (currentStatus < statusMessages.length && status) {
            status.textContent = statusMessages[currentStatus];
        }

    }, 700);

    if (window.gsap) {

        gsap.to(".loader-logo", {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            delay: 0.15,
            ease: "power3.out"
        });

        gsap.to(".orbit-one", {
            rotation: "+=360",
            duration: 8,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".orbit-two", {
            rotation: "-=360",
            duration: 10,
            repeat: -1,
            ease: "none"
        });

        gsap.to(".orbit-three", {
            rotation: "+=360",
            duration: 18,
            repeat: -1,
            ease: "none"
        });

        gsap.to(progress, {
            width: "100%",
            duration: 2.7,
            ease: "power1.inOut"
        });

        let counter = { value: 0 };

        gsap.to(counter, {
            value: 100,
            duration: 2.7,
            ease: "power1.inOut",
            onUpdate: function () {
                if (percentage) {
                    percentage.textContent =
                        Math.round(counter.value) + "%";
                }
            }
        });

    } else {

        logo.style.transition =
            "opacity 1s ease, transform 1s ease, filter 1s ease";

        requestAnimationFrame(function () {
            logo.style.opacity = "1";
            logo.style.transform = "scale(1)";
            logo.style.filter = "blur(0px)";
        });

        progress.style.transition = "width 2.7s ease";
        progress.style.width = "100%";

        let count = 0;

        const counterInterval = setInterval(function () {
            count++;

            if (percentage) {
                percentage.textContent = count + "%";
            }

            if (count >= 100) {
                clearInterval(counterInterval);
            }
        }, 27);
    }

    function hideLoader() {

        if (finished) return;

        finished = true;

        clearInterval(statusInterval);

        if (percentage) {
            percentage.textContent = "100%";
        }

        if (status) {
            status.textContent = "WELCOME TO STACKLY";
        }

        if (progress) {
            progress.style.width = "100%";
        }

        setTimeout(function () {

            loader.classList.add("loader-hidden");

            document.body.classList.remove("stackly-loading");

            setTimeout(function () {

    loader.remove();

    document.body.classList.remove("stackly-loading");

    window.dispatchEvent(
        new Event("stackly:loader-hidden")
    );

    if (window.ScrollTrigger) {
        ScrollTrigger.refresh(true);
    }

}, 700);

        }, 150);

    }

    function finishAfterLoad() {

        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, minimumDuration - elapsed);

        setTimeout(hideLoader, remaining);
    }

    if (document.readyState === "complete") {
        finishAfterLoad();
    } else {
        window.addEventListener("load", finishAfterLoad, { once: true });
    }

});