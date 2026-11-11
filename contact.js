document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-contact-hero");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const content = section.querySelector(".contact-hero-content");
    const visual = section.querySelector(".contact-hero-visual");

    const eyebrow = section.querySelector(".contact-hero-eyebrow");
    const breadcrumb = section.querySelector(".contact-breadcrumb");
    const kicker = section.querySelector(".contact-hero-kicker");
    const title = section.querySelector(".contact-hero-title");
    const description = section.querySelector(".contact-hero-description");
    const highlights = section.querySelectorAll(".contact-highlight");
    const actions = section.querySelector(".contact-hero-actions");
    const trust = section.querySelector(".contact-hero-trust");

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    gsap.set(
        [eyebrow, breadcrumb, kicker, title, description, actions, trust],
        {
            y: 30,
            autoAlpha: 0
        }
    );

    gsap.set(highlights, {
        x: -25,
        autoAlpha: 0
    });

    gsap.set(visual, {
        x: 45,
        scale: 0.94,
        autoAlpha: 0
    });

    timeline
        .to(eyebrow, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
        })

        .to(breadcrumb, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55
        }, "-=0.3")

        .to(kicker, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55
        }, "-=0.3")

        .to(title, {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            ease: "power3.out"
        }, "-=0.3")

        .to(description, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7
        }, "-=0.45")

        .to(highlights, {
            x: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.13
        }, "-=0.35")

        .to(actions, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65
        }, "-=0.3")

        .to(trust, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55
        }, "-=0.3")

        .to(visual, {
            x: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "back.out(1.2)"
        }, "-=0.9");


    gsap.to(".contact-orbit-two", {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: "none"
    });

    gsap.to(".contact-orbit-one", {
        scale: 1.12,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".contact-card-one", {
        y: -7,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".contact-card-two", {
        y: 7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".contact-glow-one", {
        x: 35,
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        const core = section.querySelector(".contact-tech-core");

        visual.addEventListener("pointermove", function (event) {

            const rect = visual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(core, {
                x: x * 12,
                y: y * 12,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        visual.addEventListener("pointerleave", function () {

            gsap.to(core, {
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

    const form = document.getElementById("stacklyContactForm");

    if (!form) return;

    if (form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const submitButton = document.getElementById("contactSubmitBtn");

    const submitStatus = document.getElementById("contactFormStatus");

    const message = document.getElementById("contactMessage");

    const counter = document.getElementById("messageCounter");

    let submitTimer;


    const fields = {

        name: {
            input: document.getElementById("contactName"),
            error: document.getElementById("nameError")
        },

        email: {
            input: document.getElementById("contactEmail"),
            error: document.getElementById("emailError")
        },

        phone: {
            input: document.getElementById("contactPhone"),
            error: document.getElementById("phoneError")
        },

        inquiry: {
            input: document.getElementById("contactInquiry"),
            error: document.getElementById("inquiryError")
        },

        product: {
            input: document.getElementById("contactProduct"),
            error: document.getElementById("productError")
        },

        budget: {
            input: document.getElementById("contactBudget"),
            error: document.getElementById("budgetError")
        },

        subject: {
            input: document.getElementById("contactSubject"),
            error: document.getElementById("subjectError")
        },

        message: {
            input: document.getElementById("contactMessage"),
            error: document.getElementById("messageError")
        },

        consent: {
            input: document.getElementById("contactConsent"),
            error: document.getElementById("consentError")
        }

    };


    function setError(field, text) {

        const wrapper = field.input.closest(".contact-field");

        if (wrapper) {
            wrapper.classList.add("has-error");
            wrapper.classList.remove("is-valid");
        }

        if (field.input.type === "checkbox") {

            field.input.setAttribute("aria-invalid", "true");

        } else {

            field.input.setAttribute("aria-invalid", "true");

        }

        field.error.textContent = text;

    }


    function setValid(field) {

        const wrapper = field.input.closest(".contact-field");

        if (wrapper) {

            wrapper.classList.remove("has-error");
            wrapper.classList.add("is-valid");

        }

        field.input.setAttribute("aria-invalid", "false");

        field.error.textContent = "";

    }


    function clearValidation(field) {

        const wrapper = field.input.closest(".contact-field");

        if (wrapper) {
            wrapper.classList.remove("has-error", "is-valid");
        }

        field.input.removeAttribute("aria-invalid");

        field.error.textContent = "";

    }


    function validateName() {

        const value = fields.name.input.value.trim();

        const validName = /^[\p{L}][\p{L}\s.'-]{1,59}$/u.test(value);

        if (!value) {

            setError(fields.name, "Please enter your full name.");

            return false;

        }

        if (value.length < 2 || value.length > 60 || !validName) {

            setError(
                fields.name,
                "Enter a valid name using 2–60 letters."
            );

            return false;

        }

        setValid(fields.name);

        return true;

    }


    function validateEmail() {

        const input = fields.email.input;

        const value = input.value.trim();

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if (!value) {

            setError(fields.email, "Please enter your email address.");

            return false;

        }

        if (
            value.length > 100 ||
            !emailPattern.test(value) ||
            !input.validity.valid
        ) {

            setError(fields.email, "Please enter a valid email address.");

            return false;

        }

        setValid(fields.email);

        return true;

    }


    function validatePhone() {

        const value = fields.phone.input.value.trim();

        const digits = value.replace(/\D/g, "");

        let mobile = digits;

        if (digits.length === 12 && digits.startsWith("91")) {
            mobile = digits.slice(2);
        }

        if (!value) {

            setError(fields.phone, "Please enter your phone number.");

            return false;

        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {

            setError(
                fields.phone,
                "Enter a valid 10-digit Indian mobile number."
            );

            return false;

        }

        setValid(fields.phone);

        return true;

    }


    function validateSelect(field, message) {

        if (!field.input.value) {

            setError(field, message);

            return false;

        }

        setValid(field);

        return true;

    }


    function validateSubject() {

        const value = fields.subject.input.value.trim();

        if (!value) {

            setError(fields.subject, "Please enter a subject.");

            return false;

        }

        if (value.length < 5 || value.length > 100) {

            setError(
                fields.subject,
                "Subject must contain between 5 and 100 characters."
            );

            return false;

        }

        setValid(fields.subject);

        return true;

    }


    function validateMessage() {

        const value = fields.message.input.value.trim();

        if (!value) {

            setError(fields.message, "Please describe your requirements.");

            return false;

        }

        if (value.length < 20) {

            setError(
                fields.message,
                "Please enter at least 20 characters."
            );

            return false;

        }

        if (value.length > 1000) {

            setError(
                fields.message,
                "Message cannot exceed 1000 characters."
            );

            return false;

        }

        setValid(fields.message);

        return true;

    }


    function validateConsent() {

        if (!fields.consent.input.checked) {

            setError(
                fields.consent,
                "Please confirm your consent before submitting."
            );

            return false;

        }

        setValid(fields.consent);

        return true;

    }


    function validateAll() {

        const results = [

            validateName(),

            validateEmail(),

            validatePhone(),

            validateSelect(
                fields.inquiry,
                "Please select an inquiry type."
            ),

            validateSelect(
                fields.product,
                "Please select your product interest."
            ),

            validateSelect(
                fields.budget,
                "Please select your estimated budget."
            ),

            validateSubject(),

            validateMessage(),

            validateConsent()

        ];

        return results.every(Boolean);

    }


    Object.values(fields).forEach(function (field) {

        const input = field.input;

        const eventName = input.type === "checkbox"
            ? "change"
            : "input";

        input.addEventListener(eventName, function () {

            if (submitStatus.classList.contains("is-visible")) {

                submitStatus.classList.remove("is-visible");

            }

            if (!input.closest(".contact-field")?.classList.contains("has-error")) {
                return;
            }

            validateSingleField(input);

        });

        input.addEventListener("blur", function () {

            if (!input.value && input.type !== "checkbox") return;

            validateSingleField(input);

        });

    });


    function validateSingleField(input) {

        if (input === fields.name.input) {
            return validateName();
        }

        if (input === fields.email.input) {
            return validateEmail();
        }

        if (input === fields.phone.input) {
            return validatePhone();
        }

        if (input === fields.inquiry.input) {
            return validateSelect(fields.inquiry, "Please select an inquiry type.");
        }

        if (input === fields.product.input) {
            return validateSelect(fields.product, "Please select your product interest.");
        }

        if (input === fields.budget.input) {
            return validateSelect(fields.budget, "Please select your estimated budget.");
        }

        if (input === fields.subject.input) {
            return validateSubject();
        }

        if (input === fields.message.input) {
            return validateMessage();
        }

        if (input === fields.consent.input) {
            return validateConsent();
        }

        return true;

    }


    function updateMessageCounter() {

        counter.textContent = message.value.length + " / 1000";

    }

    message.addEventListener("input", updateMessageCounter);

    updateMessageCounter();


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        submitStatus.classList.remove("is-visible");

        const valid = validateAll();

        if (!valid) {

            const firstInvalid = form.querySelector(
                '[aria-invalid="true"]'
            );

            if (firstInvalid) {

                firstInvalid.focus();

                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

            return;

        }


        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>REDIRECTING...</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;

        submitStatus.textContent =
            "Your details have been validated. Redirecting...";

        submitStatus.classList.add("is-visible");


        try {

            sessionStorage.setItem(
                "stacklyContactFormSubmitted",
                "true"
            );

        } catch (error) {

            console.warn("Session storage is unavailable.");

        }


        clearTimeout(submitTimer);

        submitTimer = setTimeout(function () {

            form.reset();

            updateMessageCounter();

            Object.values(fields).forEach(clearValidation);

            window.location.href = "error.html";

        }, 700);

    });


    window.addEventListener("pageshow", function () {

        let wasSubmitted = false;

        try {

            wasSubmitted = sessionStorage.getItem(
                "stacklyContactFormSubmitted"
            ) === "true";

        } catch (error) {

            wasSubmitted = false;

        }

        if (wasSubmitted) {

            clearTimeout(submitTimer);

            form.reset();

            updateMessageCounter();

            Object.values(fields).forEach(clearValidation);

            submitButton.disabled = false;

            submitButton.innerHTML = `
                <span>SUBMIT YOUR ENQUIRY</span>
                <i class="fa-solid fa-arrow-right"></i>
            `;

            submitStatus.classList.remove("is-visible");

            sessionStorage.removeItem(
                "stacklyContactFormSubmitted"
            );

        }

    });


    if (
        typeof gsap !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        const heading = document.querySelector(".contact-form-heading");

        const formCard = document.querySelector(".contact-form-card");

        const sidebar = document.querySelector(".contact-form-sidebar");

        gsap.set(
            [heading, formCard, sidebar],
            {
                y: 35,
                autoAlpha: 0
            }
        );

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) return;

                    gsap.to(heading, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "power3.out"
                    });

                    gsap.to(formCard, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1,
                        delay: 0.15,
                        ease: "power3.out"
                    });

                    gsap.to(sidebar, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.9,
                        delay: 0.3,
                        ease: "power3.out"
                    });

                    observer.disconnect();

                });

            },
            {
                threshold: 0.12
            }
        );

        observer.observe(sectionForAnimation());

        function sectionForAnimation() {
            return document.querySelector(".stackly-contact-form-section");
        }

        window.addEventListener("pagehide", function () {
            observer.disconnect();
        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-showrooms");

    if (!section) return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const slider = section.querySelector("#showroomSlider");
    const track = section.querySelector("#showroomTrack");
    const previous = section.querySelector("#showroomPrev");
    const next = section.querySelector("#showroomNext");
    const progress = section.querySelector("#showroomProgress");
    const currentLabel = section.querySelector(".showroom-current");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let cards = Array.from(
        track.querySelectorAll(".showroom-card")
    );

    let currentIndex = 0;

    function updateProgress() {

        const mobile = window.innerWidth <= 767;

        if (mobile) {

            const maxScroll = slider.scrollWidth - slider.clientWidth;

            const position = maxScroll > 0
                ? slider.scrollLeft / maxScroll
                : 0;

            progress.style.width = Math.max(0, position * 100) + "%";

            const index = Math.min(
                cards.length - 1,
                Math.round(
                    slider.scrollLeft /
                    (cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 0))
                )
            );

            currentLabel.textContent =
                String(index + 1).padStart(2, "0");

        } else {

            progress.style.width = "100%";

            currentLabel.textContent = "01";

        }

    }


    function moveCarousel(direction) {

        if (window.innerWidth <= 767) {

            const card = cards[0];

            if (!card) return;

            const gap = parseFloat(
                getComputedStyle(track).gap
            ) || 0;

            const distance = card.offsetWidth + gap;

            slider.scrollBy({
                left: direction * distance,
                behavior: reducedMotion ? "auto" : "smooth"
            });

            return;

        }


        const cardCount = cards.length;

        if (direction > 0) {

            track.appendChild(cards.shift());

        } else {

            track.insertBefore(
                cards.pop(),
                track.firstChild
            );

        }

        if (typeof gsap !== "undefined" && !reducedMotion) {

            gsap.fromTo(
                cards,
                {
                    y: 14,
                    opacity: 0.65
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.08,
                    ease: "power3.out"
                }
            );

        }

        currentIndex = (
            currentIndex + direction + cardCount
        ) % cardCount;

        currentLabel.textContent =
            String(currentIndex + 1).padStart(2, "0");

    }


    previous.addEventListener("click", function () {
        moveCarousel(-1);
    });

    next.addEventListener("click", function () {
        moveCarousel(1);
    });

    slider.addEventListener("scroll", updateProgress, {
        passive: true
    });

    window.addEventListener("resize", updateProgress);

    updateProgress();


    if (!reducedMotion && typeof gsap !== "undefined") {

        const heading = section.querySelector(".showrooms-heading");

        const navigation = section.querySelector(".showrooms-navigation");

        const bottom = section.querySelector(".showrooms-bottom");

        gsap.set(
            [heading, navigation, bottom],
            {
                y: 35,
                autoAlpha: 0
            }
        );

        gsap.set(cards, {
            y: 55,
            autoAlpha: 0
        });


        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) return;

                    const timeline = gsap.timeline({
                        defaults: {
                            ease: "power3.out"
                        }
                    });

                    timeline
                        .to(heading, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.8
                        })

                        .to(navigation, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.6
                        }, "-=0.5")

                        .to(cards, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.85,
                            stagger: 0.16
                        }, "-=0.3")

                        .to(bottom, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.6
                        }, "-=0.35");

                    observer.disconnect();

                });

            },
            {
                threshold: 0.12
            }
        );

        observer.observe(section);

        window.addEventListener("pagehide", function () {
            observer.disconnect();
        });


        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

            cards.forEach(function (card) {

                const image = card.querySelector(".showroom-image img");

                card.addEventListener("pointermove", function (event) {

                    const rect = card.getBoundingClientRect();

                    const x = (event.clientX - rect.left) / rect.width - 0.5;

                    const y = (event.clientY - rect.top) / rect.height - 0.5;

                    gsap.to(image, {
                        x: x * 8,
                        y: y * 8,
                        duration: 0.7,
                        ease: "power2.out",
                        overwrite: "auto"
                    });

                });

                card.addEventListener("pointerleave", function () {

                    gsap.to(image, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                        overwrite: "auto"
                    });

                });

            });

        }

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-location");

    if (!section) return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || typeof gsap === "undefined") return;

    const heading = section.querySelector(".location-heading");
    const information = section.querySelector(".location-information");
    const map = section.querySelector(".location-map-area");
    const footer = section.querySelector(".location-bottom");

    gsap.set(
        [heading, information, map, footer],
        {
            y: 35,
            autoAlpha: 0
        }
    );

    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .to(heading, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8
        })

        .to(information, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85
        }, "-=0.4")

        .to(map, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9
        }, "-=0.65")

        .to(footer, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6
        }, "-=0.3");


    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) return;

                timeline.play();

                observer.disconnect();

            });

        },
        {
            threshold: 0.12
        }
    );

    observer.observe(section);


    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        information.addEventListener("pointermove", function (event) {

            const rect = information.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(information, {
                x: x * 5,
                y: y * 5,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        information.addEventListener("pointerleave", function () {

            gsap.to(information, {
                x: 0,
                y: 0,
                duration: 0.6,
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

    const section = document.querySelector(".stackly-faq");

    if (!section) return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const searchInput = section.querySelector("#faqSearch");
    const searchClear = section.querySelector("#faqSearchClear");
    const resultCount = section.querySelector("#faqResultCount");
    const categories = section.querySelectorAll(".faq-category");
    const items = Array.from(section.querySelectorAll(".faq-item"));
    const noResults = section.querySelector("#faqNoResults");
    const resetSearch = section.querySelector("#faqResetSearch");

    let activeCategory = "all";


    function closeItem(item) {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        item.classList.remove("is-open");

        button.setAttribute("aria-expanded", "false");

        answer.style.maxHeight = "0px";

    }


    function openItem(item) {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        item.classList.add("is-open");

        button.setAttribute("aria-expanded", "true");

        answer.style.maxHeight = answer.scrollHeight + "px";

    }


    items.forEach(function (item) {

        const button = item.querySelector(".faq-question");

        button.addEventListener("click", function () {

            const isOpen = item.classList.contains("is-open");

            items.forEach(function (otherItem) {

                if (otherItem !== item) {
                    closeItem(otherItem);
                }

            });

            if (isOpen) {

                closeItem(item);

            } else {

                openItem(item);

            }

        });

    });


    function filterFAQs() {

        const query = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        items.forEach(function (item) {

            const question = item.querySelector(
                ".faq-question-text"
            ).textContent.toLowerCase();

            const answer = item.querySelector(
                ".faq-answer-inner"
            ).textContent.toLowerCase();

            const category = item.dataset.category;

            const categoryMatch =
                activeCategory === "all" ||
                category === activeCategory;

            const searchMatch =
                !query ||
                question.includes(query) ||
                answer.includes(query);

            const visible = categoryMatch && searchMatch;

            item.hidden = !visible;

            if (visible) {

                visibleCount++;

            } else {

                closeItem(item);

            }

        });


        resultCount.textContent =
            String(visibleCount).padStart(2, "0") +
            (visibleCount === 1 ? " QUESTION" : " QUESTIONS");

        noResults.hidden = visibleCount !== 0;

        searchClear.hidden = query.length === 0;

    }


    categories.forEach(function (button) {

        button.addEventListener("click", function () {

            activeCategory = button.dataset.category;

            categories.forEach(function (categoryButton) {

                const active = categoryButton === button;

                categoryButton.classList.toggle("active", active);

                categoryButton.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });

            filterFAQs();

        });

    });


    searchInput.addEventListener("input", filterFAQs);


    searchClear.addEventListener("click", function () {

        searchInput.value = "";

        searchInput.focus();

        filterFAQs();

    });


    resetSearch.addEventListener("click", function () {

        searchInput.value = "";

        activeCategory = "all";

        categories.forEach(function (button) {

            const active = button.dataset.category === "all";

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        });

        items.forEach(closeItem);

        filterFAQs();

    });


    window.addEventListener("resize", function () {

        items.forEach(function (item) {

            if (item.classList.contains("is-open")) {

                const answer = item.querySelector(".faq-answer");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });


    filterFAQs();


    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion && typeof gsap !== "undefined") {

        const heading = section.querySelector(".faq-heading");
        const intro = section.querySelector(".faq-intro");
        const content = section.querySelector(".faq-content");
        const footer = section.querySelector(".faq-footer-line");

        gsap.set(
            [heading, intro, content, footer],
            {
                y: 35,
                autoAlpha: 0
            }
        );

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) return;

                    const timeline = gsap.timeline({
                        defaults: {
                            ease: "power3.out"
                        }
                    });

                    timeline
                        .to(heading, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.75
                        })

                        .to(intro, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.8
                        }, "-=0.35")

                        .to(content, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.8
                        }, "-=0.6")

                        .to(footer, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.55
                        }, "-=0.3");

                    observer.disconnect();

                });

            },
            {
                threshold: 0.12
            }
        );

        observer.observe(section);

        window.addEventListener("pagehide", function () {

            observer.disconnect();

        });

    }

});