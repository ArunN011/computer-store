document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const DATA_VERSION = "2026-11-09-v3";
    const VERSION_KEY = "stacklyDataVersion";
    const needsDataSync = localStorage.getItem(VERSION_KEY) !== DATA_VERSION;

    const userEmail = localStorage.getItem("userEmail") || "customer@example.com";
    const userName = localStorage.getItem("stacklyUsername") || userEmail.split("@")[0];

    const cartKey = "stacklyCart_" + userEmail.toLowerCase();
    const wishlistKey = "stacklyWishlist_" + userEmail.toLowerCase();
    const profileKey = "stacklyUserProfile_" + userEmail.toLowerCase();
    const demoOrdersKey = "stacklyDemoOrders_" + userEmail.toLowerCase();

    const STORAGE = {
        products: "stacklyAdminProducts",
        orders: "stacklyAdminOrders",
        customers: "stacklyAdminCustomers"
    };

    let products = [];
    let orders = [];
    let customers = [];
    let cart = [];
    let wishlist = [];
    let currentOrderFilter = "all";
    let userProductModal = null;
    let checkoutModal = null;
    let userOrderModal = null;
    let demoOrders = [];

    const celebratedOrders = new Set();

    const defaultProducts = [
        {
            id: "P1001",
            name: "ASUS VivoBook 15",
            sku: "ST-LAP-001",
            category: "Laptops",
            price: 52999,
            stock: 14,
            image: "Assets/lap1.webp",
            status: "Active",
            description: "Powerful laptop designed for productivity, everyday work and entertainment.",
            featured: true
        },
        {
            id: "P1003",
            name: "Dell Inspiron 14",
            sku: "ST-LAP-002",
            category: "Laptops",
            price: 64999,
            stock: 8,
            image: "Assets/lap11.webp",
            status: "Active",
            description: "Reliable laptop with a premium design and excellent everyday performance.",
            featured: true
        },
        {
            id: "P1002",
            name: "HP Pavilion Gaming",
            sku: "ST-LAP-003",
            category: "Laptops",
            price: 84999,
            stock: 4,
            image: "Assets/lap19.webp",
            status: "Active",
            description: "Gaming-focused computing power for work, entertainment and demanding applications.",
            featured: true
        },
        {
            id: "P1004",
            name: "Samsung Monitor 27",
            sku: "ST-MON-001",
            category: "Monitors",
            price: 18499,
            stock: 3,
            image: "Assets/lap22.webp",
            status: "Active",
            description: "Premium monitor with a modern display for productive work and immersive viewing.",
            featured: true
        },
        {
            id: "P1005",
            name: "Mechanical RGB Keyboard",
            sku: "ST-ACC-001",
            category: "Accessories",
            price: 5999,
            stock: 18,
            image: "Assets/lap28.webp",
            status: "Active",
            description: "Mechanical keyboard with comfortable keys and RGB lighting.",
            featured: true
        },
        {
            id: "P1006",
            name: "Logitech Wireless Mouse",
            sku: "ST-ACC-002",
            category: "Accessories",
            price: 1999,
            stock: 2,
            image: "Assets/lap20.webp",
            status: "Active",
            description: "Wireless mouse with accurate tracking and an ergonomic design.",
            featured: false
        },
        {
            id: "P1007",
            name: "Premium Gaming Headset",
            sku: "ST-ACC-003",
            category: "Accessories",
            price: 4499,
            stock: 12,
            image: "Assets/lap26.webp",
            status: "Active",
            description: "Comfortable gaming headset with immersive audio.",
            featured: true
        }
    ];

    function readStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return fallback;
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage save error:", error);
            showToast("Unable to save data. Browser storage may be full.");
            return false;
        }
    }

    function sameProduct(a, b) {
        return String(a.id) === String(b.id) ||
            Boolean(a.sku && b.sku && String(a.sku).toLowerCase() === String(b.sku).toLowerCase());
    }

    function buildProducts() {
        const stored = readStorage(STORAGE.products, []);

        const merged = defaultProducts.map(defaultProduct => {
            const saved = stored.find(item => sameProduct(item, defaultProduct));

            if (!saved || needsDataSync) {
                return { ...defaultProduct };
            }

            return {
                ...defaultProduct,
                ...saved,
                id: defaultProduct.id,
                sku: defaultProduct.sku,
                image: saved.image || defaultProduct.image,
                stock: Number.isFinite(Number(saved.stock)) ? Number(saved.stock) : defaultProduct.stock
            };
        });

        stored.forEach(item => {
            if (!merged.some(product => sameProduct(product, item))) {
                merged.push(item);
            }
        });

        return merged;
    }

    products = buildProducts();
    localStorage.setItem(STORAGE.products, JSON.stringify(products));

    orders = readStorage(STORAGE.orders, []);
    customers = readStorage(STORAGE.customers, []);
    cart = readStorage(cartKey, []);
    wishlist = readStorage(wishlistKey, []);

    function getDemoDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getDefaultProduct(id) {
        return defaultProducts.find(product => product.id === id);
    }

    function createDemoOrder(id, status, daysAgo, productId, payment) {
        const product = getDefaultProduct(productId);

        return {
            id: id,
            customer: userName,
            email: userEmail,
            date: getDemoDate(daysAgo),
            amount: product.price,
            subtotal: product.price,
            tax: 0,
            payment: payment,
            paymentMethod: "UPI",
            status: status,
            trackingNumber: "STK-" + id,
            courier: "Blue Dart",
            shippingSpeed: "Standard Delivery",
            shippingAddress: {
                name: userName,
                address: "24, Anna Nagar",
                city: "Chennai",
                state: "Tamil Nadu",
                postalCode: "600040",
                phone: "9876543210"
            },
            phone: "9876543210",
            city: "Chennai",
            state: "Tamil Nadu",
            items: [
                {
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    sku: product.sku,
                    quantity: 1,
                    price: product.price,
                    image: product.image
                }
            ],
            statusHistory: []
        };
    }

    demoOrders = needsDataSync ? [] : readStorage(demoOrdersKey, []);

    if (!demoOrders.length) {
        demoOrders = [
            createDemoOrder("DEMO-1001", "Shipped", 1, "P1001", "Paid"),
            createDemoOrder("DEMO-1002", "Out for Delivery", 2, "P1003", "Paid"),
            createDemoOrder("DEMO-1003", "Delivered", 2, "P1002", "Paid"),
            createDemoOrder("DEMO-1004", "Cancelled", 3, "P1004", "Refunded")
        ];

        saveStorage(demoOrdersKey, demoOrders);
    }

    if (needsDataSync) {
        localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }

    function saveCart() {
        return saveStorage(cartKey, cart);
    }

    function saveWishlist() {
        return saveStorage(wishlistKey, wishlist);
    }

    function saveOrders() {
        return saveStorage(STORAGE.orders, orders);
    }

    function saveProducts() {
        return saveStorage(STORAGE.products, products);
    }

    function saveCustomers() {
        return saveStorage(STORAGE.customers, customers);
    }

    function setText(id, value) {
        const element = $(id);
        if (element) {
            element.textContent = value;
        }
    }

    function money(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character]));
    }

    function formatDate(value) {
        if (!value) return "-";

        const date = new Date(value + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function formatDateTime(value) {
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function initials(name) {
        return String(name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0].toUpperCase())
            .join("");
    }

    function findProduct(id) {
        return products.find(product => String(product.id) === String(id));
    }

    function getProductImage(product) {
        return product.image || "Assets/lap19.webp";
    }

    function getItemImage(item) {
        const productId = item.productId || item.id;
        const product = productId ? findProduct(productId) : null;

        if (product && product.image) return product.image;

        return item.image || "Assets/lap12.webp";
    }

    function statusClass(status) {
        const classes = {
            Processing: "Processing",
            Shipped: "Shipped",
            "Out for Delivery": "Out",
            Delivered: "Delivered",
            Cancelled: "Cancelled",
            Paid: "Paid",
            Pending: "Pending",
            Refunded: "Cancelled"
        };

        return classes[status] || "Processing";
    }

    function showToast(message) {
        setText("userToastMessage", message);

        const toastElement = $("userToast");

        if (toastElement && typeof bootstrap !== "undefined") {
            bootstrap.Toast.getOrCreateInstance(toastElement, {
                delay: 2800
            }).show();
        } else {
            console.log(message);
        }
    }

    async function confirmAction(title, text) {
        if (typeof Swal !== "undefined") {
            const result = await Swal.fire({
                title,
                text,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#9872b5",
                cancelButtonColor: "#8d858d",
                confirmButtonText: "Yes, continue",
                background: "#fffefa",
                color: "#29252a"
            });

            return result.isConfirmed;
        }

        return window.confirm(text);
    }

    let profile = readStorage(profileKey, {
        name: userName,
        email: userEmail,
        phone: "",
        city: "",
        state: "",
        postalCode: "",
        address: ""
    });

    if (Array.isArray(profile)) {
        profile = {
            name: userName,
            email: userEmail,
            phone: "",
            city: "",
            state: "",
            postalCode: "",
            address: ""
        };
    }

    function loadUserInformation() {
        const initial = initials(profile.name || userName) || "U";

        setText("userSidebarName", profile.name || userName);
        setText("userSidebarEmail", userEmail);
        setText("userTopName", profile.name || userName);
        setText("userTopEmail", userEmail);
        setText("userWelcomeName", profile.name || userName);
        setText("userSidebarAvatar", initial);
        setText("userTopAvatar", initial);

        setText("userCurrentDate", new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }));

        setText("profileAvatar", initial);
        setText("profileDisplayName", profile.name || userName);
        setText("profileDisplayEmail", userEmail);

        if ($("profileName")) {
            $("profileName").value = profile.name || "";
            $("profileEmail").value = userEmail;
            $("profilePhone").value = profile.phone || "";
            $("profileCity").value = profile.city || "";
            $("profileState").value = profile.state || "";
            $("profilePostalCode").value = profile.postalCode || "";
            $("profileAddress").value = profile.address || "";
        }
    }

    if (typeof bootstrap !== "undefined") {
        if ($("userProductModal")) {
            userProductModal = bootstrap.Modal.getOrCreateInstance($("userProductModal"));
        }

        if ($("userCheckoutModal")) {
            checkoutModal = bootstrap.Modal.getOrCreateInstance($("userCheckoutModal"));
        }

        if ($("userOrderModal")) {
            userOrderModal = bootstrap.Modal.getOrCreateInstance($("userOrderModal"));
        }
    }

    const sidebar = $("userSidebar");
    const overlay = $("userSidebarOverlay");
    const hamburger = $("userHamburger");
    const closeButton = $("userSidebarClose");

    let previousScrollPosition = 0;

    function openSidebar() {
        if (!sidebar || !overlay) return;

        previousScrollPosition = window.scrollY;

        sidebar.classList.add("mobile-open");
        overlay.classList.add("show");

        document.body.style.position = "fixed";
        document.body.style.top = `-${previousScrollPosition}px`;
        document.body.style.width = "100%";

        document.body.classList.add("user-sidebar-locked");

        hamburger?.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("show");

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        document.body.classList.remove("user-sidebar-locked");

        window.scrollTo({
            top: previousScrollPosition,
            behavior: "auto"
        });

        hamburger?.setAttribute("aria-expanded", "false");
    }

    hamburger?.addEventListener("click", function () {
        if (sidebar?.classList.contains("mobile-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeButton?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && sidebar?.classList.contains("mobile-open")) {
            closeSidebar();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth >= 992 && sidebar?.classList.contains("mobile-open")) {
            closeSidebar();
        }
    });

    const views = document.querySelectorAll(".user-view");

    function openUserView(viewName) {
        const selected = $(
            viewName === "dashboard"
                ? "userDashboardView"
                : "user" + viewName.charAt(0).toUpperCase() + viewName.slice(1) + "View"
        );

        if (!selected) return;

        views.forEach(view => {
            view.classList.remove("active");
        });

        selected.classList.add("active");

        document.querySelectorAll(".user-nav-link[data-user-view]").forEach(link => {
            link.classList.toggle("active", link.dataset.userView === viewName);
        });

        if (window.innerWidth < 992 && sidebar?.classList.contains("mobile-open")) {
            closeSidebar();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (viewName === "shop") renderProducts();
        if (viewName === "cart") renderCart();
        if (viewName === "orders") renderOrders();
        if (viewName === "wishlist") renderWishlist();
        if (viewName === "dashboard") renderDashboard();
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-user-view]");

        if (!button) return;

        event.preventDefault();

        const view = button.dataset.userView;

        if (view) {
            openUserView(view);
        }
    });

    function getAvailableProducts() {
        return products.filter(product => product.status !== "Inactive");
    }

    function productCard(product) {
        const image = getProductImage(product);
        const saved = wishlist.includes(product.id);
        const stock = Number(product.stock) || 0;

        return `
            <article class="user-product-card">
                <div class="user-product-image">
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        onerror="console.warn('Image not found:', this.getAttribute('src'));this.onerror=null;this.src='Assets/lap17.webp';">

                    <span class="user-product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <button type="button"
                            class="user-wishlist-button ${saved ? "active" : ""}"
                            data-product-action="wishlist"
                            data-id="${escapeHTML(product.id)}"
                            aria-label="Toggle wishlist">
                        <i class="bi ${saved ? "bi-heart-fill" : "bi-heart"}"></i>
                    </button>
                </div>

                <div class="user-product-info">
                    <h4>${escapeHTML(product.name)}</h4>
                    <p>${escapeHTML(product.sku)}</p>

                    <div class="user-product-price">
                        <strong>${money(product.price)}</strong>
                        <span class="${stock <= 5 ? "user-stock-low" : "user-stock-available"}">
                            ${stock > 0 ? stock + " in stock" : "Out of Stock"}
                        </span>
                    </div>

                    <div class="user-product-buttons">
                        <button type="button"
                                class="user-add-cart ${stock <= 0 ? "user-out-of-stock-btn" : ""}"
                                data-product-action="add"
                                data-id="${escapeHTML(product.id)}">
                            <i class="bi ${stock <= 0 ? "bi-exclamation-circle" : "bi-bag-plus"}"></i>
                            ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>

                        <button type="button"
                                class="user-view-product"
                                data-product-action="view"
                                data-id="${escapeHTML(product.id)}">
                            <i class="bi bi-eye"></i>
                            View Details
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderProducts() {
        const grid = $("userProductsGrid");

        if (!grid) return;

        const search = ($("userProductSearch")?.value || "").trim().toLowerCase();
        const category = $("userCategoryFilter")?.value || "all";
        const sort = $("userSortFilter")?.value || "default";

        const filtered = getAvailableProducts().filter(product => {
            const text = [
                product.name,
                product.sku,
                product.category,
                product.description
            ].join(" ").toLowerCase();

            return text.includes(search) &&
                (category === "all" || product.category === category);
        });

        if (sort === "low") {
            filtered.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sort === "high") {
            filtered.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sort === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setText("userProductCount", filtered.length + " products");

        if (!filtered.length) {
            grid.innerHTML = `
                <div class="user-product-empty">
                    <i class="bi bi-search fs-2 d-block mb-3"></i>
                    No products found. Try another search.
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(productCard).join("");
    }

    $("userProductSearch")?.addEventListener("input", renderProducts);
    $("userCategoryFilter")?.addEventListener("change", renderProducts);
    $("userSortFilter")?.addEventListener("change", renderProducts);

    function getCartProducts() {
        return cart.map(item => {
            const product = findProduct(item.productId);

            if (!product) return null;

            return {
                ...item,
                product
            };
        }).filter(Boolean);
    }

    function getCartTotalQuantity() {
        return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    }

    function getCartSubtotal() {
        return getCartProducts().reduce((sum, item) => {
            return sum + Number(item.product.price) * Number(item.quantity);
        }, 0);
    }

    function updateCartCounters() {
        const quantity = getCartTotalQuantity();

        setText("sidebarCartCount", quantity);
        setText("headerCartCount", quantity);
        setText("shopCartCount", quantity);
        setText("headerWishlistCount", wishlist.length);
        setText("userWishlistTotal", wishlist.length);
    }

    function addToCart(productId) {
        const product = findProduct(productId);

        if (!product) {
            showToast("Product not found.");
            return;
        }

        const existing = cart.find(item => String(item.productId) === String(productId));
        const currentQuantity = existing ? Number(existing.quantity) : 0;
        const availableStock = Number(product.stock) || 0;

        if (availableStock <= 0) {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    icon: "warning",
                    title: "Currently Out of Stock!",
                    html: `
                        <div style="text-align:center">
                            <p style="font-size:13px;color:#8d818f">
                                <strong>${escapeHTML(product.name)}</strong>
                                is currently unavailable.
                            </p>
                            <p style="font-size:11px;color:#9872b5">
                                Please check back later for availability.
                            </p>
                        </div>
                    `,
                    confirmButtonText: "Continue Shopping",
                    confirmButtonColor: "#9872b5",
                    background: "#fffefa",
                    color: "#29252a"
                });
            } else {
                showToast(product.name + " is currently out of stock.");
            }

            return;
        }

        if (currentQuantity >= availableStock) {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    icon: "info",
                    title: "Stock Limit Reached",
                    text: `Only ${availableStock} units of ${product.name} are available.`,
                    confirmButtonColor: "#9872b5",
                    confirmButtonText: "Got It",
                    background: "#fffefa",
                    color: "#29252a"
                });
            } else {
                showToast(`Only ${availableStock} units of ${product.name} are available.`);
            }

            return;
        }

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                productId: product.id,
                quantity: 1
            });
        }

        if (!saveCart()) return;

        updateCartCounters();
        renderCart();
        showToast(product.name + " added to your cart.");
    }

    function changeCartQuantity(productId, change) {
        const item = cart.find(cartItem => String(cartItem.productId) === String(productId));
        const product = findProduct(productId);

        if (!item || !product) return;

        const newQuantity = Number(item.quantity) + change;

        if (newQuantity < 1) return;

        if (newQuantity > Number(product.stock)) {
            showToast("Only " + product.stock + " units available.");
            return;
        }

        item.quantity = newQuantity;

        if (!saveCart()) return;

        renderCart();
        updateCartCounters();
    }

    async function removeCartItem(productId) {
        const confirmed = await confirmAction(
            "Remove Product?",
            "Are you sure you want to remove this product from your cart?"
        );

        if (!confirmed) return;

        cart = cart.filter(item => String(item.productId) !== String(productId));

        if (!saveCart()) return;

        renderCart();
        updateCartCounters();
        showToast("Product removed from your cart.");
    }

    function renderCart() {
        const container = $("userCartItems");

        if (!container) return;

        const lines = getCartProducts();

        setText("cartItemCount", getCartTotalQuantity() + " items");

        if (!lines.length) {
            container.innerHTML = `
                <div class="user-empty-state">
                    <i class="bi bi-bag"></i>
                    <h3>Your Cart is Empty</h3>
                    <p>
                        Explore our technology collection and find
                        something you love.
                    </p>
                    <button class="user-gold-button" data-user-view="shop">
                        Start Shopping
                    </button>
                </div>
            `;

            setText("cartSubtotal", money(0));
            setText("cartTax", money(0));
            setText("cartTotal", money(0));
            setText("cartShipping", "Free");

            return;
        }

        container.innerHTML = lines.map(item => `
            <div class="user-cart-item">
                <div class="user-cart-item-image">
                    <img
                        src="${escapeHTML(getProductImage(item.product))}"
                        alt="${escapeHTML(item.product.name)}"
                        onerror="console.warn('Image not found:', this.getAttribute('src'));this.onerror=null;this.src='Assets/lap16.webp';">
                </div>

                <div class="user-cart-item-details">
                    <h4>${escapeHTML(item.product.name)}</h4>
                    <p>${escapeHTML(item.product.sku)}</p>
                    <strong>${money(item.product.price)}</strong>
                </div>

                <div class="user-cart-controls">
                    <div class="user-quantity-control">
                        <button type="button"
                                data-cart-action="decrease"
                                data-id="${escapeHTML(item.productId)}"
                                aria-label="Decrease quantity">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button type="button"
                                data-cart-action="increase"
                                data-id="${escapeHTML(item.productId)}"
                                aria-label="Increase quantity">
                            +
                        </button>
                    </div>

                    <button type="button"
                            class="user-remove-item"
                            data-cart-action="remove"
                            data-id="${escapeHTML(item.productId)}"
                            aria-label="Remove product">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join("");

        const subtotal = getCartSubtotal();
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        setText("cartSubtotal", money(subtotal));
        setText("cartTax", money(tax));
        setText("cartShipping", "Free");
        setText("cartTotal", money(total));
    }

    $("userCartItems")?.addEventListener("click", function (event) {
        const button = event.target.closest("[data-cart-action]");

        if (!button) return;

        const action = button.dataset.cartAction;
        const id = button.dataset.id;

        if (action === "increase") {
            changeCartQuantity(id, 1);
        } else if (action === "decrease") {
            changeCartQuantity(id, -1);
        } else if (action === "remove") {
            removeCartItem(id);
        }
    });

    function toggleWishlist(productId) {
        const product = findProduct(productId);

        if (!product) return;

        const exists = wishlist.includes(productId);

        if (exists) {
            wishlist = wishlist.filter(id => String(id) !== String(productId));
            showToast("Removed from wishlist.");
        } else {
            wishlist.push(productId);
            showToast("Added to wishlist.");
        }

        if (!saveWishlist()) return;

        updateCartCounters();
        renderProducts();
        renderFeaturedProducts();
        renderWishlist();

        const modalButton = document.querySelector(
            '#userProductDetails [data-product-action="wishlist"][data-id="' + productId + '"]'
        );

        if (modalButton) {
            const nowSaved = wishlist.includes(productId);
            modalButton.innerHTML = `
                <i class="bi ${nowSaved ? "bi-heart-fill" : "bi-heart"}"></i>
                ${nowSaved ? "Saved" : "Add to Wishlist"}
            `;
        }
    }

    function renderWishlist() {
        const container = $("userWishlistProducts");

        if (!container) return;

        const savedProducts = wishlist
            .map(id => findProduct(id))
            .filter(Boolean);

        if (!savedProducts.length) {
            container.innerHTML = `
                <div class="user-empty-state">
                    <i class="bi bi-heart"></i>
                    <h3>Your Wishlist is Empty</h3>
                    <p>
                        Save products you like and find them here whenever you return.
                    </p>
                    <button class="user-gold-button" data-user-view="shop">
                        Explore Products
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = savedProducts.map(productCard).join("");
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-product-action]");

        if (!button) return;

        event.preventDefault();

        const action = button.dataset.productAction;
        const id = button.dataset.id;

        if (action === "add") {
            addToCart(id);
        } else if (action === "wishlist") {
            toggleWishlist(id);
        } else if (action === "view") {
            showProductDetails(id);
        }
    });

    function showProductDetails(id) {
        const product = findProduct(id);

        if (!product) {
            showToast("Product details not found.");
            return;
        }

        const modalElement = $("userProductModal");
        const detailsContainer = $("userProductDetails");

        if (!modalElement || !detailsContainer) {
            showToast("Product details modal is missing from HTML.");
            return;
        }

        const image = getProductImage(product);
        const stock = Number(product.stock) || 0;
        const isWishlisted = wishlist.includes(product.id);

        detailsContainer.innerHTML = `
            <div class="row g-4 align-items-center">
                <div class="col-md-6">
                    <div style="background:#f5f1ec;border-radius:8px;padding:20px;height:280px;">
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(product.name)}"
                            style="width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;"
                            onerror="console.warn('Image not found:', this.getAttribute('src'));this.onerror=null;this.src='Assets/lap14.webp';">
                    </div>
                </div>

                <div class="col-md-6">
                    <span class="user-section-kicker">
                        ${escapeHTML(product.category)}
                    </span>

                    <h2 style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:#29252a;margin:8px 0;">
                        ${escapeHTML(product.name)}
                    </h2>

                    <p class="small text-secondary">
                        SKU: ${escapeHTML(product.sku)}
                    </p>

                    <h3 style="color:#785291;font-family:'Cormorant Garamond',serif;font-size:29px;">
                        ${money(product.price)}
                    </h3>

                    <p class="small text-secondary" style="line-height:1.8">
                        ${escapeHTML(product.description || "Premium computer store product.")}
                    </p>

                    <div class="mb-3">
                        <span class="${stock > 0 ? "user-stock-available" : "user-stock-low"}">
                            <i class="bi ${stock > 0 ? "bi-check-circle" : "bi-exclamation-circle"}"></i>
                            ${stock > 0 ? stock + " units available" : "Currently Out of Stock"}
                        </span>
                    </div>

                    <div class="d-flex gap-2 flex-wrap">
                        <button type="button"
                                class="user-gold-button ${stock <= 0 ? "user-out-of-stock-btn" : ""}"
                                data-product-action="add"
                                data-id="${escapeHTML(product.id)}">
                            <i class="bi ${stock <= 0 ? "bi-exclamation-circle" : "bi-bag-plus"}"></i>
                            ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>

                        <button type="button"
                                class="user-outline-button"
                                data-product-action="wishlist"
                                data-id="${escapeHTML(product.id)}">
                            <i class="bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}"></i>
                            ${isWishlisted ? "Saved" : "Add to Wishlist"}
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (typeof bootstrap === "undefined") {
            showToast("Bootstrap JavaScript is not loaded.");
            return;
        }

        userProductModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        userProductModal.show();
    }

    $("proceedCheckoutBtn")?.addEventListener("click", function () {
        if (!cart.length) {
            showToast("Your cart is empty.");
            return;
        }

        if (!checkoutModal) {
            showToast("Checkout modal is missing.");
            return;
        }

        $("checkoutName").value = profile.name || userName;
        $("checkoutEmail").value = userEmail;
        $("checkoutPhone").value = profile.phone || "";
        $("checkoutAddress").value = profile.address || "";
        $("checkoutCity").value = profile.city || "";
        $("checkoutState").value = profile.state || "";
        $("checkoutPostalCode").value = profile.postalCode || "";

        setText("checkoutFinalTotal", money(Math.round(getCartSubtotal() * 1.05)));

        checkoutModal.show();
    });

    function makeOrderId() {
        return "ORD" + Date.now().toString().slice(-8);
    }

    function makeTrackingId(orderId) {
        return "STK-" + orderId;
    }

    function updateAdminCustomer(customerData) {
        const index = customers.findIndex(customer =>
            customer.email?.toLowerCase() === userEmail.toLowerCase()
        );

        const record = {
            id: index >= 0 ? customers[index].id : "C" + Date.now(),
            name: customerData.name,
            email: userEmail,
            phone: customerData.phone,
            city: customerData.city,
            state: customerData.state,
            postalCode: customerData.postalCode,
            address: customerData.address,
            joined: index >= 0
                ? customers[index].joined
                : new Date().toISOString().slice(0, 10)
        };

        if (index >= 0) {
            customers[index] = record;
        } else {
            customers.unshift(record);
        }

        saveCustomers();
    }

    $("userCheckoutForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!cart.length) {
            showToast("Your cart is empty.");
            return;
        }

        const lines = getCartProducts();

        if (!lines.length || lines.length !== cart.length) {
            showToast("Some products are no longer available.");
            return;
        }

        for (const item of lines) {
            if (Number(item.quantity) > Number(item.product.stock)) {
                showToast(item.product.name + " has insufficient stock.");
                return;
            }
        }

        const delivery = {
            name: $("checkoutName").value.trim(),
            email: userEmail,
            phone: $("checkoutPhone").value.trim(),
            address: $("checkoutAddress").value.trim(),
            city: $("checkoutCity").value.trim(),
            state: $("checkoutState").value.trim(),
            postalCode: $("checkoutPostalCode").value.trim()
        };

        if (Object.values(delivery).some(value => !value)) {
            showToast("Please complete all delivery details.");
            return;
        }

        if (!/^[0-9+\-\s]{10,16}$/.test(delivery.phone)) {
            showToast("Enter a valid phone number.");
            return;
        }

        if (!/^[0-9A-Za-z\s-]{5,10}$/.test(delivery.postalCode)) {
            showToast("Enter a valid postal code.");
            return;
        }

        const paymentInput = document.querySelector('input[name="paymentMethod"]:checked');

        if (!paymentInput) {
            showToast("Please select a payment method.");
            return;
        }

        const paymentMethod = paymentInput.value;
        const subtotal = getCartSubtotal();
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;
        const orderId = makeOrderId();
        const orderDate = new Date().toISOString().slice(0, 10);

        const orderItems = lines.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            category: item.product.category,
            quantity: Number(item.quantity),
            price: Number(item.product.price),
            image: item.product.image,
            icon: "bi-laptop"
        }));

        const order = {
            id: orderId,
            customer: delivery.name,
            email: userEmail,
            date: orderDate,
            amount: total,
            subtotal: subtotal,
            tax: tax,
            payment: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
            paymentMethod: paymentMethod,
            status: "Processing",
            trackingNumber: makeTrackingId(orderId),
            courier: "Stackly Logistics",
            shippingSpeed: total >= 50000 ? "Express Delivery" : "Standard Delivery",
            shippingAddress: delivery,
            phone: delivery.phone,
            city: delivery.city,
            state: delivery.state,
            items: orderItems,
            statusHistory: [
                {
                    status: "Order Placed",
                    location: "Stackly Computer Store",
                    timestamp: new Date().toISOString(),
                    note: "Customer successfully submitted the order."
                },
                {
                    status: "Order Confirmed",
                    location: "Stackly Order Management",
                    timestamp: new Date().toISOString(),
                    note: "Order received and waiting for fulfilment."
                }
            ]
        };

        orders.unshift(order);

        if (!saveOrders()) {
            orders.shift();
            return;
        }

        const previousCart = [...cart];

        cart = [];

        if (!saveCart()) {
            cart = previousCart;
            orders.shift();
            saveOrders();
            return;
        }

        orderItems.forEach(item => {
            const product = findProduct(item.productId);

            if (product) {
                product.stock = Math.max(0, Number(product.stock) - item.quantity);
            }
        });

        if (!saveProducts()) {
            showToast("Order saved, but stock update could not be saved.");
        }

        profile = {
            ...profile,
            ...delivery
        };

        saveStorage(profileKey, profile);
        updateAdminCustomer(delivery);

        checkoutModal.hide();
        this.reset();

        updateCartCounters();
        renderCart();
        renderOrders();
        renderDashboard();
        renderProducts();
        renderWishlist();
        loadUserInformation();

        showSuccessCelebration(order);
    });

    function showSuccessCelebration(order) {
        if (typeof Swal !== "undefined") {
            Swal.fire({
                title: "Order Placed Successfully!",
                html: `
                    <div style="text-align:center">
                        <div style="font-size:46px;color:#9872b5;margin-bottom:12px">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>

                        <h4 style="font-family:'Cormorant Garamond',serif;color:#785291">
                            Thank you for shopping with Stackly!
                        </h4>

                        <p style="font-size:12px;color:#8d818f">
                            Your order <strong>#${escapeHTML(order.id)}</strong>
                            has been placed.
                        </p>

                        <div style="padding:13px;background:#f5f0f7;border-radius:6px;font-size:11px">
                            Tracking ID:
                            <strong>${escapeHTML(order.trackingNumber)}</strong>
                        </div>
                    </div>
                `,
                confirmButtonText: "View My Order",
                confirmButtonColor: "#9872b5",
                background: "#fffefa",
                color: "#29252a",
                allowOutsideClick: false
            }).then(() => {
                openUserView("orders");
                showOrderDetails(order.id);
            });
        }

        if (typeof confetti === "function") {
            confetti({
                particleCount: 110,
                spread: 90,
                origin: {
                    y: 0.6
                },
                colors: ["#9872b5", "#c4a05b", "#6d9c91", "#ffffff"]
            });
        }
    }

    function getMyOrders() {
        const actualOrders = orders.filter(order =>
            (order.email || "").toLowerCase() === userEmail.toLowerCase()
        );

        const sampleOrders = demoOrders.filter(order =>
            (order.email || "").toLowerCase() === userEmail.toLowerCase()
        );

        return [...actualOrders, ...sampleOrders].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }

    function renderOrders() {
        const container = $("userOrdersList");

        if (!container) return;

        const myOrders = getMyOrders();

        const filtered = currentOrderFilter === "all"
            ? myOrders
            : myOrders.filter(order => order.status === currentOrderFilter);

        if (!filtered.length) {
            container.innerHTML = `
                <div class="user-empty-state">
                    <i class="bi bi-box-seam"></i>
                    <h3>No Orders Found</h3>
                    <p>
                        Your purchases will appear here after
                        you place your first order.
                    </p>
                    <button class="user-gold-button" data-user-view="shop">
                        Start Shopping
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(order => {
            const items = Array.isArray(order.items) ? order.items : [];

            const productsHTML = items.slice(0, 3).map(item => `
                <div class="user-order-product">
                    <img
                        src="${escapeHTML(getItemImage(item))}"
                        alt="${escapeHTML(item.name)}"
                        onerror="console.warn('Image not found:', this.getAttribute('src'));this.onerror=null;this.src='Assets/lap13.webp';">

                    <div>
                        <strong>${escapeHTML(item.name)}</strong>
                        <span>Quantity: ${Number(item.quantity || 1)}</span>
                    </div>
                </div>
            `).join("");

            return `
                <article class="user-order-card">
                    <div class="user-order-card-header">
                        <div>
                            <strong>#${escapeHTML(order.id)}</strong>
                            <span>Ordered on ${formatDate(order.date)}</span>
                        </div>

                        <span class="user-status ${statusClass(order.status)}">
                            ${escapeHTML(order.status)}
                        </span>
                    </div>

                    <div class="user-order-card-body">
                        <div class="user-order-products">
                            ${productsHTML || `
                                <div class="user-order-product">
                                    <div>
                                        <strong>Product information unavailable</strong>
                                    </div>
                                </div>
                            `}

                            ${items.length > 3
                                ? `<span class="small text-secondary">+${items.length - 3} more products</span>`
                                : ""}
                        </div>

                        <div class="user-order-card-actions">
                            <strong>${money(order.amount)}</strong>

                            <button type="button"
                                    data-order-action="details"
                                    data-id="${escapeHTML(order.id)}">
                                <i class="bi bi-eye"></i>
                                View Details
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    }

    document.addEventListener("click", function (event) {
        const filterButton = event.target.closest("[data-order-filter]");

        if (!filterButton) return;

        currentOrderFilter = filterButton.dataset.orderFilter;

        document.querySelectorAll("[data-order-filter]").forEach(item => {
            item.classList.remove("active");
        });

        filterButton.classList.add("active");

        renderOrders();
    });

    function buildUserTimeline(order) {
        const status = order.status;

        const events = [
            { title: "Order Placed", location: "Stackly Computer Store", day: 0, hour: 9 },
            { title: "Order Confirmed", location: "Stackly Order Management", day: 0, hour: 10 },
            { title: "Packed & Quality Checked", location: "Supplier Warehouse", day: 0, hour: 15 },
            { title: "Shipped", location: "Dispatch Centre", day: 1, hour: 9 },
            { title: "Out for Delivery", location: "Local Delivery Centre", day: 2, hour: 9 },
            { title: "Delivered Successfully", location: "Customer Delivery Address", day: 2, hour: 14 }
        ];

        const currentIndex = {
            Processing: 2,
            Shipped: 3,
            "Out for Delivery": 4,
            Delivered: 5,
            Cancelled: 1
        }[status] ?? 0;

        if (status === "Cancelled") {
            return [
                ...events.slice(0, 2),
                {
                    title: "Order Cancelled",
                    location: "Stackly Order Management",
                    day: 0,
                    hour: 11
                }
            ].map((event, index) => ({
                ...event,
                state: index < 2 ? "completed" : "current"
            }));
        }

        return events.map((event, index) => ({
            ...event,
            state: index < currentIndex
                ? "completed"
                : index === currentIndex
                    ? "current"
                    : "upcoming"
        }));
    }

    function showOrderDetails(orderId) {
        const order = getMyOrders().find(item => item.id === orderId);

        if (!order) {
            showToast("Order details not found.");
            return;
        }

        if (!$("userOrderDetails") || !userOrderModal) {
            showToast("Order details modal is missing.");
            return;
        }

        const address = order.shippingAddress || {};
        const timeline = buildUserTimeline(order);

        const timelineHTML = timeline.map(event => {
            const date = new Date(order.date + "T09:00:00");

            date.setDate(date.getDate() + event.day);
            date.setHours(event.hour);

            return `
                <div class="user-timeline-step ${event.state}">
                    <span class="user-timeline-dot"></span>
                    <h5>${escapeHTML(event.title)}</h5>
                    <p>
                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(event.location)}
                    </p>
                    <time>${formatDateTime(date)}</time>
                </div>
            `;
        }).join("");

        const productsHTML = (order.items || []).map(item => `
            <div class="user-detail-product">
                <img
                    src="${escapeHTML(getItemImage(item))}"
                    alt="${escapeHTML(item.name)}"
                    onerror="console.warn('Image not found:', this.getAttribute('src'));this.onerror=null;this.src='Assets/lap11.webp';">

                <div class="user-detail-product-info">
                    <strong>${escapeHTML(item.name)}</strong>
                    <span>
                        SKU: ${escapeHTML(item.sku || "-")}
                        | Qty: ${Number(item.quantity || 1)}
                    </span>
                </div>

                <strong>${money(Number(item.price) * Number(item.quantity || 1))}</strong>
            </div>
        `).join("");

        $("userOrderDetails").innerHTML = `
            <div class="user-order-detail-header">
                <div>
                    <span class="user-section-kicker">ORDER REFERENCE</span>
                    <h3>#${escapeHTML(order.id)}</h3>
                    <p class="small text-secondary">
                        Tracking ID: ${escapeHTML(order.trackingNumber || "Not assigned")}
                    </p>
                </div>

                <span class="user-status ${statusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>
            </div>

            <div class="row g-2 mb-4">
                <div class="col-md-4">
                    <div class="user-detail-box">
                        <span>ORDER DATE</span>
                        <strong>${formatDate(order.date)}</strong>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="user-detail-box">
                        <span>PAYMENT METHOD</span>
                        <strong>${escapeHTML(order.paymentMethod || "Not available")}</strong>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="user-detail-box">
                        <span>PAYMENT STATUS</span>
                        <strong>${escapeHTML(order.payment)}</strong>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="user-detail-box">
                        <span>DELIVERY PARTNER</span>
                        <strong>${escapeHTML(order.courier || "Stackly Logistics")}</strong>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="user-detail-box">
                        <span>SHIPPING SPEED</span>
                        <strong>${escapeHTML(order.shippingSpeed || "Standard Delivery")}</strong>
                    </div>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-lg-7">
                    <div class="user-panel mb-3">
                        <span class="user-section-kicker">DELIVERY JOURNEY</span>
                        <h3 class="user-panel-heading">Shipment Tracking</h3>
                        <div class="user-order-timeline">
                            ${timelineHTML}
                        </div>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="user-panel mb-3">
                        <span class="user-section-kicker">DELIVERY ADDRESS</span>
                        <h3 class="user-panel-heading">Shipping Details</h3>

                        <p class="small mb-2">
                            <strong>${escapeHTML(address.name || order.customer)}</strong>
                        </p>

                        <p class="small text-secondary mb-2">
                            ${escapeHTML(address.address || "Address not available")}
                        </p>

                        <p class="small text-secondary">
                            ${escapeHTML(address.city || order.city || "")},
                            ${escapeHTML(address.state || order.state || "")}
                            - ${escapeHTML(address.postalCode || "")}
                        </p>

                        <p class="small text-secondary mb-0">
                            <i class="bi bi-telephone"></i>
                            ${escapeHTML(address.phone || order.phone || "")}
                        </p>
                    </div>

                    <div class="user-panel">
                        <span class="user-section-kicker">PAYMENT SUMMARY</span>
                        <h3 class="user-panel-heading">Order Total</h3>

                        <div class="d-flex justify-content-between mb-3 small">
                            <span>Subtotal</span>
                            <strong>${money(order.subtotal ?? order.amount)}</strong>
                        </div>

                        <div class="d-flex justify-content-between mb-3 small">
                            <span>Estimated Tax</span>
                            <strong>${money(order.tax || 0)}</strong>
                        </div>

                        <div class="d-flex justify-content-between small border-top pt-3">
                            <strong>Total</strong>
                            <strong style="color:#785291;font-size:17px">
                                ${money(order.amount)}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user-panel mt-3">
                <span class="user-section-kicker">PRODUCT INFORMATION</span>
                <h3 class="user-panel-heading">Items in this Order</h3>
                ${productsHTML}
            </div>

            <p class="user-demo-note mt-3">
                Shipment information shown here is frontend demo information.
                Actual courier movement requires a logistics API.
            </p>
        `;

        userOrderModal.show();

        if (order.status === "Delivered") {
            celebrateDeliveredOrder(order.id);
        }
    }

    function celebrateDeliveredOrder(orderId) {
        if (celebratedOrders.has(orderId)) return;

        celebratedOrders.add(orderId);

        if (typeof confetti !== "function") return;

        const colors = ["#9872b5", "#c4a05b", "#6d9c91", "#ffffff"];

        confetti({
            particleCount: 120,
            spread: 100,
            origin: {
                y: 0.6
            },
            colors
        });

        setTimeout(() => {
            confetti({
                particleCount: 45,
                angle: 60,
                spread: 70,
                origin: {
                    x: 0,
                    y: 0.7
                },
                colors
            });

            confetti({
                particleCount: 45,
                angle: 120,
                spread: 70,
                origin: {
                    x: 1,
                    y: 0.7
                },
                colors
            });
        }, 350);
    }

    $("userOrdersList")?.addEventListener("click", function (event) {
        const button = event.target.closest('[data-order-action="details"]');

        if (!button) return;

        showOrderDetails(button.dataset.id);
    });

    function renderRecentOrders() {
        const container = $("userRecentOrders");

        if (!container) return;

        const recent = getMyOrders().slice(0, 4);

        if (!recent.length) {
            container.innerHTML = `
                <div class="user-empty-state">
                    <i class="bi bi-bag"></i>
                    <h3>No Recent Purchases</h3>
                    <p>
                        Your recent orders will appear here once you shop with Stackly.
                    </p>
                    <button class="user-gold-button" data-user-view="shop">
                        Explore Products
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = recent.map(order => {
            const firstItem = order.items?.[0];
            const product = firstItem?.name || "Computer Store Purchase";

            return `
                <div class="user-recent-order">
                    <div class="user-order-icon">
                        <i class="bi bi-box-seam"></i>
                    </div>

                    <div class="user-recent-order-details">
                        <strong>#${escapeHTML(order.id)}</strong>
                        <span>${escapeHTML(product)}</span>
                        <span>${formatDate(order.date)}</span>
                    </div>

                    <div class="user-recent-order-right">
                        <strong>${money(order.amount)}</strong>
                        <span class="user-status ${statusClass(order.status)}">
                            ${escapeHTML(order.status)}
                        </span>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderFeaturedProducts() {
        const container = $("userFeaturedProducts");

        if (!container) return;

        const featured = getAvailableProducts()
            .filter(product => product.featured !== false)
            .slice(0, 3);

        container.innerHTML = featured.length
            ? featured.map(productCard).join("")
            : `<div class="user-product-empty">No featured products available.</div>`;
    }

    function renderDashboard() {
        const myOrders = getMyOrders();

        const successfulOrders = myOrders.filter(order =>
            order.payment === "Paid" && order.status !== "Cancelled"
        );

        const totalSpending = successfulOrders.reduce(
            (total, order) => total + Number(order.amount || 0),
            0
        );

        const activeShipments = myOrders.filter(order =>
            ["Processing", "Shipped", "Out for Delivery"].includes(order.status)
        ).length;

        setText("userTotalOrders", myOrders.length);
        setText("userTotalSpending", money(totalSpending));
        setText("userActiveShipments", activeShipments);
        setText("userWishlistTotal", wishlist.length);

        renderRecentOrders();
        renderFeaturedProducts();
        updateCartCounters();
    }

    $("userProfileForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        profile = {
            name: $("profileName").value.trim(),
            email: userEmail,
            phone: $("profilePhone").value.trim(),
            city: $("profileCity").value.trim(),
            state: $("profileState").value.trim(),
            postalCode: $("profilePostalCode").value.trim(),
            address: $("profileAddress").value.trim()
        };

        if (!profile.name || !profile.phone || !profile.city) {
            showToast("Please complete the required profile information.");
            return;
        }

        if (!saveStorage(profileKey, profile)) return;

        localStorage.setItem("stacklyUsername", profile.name);

        const customerIndex = customers.findIndex(customer =>
            customer.email?.toLowerCase() === userEmail.toLowerCase()
        );

        if (customerIndex >= 0) {
            customers[customerIndex] = {
                ...customers[customerIndex],
                ...profile
            };
        } else {
            customers.unshift({
                id: "C" + Date.now(),
                ...profile,
                joined: new Date().toISOString().slice(0, 10)
            });
        }

        saveCustomers();
        loadUserInformation();
        showToast("Profile updated successfully.");
    });

    $("userNotificationBtn")?.addEventListener("click", function () {
        const activeOrders = getMyOrders().filter(order =>
            ["Processing", "Shipped", "Out for Delivery"].includes(order.status)
        );

        if (typeof Swal !== "undefined") {
            Swal.fire({
                title: "Your Notifications",
                html: `
                    <div style="text-align:left;font-size:12px;line-height:2.1">
                        <p>
                            <strong>${activeOrders.length}</strong>
                            active shipments.
                        </p>
                        <p>
                            <strong>${wishlist.length}</strong>
                            products saved in your wishlist.
                        </p>
                        <p>
                            <strong>${getCartTotalQuantity()}</strong>
                            items in your shopping cart.
                        </p>
                    </div>
                `,
                confirmButtonColor: "#9872b5",
                background: "#fffefa",
                color: "#29252a"
            });
        } else {
            showToast(
                activeOrders.length + " active shipments, " +
                wishlist.length + " wishlist products and " +
                getCartTotalQuantity() + " cart items."
            );
        }
    });

    async function logout() {
        const confirmed = await confirmAction(
            "Logout?",
            "Are you sure you want to logout from your account?"
        );

        if (!confirmed) return;

        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("stacklyUsername");

        window.location.href = "login.html";
    }

    $("userLogoutBtn")?.addEventListener("click", logout);
    $("userTopLogoutBtn")?.addEventListener("click", logout);

    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE.products) {
            products = buildProducts();
            renderProducts();
            renderCart();
            renderDashboard();
            renderWishlist();
        }

        if (event.key === STORAGE.orders) {
            orders = readStorage(STORAGE.orders, []);
            renderOrders();
            renderDashboard();
        }

        if (event.key === STORAGE.customers) {
            customers = readStorage(STORAGE.customers, []);
        }

        if (event.key === cartKey) {
            cart = readStorage(cartKey, []);
            renderCart();
            updateCartCounters();
        }

        if (event.key === wishlistKey) {
            wishlist = readStorage(wishlistKey, []);
            renderWishlist();
            renderProducts();
            updateCartCounters();
        }
    });

    function initializeAnimations() {
        if (typeof gsap === "undefined") return;

        gsap.fromTo(
            ".user-hero-content",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(
            ".user-hero-art img",
            { opacity: 0, y: 20, rotation: -8 },
            { opacity: 1, y: 0, rotation: 0, duration: 1, delay: 0.2, ease: "power3.out" }
        );

        gsap.fromTo(
            ".user-stat-card",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.65, delay: 0.2, ease: "power2.out" }
        );
    }

    if ($("userProductSearch")) $("userProductSearch").value = "";
    if ($("userCategoryFilter")) $("userCategoryFilter").value = "all";
    if ($("userSortFilter")) $("userSortFilter").value = "default";

    loadUserInformation();
    renderDashboard();
    renderProducts();
    renderCart();
    renderOrders();
    renderWishlist();
    updateCartCounters();
    initializeAnimations();

    console.log("Stackly User Dashboard initialized.");
    console.log("Products:", products.length);
    console.log("User Orders:", getMyOrders().length);
    console.log("Cart Items:", getCartTotalQuantity());
});