
document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".stackly-laptop-hero");

    if (!section || typeof gsap === "undefined") return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const image = section.querySelector(".laptop-hero-image");
    const productImage = section.querySelector(".laptop-product-image");
    const visual = section.querySelector(".laptop-hero-visual");
    const bottom = section.querySelector(".laptop-hero-bottom");

    const animatedElements = [
        ".laptop-availability",
        ".laptop-hero-kicker",
        ".laptop-hero-title",
        ".laptop-hero-description",
        ".laptop-highlight",
        ".laptop-hero-actions",
        ".laptop-hero-note"
    ].map(function (selector) {
        return section.querySelectorAll(selector);
    });

    animatedElements.forEach(function (elements) {
        gsap.set(elements, { y: 30, autoAlpha: 0 });
    });

    gsap.set(image, { scale: 1.15, opacity: 0.6 });
    gsap.set(visual, { x: 45, autoAlpha: 0 });
    gsap.set(bottom, { y: 20, autoAlpha: 0 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
        .to(image, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" })
        .to(animatedElements[0], { y: 0, autoAlpha: 1, duration: 0.65 }, "-=1.35")
        .to(animatedElements[1], { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.9")
        .to(animatedElements[2], { y: 0, autoAlpha: 1, duration: 1 }, "-=0.7")
        .to(animatedElements[3], { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.5")
        .to(animatedElements[4], { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.12 }, "-=0.35")
        .to(animatedElements[5], { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.3")
        .to(animatedElements[6], { y: 0, autoAlpha: 1, duration: 0.55 }, "-=0.35")
        .to(visual, { x: 0, autoAlpha: 1, duration: 1, ease: "back.out(1.2)" }, "-=1")
        .to(bottom, { y: 0, autoAlpha: 1, duration: 0.65 }, "-=0.3");

    gsap.to(".laptop-ring-two", { rotation: 360, duration: 30, repeat: -1, ease: "none" });

    gsap.to(".laptop-ring-one", { scale: 1.1, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    gsap.to(".laptop-floating-spec", { y: -7, duration: 2.5, stagger: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        section.addEventListener("pointermove", function (event) {
            const rect = section.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(image, { x: x * -9, y: y * -6, duration: 1, ease: "power2.out", overwrite: "auto" });
            gsap.to(productImage, { x: x * 13, y: y * 9, duration: 0.9, ease: "power2.out", overwrite: "auto" });
        });

        section.addEventListener("pointerleave", function () {
            gsap.to(image, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
            gsap.to(productImage, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        });

    }

});

(function () {
    const CART_KEY = "stacklyStoreCart";
    let lastCount = -1;

    function readCart() {
        try {
            const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (error) {
            return;
        }
        updateBadges();
        window.dispatchEvent(new CustomEvent("stackly:cart-updated"));
    }

    function getCount() {
        return readCart().reduce(function (total, item) {
            return total + Number(item.quantity || 0);
        }, 0);
    }

    function getQty(id) {
        const item = readCart().find(function (entry) {
            return String(entry.id) === String(id);
        });
        return item ? Number(item.quantity) : 0;
    }

    function updateBadges() {
        const count = getCount();
        const changed = lastCount !== -1 && count !== lastCount;
        lastCount = count;

        document.querySelectorAll(".cart-badge, .mobile-cart-badge").forEach(function (badge) {
            badge.textContent = count > 99 ? "99+" : count;
            badge.setAttribute("aria-label", count + " items in cart");

            if (changed) {
                badge.classList.remove("badge-pulse");
                void badge.offsetWidth;
                badge.classList.add("badge-pulse");
            }
        });
    }

    function add(product, quantity) {
        quantity = Number(quantity || 1);

        if (!product || product.stock <= 0) {
            return { success: false, message: "This product is currently out of stock." };
        }

        const cart = readCart();
        const existing = cart.find(function (item) {
            return String(item.id) === String(product.id);
        });

        if (existing) {
            if (existing.quantity + quantity > product.stock) {
                return { success: false, message: "Only " + product.stock + " units are available." };
            }
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice || 0,
                image: product.image,
                category: product.category,
                specs: product.specs || [],
                stock: product.stock,
                quantity: quantity
            });
        }

        saveCart(cart);
        return { success: true };
    }

    function remove(id) {
        saveCart(readCart().filter(function (item) {
            return String(item.id) !== String(id);
        }));
    }

    function updateQuantity(id, quantity) {
        const cart = readCart();
        const item = cart.find(function (entry) {
            return String(entry.id) === String(id);
        });

        if (!item) return false;

        quantity = Number(quantity);

        if (quantity > item.stock) return false;

        if (quantity < 1) {
            remove(id);
            return true;
        }

        item.quantity = quantity;
        saveCart(cart);
        return true;
    }

    function subtotal() {
        return readCart().reduce(function (total, item) {
            return total + Number(item.price) * Number(item.quantity);
        }, 0);
    }

    function savings() {
        return readCart().reduce(function (total, item) {
            return total + Math.max(0, Number(item.oldPrice || 0) - Number(item.price)) * Number(item.quantity);
        }, 0);
    }

    function formatPrice(value) {
        return "₹" + Number(value).toLocaleString("en-IN");
    }

    window.StacklyCart = {
        key: CART_KEY,
        get: readCart,
        count: getCount,
        getQty: getQty,
        add: add,
        updateQuantity: updateQuantity,
        remove: remove,
        clear: function () { saveCart([]); },
        subtotal: subtotal,
        savings: savings,
        formatPrice: formatPrice,
        updateBadges: updateBadges
    };

    window.addEventListener("storage", function (event) {
        if (event.key === CART_KEY) {
            updateBadges();
            window.dispatchEvent(new CustomEvent("stackly:cart-updated"));
        }
    });

    window.addEventListener("pageshow", updateBadges);

    lastCount = getCount();
    updateBadges();
    document.addEventListener("DOMContentLoaded", updateBadges);
})();


document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("desktopProductsGrid");

    if (!grid || !window.StacklyCart) return;

    const cart = window.StacklyCart;
    const hasGsap = typeof gsap !== "undefined";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = ["#9872B5", "#B49ACD", "#D3B16F", "#69BFC0", "#B35E83", "#4D9A75", "#FFFFFF"];
    const specLabels = ["Processor", "Graphics", "Memory", "Storage", "Display", "Battery"];

    const featureSets = {
        Ultrabooks: [
            ["fa-gauge-high", "Smooth high-refresh gaming wherever you go"],
            ["fa-snowflake", "Advanced thermal design keeps temperatures low"],
            ["fa-keyboard", "Responsive keyboard with customisable backlight"],
            ["fa-bolt", "Ready for ray tracing and DLSS"]
        ],
        Chromebooks: [
            ["fa-cubes", "Built for 3D, CAD, simulation and rendering"],
            ["fa-memory", "High-capacity memory with fast scratch storage"],
            ["fa-wind", "Sustained performance under heavy loads"],
            ["fa-clipboard-check", "Stress-tested for 72 hours before dispatch"]
        ],
         BusinessLaptops: [
            ["fa-film", "Fast 4K video editing and colour grading"],
            ["fa-palette", "Colour-accurate, wide-gamut creative display"],
            ["fa-wand-magic-sparkles", "GPU acceleration for Premiere, DaVinci and Blender"],
            ["fa-hard-drive", "Fast NVMe storage for large project files"]
        ],
        TraditionalLaptops: [
            ["fa-briefcase", "Reliable for work, study and daily multitasking"],
            ["fa-leaf", "Efficient components with all-day battery life"],
            ["fa-rocket", "Fast boot and app launch on NVMe storage"],
            ["fa-feather", "Slim, light and designed to travel"]
        ]
    };

    const reviewPool = [
        { name: "Rajesh S.", city: "Chennai", rating: 5, when: "4 weeks ago", text: "Boots in seconds and stays quiet under load. The build quality feels properly premium." },
        { name: "Suriya T.", city: "Bengaluru", rating: 5, when: "2 months ago", text: "Packaging was excellent and setup took minutes. Handles my daily workload without a stutter." },
        { name: "Karthika A.", city: "Hyderabad", rating: 4, when: "2 months ago", text: "Great performance for the price. The display is sharp, and support answered quickly." }
    ];

    /* IMPORTANT: laptop IDs start with LP so they never clash with desktop IDs (PC...) */
    const products = [
        { id: "LP1001", name: "HP OmniBook", category: "Ultrabooks", price: 249999, oldPrice: 279999, image: "Assets/lap11.webp", stock: 5, maxStock: 12, badge: "FLAGSHIP", badgeType: "badge-purple", rating: 4.9, reviews: 128, specs: ["Intel Core Ultra 9", "RTX 4080", "64GB RAM"], detail: ["Intel Core Ultra 9 185H", "NVIDIA GeForce RTX 4080 12GB", "64GB DDR5 5600MHz", "2TB NVMe Gen4 SSD", "16\" 3.2K OLED 120Hz", "99Wh battery, 240W adapter"], about: "Our flagship portable workstation for heavy rendering, simulation and AI workloads, built for people who cannot wait on their machine." },
        { id: "LP1002", name: "Lenovo ThinkPad L14 ", category: "BusinessLaptops", price: 189999, oldPrice: 209999, image: "Assets/lap12.webp", stock: 7, maxStock: 15, badge: "BESTSELLER", badgeType: "", rating: 4.8, reviews: 96, specs: ["Apple M5", "10-core GPU", "24GB RAM"], detail: ["Apple M5 chip, 10-core CPU", "10-core Apple GPU", "24GB unified memory", "1TB SSD", "15.3\" Liquid Retina display", "Up to 18 hours, MagSafe charging"], about: "An ultra-thin, fanless laptop that pairs outstanding efficiency with a stunning display and all-day battery life." },
        { id: "LP1003", name: "HP 15-FD0651TU", category: "TraditionalLaptops", price: 159999, oldPrice: 174999, image: "Assets/lap13.webp", stock: 4, maxStock: 10, badge: "CREATOR PICK", badgeType: "badge-teal", rating: 4.9, reviews: 74, specs: ["Intel i7", "RTX 4070", "32GB RAM"], detail: ["Intel Core i7-14700HX", "NVIDIA GeForce RTX 4070 8GB", "32GB DDR5 5600MHz", "2TB NVMe Gen4 SSD", "16\" 4K OLED 100% DCI-P3", "90Wh battery, 230W adapter"], about: "Tuned for editors, designers and 3D artists who need fast timelines, quick exports and colour-accurate output." },
        { id: "LP1004", name: "ASUS Chromebook CX14", category: "Chromebooks", price: 139999, oldPrice: 154999, image: "Assets/lap14.webp", stock: 3, maxStock: 8, badge: "LIMITED", badgeType: "badge-purple", rating: 4.7, reviews: 61, specs: ["Intel i7", "RTX 4060", "32GB RAM"], detail: ["Intel Core i7-13700H", "NVIDIA GeForce RTX 4060 8GB", "32GB DDR5 5200MHz", "1TB NVMe Gen4 SSD", "15.6\" QHD 165Hz", "80Wh battery, 180W adapter"], about: "A compact studio laptop that brings workstation-class power to design, engineering and video teams." },
        { id: "LP1005", name: "Apple MacBook Air M5", category: "BusinessLaptops", price: 99999, oldPrice: 109999, image: "Assets/lap15.webp", stock: 9, maxStock: 20, badge: "POPULAR", badgeType: "badge-teal", rating: 4.6, reviews: 48, specs: ["Ryzen 7", "RTX 4050", "16GB RAM"], detail: ["AMD Ryzen 7 7840HS", "NVIDIA GeForce RTX 4050 6GB", "16GB DDR5 5200MHz", "1TB NVMe Gen4 SSD", "15.6\" FHD 144Hz", "72Wh battery, 150W adapter"], about: "The sweet spot for 1080p and 1440p gaming on the move, with enough headroom for streaming and everyday creative work." },
        { id: "LP1006", name: "Apple MacBook Neo", category: "TraditionalLaptops", price: 69999, oldPrice: 74999, image: "Assets/lap16.webp", stock: 0, maxStock: 15, badge: "SOLD OUT", badgeType: "badge-purple", rating: 4.5, reviews: 32, specs: ["Intel i5", "Iris Xe", "16GB RAM"], detail: ["Intel Core i5-1335U", "Intel Iris Xe Graphics", "16GB DDR4 3200MHz", "512GB NVMe SSD", "14\" FHD IPS anti-glare", "56Wh battery, 65W USB-C charging"], about: "A dependable all-rounder for study, office work and everyday use, built to run quietly for years." }
    ];

    const sortSelect = document.getElementById("shopSort");
    const priceRange = document.getElementById("shopPriceRange");
    const priceValue = document.getElementById("shopPriceValue");
    const stockFilter = document.getElementById("shopStockFilter");
    const searchInput = document.getElementById("shopSearch");
    const countElement = document.getElementById("shopResultCount");
    const emptyState = document.getElementById("shopEmptyState");
    const activeFilters = document.getElementById("shopActiveFilters");
    const sidebar = document.getElementById("shopSidebar");
    const overlay = document.getElementById("shopSidebarOverlay");
    const openFilter = document.getElementById("shopFilterOpen");
    const closeFilter = document.getElementById("shopFilterClose");
    const resetButton = document.getElementById("shopReset");
    const emptyReset = document.getElementById("shopEmptyReset");
    const modal = document.getElementById("pdModal");
    const modalDialog = document.getElementById("pdDialog");
    const modalBody = document.getElementById("pdBody");

    const wishlistKey = "stacklyStoreWishlist";
    let toastTimer;
    let openProductId = null;
    let lastFocus = null;

    function byId(id) {
        return products.find(function (product) { return product.id === id; });
    }

    function discount(product) {
        return Math.round((1 - product.price / product.oldPrice) * 100);
    }

    function emi(product) {
        return cart.formatPrice(Math.round(product.price / 12));
    }

    function starIcons(rating) {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            html += rating >= i
                ? '<i class="fa-solid fa-star"></i>'
                : rating >= i - 0.5
                    ? '<i class="fa-solid fa-star-half-stroke"></i>'
                    : '<i class="fa-regular fa-star"></i>';
        }
        return html;
    }

    function getWishlist() {
        try {
            const data = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveWishlist(items) {
        try {
            localStorage.setItem(wishlistKey, JSON.stringify(items));
        } catch (error) {
            return;
        }
    }

    function showToast(title, message, type) {
        const toast = document.getElementById("shopToast");
        const icon = document.getElementById("shopToastIcon");
        const icons = { success: "fa-check", info: "fa-minus", warn: "fa-triangle-exclamation", heart: "fa-heart" };

        document.getElementById("shopToastTitle").textContent = title;
        document.getElementById("shopToastMessage").textContent = message;
        icon.className = "fa-solid " + (icons[type] || icons.success);
        toast.className = "shop-toast is-visible toast-" + (type || "success");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2800);
    }

    function updatePriceDisplay() {
        const min = Number(priceRange.min);
        const max = Number(priceRange.max);
        const current = Number(priceRange.value);

        priceValue.textContent = cart.formatPrice(current);
        priceRange.style.setProperty("--range-progress", ((current - min) / (max - min)) * 100 + "%");
    }

    function getSelectedCategories() {
        return Array.from(document.querySelectorAll('input[name="categoryFilter"]:checked')).map(function (input) {
            return input.value;
        });
    }

    function getFilteredProducts() {
        let result = products.slice();
        const categories = getSelectedCategories();
        const search = searchInput.value.trim().toLowerCase();

        if (categories.length) {
            result = result.filter(function (product) { return categories.includes(product.category); });
        }

        result = result.filter(function (product) { return product.price <= Number(priceRange.value); });

        if (stockFilter.checked) {
            result = result.filter(function (product) { return product.stock > 0; });
        }

        if (search) {
            result = result.filter(function (product) {
                return (product.name + " " + product.category + " " + product.specs.join(" ") + " " + product.detail.join(" ")).toLowerCase().includes(search);
            });
        }

        if (sortSelect.value === "price-low") {
            result.sort(function (a, b) { return a.price - b.price; });
        } else if (sortSelect.value === "price-high") {
            result.sort(function (a, b) { return b.price - a.price; });
        } else if (sortSelect.value === "rating") {
            result.sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
        } else if (sortSelect.value === "name") {
            result.sort(function (a, b) { return a.name.localeCompare(b.name); });
        }

        return result;
    }

    function renderActiveFilters() {
        let html = "";

        getSelectedCategories().forEach(function (category) {
            html += '<span class="shop-filter-chip">' + category +
                '<button type="button" data-remove-category="' + category + '" aria-label="Remove ' + category + ' filter"><i class="fa-solid fa-xmark"></i></button></span>';
        });

        if (Number(priceRange.value) < Number(priceRange.max)) {
            html += '<span class="shop-filter-chip">Up to ' + cart.formatPrice(priceRange.value) + "</span>";
        }

        if (stockFilter.checked) {
            html += '<span class="shop-filter-chip">In Stock Only</span>';
        }

        activeFilters.innerHTML = html;
    }

    function actionsHTML(product) {
        const qty = cart.getQty(product.id);
        const wished = getWishlist().includes(product.id);
        const available = product.stock > 0;

        const heart =
            '<button type="button" class="shop-view-wishlist' + (wished ? " is-active" : "") + '" data-wishlist="' + product.id + '" aria-pressed="' + wished + '" aria-label="Toggle wishlist for ' + product.name + '">' +
            '<i class="fa-' + (wished ? "solid" : "regular") + ' fa-heart"></i></button>';

        if (!available) {
            return '<button type="button" class="shop-add-btn" disabled><i class="fa-solid fa-ban"></i><span>OUT OF STOCK</span></button>' + heart;
        }

        if (qty > 0) {
            return '<div class="shop-qty" role="group" aria-label="Quantity in cart">' +
                '<button type="button" data-qty="dec" data-id="' + product.id + '" aria-label="Reduce quantity"><i class="fa-solid fa-' + (qty === 1 ? "trash-can" : "minus") + '"></i></button>' +
                '<span class="shop-qty-value"><strong>' + qty + "</strong><small>IN CART</small></span>" +
                '<button type="button" data-qty="inc" data-id="' + product.id + '" aria-label="Increase quantity"' + (qty >= product.stock ? " disabled" : "") + '><i class="fa-solid fa-plus"></i></button></div>' + heart;
        }

        return '<button type="button" class="shop-add-btn" data-add-to-cart="' + product.id + '"><i class="fa-solid fa-cart-plus"></i><span>ADD TO CART</span></button>' + heart;
    }

    function stockHTML(product) {
        if (product.stock <= 0) {
            return '<div class="shop-stock-status out-of-stock"><i class="fa-solid fa-circle-xmark"></i>CURRENTLY UNAVAILABLE</div>';
        }

        if (product.stock <= 3) {
            return '<div class="shop-stock-status low"><i class="fa-solid fa-fire"></i>ONLY ' + product.stock + " LEFT IN STOCK</div>";
        }

        return '<div class="shop-stock-status"><i class="fa-solid fa-circle-check"></i>IN STOCK · ' + product.stock + " AVAILABLE</div>";
    }

    function cardTemplate(product) {
        const wished = getWishlist().includes(product.id);

        return '<article class="shop-product-card" data-product-id="' + product.id + '">' +
            '<div class="shop-product-image" data-details="' + product.id + '" role="button" tabindex="0" aria-label="View details of ' + product.name + '">' +
            '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" decoding="async">' +
            '<div class="product-image-fallback"><i class="fa-solid fa-laptop"></i><span>STACKLY</span></div>' +
            '<span class="shop-product-badge ' + product.badgeType + '">' + product.badge + "</span>" +
            '<span class="shop-discount-chip">-' + discount(product) + "%</span>" +
            '<button type="button" class="shop-wishlist-btn' + (wished ? " is-active" : "") + '" data-wishlist="' + product.id + '" aria-pressed="' + wished + '" aria-label="Toggle wishlist for ' + product.name + '"><i class="fa-' + (wished ? "solid" : "regular") + ' fa-heart"></i></button>' +
            '<span class="shop-quick-view"><i class="fa-solid fa-eye"></i> QUICK VIEW</span></div>' +
            '<div class="shop-product-content">' +
            '<span class="shop-product-category">' + product.category.toUpperCase() + " SERIES</span>" +
            '<h3 class="shop-product-name" data-details="' + product.id + '" role="button" tabindex="0">' + product.name + "</h3>" +
            '<div class="shop-product-rating"><span class="stars">' + starIcons(product.rating) + "</span><strong>" + product.rating + "</strong><span>(" + product.reviews + " reviews)</span></div>" +
            '<div class="shop-product-specs">' + product.specs.map(function (spec) { return "<span>" + spec + "</span>"; }).join("") + "</div>" +
            '<div class="shop-product-price-row"><span class="shop-product-price">' + cart.formatPrice(product.price) + '</span><span class="shop-product-old-price">' + cart.formatPrice(product.oldPrice) + "</span></div>" +
            '<div class="shop-emi"><i class="fa-solid fa-credit-card"></i>EMI from ' + emi(product) + "/month</div>" +
            stockHTML(product) +
            '<div class="shop-product-actions" data-qty-state="' + cart.getQty(product.id) + '">' + actionsHTML(product) + "</div>" +
            '<button type="button" class="shop-details-btn" data-details="' + product.id + '"><i class="fa-solid fa-circle-info"></i> VIEW DETAILS</button>' +
            "</div></article>";
    }

    function renderProducts(animate) {
        const filtered = getFilteredProducts();

        countElement.textContent = filtered.length + (filtered.length === 1 ? " PRODUCT" : " PRODUCTS");
        emptyState.hidden = filtered.length !== 0;
        grid.hidden = filtered.length === 0;

        renderActiveFilters();

        if (!filtered.length) {
            grid.innerHTML = "";
            return;
        }

        grid.innerHTML = filtered.map(cardTemplate).join("");

        grid.querySelectorAll(".shop-product-image img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.parentElement.classList.add("image-missing");
            }, { once: true });
        });

        if (animate !== false && hasGsap && !reduceMotion) {
            gsap.fromTo(
                grid.querySelectorAll(".shop-product-card"),
                { y: 28, opacity: 0, scale: 0.97 },
                { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity" }
            );
        }
    }

    function popElement(element) {
        if (!element || !hasGsap || reduceMotion) return;
        gsap.fromTo(element, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    }

    function refreshCards() {
        grid.querySelectorAll(".shop-product-card").forEach(function (card) {
            const product = byId(card.dataset.productId);
            const actions = card.querySelector(".shop-product-actions");
            const qty = String(cart.getQty(product.id));

            if (actions.dataset.qtyState === qty) return;

            actions.dataset.qtyState = qty;
            actions.innerHTML = actionsHTML(product);
            popElement(actions.querySelector(".shop-qty-value strong") || actions.firstElementChild);
        });

        if (openProductId) refreshModalActions();
    }

    function refreshModalActions() {
        const product = byId(openProductId);
        const target = document.getElementById("pdActions");

        if (!product || !target) return;

        const qty = String(cart.getQty(product.id));

        if (target.dataset.qtyState === qty) return;

        target.dataset.qtyState = qty;
        target.innerHTML = actionsHTML(product);
        popElement(target.querySelector(".shop-qty-value strong") || target.firstElementChild);
    }

    function updateWishlistUI(id, wished) {
        document.querySelectorAll('[data-wishlist="' + id + '"]').forEach(function (button) {
            button.classList.toggle("is-active", wished);
            button.setAttribute("aria-pressed", wished);
            const icon = button.querySelector("i");
            if (icon) icon.className = "fa-" + (wished ? "solid" : "regular") + " fa-heart";
            if (wished && hasGsap && !reduceMotion) {
                gsap.fromTo(button, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
            }
        });
    }

    function getCartTarget() {
        return Array.from(document.querySelectorAll(".cart-action, .mobile-cart")).find(function (element) {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden";
        });
    }

    function party(x, y, power) {
        if (typeof confetti !== "function" || reduceMotion) return;

        const origin = { x: x / window.innerWidth, y: y / window.innerHeight };
        const base = { origin: origin, colors: palette, zIndex: 3000, ticks: 230, gravity: 1.05, disableForReducedMotion: true };

        confetti(Object.assign({}, base, { particleCount: Math.round(70 * power), spread: 75, startVelocity: 44, angle: 90 }));
        confetti(Object.assign({}, base, { particleCount: Math.round(40 * power), spread: 120, startVelocity: 28, scalar: 0.8, shapes: ["circle"] }));
        confetti(Object.assign({}, base, { particleCount: Math.round(24 * power), angle: 60, spread: 55, startVelocity: 52 }));
        confetti(Object.assign({}, base, { particleCount: Math.round(24 * power), angle: 120, spread: 55, startVelocity: 52 }));
    }

    function ripple(x, y, className) {
        if (!hasGsap || reduceMotion) return;

        const ring = document.createElement("span");
        ring.className = "cart-ripple " + (className || "");
        ring.style.left = x + "px";
        ring.style.top = y + "px";
        document.body.appendChild(ring);

        gsap.fromTo(ring, { scale: 0.3, opacity: 0.75 }, {
            scale: 3,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out",
            onComplete: function () { ring.remove(); }
        });
    }

    function landOnCart(target) {
        const rect = target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        if (hasGsap && !reduceMotion) {
            gsap.fromTo(target, { scale: 1 }, { scale: 1.3, duration: 0.16, repeat: 1, yoyo: true, ease: "power2.out" });
        }

        ripple(x, y, "");
        party(x, y, 0.55);
    }

    function flyToCart(image) {
        const target = getCartTarget();

        if (!target) return;

        if (!image || !hasGsap || reduceMotion) {
            landOnCart(target);
            return;
        }

        const imageRect = image.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        if (!imageRect.width || !targetRect.width) return;

        const size = Math.min(110, Math.max(70, imageRect.width * 0.4));
        const startX = imageRect.left + imageRect.width / 2;
        const startY = imageRect.top + imageRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = Math.max(targetRect.top + targetRect.height / 2, 24);
        const lift = Math.min(130, Math.max(50, Math.abs(endY - startY) * 0.25));

        const fly = document.createElement("img");
        fly.src = image.currentSrc || image.src;
        fly.alt = "";
        fly.className = "cart-flying-image";
        fly.style.width = size + "px";
        fly.style.height = size + "px";
        document.body.appendChild(fly);

        gsap.set(fly, { left: startX, top: startY, xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0, rotation: 0 });

        gsap.timeline({
            onComplete: function () {
                fly.remove();
                landOnCart(target);
            }
        })
            .to(fly, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2.2)" })
            .to(fly, { x: endX - startX, duration: 0.95, ease: "power1.inOut" }, "move")
            .to(fly, {
                keyframes: [
                    { y: -lift, duration: 0.32, ease: "power2.out" },
                    { y: endY - startY, duration: 0.63, ease: "power3.in" }
                ]
            }, "move")
            .to(fly, { rotation: 380, duration: 0.95, ease: "power1.in" }, "move")
            .to(fly, { scale: 0.14, duration: 0.5, ease: "power2.in" }, "move+=0.45")
            .to(fly, { opacity: 0.2, duration: 0.25, ease: "none" }, "move+=0.7");
    }

    function shake(element) {
        if (!hasGsap || reduceMotion || !element) return;
        gsap.fromTo(element, { x: -7 }, { x: 0, duration: 0.55, ease: "elastic.out(1, 0.25)" });
    }

    function addToCart(product, trigger, root) {
        const rect = trigger.getBoundingClientRect();
        const image = root.querySelector(".shop-product-image img, .pd-media img");
        const result = cart.add(product, 1);

        if (!result.success) {
            showToast("Unable to add", result.message, "warn");
            shake(trigger);
            return;
        }

        flyToCart(image);
        party(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
        showToast("Added to your cart", product.name + " is in your cart.", "success");
    }

    function changeQuantity(product, delta, trigger) {
        const qty = cart.getQty(product.id);
        const next = qty + delta;

        if (delta > 0 && next > product.stock) {
            showToast("Stock limit reached", "Only " + product.stock + " units are available.", "warn");
            shake(trigger);
            return;
        }

        if (next < 1) {
            cart.remove(product.id);
            showToast("Removed from cart", product.name + " was removed.", "info");
            return;
        }

        cart.updateQuantity(product.id, next);

        if (delta > 0) {
            const rect = trigger.getBoundingClientRect();
            party(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.45);
        }

        showToast(delta > 0 ? "Quantity increased" : "Quantity reduced", product.name + " × " + next + " in cart.", delta > 0 ? "success" : "info");
    }

    function toggleWishlist(id) {
        let wishlist = getWishlist();
        const product = byId(id);

        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(function (entry) { return entry !== id; });
            saveWishlist(wishlist);
            updateWishlistUI(id, false);
            showToast("Wishlist updated", "Removed from your wishlist.", "info");
        } else {
            wishlist.push(id);
            saveWishlist(wishlist);
            updateWishlistUI(id, true);
            showToast("Saved to wishlist", product.name + " is saved.", "heart");
        }
    }

    function reviewDistribution(product) {
        const five = Math.min(92, Math.round(40 + (product.rating - 4) * 50));
        const rest = 100 - five;
        const four = Math.round(rest * 0.6);
        const three = Math.round(rest * 0.25);
        const two = Math.round(rest * 0.1);
        return [five, four, three, two, rest - four - three - two];
    }

    function modalTemplate(product) {
        const dist = reviewDistribution(product);
        const stockPercent = Math.min(100, Math.round((product.stock / product.maxStock) * 100));
        const stockClass = product.stock === 0 ? "out" : product.stock <= 3 ? "low" : "ok";
        const reviews = reviewPool.map(function (review, index) {
            return reviewPool[(index + products.indexOf(product)) % reviewPool.length];
        });

        return '<div class="pd-media"><img src="' + product.image + '" alt="' + product.name + '">' +
            '<div class="product-image-fallback"><i class="fa-solid fa-laptop"></i><span>STACKLY</span></div>' +
            '<span class="shop-product-badge ' + product.badgeType + '">' + product.badge + "</span></div>" +
            '<div class="pd-info">' +
            '<span class="shop-product-category">' + product.category.toUpperCase() + " SERIES</span>" +
            '<h2 id="pdTitle">' + product.name + "</h2>" +
            '<div class="shop-product-rating pd-rating"><span class="stars">' + starIcons(product.rating) + "</span><strong>" + product.rating + "</strong><span>(" + product.reviews + " reviews)</span></div>" +
            '<div class="pd-price"><strong>' + cart.formatPrice(product.price) + "</strong><s>" + cart.formatPrice(product.oldPrice) + '</s><em>' + discount(product) + "% OFF</em></div>" +
            '<p class="pd-emi"><i class="fa-solid fa-credit-card"></i> EMI from ' + emi(product) + "/month for 12 months</p>" +
            '<div class="pd-stock ' + stockClass + '"><div class="pd-stock-top"><span><i class="fa-solid fa-warehouse"></i> ' +
            (product.stock ? product.stock + " of " + product.maxStock + " units in stock" : "Currently out of stock") +
            '</span><strong>' + (product.stock === 0 ? "SOLD OUT" : product.stock <= 3 ? "LOW STOCK" : "AVAILABLE") + '</strong></div><div class="pd-stock-bar"><span style="width:' + stockPercent + '%"></span></div></div>' +
            '<div class="pd-tabs" role="tablist">' +
            '<button type="button" class="is-active" role="tab" data-tab="overview">Overview</button>' +
            '<button type="button" role="tab" data-tab="specs">Specifications</button>' +
            '<button type="button" role="tab" data-tab="reviews">Reviews (' + product.reviews + ")</button></div>" +
            '<div class="pd-panel" data-panel="overview"><p class="pd-about">' + product.about + "</p><ul class='pd-features'>" +
            featureSets[product.category].map(function (feature) { return '<li><i class="fa-solid ' + feature[0] + '"></i><span>' + feature[1] + "</span></li>"; }).join("") + "</ul></div>" +
            '<div class="pd-panel" data-panel="specs" hidden><table class="pd-spec-table"><tbody>' +
            product.detail.map(function (value, index) { return "<tr><th>" + specLabels[index] + "</th><td>" + value + "</td></tr>"; }).join("") +
            "<tr><th>Warranty</th><td>3 years with free support</td></tr></tbody></table></div>" +
            '<div class="pd-panel" data-panel="reviews" hidden><div class="pd-review-summary"><div class="pd-review-score"><strong>' + product.rating + "</strong><span class='stars'>" + starIcons(product.rating) + "</span><small>" + product.reviews + " ratings</small></div><div class='pd-review-bars'>" +
            dist.map(function (percent, index) { return "<div><span>" + (5 - index) + '<i class="fa-solid fa-star"></i></span><div><span style="width:' + percent + '%"></span></div><small>' + percent + "%</small></div>"; }).join("") +
            "</div></div><div class='pd-reviews'>" +
            reviews.map(function (review) { return "<article><header><strong>" + review.name + "</strong><span>" + review.city + " · " + review.when + '</span></header><span class="stars">' + starIcons(review.rating) + "</span><p>" + review.text + "</p><small><i class='fa-solid fa-circle-check'></i> Verified purchase</small></article>"; }).join("") +
            "</div></div>" +
            '<div class="pd-actions shop-product-actions" id="pdActions" data-qty-state="' + cart.getQty(product.id) + '">' + actionsHTML(product) + "</div>" +
            '<ul class="pd-perks"><li><i class="fa-solid fa-truck-fast"></i>Free delivery</li><li><i class="fa-solid fa-shield-halved"></i>3-year warranty</li><li><i class="fa-solid fa-rotate-left"></i>7-day replacement</li><li><i class="fa-solid fa-headset"></i>Expert support</li></ul>' +
            "</div>";
    }

    function openDetails(id) {
        const product = byId(id);

        if (!product) return;

        openProductId = id;
        lastFocus = document.activeElement;
        modalBody.innerHTML = modalTemplate(product);
        modal.hidden = false;
        document.body.style.overflow = "hidden";

        const img = modalBody.querySelector(".pd-media img");
        img.addEventListener("error", function () { img.parentElement.classList.add("image-missing"); }, { once: true });

        modalDialog.scrollTop = 0;

        if (hasGsap && !reduceMotion) {
            gsap.fromTo(".pd-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(modalDialog, { y: 60, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
            gsap.from(".pd-info > *", { y: 16, opacity: 0, duration: 0.45, stagger: 0.04, delay: 0.12, ease: "power2.out", clearProps: "all" });
            gsap.from(".pd-stock-bar span", { width: 0, duration: 0.9, delay: 0.35, ease: "power3.out" });
        }

        modalDialog.querySelector(".pd-close").focus();
    }

    function closeDetails() {
        if (modal.hidden) return;

        function finish() {
            modal.hidden = true;
            openProductId = null;
            document.body.style.overflow = sidebar.classList.contains("is-open") ? "hidden" : "";
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        if (hasGsap && !reduceMotion) {
            gsap.to(modalDialog, { y: 40, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: finish });
            gsap.to(".pd-backdrop", { opacity: 0, duration: 0.25 });
        } else {
            finish();
        }
    }

    function switchTab(button) {
        const name = button.dataset.tab;

        modalBody.querySelectorAll(".pd-tabs button").forEach(function (tab) {
            tab.classList.toggle("is-active", tab === button);
            tab.setAttribute("aria-selected", tab === button);
        });

        modalBody.querySelectorAll(".pd-panel").forEach(function (panel) {
            const show = panel.dataset.panel === name;
            panel.hidden = !show;

            if (show && hasGsap && !reduceMotion) {
                gsap.fromTo(panel, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", clearProps: "all" });
                gsap.from(panel.querySelectorAll(".pd-review-bars div > div span"), { width: 0, duration: 0.8, ease: "power3.out" });
            }
        });
    }

    function handleActions(event) {
        const root = event.currentTarget;
        const addButton = event.target.closest("[data-add-to-cart]");
        const qtyButton = event.target.closest("[data-qty]");
        const wishButton = event.target.closest("[data-wishlist]");
        const detailsTrigger = event.target.closest("[data-details]");

        if (qtyButton) {
            if (qtyButton.disabled) return;
            changeQuantity(byId(qtyButton.dataset.id), qtyButton.dataset.qty === "inc" ? 1 : -1, qtyButton);
            return;
        }

        if (addButton) {
            if (addButton.disabled) return;
            addToCart(byId(addButton.dataset.addToCart), addButton, addButton.closest(".shop-product-card") || modalDialog);
            return;
        }

        if (wishButton) {
            toggleWishlist(wishButton.dataset.wishlist);
            return;
        }

        if (detailsTrigger && root === grid) {
            openDetails(detailsTrigger.dataset.details);
        }
    }

    grid.addEventListener("click", handleActions);

    grid.addEventListener("keydown", function (event) {
        const trigger = event.target.closest("[data-details][role='button']");

        if (trigger && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openDetails(trigger.dataset.details);
        }
    });

    modalDialog.addEventListener("click", function (event) {
        const tab = event.target.closest("[data-tab]");

        if (tab) {
            switchTab(tab);
            return;
        }

        if (event.target.closest("[data-close-details]")) {
            closeDetails();
            return;
        }

        handleActions({ currentTarget: modalDialog, target: event.target });
    });

    modal.querySelector(".pd-backdrop").addEventListener("click", closeDetails);

    activeFilters.addEventListener("click", function (event) {
        const button = event.target.closest("[data-remove-category]");

        if (!button) return;

        const checkbox = document.querySelector('input[name="categoryFilter"][value="' + button.dataset.removeCategory + '"]');

        if (checkbox) checkbox.checked = false;

        renderProducts();
    });

    function resetFilters() {
        document.querySelectorAll('input[name="categoryFilter"]').forEach(function (checkbox) {
            checkbox.checked = false;
        });

        priceRange.value = priceRange.max;
        stockFilter.checked = false;
        searchInput.value = "";
        sortSelect.value = "featured";

        updatePriceDisplay();
        renderProducts();
    }

    function openSidebar() {
        sidebar.classList.add("is-open");
        overlay.classList.add("is-active");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("is-open");
        overlay.classList.remove("is-active");
        if (modal.hidden) document.body.style.overflow = "";
    }

    openFilter.addEventListener("click", openSidebar);
    closeFilter.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        if (!modal.hidden) {
            closeDetails();
        } else {
            closeSidebar();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) closeSidebar();
    });

    resetButton.addEventListener("click", resetFilters);
    emptyReset.addEventListener("click", resetFilters);

    priceRange.addEventListener("input", function () {
        updatePriceDisplay();
        renderProducts(false);
    });

    stockFilter.addEventListener("change", function () { renderProducts(); });
    sortSelect.addEventListener("change", function () { renderProducts(); });
    searchInput.addEventListener("input", function () { renderProducts(false); });

    document.querySelectorAll('input[name="categoryFilter"]').forEach(function (checkbox) {
        checkbox.addEventListener("change", function () { renderProducts(); });
    });

    window.addEventListener("stackly:cart-updated", refreshCards);

    window.addEventListener("storage", function (event) {
        if (event.key === wishlistKey) renderProducts(false);
    });

    /* Scroll animations (laptop page: only the shop heading + trust bar) */
    if (hasGsap && !reduceMotion && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".shop-heading > *, .shop-trust > div", {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: ".shop-heading", start: "top 85%" }
        });
    }

    updatePriceDisplay();
    renderProducts();
});