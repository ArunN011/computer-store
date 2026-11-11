document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const $ = id => document.getElementById(id);

    const STORAGE = {
        products: "stacklyAdminProducts",
        orders: "stacklyAdminOrders",
        customers: "stacklyAdminCustomers"
    };

    const userEmail = localStorage.getItem("userEmail") || "admin@stackly.com";
    const userRole = localStorage.getItem("userRole") || "Administrator";
    const accountName = localStorage.getItem("stacklyUsername") || userEmail.split("@")[0];

    let products = [];
    let orders = [];
    let customers = [];

    let revenueChart = null;
    let orderChart = null;
    let chartResizeTimer = null;
    let savedScrollPosition = 0;

    let productModal = null;
    let orderModal = null;
    let customerModal = null;
    let orderDetailsModal = null;
    let customerDetailsModal = null;


    /* DEFAULT PRODUCTS */

    const defaultProducts = [
        { id: "P1001", name: "ASUS VivoBook 15", sku: "ST-LAP-001", category: "Laptops", price: 52999, stock: 14, image: "", status: "Active" },
        { id: "P1002", name: "Dell Inspiron 14", sku: "ST-LAP-002", category: "Laptops", price: 64999, stock: 8, image: "", status: "Active" },
        { id: "P1003", name: "HP Pavilion Gaming", sku: "ST-LAP-003", category: "Laptops", price: 84999, stock: 4, image: "", status: "Active" },
        { id: "P1004", name: "Samsung Monitor 27", sku: "ST-MON-001", category: "Monitors", price: 18499, stock: 3, image: "", status: "Active" },
        { id: "P1005", name: "Mechanical RGB Keyboard", sku: "ST-ACC-001", category: "Accessories", price: 5999, stock: 18, image: "", status: "Active" },
        { id: "P1006", name: "Logitech Wireless Mouse", sku: "ST-ACC-002", category: "Accessories", price: 1999, stock: 2, image: "", status: "Active" },
        { id: "P1007", name: "Gaming Desktop RTX", sku: "ST-DES-001", category: "Desktops", price: 124999, stock: 9, image: "", status: "Active" }
    ];


    /* DEFAULT ORDERS */

    const defaultOrders = [
        {
            id: "ORD39848",
            customer: "Haris Ortiz",
            email: "haris@example.com",
            date: "2026-11-02",
            amount: 52999,
            payment: "Paid",
            paymentMethod: "UPI",
            status: "Delivered",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD39848",
            items: [
                {
                    name: "ASUS VivoBook 15",
                    sku: "ST-LAP-001",
                    quantity: 1,
                    price: 52999,
                    icon: "bi-laptop"
                }
            ]
        },
        {
            id: "ORD30283",
            customer: "Alistair Dunlap",
            email: "alistair@example.com",
            date: "2026-11-02",
            amount: 18499,
            payment: "Paid",
            paymentMethod: "Credit Card",
            status: "Processing",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD30283",
            items: [
                {
                    name: "Samsung Monitor 27",
                    sku: "ST-MON-001",
                    quantity: 1,
                    price: 18499,
                    icon: "bi-display"
                }
            ]
        },
        {
            id: "ORD31856",
            customer: "Kacie Velasquez",
            email: "kacie@example.com",
            date: "2026-11-01",
            amount: 4299,
            payment: "Pending",
            paymentMethod: "Cash on Delivery",
            status: "Shipped",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD31856",
            items: [
                {
                    name: "Wireless Gaming Mouse Bundle",
                    sku: "ST-ACC-003",
                    quantity: 1,
                    price: 4299,
                    icon: "bi-mouse"
                }
            ]
        },
        {
            id: "ORD39855",
            customer: "Mateo Petty",
            email: "mateo@example.com",
            date: "2026-10-31",
            amount: 129500,
            payment: "Paid",
            paymentMethod: "Net Banking",
            status: "Delivered",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD39855",
            items: [
                {
                    name: "Gaming Desktop RTX",
                    sku: "ST-DES-001",
                    quantity: 1,
                    price: 124999,
                    icon: "bi-pc-display"
                },
                {
                    name: "Installation and Setup",
                    sku: "ST-SRV-001",
                    quantity: 1,
                    price: 4501,
                    icon: "bi-tools"
                }
            ]
        },
        {
            id: "ORD40995",
            customer: "Scarlet Everett",
            email: "scarlet@example.com",
            date: "2026-10-30",
            amount: 68220,
            payment: "Paid",
            paymentMethod: "UPI",
            status: "Cancelled",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD40995",
            items: [
                {
                    name: "Dell Inspiron Accessories Package",
                    sku: "ST-ACC-009",
                    quantity: 1,
                    price: 68220,
                    icon: "bi-pc-display"
                }
            ]
        },
        {
            id: "ORD59030",
            customer: "Aysha Hayes",
            email: "aysha@example.com",
            date: "2026-10-29",
            amount: 54766,
            payment: "Paid",
            paymentMethod: "Credit Card",
            status: "Delivered",
            courier: "Stackly Logistics",
            trackingNumber: "STK-ORD59030",
            items: [
                {
                    name: "Premium Gaming Setup Bundle",
                    sku: "ST-GAME-001",
                    quantity: 1,
                    price: 54766,
                    icon: "bi-controller"
                }
            ]
        }
    ];


    /* DEFAULT CUSTOMERS */

    const defaultCustomers = [
        {
            id: "C1001",
            name: "Haris Ortiz",
            email: "haris@example.com",
            phone: "+91 9876543210",
            city: "Chennai",
            state: "Tamil Nadu",
            postalCode: "600001",
            address: "Address not added",
            joined: "2026-09-10"
        },
        {
            id: "C1002",
            name: "Alistair Dunlap",
            email: "alistair@example.com",
            phone: "+91 9876543211",
            city: "Bangalore",
            state: "Karnataka",
            postalCode: "560001",
            address: "Address not added",
            joined: "2026-09-15"
        },
        {
            id: "C1003",
            name: "Kacie Velasquez",
            email: "kacie@example.com",
            phone: "+91 9876543212",
            city: "Coimbatore",
            state: "Tamil Nadu",
            postalCode: "641001",
            address: "Address not added",
            joined: "2026-09-20"
        },
        {
            id: "C1004",
            name: "Mateo Petty",
            email: "mateo@example.com",
            phone: "+91 9876543213",
            city: "Salem",
            state: "Tamil Nadu",
            postalCode: "636001",
            address: "Address not added",
            joined: "2026-09-22"
        }
    ];


    /* LOCAL STORAGE */

    function cloneRows(rows) {
        return rows.map(row => ({ ...row }));
    }

    function readStorage(key, fallback) {

        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return cloneRows(fallback);
            }

            const parsed = JSON.parse(raw);

            return Array.isArray(parsed)
                ? parsed
                : cloneRows(fallback);

        } catch (error) {

            console.error("Unable to read LocalStorage:", error);

            return cloneRows(fallback);
        }
    }

    function saveStorage(key, value) {

        try {

            localStorage.setItem(key, JSON.stringify(value));

            return true;

        } catch (error) {

            console.error("Unable to save LocalStorage:", error);

            showToast("Unable to save data. Browser storage may be full.");

            return false;
        }
    }

    products = readStorage(STORAGE.products, defaultProducts);
    orders = readStorage(STORAGE.orders, defaultOrders);
    customers = readStorage(STORAGE.customers, defaultCustomers);

    if (!localStorage.getItem(STORAGE.products)) {
        saveStorage(STORAGE.products, products);
    }

    if (!localStorage.getItem(STORAGE.orders)) {
        saveStorage(STORAGE.orders, orders);
    }

    if (!localStorage.getItem(STORAGE.customers)) {
        saveStorage(STORAGE.customers, customers);
    }

    function persistProducts() {
        return saveStorage(STORAGE.products, products);
    }

    function persistOrders() {
        return saveStorage(STORAGE.orders, orders);
    }

    function persistCustomers() {
        return saveStorage(STORAGE.customers, customers);
    }
    const productImageInput = $("productImage");
const productImageFile = $("productImageFile");
const productImagePreview = $("productImagePreview");
const productImagePreviewWrap = $("productImagePreviewWrap");


function updateProductImagePreview(source) {

    if (!source) {

        productImagePreviewWrap.hidden = true;

        productImagePreview.removeAttribute("src");

        return;

    }

    productImagePreview.onerror = function () {

        productImagePreviewWrap.hidden = true;

    };

    productImagePreview.onload = function () {

        productImagePreviewWrap.hidden = false;

    };

    productImagePreview.src = source;

}


async function optimizeProductImage(file) {

    if (!file || !file.type.startsWith("image/")) {

        throw new Error("Please select a valid image.");

    }

    if (file.size > 10 * 1024 * 1024) {

        throw new Error("Image size must be below 10 MB.");

    }

    const image = await new Promise((resolve, reject) => {

        const objectURL = URL.createObjectURL(file);

        const img = new Image();

        img.onload = function () {

            URL.revokeObjectURL(objectURL);

            resolve(img);

        };

        img.onerror = function () {

            URL.revokeObjectURL(objectURL);

            reject(new Error("Unable to read the selected image."));

        };

        img.src = objectURL;

    });


    const maxDimension = 1000;

    const scale = Math.min(
        1,
        maxDimension / Math.max(image.width, image.height)
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(1, Math.round(image.width * scale));

    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");

    if (!context) {

        throw new Error("Image processing is unavailable.");

    }

    context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );


    let blob = await new Promise(resolve => {

        canvas.toBlob(resolve, "image/webp", 0.82);

    });


    if (!blob) {

        blob = await new Promise(resolve => {

            canvas.toBlob(resolve, "image/jpeg", 0.82);

        });

    }


    if (!blob) {

        throw new Error("Unable to compress the image.");

    }


    return await new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () => reject(
            new Error("Unable to save the image.")
        );

        reader.readAsDataURL(blob);

    });

}


productImageFile?.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast("Please select an image file.");

        this.value = "";

        return;

    }

    productImageInput.value = "";

    const previewURL = URL.createObjectURL(file);

    updateProductImagePreview(previewURL);

});


productImageInput?.addEventListener("input", function () {

    const file = productImageFile?.files[0];

    if (file) {
        productImageFile.value = "";
    }

    updateProductImagePreview(this.value.trim());

});


    /* COMMON FUNCTIONS */

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

    function formatDate(value) {

        if (!value) return "-";

        const date = new Date(value + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function formatDateTime(date) {

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
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

   function safeImageUrl(value) {

    if (!value) return "";

    const imageValue = String(value).trim();

    if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(imageValue)) {
        return imageValue;
    }

    try {

        const url = new URL(imageValue, window.location.href);

        if (["http:", "https:"].includes(url.protocol)) {
            return url.href;
        }

        return "";

    } catch (error) {

        return "";

    }

}

    function initials(name) {

        return String(name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join("");
    }

    function showToast(message) {

        setText("toastMessage", message);

        const toastElement = $("adminToast");

        if (toastElement && typeof bootstrap !== "undefined") {

            bootstrap.Toast.getOrCreateInstance(toastElement, {
                delay: 3000
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
                cancelButtonText: "Cancel",
                background: "#fffefa",
                color: "#29252a"
            });

            return result.isConfirmed;
        }

        return window.confirm(text);
    }

    function statusClass(status) {

        const classes = {
            Delivered: "status-delivered",
            Processing: "status-processing",
            Shipped: "status-shipped",
            Cancelled: "status-cancelled",
            Paid: "status-paid",
            Pending: "status-pending",
            Refunded: "status-refunded"
        };

        return classes[status] || "status-processing";
    }

    function getRevenue() {

        return orders
            .filter(order =>
                order.status !== "Cancelled" &&
                order.payment === "Paid"
            )
            .reduce((total, order) => {
                return total + Number(order.amount || 0);
            }, 0);
    }

    function getOrderCount(status) {

        return orders.filter(order => order.status === status).length;
    }

    function showModal(instance) {

        if (instance) {
            instance.show();
        } else {
            showToast("Required modal is missing from admin-dashboard.html.");
        }
    }


    /* MODAL INITIALIZATION */

    function initializeModals() {

        if (typeof bootstrap === "undefined") {
            console.error("Bootstrap bundle is not loaded.");
            return;
        }

        if ($("productModal")) {
            productModal = new bootstrap.Modal($("productModal"));
        }

        if ($("orderModal")) {
            orderModal = new bootstrap.Modal($("orderModal"));
        }

        if ($("customerModal")) {
            customerModal = new bootstrap.Modal($("customerModal"));
        }

        if ($("orderDetailsModal")) {
            orderDetailsModal = new bootstrap.Modal($("orderDetailsModal"));
        }

        if ($("customerDetailsModal")) {
            customerDetailsModal = new bootstrap.Modal($("customerDetailsModal"));
        }
        if (typeof bootstrap !== "undefined") {

    if (document.getElementById("orderDetailsModal")) {
        orderDetailsModal = new bootstrap.Modal(
            document.getElementById("orderDetailsModal")
        );
    }

    if (document.getElementById("customerDetailsModal")) {
        customerDetailsModal = new bootstrap.Modal(
            document.getElementById("customerDetailsModal")
        );
    }

}
    }


    /* ACCOUNT INFORMATION */

    function loadAccountInformation() {

        const initial = (userEmail.charAt(0) || "A").toUpperCase();

        setText("sidebarName", accountName);
        setText("sidebarEmail", userEmail);

        setText("topAdminName", accountName);
        setText("topAdminEmail", userEmail);

        setText("welcomeEmail", userEmail);

        setText("sidebarAvatar", initial);
        setText("topAvatar", initial);

        setText("adminRole", userRole);

        setText(
            "currentDate",
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        );
    }


    /* MOBILE SIDEBAR */

    const sidebar = $("adminSidebar");
    const overlay = $("sidebarOverlay");
    const hamburger = $("hamburgerBtn");
    const closeSidebarButton = $("sidebarClose");

    // let savedScrollPosition = 0;

    function openSidebar() {

        if (!sidebar || !overlay) return;

        savedScrollPosition = window.scrollY;

        sidebar.classList.add("mobile-open");
        overlay.classList.add("show");

        document.body.classList.add("sidebar-locked");

        document.body.style.position = "fixed";
        document.body.style.top = `-${savedScrollPosition}px`;
        document.body.style.width = "100%";

        hamburger?.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {

        if (!sidebar || !overlay) return;

        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("show");

        document.body.classList.remove("sidebar-locked");

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        window.scrollTo({
            top: savedScrollPosition,
            behavior: "auto"
        });

        hamburger?.setAttribute("aria-expanded", "false");
    }

    hamburger?.addEventListener("click", function () {

        if (sidebar.classList.contains("mobile-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeSidebarButton?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            sidebar?.classList.contains("mobile-open")
        ) {
            closeSidebar();
        }
    });

    window.addEventListener("resize", function () {

        if (
            window.innerWidth >= 992 &&
            sidebar?.classList.contains("mobile-open")
        ) {
            closeSidebar();
        }

        resizeCharts();
    });


    /* PAGE NAVIGATION */

    const views = document.querySelectorAll(".content-view");

    const navItems = document.querySelectorAll(".nav-item[data-view]");

    function openView(viewName) {

        const selectedView = $(viewName + "View");

        if (!selectedView) return;

        views.forEach(view => {
            view.classList.remove("active");
        });

        navItems.forEach(item => {
            item.classList.remove("active");
        });

        selectedView.classList.add("active");

        document.querySelector(
            `.nav-item[data-view="${viewName}"]`
        )?.classList.add("active");

        if (window.innerWidth < 992) {
            closeSidebar();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (viewName === "dashboard") {

            requestAnimationFrame(resizeCharts);

        } else if (viewName === "products") {

            renderProducts(
                $("productSearch")?.value || "",
                $("productCategoryFilter")?.value || "all"
            );

        } else if (viewName === "orders") {

            renderOrders(
                $("orderSearch")?.value || "",
                $("orderStatusFilter")?.value || "all"
            );

        } else if (viewName === "customers") {

            renderCustomers(
                $("customerSearch")?.value || ""
            );

        }

        if (typeof AOS !== "undefined") {
            AOS.refresh();
        }
    }

    navItems.forEach(item => {

        item.addEventListener("click", function () {
            openView(this.dataset.view);
        });

    });

    document.querySelectorAll("[data-view-target]").forEach(button => {

        button.addEventListener("click", function () {
            openView(this.dataset.viewTarget);
        });

    });



    const productForm = $("productForm");

    function renderProducts(search = "", category = "all") {

        const tbody = $("productsTableBody");

        if (!tbody) return;

        const filtered = products.filter(product => {

            const text = [
                product.name,
                product.sku,
                product.category
            ].join(" ").toLowerCase();

            return text.includes(search.toLowerCase()) &&
                (category === "all" || product.category === category);
        });

        setText("productCountLabel", filtered.length + " products");

        if (!filtered.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = filtered.map(product => {

            const stock = Number(product.stock) || 0;

            const stockClass = stock <= 5
                ? "status-cancelled"
                : stock <= 10
                    ? "status-processing"
                    : "status-delivered";

             const imageUrl = safeImageUrl(product.image);

            const imageHtml = imageUrl
                ? `<img
            src="${escapeHTML(imageUrl)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.onerror=null;this.parentElement.innerHTML='<i class=&quot;bi bi-laptop&quot;></i>';">`
            : `<i class="bi bi-laptop"></i>`;

            return `
                <tr>

                    <td>
                        <div class="product-name-cell">

                            <div class="product-image-cell">
                                ${imageHtml}
                            </div>

                            <div>
                                <strong>${escapeHTML(product.name)}</strong>
                                <span>${escapeHTML(product.id)}</span>
                            </div>

                        </div>
                    </td>

                    <td>${escapeHTML(product.sku)}</td>

                    <td>${escapeHTML(product.category)}</td>

                    <td class="amount-cell">
                        ${money(product.price)}
                    </td>

                    <td>
                        <span class="status-badge ${stockClass}">
                            ${stock} units
                        </span>
                    </td>

                    <td>
                        <span class="status-badge status-delivered">
                            ${escapeHTML(product.status || "Active")}
                        </span>
                    </td>

                    <td>
                        <div class="action-buttons">

                            <button class="table-action-btn"
                                    data-action="edit-product"
                                    data-id="${escapeHTML(product.id)}"
                                    aria-label="Edit product">
                                <i class="bi bi-pencil"></i>
                            </button>

                            <button class="table-action-btn delete"
                                    data-action="delete-product"
                                    data-id="${escapeHTML(product.id)}"
                                    aria-label="Delete product">
                                <i class="bi bi-trash"></i>
                            </button>

                        </div>
                    </td>

                </tr>
            `;
        }).join("");
    }

    $("addProductBtn")?.addEventListener("click", function () {

    productForm.reset();

    $("productId").value = "";

    productImageFile.value = "";

    updateProductImagePreview("");

    setText("productModalTitle", "Add New Product");

    showModal(productModal);

});

    $("productSearch")?.addEventListener("input", function () {

        renderProducts(
            this.value,
            $("productCategoryFilter")?.value || "all"
        );

    });

    $("productCategoryFilter")?.addEventListener("change", function () {

        renderProducts(
            $("productSearch")?.value || "",
            this.value
        );

    });

  productForm?.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = $("productId").value;

    const existingProduct = products.find(item => item.id === id);

    const uploadedFile = productImageFile?.files[0];

    let imageValue = existingProduct?.image || "";


    const projectImagePath = productImageInput.value.trim();


    if (uploadedFile) {

        try {

            imageValue = await optimizeProductImage(uploadedFile);

        } catch (error) {

            showToast(error.message);

            return;

        }

    } else if (projectImagePath) {

        imageValue = projectImagePath;

    }


    const product = {

        id: id || "P" + Date.now(),

        name: $("productName").value.trim(),

        sku: $("productSku").value.trim(),

        category: $("productCategory").value,

        price: Number($("productPrice").value),

        stock: Number($("productStock").value),

        image: imageValue,

        status: existingProduct?.status || "Active"

    };


    if (!product.name || !product.sku || !product.category) {

        showToast("Please complete all required product fields.");

        return;

    }


    if (!Number.isFinite(product.price) || product.price <= 0) {

        showToast("Enter a valid product price.");

        return;

    }


    if (!Number.isInteger(product.stock) || product.stock < 0) {

        showToast("Enter a valid stock quantity.");

        return;

    }


    const duplicateSku = products.some(item =>

        item.sku.toLowerCase() === product.sku.toLowerCase() &&
        item.id !== id

    );


    if (duplicateSku) {

        showToast("This SKU already exists.");

        return;

    }


    if (id) {

        const index = products.findIndex(item => item.id === id);

        if (index >= 0) {

            products[index] = product;

        }

        showToast("Product updated successfully.");

    } else {

        products.unshift(product);

        showToast("Product added successfully.");

    }


    if (!persistProducts()) return;


    productModal?.hide();

    renderProducts();


    refreshDashboard();

});

    $("productsTableBody")?.addEventListener("click", async function (event) {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const product = products.find(item => item.id === button.dataset.id);

        if (!product) return;

        if (button.dataset.action === "edit-product") {

    $("productId").value = product.id;

    $("productName").value = product.name;

    $("productSku").value = product.sku;

    $("productCategory").value = product.category;

    $("productPrice").value = product.price;

    $("productStock").value = product.stock;


    productImageFile.value = "";


    const existingImage = product.image || "";

    const isUploadedImage = existingImage.startsWith("data:image/");


    productImageInput.value = isUploadedImage
        ? ""
        : existingImage;


    updateProductImagePreview(existingImage);


    setText("productModalTitle", "Edit Product");

    showModal(productModal);

}

        if (button.dataset.action === "delete-product") {

            const confirmed = await confirmAction(
                "Delete Product?",
                "This product will be removed from your catalogue."
            );

            if (!confirmed) return;

            products = products.filter(item => item.id !== product.id);

            if (!persistProducts()) return;

            renderProducts();

            refreshDashboard();

            showToast("Product deleted successfully.");
        }
    });


    /* ORDER AND CUSTOMER HELPERS */

    function getCustomerForOrder(order) {

        return customers.find(customer =>

            (customer.email || "").toLowerCase() ===
            (order.email || "").toLowerCase() ||

            (customer.name || "").toLowerCase() ===
            (order.customer || "").toLowerCase()

        ) || null;
    }

    function getOrderItems(order) {

        if (Array.isArray(order.items) && order.items.length) {
            return order.items;
        }

        const itemMap = {

            ORD39848: [
                {
                    name: "ASUS VivoBook 15",
                    sku: "ST-LAP-001",
                    quantity: 1,
                    price: 52999,
                    icon: "bi-laptop"
                }
            ],

            ORD30283: [
                {
                    name: "Samsung Monitor 27",
                    sku: "ST-MON-001",
                    quantity: 1,
                    price: 18499,
                    icon: "bi-display"
                }
            ],

            ORD31856: [
                {
                    name: "Wireless Gaming Mouse Bundle",
                    sku: "ST-ACC-003",
                    quantity: 1,
                    price: 4299,
                    icon: "bi-mouse"
                }
            ],

            ORD39855: [
                {
                    name: "Gaming Desktop RTX",
                    sku: "ST-DES-001",
                    quantity: 1,
                    price: 124999,
                    icon: "bi-pc-display"
                },
                {
                    name: "Installation and Setup",
                    sku: "ST-SRV-001",
                    quantity: 1,
                    price: 4501,
                    icon: "bi-tools"
                }
            ],

            ORD40995: [
                {
                    name: "Dell Inspiron Accessories Package",
                    sku: "ST-ACC-009",
                    quantity: 1,
                    price: 68220,
                    icon: "bi-pc-display"
                }
            ],

            ORD59030: [
                {
                    name: "Premium Gaming Setup Bundle",
                    sku: "ST-GAME-001",
                    quantity: 1,
                    price: 54766,
                    icon: "bi-controller"
                }
            ]

        };

        return itemMap[order.id] || [
            {
                name: "Computer Store Purchase",
                sku: "CUSTOM-ITEM",
                quantity: 1,
                price: Number(order.amount) || 0,
                icon: "bi-laptop"
            }
        ];
    }

    function datePlusDays(dateString, days) {

        const base = new Date(
            `${dateString || new Date().toISOString().slice(0, 10)}T09:00:00`
        );

        base.setDate(base.getDate() + days);

        return base;
    }

    function trackingDate(dateString, dayOffset, hour) {

        const date = datePlusDays(dateString, dayOffset);

        date.setHours(hour || 10, 0, 0, 0);

        return formatDateTime(date);
    }


    /* ORDER TRACKING DATA */

    function getTrackingData(order) {

        const customer = getCustomerForOrder(order);

        const city = customer?.city || order.city || "Customer location not provided";

        const state = customer?.state || order.state || "";

        const status = order.status || "Processing";

        const currentLocationByStatus = {

            Processing: "Stackly Fulfilment Centre, Salem",

            Shipped: `Regional Sorting Hub, ${city}`,

            Delivered: `Delivered to customer, ${city}`,

            Cancelled: "Shipment stopped at fulfilment centre"

        };

        const nextLocationByStatus = {

            Processing: "Dispatch hub, Salem",

            Shipped: `Local delivery facility, ${city}`,

            Delivered: "Delivery completed",

            Cancelled: "No further movement"

        };

        const progressIndex = {

            Processing: 1,

            Shipped: 3,

            Delivered: 5,

            Cancelled: 1

        };

        const steps = [

            {
                title: "Order Placed",
                location: "Stackly Computer Store",
                description: "The order was received by the store.",
                day: 0,
                hour: 9
            },

            {
                title: "Order Confirmed & Packed",
                location: "Salem Fulfilment Centre",
                description: "The order was checked and packed for dispatch.",
                day: 0,
                hour: 11
            },

            {
                title: "Dispatched from Warehouse",
                location: "Salem Dispatch Hub",
                description: "The parcel was handed over to the delivery partner.",
                day: 1,
                hour: 8
            },

            {
                title: "Arrived at Regional Hub",
                location: `Regional Sorting Hub, ${city}`,
                description: "The parcel was scanned at a regional sorting facility.",
                day: 2,
                hour: 10
            },

            {
                title: "Out for Delivery",
                location: `Local Delivery Facility, ${city}`,
                description: "The parcel was assigned for final delivery.",
                day: 3,
                hour: 8
            },

            {
                title: "Delivered Successfully",
                location: `Customer delivery address, ${city}`,
                description: "The parcel was marked as delivered.",
                day: 4,
                hour: 13
            }

        ];

        const estimatedDelivery = status === "Delivered"
            ? datePlusDays(order.date, 4)
            : status === "Cancelled"
                ? null
                : datePlusDays(order.date, status === "Processing" ? 4 : 2);

        return {

            customer,
            city,
            state,
            status,

            currentIndex: progressIndex[status] ?? 0,

            currentLocation: currentLocationByStatus[status] ||
                "Location update unavailable",

            nextLocation: nextLocationByStatus[status] ||
                "Awaiting next scan",

            estimatedDelivery,

            steps,

            courier: order.courier || "Stackly Logistics (Demo)",

            trackingNumber: order.trackingNumber || `STK-${order.id}`,

            shippingSpeed: order.shippingSpeed ||
                (Number(order.amount) >= 50000
                    ? "Express Delivery"
                    : "Standard Delivery")

        };
    }


    /* ORDER TIMELINE */

    function renderOrderTrackingTimeline(order, tracking) {

        if (order.status === "Cancelled") {

            return `

                <div class="tracking-step completed">

                    <span class="tracking-dot"></span>

                    <h5>Order Placed</h5>

                    <p>Stackly Computer Store</p>

                    <time>${trackingDate(order.date, 0, 9)}</time>

                </div>

                <div class="tracking-step completed">

                    <span class="tracking-dot"></span>

                    <h5>Order Confirmed</h5>

                    <p>Order details were verified.</p>

                    <time>${trackingDate(order.date, 0, 11)}</time>

                </div>

                <div class="tracking-step current">

                    <span class="tracking-dot"></span>

                    <h5>Order Cancelled</h5>

                    <p>No further shipment movement is expected.</p>

                    <time>${formatDate(order.date)}</time>

                </div>

            `;
        }

        return tracking.steps.map((step, index) => {

            const completed =
                order.status === "Delivered" ||
                index < tracking.currentIndex;

            const current =
                order.status !== "Delivered" &&
                index === tracking.currentIndex;

            const visible =
                order.status === "Delivered" ||
                index <= tracking.currentIndex;

            if (!visible) return "";

            return `

                <div class="tracking-step ${completed ? "completed" : ""} ${current ? "current" : ""}">

                    <span class="tracking-dot"></span>

                    <h5>${escapeHTML(step.title)}</h5>

                    <p>
                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(step.location)}
                    </p>

                    <p>${escapeHTML(step.description)}</p>

                    <time>
                        ${trackingDate(order.date, step.day, step.hour)}
                    </time>

                </div>

            `;

        }).join("");
    }


    /* ORDER DETAILS */

    function showOrderDetails(orderId) {

        const order = orders.find(item => item.id === orderId);

        if (!order) return;

        if (!$("orderDetailsContent")) {
            showToast("Add orderDetailsModal to admin-dashboard.html.");
            return;
        }

        const tracking = getTrackingData(order);

        const customer = tracking.customer;

        const items = getOrderItems(order);

        const estimatedDelivery = tracking.estimatedDelivery
            ? tracking.estimatedDelivery.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
            : "Not applicable";

        const itemMarkup = items.map(item => `

            <div class="detail-product">

                <div class="detail-product-icon">
                    <i class="bi ${escapeHTML(item.icon || "bi-laptop")}"></i>
                </div>

                <div class="detail-product-info">

                    <strong>${escapeHTML(item.name)}</strong>

                    <span>
                        SKU: ${escapeHTML(item.sku || "-")}
                        &nbsp; | &nbsp;
                        Qty: ${Number(item.quantity || 1)}
                    </span>

                </div>

                <span class="detail-product-price">
                    ${money(item.price)}
                </span>

            </div>

        `).join("");

        const cancelledMessage = order.status === "Cancelled"

            ? `
                <div class="alert alert-danger mt-3 small">
                    <i class="bi bi-exclamation-circle"></i>
                    This order was cancelled. Shipment movement has stopped.
                </div>
            `

            : "";

        $("orderDetailsContent").innerHTML = `

            <div class="detail-top">

                <div>

                    <span class="section-kicker">
                        ORDER REFERENCE
                    </span>

                    <h3>#${escapeHTML(order.id)}</h3>

                    <span class="detail-subtitle">
                        Placed on ${formatDate(order.date)}
                    </span>

                </div>

                <span class="status-badge ${statusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>

            </div>


            <div class="detail-info-grid">

                <div class="detail-info-box">
                    <span>EXPECTED DELIVERY</span>
                    <strong>${estimatedDelivery}</strong>
                </div>

                <div class="detail-info-box">
                    <span>DELIVERY PARTNER</span>
                    <strong>${escapeHTML(tracking.courier)}</strong>
                </div>

                <div class="detail-info-box">
                    <span>TRACKING NUMBER</span>
                    <strong>${escapeHTML(tracking.trackingNumber)}</strong>
                </div>

                <div class="detail-info-box">
                    <span>SHIPPING SPEED</span>
                    <strong>${escapeHTML(tracking.shippingSpeed)}</strong>
                </div>

                <div class="detail-info-box">
                    <span>CURRENT LOCATION</span>
                    <strong>${escapeHTML(tracking.currentLocation)}</strong>
                </div>

                <div class="detail-info-box">
                    <span>NEXT CHECKPOINT</span>
                    <strong>${escapeHTML(tracking.nextLocation)}</strong>
                </div>

            </div>


            <div class="tracking-banner">

                <span class="tracking-label">
                    SHIPMENT TRACKING
                </span>

                <h3>${escapeHTML(tracking.currentLocation)}</h3>

                <p>
                    ${order.status === "Delivered"
                        ? "This demo order is marked as delivered."
                        : "Current shipment checkpoint based on the selected demo order status."}
                </p>

                <span class="tracking-demo-note">
                    DEMO TRACKING · SAMPLE LOCATIONS · NOT LIVE GPS
                </span>

            </div>


            <div class="tracking-route">

                <div class="route-location">
                    <i class="bi bi-box-seam"></i>
                    Salem Warehouse
                </div>

                <i class="bi bi-arrow-right route-arrow"></i>

                <div class="route-location">
                    <i class="bi bi-building"></i>
                    Regional Sorting Hub
                </div>

                <i class="bi bi-arrow-right route-arrow"></i>

                <div class="route-location">
                    <i class="bi bi-geo-alt"></i>
                    ${escapeHTML(tracking.city)}
                </div>

            </div>


            <div class="row g-3">

                <div class="col-lg-7">

                    <div class="detail-section">

                        <h4>
                            <i class="bi bi-truck text-secondary"></i>
                            Shipment Journey
                        </h4>

                        <div class="tracking-timeline">
                            ${renderOrderTrackingTimeline(order, tracking)}
                        </div>

                        ${cancelledMessage}

                    </div>


                    <div class="detail-section">

                        <h4>
                            <i class="bi bi-box-seam text-secondary"></i>
                            Ordered Products
                        </h4>

                        ${itemMarkup}

                        <div class="detail-total">

                            <span>Order Total</span>

                            <strong>${money(order.amount)}</strong>

                        </div>

                    </div>

                </div>


                <div class="col-lg-5">

                    <div class="detail-section">

                        <h4>Customer Information</h4>

                        <h5>${escapeHTML(order.customer)}</h5>

                        <p class="small text-secondary mb-2">
                            ${escapeHTML(order.email)}
                        </p>

                        <p class="small text-secondary mb-0">
                            <i class="bi bi-geo-alt"></i>
                            ${escapeHTML(tracking.city)}
                            ${tracking.state ? ", " + escapeHTML(tracking.state) : ""}
                        </p>

                        <hr>

                        <span class="section-kicker">
                            CUSTOMER DETAILS
                        </span>

                        <p class="small mb-1">
                            Phone:
                            ${escapeHTML(customer?.phone || "Not provided")}
                        </p>

                        <p class="small mb-0">
                            City: ${escapeHTML(tracking.city)}
                        </p>

                    </div>


                    <div class="detail-section">

                        <h4>Payment Information</h4>

                        <div class="d-flex justify-content-between align-items-center mb-3">

                            <span class="small text-secondary">
                                Payment Status
                            </span>

                            <span class="status-badge ${statusClass(order.payment)}">
                                ${escapeHTML(order.payment)}
                            </span>

                        </div>


                        <div class="d-flex justify-content-between mb-3">

                            <span class="small text-secondary">
                                Payment Method
                            </span>

                            <strong class="small">
                                ${escapeHTML(order.paymentMethod || "Not recorded")}
                            </strong>

                        </div>


                        <div class="d-flex justify-content-between">

                            <span class="small text-secondary">
                                Total Paid
                            </span>

                            <strong>
                                ${money(order.payment === "Paid" ? order.amount : 0)}
                            </strong>

                        </div>

                    </div>


                    <div class="detail-section">

                        <h4>Delivery Information</h4>

                        <p class="small text-secondary mb-2">
                            <i class="bi bi-geo-alt"></i>
                            Delivery destination
                        </p>

                        <strong class="small">
                            ${escapeHTML(customer?.address || "Address not saved in demo data")}
                        </strong>

                        <p class="small text-secondary mt-2 mb-0">
                            ${escapeHTML(tracking.city)}
                            ${tracking.state ? ", " + escapeHTML(tracking.state) : ""}
                            ${customer?.postalCode ? " - " + escapeHTML(customer.postalCode) : ""}
                        </p>

                    </div>

                </div>

            </div>

        `;

        showModal(orderDetailsModal);
    }


    /* ORDER MANAGEMENT */

    function renderOrders(search = "", status = "all") {

        const tbody = $("ordersTableBody");

        if (!tbody) return;

        const filtered = orders.filter(order => {

            const text = [
                order.id,
                order.customer,
                order.email
            ].join(" ").toLowerCase();

            return text.includes(search.toLowerCase()) &&
                (status === "all" || order.status === status);
        });

        setText("orderCountLabel", filtered.length + " orders");

        if (!filtered.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        No orders found.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = filtered.map(order => `

            <tr>

                <td>
                    <button class="order-id-link"
                            data-action="view-order"
                            data-id="${escapeHTML(order.id)}">
                        #${escapeHTML(order.id)}
                    </button>
                </td>

                <td>${escapeHTML(order.customer)}</td>

                <td>${escapeHTML(order.email)}</td>

                <td>${formatDate(order.date)}</td>

                <td class="amount-cell">
                    ${money(order.amount)}
                </td>

                <td>
                    <span class="status-badge ${statusClass(order.payment)}">
                        ${escapeHTML(order.payment)}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${statusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>
                </td>

                <td>

                    <div class="action-buttons">

                        <button class="table-action-btn"
                                data-action="view-order"
                                data-id="${escapeHTML(order.id)}"
                                aria-label="View order">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button class="table-action-btn"
                                data-action="edit-order"
                                data-id="${escapeHTML(order.id)}"
                                aria-label="Edit order">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="table-action-btn delete"
                                data-action="delete-order"
                                data-id="${escapeHTML(order.id)}"
                                aria-label="Delete order">
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");
    }

    $("orderSearch")?.addEventListener("input", function () {

        renderOrders(
            this.value,
            $("orderStatusFilter")?.value || "all"
        );

    });

    $("orderStatusFilter")?.addEventListener("change", function () {

        renderOrders(
            $("orderSearch")?.value || "",
            this.value
        );

    });

    $("ordersTableBody")?.addEventListener("click", async function (event) {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const id = button.dataset.id;

        const order = orders.find(item => item.id === id);

        if (!order) return;

        if (button.dataset.action === "view-order") {

            showOrderDetails(id);

            return;
        }

        if (button.dataset.action === "edit-order") {

            $("editOrderId").value = order.id;
            $("editOrderNumber").value = order.id;
            $("editPaymentStatus").value = order.payment;
            $("editOrderStatus").value = order.status;

            showModal(orderModal);

            return;
        }

        if (button.dataset.action === "delete-order") {

            const confirmed = await confirmAction(
                "Delete Order?",
                "This order will be removed from local dashboard storage."
            );

            if (!confirmed) return;

            orders = orders.filter(item => item.id !== id);

            if (!persistOrders()) return;

            renderOrders(
                $("orderSearch")?.value || "",
                $("orderStatusFilter")?.value || "all"
            );

            refreshDashboard();

            showToast("Order deleted successfully.");
        }

    });


    /* ORDER UPDATE */

    $("orderForm")?.addEventListener("submit", function (event) {

        event.preventDefault();

        const id = $("editOrderId")?.value;

        const order = orders.find(item => item.id === id);

        if (!order) return;

        order.payment = $("editPaymentStatus").value;

        order.status = $("editOrderStatus").value;

        if (!persistOrders()) return;

        orderModal?.hide();

        renderOrders(
            $("orderSearch")?.value || "",
            $("orderStatusFilter")?.value || "all"
        );

        refreshDashboard();

        showToast("Order updated successfully.");

    });


    /* CUSTOMER DETAILS */

    function showCustomerDetails(customerId) {

        const customer = customers.find(item => item.id === customerId);

        if (!customer) return;

        if (!$("customerDetailsContent")) {
            showToast("Add customerDetailsModal to admin-dashboard.html.");
            return;
        }

        const customerOrders = orders.filter(order =>

            (order.email || "").toLowerCase() ===
            (customer.email || "").toLowerCase() ||

            (order.customer || "").toLowerCase() ===
            (customer.name || "").toLowerCase()

        ).sort((a, b) => new Date(b.date) - new Date(a.date));


        const successfulOrders = customerOrders.filter(order =>
            order.payment === "Paid" &&
            order.status !== "Cancelled"
        );

        const totalSpent = successfulOrders.reduce(
            (total, order) => total + Number(order.amount || 0),
            0
        );

        const averageOrder = successfulOrders.length
            ? totalSpent / successfulOrders.length
            : 0;

        const lastOrder = customerOrders.length
            ? formatDate(customerOrders[0].date)
            : "No purchases yet";


        const orderRows = customerOrders.length

            ? customerOrders.map(order => `

                <tr>

                    <td>
                        <button class="order-id-link"
                                data-action="view-order-from-customer"
                                data-id="${escapeHTML(order.id)}">
                            #${escapeHTML(order.id)}
                        </button>
                    </td>

                    <td>${formatDate(order.date)}</td>

                    <td>
                        ${getOrderItems(order)
                            .map(item => escapeHTML(item.name))
                            .join(", ")}
                    </td>

                    <td class="amount-cell">
                        ${money(order.amount)}
                    </td>

                    <td>
                        <span class="status-badge ${statusClass(order.status)}">
                            ${escapeHTML(order.status)}
                        </span>
                    </td>

                    <td>
                        <button class="table-action-btn"
                                data-action="view-order-from-customer"
                                data-id="${escapeHTML(order.id)}"
                                aria-label="View order">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>

                </tr>

            `).join("")

            : `
                <tr>
                    <td colspan="6" class="empty-state">
                        No purchase history available.
                    </td>
                </tr>
            `;


        $("customerDetailsContent").innerHTML = `

            <div class="customer-profile-header">

                <div class="customer-large-avatar">
                    ${escapeHTML(initials(customer.name))}
                </div>

                <div>

                    <span class="section-kicker">
                        CUSTOMER PROFILE
                    </span>

                    <h3>${escapeHTML(customer.name)}</h3>

                    <p>
                        Customer ID: ${escapeHTML(customer.id)}
                    </p>

                </div>

            </div>


            <div class="customer-metrics">

                <div class="customer-metric">
                    <span>Total Orders</span>
                    <strong>${customerOrders.length}</strong>
                </div>

                <div class="customer-metric">
                    <span>Total Purchases</span>
                    <strong>${money(totalSpent)}</strong>
                </div>

                <div class="customer-metric">
                    <span>Average Order</span>
                    <strong>${money(averageOrder)}</strong>
                </div>

                <div class="customer-metric">
                    <span>Last Purchase</span>
                    <strong style="font-size:15px">
                        ${lastOrder}
                    </strong>
                </div>

            </div>


            <div class="row g-3">

                <div class="col-lg-5">

                    <div class="detail-section">

                        <h4>Personal Information</h4>

                        <div class="customer-detail-list">

                            <div class="customer-detail-item">
                                <span>Full Name</span>
                                <strong>${escapeHTML(customer.name)}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>Customer ID</span>
                                <strong>${escapeHTML(customer.id)}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>Email Address</span>
                                <strong>${escapeHTML(customer.email)}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>Mobile Number</span>
                                <strong>${escapeHTML(customer.phone)}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>City</span>
                                <strong>${escapeHTML(customer.city)}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>Registration Date</span>
                                <strong>${formatDate(customer.joined)}</strong>
                            </div>

                        </div>

                    </div>


                    <div class="detail-section">

                        <h4>Delivery Address</h4>

                        <div class="customer-detail-item">
                            <span>Address</span>
                            <strong>
                                ${escapeHTML(customer.address || "Address not saved")}
                            </strong>
                        </div>

                        <div class="customer-detail-list mt-2">

                            <div class="customer-detail-item">
                                <span>City</span>
                                <strong>${escapeHTML(customer.city || "Not provided")}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>State</span>
                                <strong>${escapeHTML(customer.state || "Not provided")}</strong>
                            </div>

                            <div class="customer-detail-item">
                                <span>Postal Code</span>
                                <strong>${escapeHTML(customer.postalCode || "Not provided")}</strong>
                            </div>

                        </div>

                    </div>

                </div>


                <div class="col-lg-7">

                    <div class="detail-section">

                        <h4>Purchase History</h4>

                        <p class="small text-secondary">
                            Recorded orders and products purchased by this customer.
                        </p>

                        <div class="table-responsive">

                            <table class="table admin-table">

                                <thead>

                                    <tr>
                                        <th>ORDER ID</th>
                                        <th>DATE</th>
                                        <th>PRODUCT</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                        <th>VIEW</th>
                                    </tr>

                                </thead>

                                <tbody>
                                    ${orderRows}
                                </tbody>

                            </table>

                        </div>

                    </div>


                    <div class="detail-section">

                        <h4>Customer Summary</h4>

                        <div class="d-flex justify-content-between mb-3">
                            <span class="small text-secondary">Successful purchases</span>
                            <strong class="small">${successfulOrders.length}</strong>
                        </div>

                        <div class="d-flex justify-content-between mb-3">
                            <span class="small text-secondary">Processing orders</span>
                            <strong class="small">
                                ${customerOrders.filter(order => order.status === "Processing").length}
                            </strong>
                        </div>

                        <div class="d-flex justify-content-between mb-3">
                            <span class="small text-secondary">Shipped orders</span>
                            <strong class="small">
                                ${customerOrders.filter(order => order.status === "Shipped").length}
                            </strong>
                        </div>

                        <div class="d-flex justify-content-between">
                            <span class="small text-secondary">Cancelled orders</span>
                            <strong class="small">
                                ${customerOrders.filter(order => order.status === "Cancelled").length}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        `;

        showModal(customerDetailsModal);
    }


    /* CUSTOMER CRUD */

    const customerForm = $("customerForm");

    function renderCustomers(search = "") {

        const tbody = $("customersTableBody");

        if (!tbody) return;

        const filtered = customers.filter(customer => {

            const text = [
                customer.name,
                customer.email,
                customer.phone,
                customer.city
            ].join(" ").toLowerCase();

            return text.includes(search.toLowerCase());
        });

        setText("customerCountLabel", filtered.length + " customers");

        if (!filtered.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="bi bi-people fs-4 d-block mb-2"></i>
                        No customers found.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = filtered.map(customer => `

            <tr>

                <td>

                    <div class="customer-cell">

                        <span class="customer-avatar">
                            ${escapeHTML(initials(customer.name))}
                        </span>

                        <button class="customer-name-link"
                                data-action="view-customer"
                                data-id="${escapeHTML(customer.id)}">

                            ${escapeHTML(customer.name)}

                        </button>

                    </div>

                </td>

                <td>${escapeHTML(customer.email)}</td>

                <td>${escapeHTML(customer.phone)}</td>

                <td>${escapeHTML(customer.city)}</td>

                <td>${formatDate(customer.joined)}</td>

                <td>

                    <div class="action-buttons">

                        <button class="table-action-btn"
                                data-action="view-customer"
                                data-id="${escapeHTML(customer.id)}"
                                aria-label="View customer">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button class="table-action-btn"
                                data-action="edit-customer"
                                data-id="${escapeHTML(customer.id)}"
                                aria-label="Edit customer">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="table-action-btn delete"
                                data-action="delete-customer"
                                data-id="${escapeHTML(customer.id)}"
                                aria-label="Delete customer">
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");
    }


    $("addCustomerBtn")?.addEventListener("click", function () {

        customerForm?.reset();

        $("customerId").value = "";

        setText("customerModalTitle", "Add Customer");

        showModal(customerModal);
    });

    $("customerSearch")?.addEventListener("input", function () {

        renderCustomers(this.value);

    });

    customerForm?.addEventListener("submit", function (event) {

        event.preventDefault();

        const id = $("customerId").value;

        const existing = customers.find(item => item.id === id);

        const customer = {

            id: id || "C" + Date.now(),

            name: $("customerName").value.trim(),

            email: $("customerEmail").value.trim(),

            phone: $("customerPhone").value.trim(),

            city: $("customerCity").value.trim(),

            state: existing?.state || "",

            postalCode: existing?.postalCode || "",

            address: existing?.address || "Address not saved",

            joined: existing?.joined ||
                new Date().toISOString().slice(0, 10)

        };

        if (!customer.name || !customer.email ||
            !customer.phone || !customer.city) {

            showToast("Please complete all customer fields.");

            return;
        }

        const duplicate = customers.some(item =>
            item.email.toLowerCase() === customer.email.toLowerCase() &&
            item.id !== id
        );

        if (duplicate) {

            showToast("Customer email already exists.");

            return;
        }

        if (id) {

            const index = customers.findIndex(item => item.id === id);

            if (index >= 0) {
                customers[index] = customer;
            }

            showToast("Customer updated successfully.");

        } else {

            customers.unshift(customer);

            showToast("Customer added successfully.");

        }

        if (!persistCustomers()) return;

        customerModal?.hide();

        renderCustomers();

        refreshDashboard();
    });


    $("customersTableBody")?.addEventListener("click", async function (event) {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const customer = customers.find(item =>
            item.id === button.dataset.id
        );

        if (!customer) return;

        if (button.dataset.action === "view-customer") {

            showCustomerDetails(customer.id);

            return;
        }

        if (button.dataset.action === "edit-customer") {

            $("customerId").value = customer.id;
            $("customerName").value = customer.name;
            $("customerEmail").value = customer.email;
            $("customerPhone").value = customer.phone;
            $("customerCity").value = customer.city;

            setText("customerModalTitle", "Edit Customer");

            showModal(customerModal);

            return;
        }

        if (button.dataset.action === "delete-customer") {

            const confirmed = await confirmAction(
                "Delete Customer?",
                "This customer will be removed from the customer directory."
            );

            if (!confirmed) return;

            customers = customers.filter(item =>
                item.id !== customer.id
            );

            if (!persistCustomers()) return;

            renderCustomers();

            refreshDashboard();

            showToast("Customer deleted successfully.");
        }

    });


    /* OPEN ORDER FROM CUSTOMER PROFILE */

    $("customerDetailsContent")?.addEventListener("click", function (event) {

        const button = event.target.closest(
            '[data-action="view-order-from-customer"]'
        );

        if (!button) return;

        const orderId = button.dataset.id;

        const modalElement = $("customerDetailsModal");

        if (modalElement) {

            modalElement.addEventListener("hidden.bs.modal", function handler() {

                modalElement.removeEventListener("hidden.bs.modal", handler);

                showOrderDetails(orderId);

            });

            customerDetailsModal?.hide();

        } else {

            showOrderDetails(orderId);

        }

    });


    /* RECENT ORDERS */

    function renderRecentOrders() {

        const tbody = $("recentOrdersBody");

        if (!tbody) return;

        const recent = [...orders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (!recent.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        No orders available.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = recent.map(order => `

            <tr>

                <td>
                    <button class="order-id-link"
                            data-action="view-recent-order"
                            data-id="${escapeHTML(order.id)}">
                        #${escapeHTML(order.id)}
                    </button>
                </td>

                <td>
                    <div class="customer-cell">
                        <span class="customer-avatar">
                            ${escapeHTML(initials(order.customer))}
                        </span>
                        ${escapeHTML(order.customer)}
                    </div>
                </td>

                <td>${formatDate(order.date)}</td>

                <td class="amount-cell">
                    ${money(order.amount)}
                </td>

                <td>
                    <span class="status-badge ${statusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>
                </td>

            </tr>

        `).join("");
    }

    $("recentOrdersBody")?.addEventListener("click", function (event) {

        const button = event.target.closest(
            '[data-action="view-recent-order"]'
        );

        if (button) {
            showOrderDetails(button.dataset.id);
        }

    });


    /* INVENTORY ALERTS */

    function renderInventory() {

        const container = $("inventoryAlerts");

        if (!container) return;

        const lowStock = products
            .filter(product => Number(product.stock) <= 5)
            .slice(0, 4);

        if (!lowStock.length) {

            container.innerHTML = `

                <div class="inventory-item">

                    <div class="inventory-symbol">
                        <i class="bi bi-check-circle"></i>
                    </div>

                    <div class="inventory-details">

                        <strong>Inventory looks good</strong>

                        <span>No critical stock alerts.</span>

                    </div>

                </div>

            `;

            return;
        }

        container.innerHTML = lowStock.map(product => `

            <div class="inventory-item">

                <div class="inventory-symbol">
                    <i class="bi bi-laptop"></i>
                </div>

                <div class="inventory-details">

                    <strong>${escapeHTML(product.name)}</strong>

                    <span>${escapeHTML(product.category)}</span>

                </div>

                <span class="stock-quantity">
                    ${Number(product.stock)} left
                </span>

            </div>

        `).join("");
    }


    /* DASHBOARD STATISTICS */

    function refreshStatistics() {

        setText("totalRevenue", money(getRevenue()));

        setText("totalOrders", orders.length.toLocaleString("en-IN"));

        setText("totalProducts", products.length.toLocaleString("en-IN"));

        setText("totalCustomers", customers.length.toLocaleString("en-IN"));

        setText("sidebarOrderCount", getOrderCount("Processing"));

        setText("chartOrderTotal", orders.length);

        setText("deliveredCount", getOrderCount("Delivered"));

        setText("processingCount", getOrderCount("Processing"));

        setText("shippedCount", getOrderCount("Shipped"));

        setText("cancelledCount", getOrderCount("Cancelled"));
    }


    /* CHART CONTAINER SIZING */

    function prepareChartContainers() {

        const revenueCanvas = $("revenueChart");

        const orderCanvas = $("orderChart");

        if (revenueCanvas && revenueCanvas.parentElement) {

            const parent = revenueCanvas.parentElement;

            parent.style.position = "relative";

            parent.style.width = "100%";

            if (parent.clientHeight < 100) {

                parent.style.height = window.innerWidth <= 575
                    ? "220px"
                    : "250px";
            }
        }

        if (orderCanvas && orderCanvas.parentElement) {

            const parent = orderCanvas.parentElement;

            parent.style.position = "relative";

            if (parent.clientHeight < 100) {

                parent.style.width = "165px";

                parent.style.height = "165px";
            }
        }
    }


    /* REVENUE CHART DATA */

    function getRevenueBuckets(period) {

        const now = new Date();

        const paidOrders = orders.filter(order =>
            order.payment === "Paid" &&
            order.status !== "Cancelled"
        );

        if (period === "7") {

            const labels = [];
            const data = [];

            for (let offset = 6; offset >= 0; offset--) {

                const day = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - offset
                );

                const key = [
                    day.getFullYear(),
                    String(day.getMonth() + 1).padStart(2, "0"),
                    String(day.getDate()).padStart(2, "0")
                ].join("-");

                labels.push(
                    day.toLocaleDateString("en-IN", {
                        weekday: "short"
                    })
                );

                data.push(
                    paidOrders
                        .filter(order => order.date === key)
                        .reduce((sum, order) => sum + Number(order.amount || 0), 0)
                );
            }

            return { labels, data };
        }

        if (period === "90") {

            const labels = [];
            const data = [];

            for (let offset = 2; offset >= 0; offset--) {

                const month = new Date(
                    now.getFullYear(),
                    now.getMonth() - offset,
                    1
                );

                labels.push(
                    month.toLocaleDateString("en-IN", {
                        month: "short"
                    })
                );

                data.push(
                    paidOrders
                        .filter(order => {

                            const date = new Date(order.date + "T00:00:00");

                            return date.getFullYear() === month.getFullYear() &&
                                date.getMonth() === month.getMonth();

                        })
                        .reduce((sum, order) => sum + Number(order.amount || 0), 0)
                );
            }

            return { labels, data };
        }

        const labels = [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 5"
        ];

        const data = [0, 0, 0, 0, 0];

        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 34
        );

        paidOrders.forEach(order => {

            const date = new Date(order.date + "T00:00:00");

            const days = Math.floor((date - start) / 86400000);

            if (days >= 0 && days < 35) {

                const bucket = Math.min(4, Math.floor(days / 7));

                data[bucket] += Number(order.amount || 0);
            }
        });

        return { labels, data };
    }


    /* REVENUE ANALYTICS CHART */

    function createRevenueChart(period = "30") {

        const canvas = $("revenueChart");

        if (!canvas) return;

        if (typeof Chart === "undefined") {

            console.error("Chart.js is not loaded.");

            showToast("Chart.js could not load. Check script order and internet connection.");

            return;
        }

        prepareChartContainers();

        const chartData = getRevenueBuckets(period);

        if (revenueChart) {

            revenueChart.destroy();

            revenueChart = null;
        }

        Chart.defaults.font.family = "'DM Sans', sans-serif";

        Chart.defaults.color = "#928994";

        revenueChart = new Chart(canvas, {

            type: "line",

            data: {

                labels: chartData.labels,

                datasets: [{

                    label: "Paid Revenue",

                    data: chartData.data,

                    borderColor: "#9872b5",

                    backgroundColor: "rgba(152,114,181,0.12)",

                    borderWidth: 2.5,

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    pointBackgroundColor: "#c4a05b",

                    pointBorderColor: "#fffefa",

                    pointBorderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                resizeDelay: 100,

                animation: {
                    duration: 900,
                    easing: "easeOutQuart"
                },

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor: "#252027",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        borderColor: "rgba(196,160,91,0.4)",

                        borderWidth: 1,

                        padding: 12,

                        displayColors: false,

                        callbacks: {

                            label: function (context) {
                                return "Paid revenue: " + money(context.raw);
                            }

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color: "#928994",

                            maxRotation: 0,

                            font: {
                                family: "DM Sans",
                                size: 10
                            }

                        },

                        border: {
                            display: false
                        }

                    },

                    y: {

                        beginAtZero: true,

                        grace: "10%",

                        grid: {
                            color: "#eee9e3",
                            drawTicks: false
                        },

                        ticks: {

                            color: "#928994",

                            padding: 9,

                            maxTicksLimit: 6,

                            font: {
                                family: "DM Sans",
                                size: 9
                            },

                            callback: function (value) {

                                return value >= 100000
                                    ? "₹" + (value / 100000).toFixed(1) + "L"
                                    : "₹" + (value / 1000).toFixed(0) + "k";

                            }

                        },

                        border: {
                            display: false
                        }

                    }

                }

            }

        });

        requestAnimationFrame(() => revenueChart?.resize());
    }


    /* ORDER DISTRIBUTION DOUGHNUT CHART */

    function createOrderChart() {

        const canvas = $("orderChart");

        if (!canvas) return;

        if (typeof Chart === "undefined") {

            console.error("Chart.js is not loaded.");

            return;
        }

        prepareChartContainers();

        const values = [

            getOrderCount("Delivered"),

            getOrderCount("Processing"),

            getOrderCount("Shipped"),

            getOrderCount("Cancelled")

        ];

        const hasOrders = values.some(value => value > 0);

        if (orderChart) {

            orderChart.destroy();

            orderChart = null;
        }

        orderChart = new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Delivered",
                    "Processing",
                    "Shipped",
                    "Cancelled"
                ],

                datasets: [{

                    data: hasOrders ? values : [1, 0, 0, 0],

                    backgroundColor: [
                        "#9872b5",
                        "#c4a05b",
                        "#6d9c91",
                        "#c77c80"
                    ],

                    borderWidth: 3,

                    borderColor: "#fffefa",

                    hoverOffset: 8,

                    spacing: 3

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                resizeDelay: 100,

                cutout: "76%",

                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 900
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        enabled: hasOrders,

                        backgroundColor: "#252027",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        padding: 12

                    }

                }

            }

        });

        requestAnimationFrame(() => orderChart?.resize());
    }


    /* CHART RESIZE */

    function resizeCharts() {

        clearTimeout(chartResizeTimer);

        chartResizeTimer = setTimeout(() => {

            const dashboard = $("dashboardView");

            if (!dashboard || !dashboard.classList.contains("active")) {
                return;
            }

            prepareChartContainers();

            revenueChart?.resize();

            orderChart?.resize();

        }, 180);
    }


    /* CHART PERIOD FILTER */

    $("chartPeriod")?.addEventListener("change", function () {

        createRevenueChart(this.value);

    });


    /* DASHBOARD RECENT ORDERS */

    function renderRecentOrders() {

        const tbody = $("recentOrdersBody");

        if (!tbody) return;

        const recent = [...orders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (!recent.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        No orders available.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = recent.map(order => `

            <tr>

                <td>
                    <button class="order-id-link"
                            data-action="view-recent-order"
                            data-id="${escapeHTML(order.id)}">
                        #${escapeHTML(order.id)}
                    </button>
                </td>

                <td>
                    <div class="customer-cell">

                        <span class="customer-avatar">
                            ${escapeHTML(initials(order.customer))}
                        </span>

                        ${escapeHTML(order.customer)}

                    </div>
                </td>

                <td>${formatDate(order.date)}</td>

                <td class="amount-cell">
                    ${money(order.amount)}
                </td>

                <td>
                    <span class="status-badge ${statusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>
                </td>

            </tr>

        `).join("");
    }

    $("recentOrdersBody")?.addEventListener("click", function (event) {

        const button = event.target.closest(
            '[data-action="view-recent-order"]'
        );

        if (button) {
            showOrderDetails(button.dataset.id);
        }

    });


    /* INVENTORY ALERTS */

    function renderInventory() {

        const container = $("inventoryAlerts");

        if (!container) return;

        const lowStock = products
            .filter(product => Number(product.stock) <= 5)
            .slice(0, 4);

        if (!lowStock.length) {

            container.innerHTML = `

                <div class="inventory-item">

                    <div class="inventory-symbol">
                        <i class="bi bi-check-circle"></i>
                    </div>

                    <div class="inventory-details">

                        <strong>Inventory looks good</strong>

                        <span>No critical stock alerts.</span>

                    </div>

                </div>

            `;

            return;
        }

        container.innerHTML = lowStock.map(product => `

            <div class="inventory-item">

                <div class="inventory-symbol">
                    <i class="bi bi-laptop"></i>
                </div>

                <div class="inventory-details">

                    <strong>${escapeHTML(product.name)}</strong>

                    <span>${escapeHTML(product.category)}</span>

                </div>

                <span class="stock-quantity">
                    ${Number(product.stock)} left
                </span>

            </div>

        `).join("");
    }


    /* DASHBOARD STATISTICS */

    function refreshStatistics() {

        setText("totalRevenue", money(getRevenue()));

        setText("totalOrders", orders.length.toLocaleString("en-IN"));

        setText("totalProducts", products.length.toLocaleString("en-IN"));

        setText("totalCustomers", customers.length.toLocaleString("en-IN"));

        setText("sidebarOrderCount", getOrderCount("Processing"));

        setText("chartOrderTotal", orders.length);

        setText("deliveredCount", getOrderCount("Delivered"));

        setText("processingCount", getOrderCount("Processing"));

        setText("shippedCount", getOrderCount("Shipped"));

        setText("cancelledCount", getOrderCount("Cancelled"));
    }


    /* REFRESH DASHBOARD */

    function refreshDashboard() {

        refreshStatistics();

        renderRecentOrders();

        renderInventory();

        renderProducts(
            $("productSearch")?.value || "",
            $("productCategoryFilter")?.value || "all"
        );

        renderOrders(
            $("orderSearch")?.value || "",
            $("orderStatusFilter")?.value || "all"
        );

        renderCustomers(
            $("customerSearch")?.value || ""
        );

        createRevenueChart(
            $("chartPeriod")?.value || "30"
        );

        createOrderChart();
    }

    $("refreshDashboard")?.addEventListener("click", function () {

        refreshDashboard();

        showToast("Dashboard refreshed successfully.");

    });


    /* CSV EXPORT */

    function downloadCSV() {
        window.location.href="error.html";

        // const csv = rows.map(row =>

        //     row.map(value =>
        //         `"${String(value ?? "").replace(/"/g, '""')}"`
        //     ).join(",")

        // ).join("\r\n");

        // const blob = new Blob(["\uFEFF" + csv], {
        //     type: "text/csv;charset=utf-8;"
        // });

        // const url = URL.createObjectURL(blob);

        // const link = document.createElement("a");

        // link.href = url;

        // link.download = filename;

        // document.body.appendChild(link);

        // link.click();

        // link.remove();

        // URL.revokeObjectURL(url);
    }


    function exportOrdersCSV() {

       window.location.href="error.html";
    }

    $("exportOrders")?.addEventListener("click", exportOrdersCSV);


    $("exportDashboard")?.addEventListener("click", function () {

        const rows = [

            ["Metric", "Value"],

            ["Total Revenue", getRevenue()],

            ["Total Orders", orders.length],

            ["Total Products", products.length],

            ["Total Customers", customers.length],

            ["Delivered Orders", getOrderCount("Delivered")],

            ["Processing Orders", getOrderCount("Processing")],

            ["Shipped Orders", getOrderCount("Shipped")],

            ["Cancelled Orders", getOrderCount("Cancelled")]

        ];

        downloadCSV("stackly-dashboard-report.csv", rows);

        showToast("Dashboard report exported successfully.");

    });


    /* GLOBAL SEARCH */

    const globalSearch = $("globalSearch");

    function performGlobalSearch() {

        if (!globalSearch) return;

        const search = globalSearch.value.trim().toLowerCase();

        if (!search) return;

        const productMatch = products.some(item =>

            [
                item.name,
                item.sku,
                item.category
            ].join(" ").toLowerCase().includes(search)

        );

        const orderMatch = orders.some(item =>

            [
                item.id,
                item.customer,
                item.email
            ].join(" ").toLowerCase().includes(search)

        );

        const customerMatch = customers.some(item =>

            [
                item.name,
                item.email,
                item.phone,
                item.city
            ].join(" ").toLowerCase().includes(search)

        );

        if (productMatch) {

            openView("products");

            $("productSearch").value = search;

            renderProducts(
                search,
                $("productCategoryFilter")?.value || "all"
            );

        } else if (orderMatch) {

            openView("orders");

            $("orderSearch").value = search;

            renderOrders(
                search,
                $("orderStatusFilter")?.value || "all"
            );

        } else if (customerMatch) {

            openView("customers");

            $("customerSearch").value = search;

            renderCustomers(search);

        } else {

            showToast("No matching records found.");

        }
    }

    globalSearch?.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            performGlobalSearch();
        }

    });


    document.addEventListener("keydown", function (event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            if (window.innerWidth >= 992 && globalSearch) {

                globalSearch.focus();

            } else {

                hamburger?.focus();

            }
        }
    });


    /* NOTIFICATIONS */

    $("notificationBtn")?.addEventListener("click", function () {

        const lowStock = products.filter(product =>
            Number(product.stock) <= 5
        );

        const processingOrders = orders.filter(order =>
            order.status === "Processing"
        );

        const pendingPayments = orders.filter(order =>
            order.payment === "Pending"
        );

        if (typeof Swal !== "undefined") {

            Swal.fire({

                title: "Store Notifications",

                html: `
                    <div style="text-align:left;font-size:13px;line-height:2;color:#514853">

                        <p>
                            <strong>${lowStock.length}</strong>
                            products require stock attention.
                        </p>

                        <p>
                            <strong>${processingOrders.length}</strong>
                            orders are being processed.
                        </p>

                        <p>
                            <strong>${pendingPayments.length}</strong>
                            payments are pending.
                        </p>

                    </div>
                `,

                confirmButtonColor: "#9872b5",

                background: "#fffefa",

                color: "#29252a"

            });

        } else {

            showToast(
                `${lowStock.length} low-stock products, ` +
                `${processingOrders.length} processing orders, ` +
                `${pendingPayments.length} pending payments.`
            );

        }

    });


    /* LOGOUT */

    async function logout() {

        const confirmed = await confirmAction(
            "Logout?",
            "Are you sure you want to logout from your admin account?"
        );

        if (!confirmed) return;

        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("stacklyUsername");

        window.location.href = "login.html";
    }

    $("logoutBtn")?.addEventListener("click", logout);

    $("topLogoutBtn")?.addEventListener("click", logout);


    /* GSAP ANIMATIONS */

    function initializeAnimations() {

        if (typeof gsap !== "undefined") {

            if (
                gsap.registerPlugin &&
                typeof ScrollTrigger !== "undefined"
            ) {
                gsap.registerPlugin(ScrollTrigger);
            }

            gsap.fromTo(

                ".hero-content",

                {
                    opacity: 0,
                    x: -30
                },

                {
                    opacity: 1,
                    x: 0,
                    duration: 0.9,
                    ease: "power3.out"
                }

            );

            gsap.fromTo(

                ".hero-image-frame",

                {
                    opacity: 0,
                    y: 20,
                    rotation: -10
                },

                {
                    opacity: 1,
                    y: 0,
                    rotation: -5,
                    duration: 1,
                    delay: 0.15,
                    ease: "power3.out"
                }

            );

        }

        if (typeof AOS !== "undefined") {

            AOS.init({

                duration: 700,

                once: true,

                offset: 35,

                easing: "ease-out-cubic"

            });

        }
    }


    /* INITIALIZATION */

    loadAccountInformation();

    initializeModals();

    initializeAnimations();

    refreshDashboard();

    window.addEventListener("load", resizeCharts);

    console.log("Stackly Admin Dashboard initialized.");

    console.log("Products:", products.length);

    console.log("Orders:", orders.length);

    console.log("Customers:", customers.length);

    console.log(
        "Chart.js:",
        typeof Chart !== "undefined" ? "Loaded" : "Not loaded"
    );

    let activeTrackingOrderId = null;

const celebratedTrackingOrders = new Set();


const supplierDirectory = {

    Laptops: {
        name: "TechSource Distributors Pvt Ltd",
        email: "sales@techsource.example",
        phone: "+91 90000 11001",
        city: "Coimbatore",
        warehouse: "Coimbatore Technology Warehouse"
    },

    Desktops: {
        name: "Prime Computing Systems",
        email: "orders@primecomputing.example",
        phone: "+91 90000 11002",
        city: "Chennai",
        warehouse: "Chennai Computer Distribution Centre"
    },

    Monitors: {
        name: "Vision Electronics Wholesale",
        email: "support@visionelectronics.example",
        phone: "+91 90000 11003",
        city: "Chennai",
        warehouse: "Chennai Electronics Warehouse"
    },

    Accessories: {
        name: "Peripheral Hub Supplies",
        email: "sales@peripheralhub.example",
        phone: "+91 90000 11004",
        city: "Bangalore",
        warehouse: "Bangalore Accessories Distribution Centre"
    }

};


function getSupplierForOrder(order) {

    const items = getOrderItems(order);

    const firstItem = items[0] || {};

    const product = products.find(item =>
        item.sku === firstItem.sku
    );

    const category = product?.category ||
        firstItem.category ||
        "Laptops";

    return supplierDirectory[category] ||
        supplierDirectory.Laptops;

}


function getTrackingProgress(status) {

    const progress = {

        Processing: 43,

        Shipped: 72,

        "Out for Delivery": 88,

        Delivered: 100,

        Cancelled: 20

    };

    return progress[status] ?? 0;

}


function getTrackingLocation(order, supplier, customer) {

    const city = customer?.city || "Customer location";

    const locations = {

        Processing: {
            current: supplier.warehouse,
            next: "Dispatch and courier pickup"
        },

        Shipped: {
            current: `Regional Sorting Hub, ${city}`,
            next: `Local Delivery Centre, ${city}`
        },

        "Out for Delivery": {
            current: `Local Delivery Centre, ${city}`,
            next: "Customer delivery address"
        },

        Delivered: {
            current: `Successfully delivered, ${city}`,
            next: "Delivery completed"
        },

        Cancelled: {
            current: supplier.warehouse,
            next: "Shipment stopped"
        }

    };

    return locations[order.status] || locations.Processing;

}


function buildTrackingEvents(order, supplier, customer) {

    const city = customer?.city || "Customer location";

    const events = [

        {
            title: "Order Placed",
            location: "Stackly Computer Store",
            description: "Customer successfully placed the order.",
            day: 0,
            hour: 9,
            minute: 15
        },

        {
            title: "Order Confirmed",
            location: "Stackly Order Processing",
            description: "Order details and payment information verified.",
            day: 0,
            hour: 9,
            minute: 45
        },

        {
            title: "Supplier Accepted Order",
            location: supplier.warehouse,
            description: "Supplier received the purchase request and confirmed stock.",
            day: 0,
            hour: 11,
            minute: 20
        },

        {
            title: "Packed & Quality Checked",
            location: supplier.warehouse,
            description: "Product inspection completed and package prepared.",
            day: 0,
            hour: 16,
            minute: 30
        },

        {
            title: "Shipped from Warehouse",
            location: `Dispatch Hub, ${supplier.city}`,
            description: "Courier collected the package from the supplier.",
            day: 1,
            hour: 8,
            minute: 45
        },

        {
            title: "In Transit",
            location: `Regional Sorting Hub, ${city}`,
            description: "Package scanned and forwarded to the destination region.",
            day: 1,
            hour: 20,
            minute: 15
        },

        {
            title: "Out for Delivery",
            location: `Local Delivery Centre, ${city}`,
            description: "Package assigned to a delivery executive.",
            day: 2,
            hour: 8,
            minute: 30
        },

        {
            title: "Delivered Successfully",
            location: `Customer Address, ${city}`,
            description: "Package successfully delivered to the customer.",
            day: 2,
            hour: 14,
            minute: 45
        }

    ];


    if (order.status === "Cancelled") {

        return [
            events[0],
            events[1],
            {
                title: "Order Cancelled",
                location: supplier.warehouse,
                description: "The order was cancelled. Further shipment movement stopped.",
                day: 0,
                hour: 12,
                minute: 30
            }
        ];

    }


    const progress = {

        Processing: 3,

        Shipped: 5,

        "Out for Delivery": 6,

        Delivered: 7

    };

    const currentIndex = progress[order.status] ?? 3;

    return events.map((event, index) => ({

        ...event,

        state: index < currentIndex
            ? "completed"
            : index === currentIndex
                ? "current"
                : "upcoming"

    }));

}


function getTrackingTimestamp(order, event) {

    const date = new Date(
        order.date + "T09:00:00"
    );

    date.setDate(date.getDate() + event.day);

    date.setHours(
        event.hour,
        event.minute,
        0,
        0
    );

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}


function launchDeliveryCelebration(orderId) {

    if (celebratedTrackingOrders.has(orderId)) {
        return;
    }

    celebratedTrackingOrders.add(orderId);

    if (typeof confetti !== "function") {
        return;
    }

    const duration = 2500;

    const end = Date.now() + duration;

    const colors = [
        "#9872b5",
        "#c4a05b",
        "#6d9c91",
        "#e8c98d",
        "#ffffff"
    ];

    function celebrate() {

        confetti({

            particleCount: 5,

            angle: 60,

            spread: 65,

            origin: {
                x: 0,
                y: 0.7
            },

            colors: colors

        });

        confetti({

            particleCount: 5,

            angle: 120,

            spread: 65,

            origin: {
                x: 1,
                y: 0.7
            },

            colors: colors

        });

        if (Date.now() < end) {
            requestAnimationFrame(celebrate);
        }

    }

    celebrate();

    confetti({

        particleCount: 100,

        spread: 100,

        startVelocity: 45,

        origin: {
            x: 0.5,
            y: 0.55
        },

        colors: colors

    });

}


function renderTrackingResult(order) {

    const resultContainer = $("trackingResult");

    if (!resultContainer) return;

    activeTrackingOrderId = order.id;

    const customer = getCustomerForOrder(order);

    const supplier = getSupplierForOrder(order);

    const location = getTrackingLocation(
        order,
        supplier,
        customer
    );

    const trackingId = order.trackingNumber ||
        `STK-${order.id}`;

    const progress = getTrackingProgress(order.status);

    const events = buildTrackingEvents(
        order,
        supplier,
        customer
    );

    const courier = order.courier ||
        "Stackly Logistics (Demo)";

    const deliveryExecutive = order.deliveryExecutive ||
        "Arun Kumar (Demo)";

    const deliveryPhone = order.deliveryPhone ||
        "+91 90000 11223";

    const shippingSpeed = order.shippingSpeed ||
        (Number(order.amount) >= 50000
            ? "Express Delivery"
            : "Standard Delivery");


    const deliveryDate = order.status === "Delivered"
        ? getTrackingTimestamp(order, {
            day: 2,
            hour: 14,
            minute: 45
        })
        : order.status === "Cancelled"
            ? "Not applicable"
            : getTrackingTimestamp(order, {
                day: order.status === "Processing" ? 4 : 3,
                hour: 18,
                minute: 0
            });


    const eventHTML = events.map(event => `

        <div class="tracking-step ${event.state || "upcoming"}">

            <span class="tracking-dot"></span>

            <h5>${escapeHTML(event.title)}</h5>

            <p>
                <i class="bi bi-geo-alt"></i>
                ${escapeHTML(event.location)}
            </p>

            <p>${escapeHTML(event.description)}</p>

            <time>
                ${getTrackingTimestamp(order, event)}
            </time>

        </div>

    `).join("");


    const items = getOrderItems(order);

    const itemHTML = items.map(item => `

        <tr>

            <td>${escapeHTML(item.name)}</td>

            <td>${escapeHTML(item.sku || "-")}</td>

            <td>${Number(item.quantity || 1)}</td>

            <td class="amount-cell">
                ${money(item.price)}
            </td>

        </tr>

    `).join("");


    const deliveredHTML = order.status === "Delivered"

        ? `

            <div class="tracking-delivered-celebration">

                <i class="bi bi-trophy-fill"></i>

                <h3>Mission Accomplished!</h3>

                <p>
                    Package delivered successfully. Another happy customer!
                </p>

            </div>

        `

        : "";


    const statusMessage = {

        Processing: "Your order is being prepared for dispatch.",

        Shipped: "Your package is moving through the delivery network.",

        "Out for Delivery": "Your package is with the local delivery executive.",

        Delivered: "Your order has successfully reached its destination.",

        Cancelled: "This order has been cancelled and shipment movement has stopped."

    };


    resultContainer.innerHTML = `

        ${deliveredHTML}


        <div class="tracking-result-card">

            <div class="tracking-result-heading">

                <div>

                    <span class="section-kicker">
                        SHIPMENT REFERENCE
                    </span>

                    <h3>#${escapeHTML(order.id)}</h3>

                    <p>
                        Tracking ID: ${escapeHTML(trackingId)}
                        &nbsp; | &nbsp;
                        Order Date: ${formatDate(order.date)}
                    </p>

                </div>

                <span class="status-badge ${statusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>

            </div>


            <div class="tracking-status-banner">

                <div>

                    <span class="tracking-label">
                        CURRENT SHIPMENT STATUS
                    </span>

                    <h3>${escapeHTML(order.status)}</h3>

                    <p>${escapeHTML(statusMessage[order.status] || "")}</p>

                </div>

                <i class="bi bi-truck-front-fill"></i>

            </div>


            <div class="tracking-progress-area">

                <div class="tracking-progress-heading">

                    <strong>Delivery Progress</strong>

                    <span>${progress}% Completed</span>

                </div>

                <div class="tracking-progress-track">

                    <div class="tracking-progress-fill"
                         id="trackingProgressFill">
                    </div>

                    <div class="tracking-progress-truck"
                         id="trackingProgressTruck">

                        <i class="bi bi-truck-front-fill"></i>

                    </div>

                </div>

                <div class="tracking-progress-labels">

                    <span>Order Placed</span>

                    <span>Processing</span>

                    <span>Shipped</span>

                    <span>Delivered</span>

                </div>

            </div>


            <div class="tracking-information-grid">

                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-geo-alt"></i>
                        CURRENT LOCATION
                    </span>

                    <strong>${escapeHTML(location.current)}</strong>

                </div>


                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-signpost"></i>
                        NEXT DESTINATION
                    </span>

                    <strong>${escapeHTML(location.next)}</strong>

                </div>


                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-calendar-check"></i>
                        ESTIMATED DELIVERY
                    </span>

                    <strong>${escapeHTML(deliveryDate)}</strong>

                </div>


                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-speedometer2"></i>
                        SHIPPING SPEED
                    </span>

                    <strong>${escapeHTML(shippingSpeed)}</strong>

                </div>


                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-upc-scan"></i>
                        TRACKING NUMBER
                    </span>

                    <strong>${escapeHTML(trackingId)}</strong>

                </div>


                <div class="tracking-information-box">

                    <span>
                        <i class="bi bi-truck"></i>
                        DELIVERY PARTNER
                    </span>

                    <strong>${escapeHTML(courier)}</strong>

                </div>

            </div>


            <h3 class="tracking-section-title">
                Shipment Journey
            </h3>


            <div class="row g-3">

                <div class="col-lg-7">

                    <div class="detail-section">

                        <div class="tracking-timeline">

                            ${eventHTML}

                        </div>

                    </div>

                </div>


                <div class="col-lg-5">

                    <div class="tracking-party-card mb-3">

                        <div class="tracking-party-heading">

                            <div class="tracking-party-icon">
                                <i class="bi bi-building"></i>
                            </div>

                            <h4>Supplier Details</h4>

                        </div>

                        <span class="party-role">
                            PRODUCT SUPPLIER
                        </span>

                        <p>
                            <strong>${escapeHTML(supplier.name)}</strong>
                        </p>

                        <p>
                            <i class="bi bi-envelope"></i>
                            ${escapeHTML(supplier.email)}
                        </p>

                        <p>
                            <i class="bi bi-telephone"></i>
                            ${escapeHTML(supplier.phone)}
                        </p>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${escapeHTML(supplier.warehouse)}
                        </p>

                    </div>


                    <div class="tracking-party-card mb-3">

                        <div class="tracking-party-heading">

                            <div class="tracking-party-icon">
                                <i class="bi bi-person"></i>
                            </div>

                            <h4>Customer Details</h4>

                        </div>

                        <span class="party-role">
                            ORDER RECIPIENT
                        </span>

                        <p>
                            <strong>${escapeHTML(order.customer)}</strong>
                        </p>

                        <p>
                            <i class="bi bi-envelope"></i>
                            ${escapeHTML(order.email)}
                        </p>

                        <p>
                            <i class="bi bi-telephone"></i>
                            ${escapeHTML(customer?.phone || "Phone not available")}
                        </p>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${escapeHTML(customer?.city || "Location not available")}
                        </p>

                    </div>


                    <div class="tracking-party-card">

                        <div class="tracking-party-heading">

                            <div class="tracking-party-icon">
                                <i class="bi bi-truck"></i>
                            </div>

                            <h4>Delivery Executive</h4>

                        </div>

                        <span class="party-role">
                            LAST MILE DELIVERY
                        </span>

                        <p>
                            <strong>${escapeHTML(deliveryExecutive)}</strong>
                        </p>

                        <p>
                            <i class="bi bi-telephone"></i>
                            ${escapeHTML(deliveryPhone)}
                        </p>

                        <p>
                            Vehicle: Delivery Van
                        </p>

                    </div>

                </div>

            </div>


            <div class="detail-section mt-3">

                <h3 class="tracking-section-title">
                    Ordered Products
                </h3>

                <div class="table-responsive">

                    <table class="table admin-table tracking-items-table">

                        <thead>

                            <tr>
                                <th>PRODUCT</th>
                                <th>SKU</th>
                                <th>QUANTITY</th>
                                <th>PRICE</th>
                            </tr>

                        </thead>

                        <tbody>
                            ${itemHTML}
                        </tbody>

                    </table>

                </div>


                <div class="detail-total">

                    <span>Total Order Amount</span>

                    <strong>${money(order.amount)}</strong>

                </div>

            </div>


            <div class="d-flex justify-content-end mt-3">

                <button class="gold-btn"
                        type="button"
                        data-action="open-tracking-order-details"
                        data-id="${escapeHTML(order.id)}">

                    <i class="bi bi-receipt"></i>

                    Complete Order Details

                </button>

            </div>


            <p class="tracking-demo-disclaimer">

                Demonstration tracking data only. Supplier contacts, courier
                details, shipment scans, locations and delivery timestamps
                are sample frontend records, not live logistics data.

            </p>

        </div>

    `;


    animateTrackingResult(progress);


    if (order.status === "Delivered") {

        setTimeout(() => {
            launchDeliveryCelebration(order.id);
        }, 700);

    }

}


/* TRACKING ANIMATIONS */

function animateTrackingResult(progress) {

    if (typeof gsap === "undefined") {

        const fill = $("trackingProgressFill");

        if (fill) {
            fill.style.width = progress + "%";
        }

        const truck = $("trackingProgressTruck");

        if (truck) {
            truck.style.left = progress + "%";
        }

        return;
    }


    gsap.fromTo(

        ".tracking-result-card",

        {
            opacity: 0,
            y: 25
        },

        {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out"
        }

    );


    gsap.fromTo(

        ".tracking-step",

        {
            opacity: 0,
            x: -15
        },

        {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.12,
            delay: 0.25,
            ease: "power2.out"
        }

    );


    gsap.to("#trackingProgressFill", {

        width: progress + "%",

        duration: 1.7,

        delay: 0.3,

        ease: "power2.out"

    });


    gsap.to("#trackingProgressTruck", {

        left: progress + "%",

        duration: 1.8,

        delay: 0.3,

        ease: "power2.out"

    });


    gsap.fromTo(

        ".tracking-information-box",

        {
            opacity: 0,
            y: 12
        },

        {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            delay: 0.3
        }

    );

}


/* SEARCH TRACKING ID */

function searchTrackingOrder(value) {

    const searchValue = String(value || "")
        .trim()
        .toLowerCase();

    if (!searchValue) {

        showToast("Please enter a Tracking ID.");

        return;

    }


    const order = orders.find(item => {

        const trackingId = item.trackingNumber ||
            `STK-${item.id}`;

        return (

            item.id.toLowerCase() === searchValue ||

            trackingId.toLowerCase() === searchValue

        );

    });


    if (!order) {

        activeTrackingOrderId = null;

        $("trackingResult").innerHTML = `

            <div class="tracking-empty-state">

                <div class="empty-tracking-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h3>Shipment Not Found</h3>

                <p>
                    We couldn't find an order matching this Tracking ID.
                    Please verify the ID and try again.
                </p>

            </div>

        `;

        showToast("No order found for this Tracking ID.");

        return;

    }


    renderTrackingResult(order);

}


/* TRACKING SEARCH FORM */

$("trackingSearchForm")?.addEventListener("submit", function (event) {

    event.preventDefault();

    const value = $("trackingIdInput").value;

    searchTrackingOrder(value);

});


/* QUICK TRACKING BUTTONS */

document.querySelectorAll("[data-track-id]").forEach(button => {

    button.addEventListener("click", function () {

        const trackingId = this.dataset.trackId;

        $("trackingIdInput").value = trackingId;

        searchTrackingOrder(trackingId);

    });

});


/* OPEN ORDER DETAILS FROM TRACKING */

$("trackingResult")?.addEventListener("click", function (event) {

    const button = event.target.closest(
        '[data-action="open-tracking-order-details"]'
    );

    if (!button) return;

    const orderId = button.dataset.id;

    showOrderDetails(orderId);

});

});