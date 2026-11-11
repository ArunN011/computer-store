document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("stacklyLoginForm");
    const card = document.getElementById("loginCard");

    if (!form || form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const emailInput = document.getElementById("loginEmail");
    const roleInput = document.getElementById("loginRole");
    const passwordInput = document.getElementById("loginPassword");

    const togglePassword = document.getElementById("togglePassword");
    const submitButton = document.getElementById("loginSubmit");
    const statusBox = document.getElementById("loginStatus");

    const fields = {

        email: {
            input: emailInput,
            wrapper: document.getElementById("emailField"),
            error: document.getElementById("emailError")
        },

        role: {
            input: roleInput,
            wrapper: document.getElementById("roleField"),
            error: document.getElementById("roleError")
        },

        password: {
            input: passwordInput,
            wrapper: document.getElementById("passwordField"),
            error: document.getElementById("passwordError")
        }

    };

    let redirectTimer = null;


    function setError(field, message) {

        field.wrapper.classList.add("has-error");
        field.wrapper.classList.remove("is-valid");

        field.error.textContent = message;

        field.input.setAttribute("aria-invalid", "true");

    }


    function setValid(field) {

        field.wrapper.classList.remove("has-error");
        field.wrapper.classList.add("is-valid");

        field.error.textContent = "";

        field.input.setAttribute("aria-invalid", "false");

    }


    function clearField(field) {

        field.wrapper.classList.remove("has-error", "is-valid");

        field.error.textContent = "";

        field.input.removeAttribute("aria-invalid");

    }


    function validateEmail() {

        const value = emailInput.value.trim();

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if (!value) {

            setError(fields.email, "Please enter your professional email.");

            return false;

        }

        if (value.length > 100 || !emailPattern.test(value)) {

            setError(fields.email, "Enter a valid email address.");

            return false;

        }

        setValid(fields.email);

        return true;

    }


    function validateRole() {

        const value = roleInput.value;

        if (!value) {

            setError(fields.role, "Please select your account type.");

            return false;

        }

        if (!["user", "admin"].includes(value)) {

            setError(fields.role, "Please select a valid account type.");

            return false;

        }

        setValid(fields.role);

        return true;

    }


    function validatePassword() {

        const value = passwordInput.value;

        if (!value) {

            setError(fields.password, "Please enter your password.");

            return false;

        }

        if (value.length < 8) {

            setError(
                fields.password,
                "Password must contain at least 8 characters."
            );

            return false;

        }

        if (value.length > 128) {

            setError(
                fields.password,
                "Password cannot exceed 128 characters."
            );

            return false;

        }

        setValid(fields.password);

        return true;

    }


    function validateAll() {

        const emailValid = validateEmail();

        const roleValid = validateRole();

        const passwordValid = validatePassword();

        return emailValid && roleValid && passwordValid;

    }


    function animateError() {

        card.classList.remove("is-shaking");

        void card.offsetWidth;

        card.classList.add("is-shaking");

        if (typeof gsap !== "undefined") {

            gsap.fromTo(
                card,
                {
                    x: -7
                },
                {
                    x: 0,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                }
            );

        }

        setTimeout(function () {

            card.classList.remove("is-shaking");

        }, 500);

    }


    function focusFirstError() {

        const firstInvalid = form.querySelector(
            '[aria-invalid="true"]'
        );

        if (!firstInvalid) return;

        firstInvalid.focus();

        const inputWrap = firstInvalid.closest(".login-input-wrap");

        if (inputWrap) {

            inputWrap.classList.remove("is-pulsing");

            void inputWrap.offsetWidth;

            inputWrap.classList.add("is-pulsing");

        }

    }


    function showStatus(message) {

        statusBox.textContent = message;

        statusBox.classList.add("is-visible");

    }


    function hideStatus() {

        statusBox.textContent = "";

        statusBox.classList.remove("is-visible");

    }


    function formatDisplayName(email) {

        const username = email.split("@")[0];

        return username
            .split(/[._-]+/)
            .filter(Boolean)
            .map(function (part) {

                return part.charAt(0).toUpperCase() + part.slice(1);

            })
            .join(" ");

    }


    function getUserProfile(email) {

        const profileKey = "stacklyUserProfile_" + email.toLowerCase();

        try {

            const profile = JSON.parse(
                localStorage.getItem(profileKey) || "{}"
            );

            return {
                key: profileKey,
                data: profile && typeof profile === "object" ? profile : {}
            };

        } catch (error) {

            return {
                key: profileKey,
                data: {}
            };

        }

    }


    function saveLoginSession(email, role) {

        const previousEmail = (
            localStorage.getItem("userEmail") || ""
        ).toLowerCase();

        const existingName = previousEmail === email
            ? localStorage.getItem("stacklyUsername")
            : null;

        const profileResult = getUserProfile(email);

        const profile = profileResult.data;

        const displayName =
            (
                typeof profile.name === "string" &&
                profile.name.trim()
            )
                ? profile.name.trim()
                : existingName || formatDisplayName(email);


        localStorage.setItem("userEmail", email);

        localStorage.setItem("userRole", role);

        localStorage.setItem("userName", displayName);

        localStorage.setItem("stacklyUsername", displayName);


        if (role === "user") {

            const updatedProfile = {
                ...profile,
                name: displayName,
                email: email
            };

            localStorage.setItem(
                profileResult.key,
                JSON.stringify(updatedProfile)
            );

        }

    }


    togglePassword.addEventListener("click", function () {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        const icon = togglePassword.querySelector("i");

        icon.classList.toggle("fa-eye", isPassword);

        icon.classList.toggle("fa-eye-slash", !isPassword);

        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

        togglePassword.setAttribute(
            "aria-pressed",
            String(isPassword)
        );

        passwordInput.focus();

    });


    Object.values(fields).forEach(function (field) {

        field.input.addEventListener("input", function () {

            hideStatus();

            if (field.wrapper.classList.contains("has-error")) {

                validateField(field.input);

            }

        });

        field.input.addEventListener("change", function () {

            hideStatus();

            if (
                field.input === roleInput &&
                field.wrapper.classList.contains("has-error")
            ) {

                validateRole();

            }

        });

        field.input.addEventListener("blur", function () {

            if (!field.input.value) return;

            validateField(field.input);

        });

    });


    function validateField(input) {

        if (input === emailInput) return validateEmail();

        if (input === roleInput) return validateRole();

        if (input === passwordInput) return validatePassword();

        return true;

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (submitButton.disabled) return;

        hideStatus();

        const valid = validateAll();

        if (!valid) {

            showStatus("Please correct the highlighted fields.");

            animateError();

            focusFirstError();

            return;

        }


        const email = emailInput.value.trim().toLowerCase();

        const role = roleInput.value;


        try {

            saveLoginSession(email, role);

        } catch (error) {

            showStatus("Unable to initialize your session. Please check browser storage.");

            animateError();

            return;

        }


        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>INITIALIZING ACCESS</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span class="login-button-shine"></span>
        `;

        


        if (typeof gsap !== "undefined") {

            gsap.to(card, {
                scale: 0.98,
                opacity: 0.85,
                duration: 0.35,
                ease: "power2.in"
            });

        }


        const destination = role === "admin"
            ? "admin-dashboard.html"
            : "user-dashboard.html";


        redirectTimer = setTimeout(function () {

            window.location.assign(destination);

        }, 650);

    });


    document.querySelectorAll("[data-provider]").forEach(function (button) {

        button.addEventListener("click", function () {

            const provider = button.dataset.provider;

            showStatus(
                provider + " sign-in is not configured yet. Please use email login."
            );

            animateError();

        });

    });


    if (
        typeof gsap !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        gsap.fromTo(
            card,
            {
                y: 35,
                opacity: 0,
                scale: 0.96
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: "power3.out"
            }
        );

        gsap.from(".login-heading > *", {
            y: 15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.25,
            ease: "power3.out"
        });

    }


    window.addEventListener("pagehide", function () {

        clearTimeout(redirectTimer);

    });
    function restoreLoginPage() {

    clearTimeout(redirectTimer);

    submitButton.disabled = false;

    submitButton.innerHTML = `
        <span>INITIALIZE ACCESS</span>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="login-button-shine"></span>
    `;

    statusBox.textContent = "";
    statusBox.classList.remove("is-visible");

    card.classList.remove("is-shaking");

    passwordInput.value = "";

    if (passwordInput.type !== "password") {

        passwordInput.type = "password";

        const icon = togglePassword.querySelector("i");

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

        togglePassword.setAttribute("aria-label", "Show password");
        togglePassword.setAttribute("aria-pressed", "false");

    }

    Object.values(fields).forEach(function (field) {
        clearField(field);
    });

    if (typeof gsap !== "undefined") {

        gsap.set(card, {
            clearProps: "transform,opacity,visibility"
        });

    }

}


window.addEventListener("pageshow", function () {
    restoreLoginPage();
});

window.addEventListener("popstate", function () {
    restoreLoginPage();
});

});