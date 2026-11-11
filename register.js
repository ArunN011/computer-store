document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("stacklyRegisterForm");
    const card = document.getElementById("registerCard");

    if (!form || form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const submitButton = document.getElementById("registerSubmit");
    const statusBox = document.getElementById("registerStatus");

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const phoneInput = document.getElementById("registerPhone");
    const roleInput = document.getElementById("registerRole");
    const passwordInput = document.getElementById("registerPassword");
    const confirmInput = document.getElementById("registerConfirm");
    const termsInput = document.getElementById("registerTerms");

    const strengthBar = document.getElementById("passwordStrengthBar");
    const strengthText = document.getElementById("passwordStrengthText");

    const fields = {

        name: {
            input: nameInput,
            wrapper: document.getElementById("registerNameField"),
            error: document.getElementById("registerNameError")
        },

        email: {
            input: emailInput,
            wrapper: document.getElementById("registerEmailField"),
            error: document.getElementById("registerEmailError")
        },

        phone: {
            input: phoneInput,
            wrapper: document.getElementById("registerPhoneField"),
            error: document.getElementById("registerPhoneError")
        },

        role: {
            input: roleInput,
            wrapper: document.getElementById("registerRoleField"),
            error: document.getElementById("registerRoleError")
        },

        password: {
            input: passwordInput,
            wrapper: document.getElementById("registerPasswordField"),
            error: document.getElementById("registerPasswordError")
        },

        confirm: {
            input: confirmInput,
            wrapper: document.getElementById("registerConfirmField"),
            error: document.getElementById("registerConfirmError")
        },

        terms: {
            input: termsInput,
            wrapper: document.getElementById("registerTermsField"),
            error: document.getElementById("registerTermsError")
        }

    };


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


    function validateName() {

        const value = nameInput.value.trim();

        const pattern = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;

        if (!value) {

            setError(fields.name, "Please enter your full name.");

            return false;

        }

        if (value.length < 2 || value.length > 60 || !pattern.test(value)) {

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

        const value = emailInput.value.trim();

        const pattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if (!value) {

            setError(fields.email, "Please enter your email address.");

            return false;

        }

        if (value.length > 100 || !pattern.test(value)) {

            setError(fields.email, "Enter a valid email address.");

            return false;

        }

        setValid(fields.email);

        return true;

    }


    function validatePhone() {

        const value = phoneInput.value.trim();

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


    function validateRole() {

        if (!["user", "admin"].includes(roleInput.value)) {

            setError(fields.role, "Please select User or Admin.");

            return false;

        }

        setValid(fields.role);

        return true;

    }


    function getPasswordStrength(value) {

        let score = 0;

        if (value.length >= 8) score++;

        if (/[a-z]/.test(value)) score++;

        if (/[A-Z]/.test(value)) score++;

        if (/[0-9]/.test(value)) score++;

        if (/[^A-Za-z0-9]/.test(value)) score++;

        return score;

    }


    function updatePasswordStrength() {

        const value = passwordInput.value;

        const strength = getPasswordStrength(value);

        const levels = {

            0: {
                width: "0%",
                text: "PASSWORD STRENGTH",
                color: "#D36C6C"
            },

            1: {
                width: "20%",
                text: "VERY WEAK",
                color: "#D36C6C"
            },

            2: {
                width: "40%",
                text: "WEAK",
                color: "#D99B65"
            },

            3: {
                width: "60%",
                text: "MODERATE",
                color: "#D9BE68"
            },

            4: {
                width: "80%",
                text: "STRONG",
                color: "#8BC4A0"
            },

            5: {
                width: "100%",
                text: "VERY STRONG",
                color: "#69BFC0"
            }

        };

        const current = levels[strength];

        strengthBar.style.width = current.width;
        strengthBar.style.background = current.color;

        strengthText.textContent = current.text;

        strengthText.style.color = current.color;

    }


    function validatePassword() {

        const value = passwordInput.value;

        updatePasswordStrength();

        if (!value) {

            setError(fields.password, "Please create a password.");

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

        if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {

            setError(
                fields.password,
                "Include uppercase, lowercase and at least one number."
            );

            return false;

        }

        setValid(fields.password);

        return true;

    }


    function validateConfirm() {

        const value = confirmInput.value;

        if (!value) {

            setError(fields.confirm, "Please confirm your password.");

            return false;

        }

        if (value !== passwordInput.value) {

            setError(fields.confirm, "Passwords do not match.");

            return false;

        }

        setValid(fields.confirm);

        return true;

    }


    function validateTerms() {

        if (!termsInput.checked) {

            setError(
                fields.terms,
                "Please accept the Terms of Service and Privacy Policy."
            );

            return false;

        }

        setValid(fields.terms);

        return true;

    }


    function validateAll() {

        const results = [

            validateName(),
            validateEmail(),
            validatePhone(),
            validateRole(),
            validatePassword(),
            validateConfirm(),
            validateTerms()

        ];

        return results.every(Boolean);

    }


    function showStatus(message, success) {

        statusBox.textContent = message;

        statusBox.classList.add("is-visible");

        statusBox.classList.toggle("is-success", Boolean(success));

    }


    function hideStatus() {

        statusBox.textContent = "";

        statusBox.classList.remove("is-visible", "is-success");

    }


    function animateError() {

        card.classList.remove("is-shaking");

        void card.offsetWidth;

        card.classList.add("is-shaking");

        if (typeof gsap !== "undefined") {

            gsap.fromTo(
                card,
                { x: -7 },
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

        const wrap = firstInvalid.closest(".register-input-wrap");

        if (wrap) {

            wrap.classList.remove("is-pulsing");

            void wrap.offsetWidth;

            wrap.classList.add("is-pulsing");

        }

    }


    function validateSingleField(input) {

        if (input === nameInput) return validateName();

        if (input === emailInput) return validateEmail();

        if (input === phoneInput) return validatePhone();

        if (input === roleInput) return validateRole();

        if (input === passwordInput) {

            const valid = validatePassword();

            if (confirmInput.value) {
                validateConfirm();
            }

            return valid;

        }

        if (input === confirmInput) return validateConfirm();

        if (input === termsInput) return validateTerms();

        return true;

    }


    Object.values(fields).forEach(function (field) {

        const input = field.input;

        input.addEventListener(
            input.type === "checkbox" || input.tagName === "SELECT"
                ? "change"
                : "input",
            function () {

                hideStatus();

                if (field.wrapper.classList.contains("has-error")) {

                    validateSingleField(input);

                }

            }
        );

        input.addEventListener("blur", function () {

            if (input.type === "checkbox") return;

            if (!input.value) return;

            validateSingleField(input);

        });

    });


    document.querySelectorAll(".register-password-toggle").forEach(function (button) {

        button.addEventListener("click", function () {

            const target = document.getElementById(
                button.dataset.target
            );

            const show = target.type === "password";

            target.type = show ? "text" : "password";

            const icon = button.querySelector("i");

            icon.classList.toggle("fa-eye", show);

            icon.classList.toggle("fa-eye-slash", !show);

            button.setAttribute(
                "aria-label",
                show ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                String(show)
            );

            target.focus();

        });

    });


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (submitButton.disabled) return;

        hideStatus();

        if (!validateAll()) {

            showStatus("Please correct the highlighted fields before continuing.");

            animateError();

            focusFirstError();

            return;

        }


        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>REGISTRATION COMPLETE</span>
            <i class="fa-solid fa-check"></i>
            <span class="register-button-shine"></span>
        `;

        showStatus(
            "All fields validated. Redirecting you to the login page...",
            true
        );


        if (
            typeof gsap !== "undefined" &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {

            gsap.to(card, {
                scale: 0.98,
                opacity: 0.85,
                duration: 0.35,
                ease: "power2.in"
            });

        }


        setTimeout(function () {

            form.reset();

            window.location.assign("login.html");

        }, 800);

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

        gsap.from(".register-heading > *", {
            y: 15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.25,
            ease: "power3.out"
        });

    }

});