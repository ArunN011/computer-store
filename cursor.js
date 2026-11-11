document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("stacklySmokeCanvas");

    if (!canvas) return;

    if (canvas.parentElement !== document.body) {
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || reducedMotion) {
        canvas.style.display = "none";
        return;
    }

    canvas.style.position = "fixed";
    canvas.style.pointerEvents = "none";
    canvas.style.background = "transparent";

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    let active = false;
    let initialized = false;
    let animationRunning = false;

    let particles = [];

    let animationFrame = null;

    const colors = [
        { r: 180, g: 154, b: 205 },
        { r: 152, g: 114, b: 181 },
        { r: 211, g: 177, b: 111 },
        { r: 105, g: 191, b: 192 }
    ];

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function resizeCanvas() {

        width = window.innerWidth;
        height = window.innerHeight;

        dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    function createParticle(x, y) {

        const color = colors[
            Math.floor(Math.random() * colors.length)
        ];

        particles.push({

            x: x,
            y: y,

            size: Math.random() * 2 + 1,

            alpha: Math.random() * 0.35 + 0.2,

            life: 1,

            speedX: (Math.random() - 0.5) * 0.5,

            speedY: (Math.random() - 0.5) * 0.5,

            color: color

        });

        if (particles.length > 55) {
            particles.shift();
        }
    }

    function handlePointer(event) {

        if (event.pointerType === "touch") return;

        const x = event.clientX;
        const y = event.clientY;

        mouseX = x;
        mouseY = y;

        if (!initialized) {

            currentX = x;
            currentY = y;

            initialized = true;
        }

        active = true;

        if (Math.random() > 0.35) {
            createParticle(x, y);
        }
    }

    window.addEventListener(
        "pointermove",
        handlePointer,
        {
            passive: true
        }
    );

    window.addEventListener("pointerout", function (event) {

        if (!event.relatedTarget) {
            active = false;
            initialized = false;
        }

    });

    window.addEventListener("blur", function () {

        active = false;
        initialized = false;

    });

    function drawAmbientGlow(x, y, pulse) {

        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, 90 * pulse
        );

        gradient.addColorStop(
            0,
            "rgba(180, 154, 205, 0.28)"
        );

        gradient.addColorStop(
            0.2,
            "rgba(152, 114, 181, 0.19)"
        );

        gradient.addColorStop(
            0.42,
            "rgba(105, 191, 192, 0.09)"
        );

        gradient.addColorStop(
            0.65,
            "rgba(211, 177, 111, 0.055)"
        );

        gradient.addColorStop(
            1,
            "rgba(152, 114, 181, 0)"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            90 * pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    function drawOuterRings(now) {

        const rotation = now * 0.00035;

        ctx.save();

        ctx.translate(currentX, currentY);

        ctx.rotate(rotation);

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            37,
            -0.7,
            1.4
        );

        ctx.strokeStyle = "rgba(180, 154, 205, 0.72)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            43,
            2.6,
            4.9
        );

        ctx.strokeStyle = "rgba(211, 177, 111, 0.72)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.rotate(-rotation * 1.8);

        ctx.setLineDash([2, 5]);

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            51,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(105, 191, 192, 0.38)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.setLineDash([]);

        ctx.restore();
    }

    function drawMicrochip() {

        ctx.save();

        ctx.translate(currentX, currentY);

        ctx.shadowColor = "#9872B5";
        ctx.shadowBlur = 13;

        ctx.beginPath();

        ctx.moveTo(-10, -8);
        ctx.lineTo(-8, -10);
        ctx.lineTo(8, -10);
        ctx.lineTo(10, -8);
        ctx.lineTo(10, 8);
        ctx.lineTo(8, 10);
        ctx.lineTo(-8, 10);
        ctx.lineTo(-10, 8);

        ctx.closePath();

        ctx.fillStyle = "rgba(152, 114, 181, 0.13)";
        ctx.fill();

        ctx.strokeStyle = "rgba(211, 177, 111, 0.9)";
        ctx.lineWidth = 1.3;
        ctx.stroke();

        ctx.strokeStyle = "rgba(180, 154, 205, 0.9)";
        ctx.lineWidth = 1;

        ctx.strokeRect(-5, -5, 10, 10);

        const pins = [
            [-4, -10, -4, -17],
            [4, -10, 4, -17],
            [-4, 10, -4, 17],
            [4, 10, 4, 17],
            [-10, -4, -17, -4],
            [-10, 4, -17, 4],
            [10, -4, 17, -4],
            [10, 4, 17, 4]
        ];

        pins.forEach(function (pin, index) {

            ctx.beginPath();

            ctx.moveTo(pin[0], pin[1]);
            ctx.lineTo(pin[2], pin[3]);

            ctx.strokeStyle = index % 2 === 0
                ? "rgba(105, 191, 192, 0.9)"
                : "rgba(211, 177, 111, 0.9)";

            ctx.lineWidth = 1.2;

            ctx.stroke();

            ctx.beginPath();

            ctx.arc(
                pin[2],
                pin[3],
                1.3,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#D3B16F";
            ctx.fill();

        });

        const center = ctx.createRadialGradient(
            0, 0, 0,
            0, 0, 7
        );

        center.addColorStop(0, "#FFFFFF");
        center.addColorStop(0.45, "#D8C5FF");
        center.addColorStop(1, "rgba(152, 114, 181, 0)");

        ctx.fillStyle = center;

        ctx.shadowColor = "#B49ACD";
        ctx.shadowBlur = 17;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }

    function drawParticles() {

        for (let i = particles.length - 1; i >= 0; i--) {

            const particle = particles[i];

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            particle.life -= 0.018;

            if (particle.life <= 0) {

                particles.splice(i, 1);

                continue;
            }

            const alpha = particle.alpha * particle.life;

            const color = particle.color;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

            ctx.shadowColor =
                `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;

            ctx.shadowBlur = 9;

            ctx.fill();
        }

        ctx.shadowBlur = 0;
    }

    function drawCenterGlow() {

        const gradient = ctx.createRadialGradient(
            currentX,
            currentY,
            0,
            currentX,
            currentY,
            23
        );

        gradient.addColorStop(
            0,
            "rgba(255, 255, 255, 0.2)"
        );

        gradient.addColorStop(
            0.3,
            "rgba(180, 154, 205, 0.15)"
        );

        gradient.addColorStop(
            1,
            "rgba(152, 114, 181, 0)"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            currentX,
            currentY,
            23,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    function animate(now) {

        if (!animationRunning) return;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        if (active) {

            currentX += (mouseX - currentX) * 0.24;
            currentY += (mouseY - currentY) * 0.24;

            const pulse =
                1 + Math.sin(now * 0.003) * 0.045;

            drawAmbientGlow(
                currentX,
                currentY,
                pulse
            );

            drawOuterRings(now);

            drawCenterGlow();

            drawMicrochip();
        }

        drawParticles();

        animationFrame = requestAnimationFrame(animate);
    }

    function startCursorAnimation() {

        if (animationRunning) return;

        if (!canvas.isConnected) {
            document.body.appendChild(canvas);
        }

        canvas.style.display = "block";

        resizeCanvas();

        animationRunning = true;

        animationFrame = requestAnimationFrame(animate);
    }

    function stopCursorAnimation() {

        animationRunning = false;

        if (animationFrame !== null) {

            cancelAnimationFrame(animationFrame);

            animationFrame = null;
        }
    }

    startCursorAnimation();

    window.addEventListener("pagehide", function () {

        stopCursorAnimation();

    });

    window.addEventListener("pageshow", function () {

        active = false;
        initialized = false;

        particles.length = 0;

        startCursorAnimation();

    });

    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            stopCursorAnimation();

        } else {

            active = false;
            initialized = false;

            resizeCanvas();

            startCursorAnimation();
        }

    });

});