// (function () {
//     const CART_KEY = "stacklyStoreCart";
//     let lastCount = -1;

//     function readCart() {
//         try {
//             const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
//             return Array.isArray(data) ? data : [];
//         } catch (error) {
//             return [];
//         }
//     }

//     function saveCart(cart) {
//         try {
//             localStorage.setItem(CART_KEY, JSON.stringify(cart));
//         } catch (error) {
//             return;
//         }
//         updateBadges();
//         window.dispatchEvent(new CustomEvent("stackly:cart-updated"));
//     }

//     function getCount() {
//         return readCart().reduce(function (total, item) {
//             return total + Number(item.quantity || 0);
//         }, 0);
//     }

//     function getQty(id) {
//         const item = readCart().find(function (entry) {
//             return String(entry.id) === String(id);
//         });
//         return item ? Number(item.quantity) : 0;
//     }

//     function updateBadges() {
//         const count = getCount();
//         const changed = lastCount !== -1 && count !== lastCount;
//         lastCount = count;

//         document.querySelectorAll(".cart-badge, .mobile-cart-badge").forEach(function (badge) {
//             badge.textContent = count > 99 ? "99+" : count;
//             badge.setAttribute("aria-label", count + " items in cart");

//             if (changed) {
//                 badge.classList.remove("badge-pulse");
//                 void badge.offsetWidth;
//                 badge.classList.add("badge-pulse");
//             }
//         });
//     }

//     function add(product, quantity) {
//         quantity = Number(quantity || 1);

//         if (!product || product.stock <= 0) {
//             return { success: false, message: "This product is currently out of stock." };
//         }

//         const cart = readCart();
//         const existing = cart.find(function (item) {
//             return String(item.id) === String(product.id);
//         });

//         if (existing) {
//             if (existing.quantity + quantity > product.stock) {
//                 return { success: false, message: "Only " + product.stock + " units are available." };
//             }
//             existing.quantity += quantity;
//         } else {
//             cart.push({
//                 id: product.id,
//                 name: product.name,
//                 price: product.price,
//                 oldPrice: product.oldPrice || 0,
//                 image: product.image,
//                 category: product.category,
//                 specs: product.specs || [],
//                 stock: product.stock,
//                 quantity: quantity
//             });
//         }

//         saveCart(cart);
//         return { success: true };
//     }

//     function remove(id) {
//         saveCart(readCart().filter(function (item) {
//             return String(item.id) !== String(id);
//         }));
//     }

//     function updateQuantity(id, quantity) {
//         const cart = readCart();
//         const item = cart.find(function (entry) {
//             return String(entry.id) === String(id);
//         });

//         if (!item) return false;

//         quantity = Number(quantity);

//         if (quantity > item.stock) return false;

//         if (quantity < 1) {
//             remove(id);
//             return true;
//         }

//         item.quantity = quantity;
//         saveCart(cart);
//         return true;
//     }

//     function subtotal() {
//         return readCart().reduce(function (total, item) {
//             return total + Number(item.price) * Number(item.quantity);
//         }, 0);
//     }

//     function savings() {
//         return readCart().reduce(function (total, item) {
//             return total + Math.max(0, Number(item.oldPrice || 0) - Number(item.price)) * Number(item.quantity);
//         }, 0);
//     }

//     function formatPrice(value) {
//         return "₹" + Number(value).toLocaleString("en-IN");
//     }

//     window.StacklyCart = {
//         key: CART_KEY,
//         get: readCart,
//         count: getCount,
//         getQty: getQty,
//         add: add,
//         updateQuantity: updateQuantity,
//         remove: remove,
//         clear: function () { saveCart([]); },
//         subtotal: subtotal,
//         savings: savings,
//         formatPrice: formatPrice,
//         updateBadges: updateBadges
//     };

//     window.addEventListener("storage", function (event) {
//         if (event.key === CART_KEY) {
//             updateBadges();
//             window.dispatchEvent(new CustomEvent("stackly:cart-updated"));
//         }
//     });

//     window.addEventListener("pageshow", updateBadges);

//     lastCount = getCount();
//     updateBadges();
//     document.addEventListener("DOMContentLoaded", updateBadges);
// })();


// document.addEventListener("DOMContentLoaded", function () {

//     const section = document.querySelector(".stackly-cart-hero");

//     if (!section) return;

//     if (section.dataset.initialized === "true") return;

//     section.dataset.initialized = "true";

//     const countElement = section.querySelector("#cartHeroCount");

//     const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     function updateHeroCount() {
//         if (!window.StacklyCart || !countElement) return;
//         countElement.textContent = window.StacklyCart.count();
//     }

//     updateHeroCount();

//     window.addEventListener("pageshow", updateHeroCount);

//     window.addEventListener("stackly:cart-updated", updateHeroCount);

//     window.addEventListener("storage", function (event) {
//         if (event.key === "stacklyStoreCart" || event.key === null) {
//             updateHeroCount();
//         }
//     });

//     if (reducedMotion || typeof gsap === "undefined") return;

//     const eyebrow = section.querySelector(".cart-hero-eyebrow");
//     const breadcrumb = section.querySelector(".cart-hero-breadcrumb");
//     const title = section.querySelector(".cart-hero-title");
//     const description = section.querySelector(".cart-hero-description");
//     const actions = section.querySelector(".cart-hero-actions");
//     const information = section.querySelector(".cart-hero-information");
//     const visual = section.querySelector(".cart-hero-visual");
//     const bottom = section.querySelector(".cart-hero-bottom-line");

//     const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

//     gsap.set([eyebrow, breadcrumb, title, description, actions, information], { y: 30, autoAlpha: 0 });
//     gsap.set(visual, { x: 45, autoAlpha: 0, scale: 0.94 });
//     gsap.set(bottom, { y: 15, autoAlpha: 0 });

//     timeline
//         .to(eyebrow, { y: 0, autoAlpha: 1, duration: 0.6 })
//         .to(breadcrumb, { y: 0, autoAlpha: 1, duration: 0.55 }, "-=0.35")
//         .to(title, { y: 0, autoAlpha: 1, duration: 0.9 }, "-=0.3")
//         .to(description, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.45")
//         .to(actions, { y: 0, autoAlpha: 1, duration: 0.65 }, "-=0.35")
//         .to(information, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.3")
//         .to(visual, { x: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.85")
//         .to(bottom, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.3");

//     gsap.to(".cart-orbit-two", { rotation: 360, duration: 35, repeat: -1, ease: "none" });
//     gsap.to(".cart-orbit-one", { scale: 1.1, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
//     gsap.to(".cart-floating-card-top", { y: -7, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
//     gsap.to(".cart-floating-card-bottom", { y: 7, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

//     if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

//         const stage = section.querySelector(".cart-visual-stage");
//         const circle = section.querySelector(".cart-visual-circle");

//         stage.addEventListener("pointermove", function (event) {
//             const rect = stage.getBoundingClientRect();
//             const x = (event.clientX - rect.left) / rect.width - 0.5;
//             const y = (event.clientY - rect.top) / rect.height - 0.5;

//             gsap.to(circle, { x: x * 12, y: y * 12, duration: 0.8, ease: "power2.out", overwrite: "auto" });
//         });

//         stage.addEventListener("pointerleave", function () {
//             gsap.to(circle, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
//         });

//     }

// });


// document.addEventListener("DOMContentLoaded", function () {

//     const root = document.getElementById("cartItems");

//     if (!root || !window.StacklyCart) return;

//     const cart = window.StacklyCart;
//     const hasGsap = typeof gsap !== "undefined";
//     const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const wishlistKey = "stacklyStoreWishlist";
//     const palette = ["#9872B5", "#B49ACD", "#D3B16F", "#69BFC0", "#B35E83", "#4D9A75", "#FFFFFF"];

//     const states = [
//         "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
//         "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
//         "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
//         "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
//         "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
//         "West Bengal"
//     ];

//     const banks = [
//         "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
//         "Yes Bank", "Bank of Baroda", "IDFC FIRST Bank"
//     ];

//     const coupons = {
//         STACKLY10: { type: "percent", value: 10, max: 15000, min: 50000, label: "10% off up to ₹15,000" },
//         WELCOME5: { type: "percent", value: 5, max: 8000, min: 0, label: "5% off up to ₹8,000" },
//         MEGA2000: { type: "flat", value: 2000, max: 2000, min: 100000, label: "₹2,000 off above ₹1,00,000" }
//     };

//     const COD_FEE = 99;
//     const COD_LIMIT = 100000;
//     const tenures = [3, 6, 9, 12];

//     const state = { step: 1, coupon: null, method: "upi", tenure: 6, busy: false };

//     const $ = function (id) { return document.getElementById(id); };
//     const money = cart.formatPrice;

//     const rules = {
//         fName: function (v) { return /^[A-Za-z][A-Za-z .'-]{2,59}$/.test(v) ? "" : "Enter your full name (letters only, at least 3 characters)"; },
//         fPhone: function (v) { return /^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number"; },
//         fEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address"; },
//         fAddr1: function (v) { return v.length >= 8 ? "" : "Enter your house number, building and street"; },
//         fPincode: function (v) { return /^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit pincode"; },
//         fCity: function (v) { return /^[A-Za-z][A-Za-z .'-]{1,}$/.test(v) ? "" : "Enter your city"; },
//         fState: function (v) { return v ? "" : "Select your state"; },
//         upiId: function (v) { return /^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(v) ? "" : "Enter a valid UPI ID, for example name@okaxis"; },
//         cardNumber: function (v) {
//             const d = v.replace(/\s/g, "");
//             return /^\d{13,19}$/.test(d) && luhn(d) ? "" : "Enter a valid card number";
//         },
//         cardName: function (v) { return /^[A-Za-z][A-Za-z .'-]{2,}$/.test(v) ? "" : "Enter the name printed on your card"; },
//         cardExpiry: function (v) { return validExpiry(v) ? "" : "Enter a valid expiry date (MM/YY)"; },
//         cardCvv: function (v) { return /^\d{3,4}$/.test(v) ? "" : "Enter the 3 or 4 digit CVV"; },
//         emiBank: function (v) { return v ? "" : "Select your card bank"; }
//     };

//     const detailIds = ["fName", "fPhone", "fEmail", "fAddr1", "fPincode", "fCity", "fState"];

//     function luhn(number) {
//         let sum = 0;
//         let alt = false;
//         for (let i = number.length - 1; i >= 0; i--) {
//             let digit = Number(number[i]);
//             if (alt) {
//                 digit *= 2;
//                 if (digit > 9) digit -= 9;
//             }
//             sum += digit;
//             alt = !alt;
//         }
//         return sum % 10 === 0;
//     }

//     function validExpiry(value) {
//         const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
//         if (!match) return false;
//         const month = Number(match[1]);
//         const year = 2000 + Number(match[2]);
//         const now = new Date();
//         const end = new Date(year, month, 0, 23, 59, 59);
//         return end >= now && year <= now.getFullYear() + 20;
//     }

//     function cardBrand(digits) {
//         if (/^4/.test(digits)) return "VISA";
//         if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
//         if (/^3[47]/.test(digits)) return "AMEX";
//         if (/^(60|65|81|82|508)/.test(digits)) return "RUPAY";
//         return "";
//     }

//     function esc(value) {
//         return String(value).replace(/[&<>"']/g, function (char) {
//             return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
//         });
//     }

//     function deliveryDate(days) {
//         const date = new Date();
//         date.setDate(date.getDate() + days);
//         return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
//     }

//     let toastTimer;

//     function toast(title, message, type) {
//         const box = $("coToast");
//         const icons = { success: "fa-check", info: "fa-minus", warn: "fa-triangle-exclamation", heart: "fa-heart" };

//         $("coToastTitle").textContent = title;
//         $("coToastMessage").textContent = message || "";
//         $("coToastIcon").className = "fa-solid " + (icons[type] || icons.success);
//         box.className = "co-toast is-visible toast-" + (type || "success");

//         clearTimeout(toastTimer);
//         toastTimer = setTimeout(function () {
//             box.classList.remove("is-visible");
//         }, 2800);
//     }

//     function party(x, y, power) {
//         if (typeof confetti !== "function" || reduceMotion) return;
//         const origin = { x: x / window.innerWidth, y: y / window.innerHeight };
//         const base = { origin: origin, colors: palette, zIndex: 6000, ticks: 200, gravity: 1.05, disableForReducedMotion: true };
//         confetti(Object.assign({}, base, { particleCount: Math.round(60 * power), spread: 80, startVelocity: 40 }));
//         confetti(Object.assign({}, base, { particleCount: Math.round(30 * power), spread: 120, startVelocity: 26, scalar: 0.8, shapes: ["circle"] }));
//     }

//     function getWishlist() {
//         try {
//             const data = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
//             return Array.isArray(data) ? data : [];
//         } catch (error) {
//             return [];
//         }
//     }

//     function saveWishlist(items) {
//         try {
//             localStorage.setItem(wishlistKey, JSON.stringify(items));
//         } catch (error) {
//             return;
//         }
//     }

//     function totals() {
//         const items = cart.get();
//         const subtotal = cart.subtotal();
//         const mrp = items.reduce(function (sum, item) {
//             return sum + Math.max(Number(item.oldPrice || 0), Number(item.price)) * Number(item.quantity);
//         }, 0);
//         const productDiscount = Math.max(0, mrp - subtotal);
//         let couponDiscount = 0;

//         if (state.coupon) {
//             const coupon = coupons[state.coupon];
//             if (coupon && subtotal >= coupon.min) {
//                 couponDiscount = coupon.type === "percent"
//                     ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.max)
//                     : coupon.value;
//             } else {
//                 state.coupon = null;
//             }
//         }

//         const payable = subtotal - couponDiscount;
//         const codFee = state.method === "cod" ? COD_FEE : 0;
//         const total = payable + codFee;
//         const gst = Math.round(payable * 18 / 118);

//         return {
//             count: cart.count(),
//             subtotal: subtotal,
//             mrp: mrp,
//             productDiscount: productDiscount,
//             couponDiscount: couponDiscount,
//             payable: payable,
//             codFee: codFee,
//             total: total,
//             gst: gst
//         };
//     }

//     function itemHTML(item) {
//         const qty = Number(item.quantity);
//         const price = Number(item.price);
//         const old = Number(item.oldPrice || 0);
//         const stock = Number(item.stock || 0);
//         const off = old > price ? Math.round((1 - price / old) * 100) : 0;
//         const icon = String(item.id).indexOf("LP") === 0 ? "fa-laptop" : "fa-computer";
//         const id = esc(item.id);
//         const stockLine = stock <= 3
//             ? '<span class="co-stock low"><i class="fa-solid fa-fire"></i>Only ' + stock + " left in stock</span>"
//             : '<span class="co-stock"><i class="fa-solid fa-circle-check"></i>In stock</span>';

//         return '<article class="co-item" data-item="' + id + '">' +
//             '<div class="co-item-img"><img src="' + esc(item.image) + '" alt="' + esc(item.name) + '" loading="lazy">' +
//             '<div class="co-fallback"><i class="fa-solid ' + icon + '"></i><span>STACKLY</span></div></div>' +
//             '<div class="co-item-body">' +
//             '<span class="co-item-cat">' + esc(String(item.category || "").toUpperCase()) + " SERIES</span>" +
//             '<h4 class="co-item-name">' + esc(item.name) + "</h4>" +
//             '<div class="co-item-specs">' + (item.specs || []).map(function (spec) { return "<span>" + esc(spec) + "</span>"; }).join("") + "</div>" +
//             stockLine +
//             '<span class="co-delivery"><i class="fa-solid fa-truck-fast"></i>Free delivery by ' + deliveryDate(4) + "</span>" +
//             '<div class="co-item-actions">' +
//             '<button type="button" data-act="wish" data-id="' + id + '"><i class="fa-regular fa-heart"></i>Save for later</button>' +
//             '<button type="button" data-act="remove" data-id="' + id + '"><i class="fa-regular fa-trash-can"></i>Remove</button>' +
//             "</div></div>" +
//             '<div class="co-item-side">' +
//             '<div class="co-price"><strong>' + money(price) + "</strong>" +
//             (old > price ? "<s>" + money(old) + "</s><em>" + off + "% off</em>" : "") + "</div>" +
//             '<div class="co-qty" role="group" aria-label="Quantity">' +
//             '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease quantity"><i class="fa-solid fa-' + (qty === 1 ? "trash-can" : "minus") + '"></i></button>' +
//             "<strong>" + qty + "</strong>" +
//             '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase quantity"' + (qty >= stock ? " disabled" : "") + '><i class="fa-solid fa-plus"></i></button></div>' +
//             '<div class="co-line-total">Item total<b>' + money(price * qty) + "</b></div>" +
//             "</div></article>";
//     }

//     function bindImages(container) {
//         container.querySelectorAll("img").forEach(function (img) {
//             const markMissing = function () {
//                 if (img.parentElement) img.parentElement.classList.add("image-missing");
//             };
//             img.addEventListener("error", markMissing, { once: true });
//             if (img.complete && img.naturalWidth === 0) markMissing();
//         });
//     }

//     function renderList(animate) {
//         const items = cart.get();
//         const count = cart.count();

//         $("coItemCount").textContent = count + (count === 1 ? " item" : " items");
//         $("coList").innerHTML = items.map(itemHTML).join("");
//         bindImages($("coList"));

//         if (animate && hasGsap && !reduceMotion && items.length) {
//             gsap.from("#coList .co-item", { y: 24, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", clearProps: "all" });
//         }
//     }

//     function renderMini() {
//         $("coMini").innerHTML = cart.get().map(function (item) {
//             return '<div class="co-mini-item"><div class="co-mini-img"><img src="' + esc(item.image) + '" alt=""><b>' + item.quantity + "</b></div>" +
//                 '<span class="co-mini-name">' + esc(item.name) + "</span>" +
//                 '<span class="co-mini-price">' + money(Number(item.price) * Number(item.quantity)) + "</span></div>";
//         }).join("");
//     }

//     function renderCouponChips() {
//         const subtotal = cart.subtotal();
//         $("coCouponChips").innerHTML = Object.keys(coupons).map(function (code) {
//             const coupon = coupons[code];
//             const applied = state.coupon === code;
//             return '<button type="button" data-code="' + code + '" class="' + (applied ? "is-applied" : "") + '" title="' + esc(coupon.label) + '"' +
//                 (subtotal < coupon.min ? ' style="opacity:.55"' : "") + ">" + code + "</button>";
//         }).join("");
//     }

//     function renderTenures(t) {
//         const base = t.payable;
//         $("coTenures").innerHTML = tenures.map(function (months) {
//             return '<label class="co-tenure"><input type="radio" name="tenure" value="' + months + '"' + (state.tenure === months ? " checked" : "") + ">" +
//                 "<span><strong>" + months + " months</strong><small>" + money(Math.round(base / months)) + "/month</small></span></label>";
//         }).join("");
//     }

//     function renderSummary() {
//         const t = totals();
//         const rows = [];

//         rows.push(["Price (" + t.count + " item" + (t.count === 1 ? "" : "s") + ")", money(t.mrp), ""]);
//         if (t.productDiscount) rows.push(["Product discount", "− " + money(t.productDiscount), "is-green"]);
//         if (t.couponDiscount) rows.push(["Coupon (" + state.coupon + ")", "− " + money(t.couponDiscount), "is-green"]);
//         rows.push(["Delivery charges", "FREE", "is-green"]);
//         if (t.codFee) rows.push(["COD handling fee", money(t.codFee), ""]);
//         rows.push(["Includes GST (18%)", money(t.gst), "is-muted"]);

//         $("coLines").innerHTML = rows.map(function (row) {
//             return '<div class="' + row[2] + '"><dt>' + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
//         }).join("");

//         $("coTotal").textContent = money(t.total);
//         $("coBarTotal").textContent = money(t.total);

//         const saved = t.productDiscount + t.couponDiscount;
//         $("coSave").textContent = saved > 0 ? "You will save " + money(saved) + " on this order" : "";
//         $("coEmiHint").textContent = t.payable > 0 ? "No-cost EMI from " + money(Math.round(t.payable / 12)) + "/month" : "";
//         $("coPlaceLabel").textContent = "Place order · " + money(t.total);

//         renderMini();
//         renderCouponChips();
//         renderTenures(t);

//         const codBlocked = t.subtotal > COD_LIMIT;
//         const codBox = $("codMethod");
//         const codInput = codBox.querySelector("input");

//         codBox.classList.toggle("is-disabled", codBlocked);
//         codInput.disabled = codBlocked;
//         $("codNote").textContent = codBlocked
//             ? "Not available for orders above ₹1,00,000"
//             : "Pay when your order arrives. A ₹99 handling fee applies.";

//         if (codBlocked && state.method === "cod") {
//             state.method = "upi";
//             root.querySelector('input[name="payMethod"][value="upi"]').checked = true;
//             applyMethod();
//             renderSummary();
//         }
//     }

//     function applyMethod() {
//         root.querySelectorAll(".co-method").forEach(function (box) {
//             const on = box.dataset.method === state.method;
//             box.classList.toggle("is-selected", on);
//             const body = box.querySelector(".co-method-body");
//             if (body) body.hidden = !on;
//         });
//     }

//     function setCouponMessage(text, kind, withRemove) {
//         const box = $("coCouponMsg");
//         box.className = "co-coupon-msg" + (kind ? " " + kind : "");
//         box.innerHTML = esc(text) + (withRemove ? '<button type="button" data-remove-coupon>Remove</button>' : "");
//     }

//     function applyCoupon(raw) {
//         const code = String(raw || "").trim().toUpperCase();
//         const coupon = coupons[code];
//         const subtotal = cart.subtotal();

//         if (!code) {
//             setCouponMessage("Enter a coupon code to apply.", "bad");
//             return;
//         }

//         if (!coupon) {
//             setCouponMessage("This coupon code is not valid.", "bad");
//             return;
//         }

//         if (subtotal < coupon.min) {
//             setCouponMessage("Add " + money(coupon.min - subtotal) + " more to use " + code + ".", "bad");
//             return;
//         }

//         state.coupon = code;
//         $("coCouponInput").value = "";
//         renderSummary();
//         const t = totals();
//         setCouponMessage(code + " applied. You saved " + money(t.couponDiscount) + ".", "ok", true);
//         toast("Coupon applied", code + " saved you " + money(t.couponDiscount) + ".", "success");
//     }

//     function setError(input, message) {
//         const wrap = input.closest(".co-field");
//         if (!wrap) return !message;
//         wrap.classList.toggle("is-invalid", !!message);
//         const slot = wrap.querySelector(".co-error");
//         if (slot) slot.textContent = message;
//         return !message;
//     }

//     function validateField(id) {
//         const input = $(id);
//         return setError(input, rules[id](input.value.trim()));
//     }

//     function focusFirstInvalid() {
//         const bad = root.querySelector(".co-field.is-invalid input, .co-field.is-invalid select");
//         if (bad) bad.focus();
//     }

//     function validateDetails() {
//         let ok = true;
//         detailIds.forEach(function (id) {
//             if (!validateField(id)) ok = false;
//         });
//         if (!ok) focusFirstInvalid();
//         return ok;
//     }

//     function validatePayment() {
//         let ok = true;
//         if (state.method === "upi") {
//             ok = validateField("upiId");
//         } else if (state.method === "card") {
//             ["cardNumber", "cardName", "cardExpiry", "cardCvv"].forEach(function (id) {
//                 if (!validateField(id)) ok = false;
//             });
//         } else if (state.method === "netbanking") {
//             const chosen = root.querySelector('input[name="nb"]:checked');
//             const line = $("nbError");
//             line.textContent = chosen ? "" : "Select your bank to continue";
//             line.classList.toggle("is-visible", !chosen);
//             ok = !!chosen;
//         } else if (state.method === "emi") {
//             ok = validateField("emiBank");
//         }
//         if (!ok) focusFirstInvalid();
//         return ok;
//     }

//     function getDetails() {
//         const type = root.querySelector('input[name="addrType"]:checked');
//         return {
//             name: $("fName").value.trim(),
//             phone: $("fPhone").value.trim(),
//             email: $("fEmail").value.trim(),
//             address1: $("fAddr1").value.trim(),
//             address2: $("fAddr2").value.trim(),
//             landmark: $("fLandmark").value.trim(),
//             pincode: $("fPincode").value.trim(),
//             city: $("fCity").value.trim(),
//             state: $("fState").value,
//             type: type ? type.value : "Home"
//         };
//     }

//     function paymentLabel() {
//         if (state.method === "upi") return "UPI · " + $("upiId").value.trim();
//         if (state.method === "card") {
//             const digits = $("cardNumber").value.replace(/\s/g, "");
//             const brand = cardBrand(digits);
//             return (brand ? brand + " card" : "Card") + " ending " + digits.slice(-4);
//         }
//         if (state.method === "netbanking") {
//             const chosen = root.querySelector('input[name="nb"]:checked');
//             return "Net banking · " + (chosen ? chosen.value : "");
//         }
//         if (state.method === "emi") return "No-cost EMI · " + $("emiBank").value + " · " + state.tenure + " months";
//         return "Cash on delivery";
//     }

//     function renderReview() {
//         const d = getDetails();
//         const t = totals();
//         const address = [d.address1, d.address2, d.landmark ? "Near " + d.landmark : "", d.city + ", " + d.state + " - " + d.pincode].filter(Boolean).map(esc).join("<br>");

//         $("coReview").innerHTML =
//             '<div class="co-review-block"><header><h4>Delivering to · ' + esc(d.type) + '</h4><button type="button" data-goto="2">EDIT</button></header>' +
//             "<p><strong>" + esc(d.name) + "</strong><br>" + address + "<br>+91 " + esc(d.phone) + " · " + esc(d.email) + "</p></div>" +
//             '<div class="co-review-block"><header><h4>Payment</h4><button type="button" data-goto="3">EDIT</button></header>' +
//             "<p>" + esc(paymentLabel()) + "</p></div>" +
//             '<div class="co-review-block"><header><h4>Items (' + t.count + ')</h4><button type="button" data-goto="1">EDIT</button></header>' +
//             cart.get().map(function (item) {
//                 return '<div class="co-review-row"><span>' + esc(item.name) + " × " + item.quantity + "</span><b>" + money(Number(item.price) * Number(item.quantity)) + "</b></div>";
//             }).join("") +
//             '<div class="co-review-row"><span>Estimated delivery</span><b>' + deliveryDate(4) + "</b></div></div>";
//     }

//     function updateSteps() {
//         root.querySelectorAll(".co-step").forEach(function (button) {
//             const n = Number(button.dataset.step);
//             button.classList.toggle("is-active", n === state.step);
//             button.classList.toggle("is-done", n < state.step);
//             if (n === state.step) button.setAttribute("aria-current", "step");
//             else button.removeAttribute("aria-current");
//         });
//     }

//     function updateBar() {
//         const bar = $("coBar");
//         const hasItems = cart.count() > 0;
//         bar.classList.toggle("is-visible", hasItems);

//         const primary = root.querySelector('.co-panel[data-panel="' + state.step + '"] [data-primary]');
//         $("coBarBtn").innerHTML = primary ? primary.innerHTML : "";
//     }

//     function showStep(n, animate) {
//         state.step = n;

//         root.querySelectorAll(".co-panel").forEach(function (panel) {
//             panel.hidden = Number(panel.dataset.panel) !== n;
//         });

//         if (n === 4) renderReview();

//         updateSteps();
//         updateBar();

//         const panel = root.querySelector('.co-panel[data-panel="' + n + '"]');

//         if (animate !== false) {
//             const top = $("coSteps").getBoundingClientRect().top + window.scrollY - 90;
//             window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });

//             if (hasGsap && !reduceMotion && panel) {
//                 gsap.fromTo(panel, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "all" });
//             }
//         }
//     }

//     function validateStep(n) {
//         if (n === 1) {
//             if (!cart.count()) {
//                 toast("Your cart is empty", "Add a product to continue.", "warn");
//                 return false;
//             }
//             return true;
//         }
//         if (n === 2) return validateDetails();
//         if (n === 3) return validatePayment();
//         return true;
//     }

//     function goTo(target) {
//         if (!cart.count()) return;

//         if (target <= state.step) {
//             showStep(target);
//             return;
//         }

//         for (let s = state.step; s < target; s++) {
//             if (!validateStep(s)) {
//                 if (s !== state.step) {
//                     showStep(s);
//                     validateStep(s);
//                 }
//                 return;
//             }
//         }

//         showStep(target);
//     }

//     function renderAll(animate) {
//         const count = cart.count();
//         const empty = count === 0;

//         root.classList.toggle("is-empty", empty);
//         $("coEmpty").hidden = !empty;

//         if (empty) {
//             state.step = 1;
//             state.coupon = null;
//             $("coBar").classList.remove("is-visible");
//             return;
//         }

//         renderList(animate);
//         renderSummary();
//         updateSteps();
//         updateBar();

//         if (state.step === 4) renderReview();
//     }

//     function removeItem(id, name) {
//         const card = $("coList").querySelector('[data-item="' + id + '"]');

//         const finish = function () {
//             cart.remove(id);
//             toast("Removed from cart", name + " was removed.", "info");
//         };

//         if (card && hasGsap && !reduceMotion) {
//             gsap.to(card, { x: -40, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: finish });
//         } else {
//             finish();
//         }
//     }

//     $("coList").addEventListener("click", function (event) {
//         const button = event.target.closest("[data-act]");

//         if (!button || button.disabled) return;

//         const id = button.dataset.id;
//         const item = cart.get().find(function (entry) { return String(entry.id) === String(id); });

//         if (!item) return;

//         const act = button.dataset.act;

//         if (act === "inc") {
//             if (item.quantity + 1 > item.stock) {
//                 toast("Stock limit reached", "Only " + item.stock + " units are available.", "warn");
//                 return;
//             }
//             cart.updateQuantity(id, item.quantity + 1);
//         } else if (act === "dec") {
//             if (item.quantity <= 1) removeItem(id, item.name);
//             else cart.updateQuantity(id, item.quantity - 1);
//         } else if (act === "remove") {
//             removeItem(id, item.name);
//         } else if (act === "wish") {
//             const list = getWishlist();
//             if (list.indexOf(item.id) === -1) list.push(item.id);
//             saveWishlist(list);
//             cart.remove(id);
//             toast("Saved for later", item.name + " is in your wishlist.", "heart");
//         }
//     });

//     $("coClear").addEventListener("click", function () {
//         if (!cart.count()) return;
//         if (window.confirm("Remove all items from your cart?")) {
//             cart.clear();
//             toast("Cart cleared", "All items were removed.", "info");
//         }
//     });

//     $("coSteps").addEventListener("click", function (event) {
//         const button = event.target.closest("[data-step]");
//         if (button) goTo(Number(button.dataset.step));
//     });

//     root.addEventListener("click", function (event) {
//         if (event.target.closest("[data-next]")) {
//             goTo(state.step + 1);
//             return;
//         }

//         if (event.target.closest("[data-back]")) {
//             showStep(Math.max(1, state.step - 1));
//             return;
//         }

//         if (event.target.closest("[data-place]")) {
//             placeOrder();
//             return;
//         }

//         const jump = event.target.closest("[data-goto]");
//         if (jump) {
//             showStep(Number(jump.dataset.goto));
//             return;
//         }

//         const suffix = event.target.closest("[data-suffix]");
//         if (suffix) {
//             const input = $("upiId");
//             const value = input.value.split("@")[0];
//             input.value = value + suffix.dataset.suffix;
//             input.focus();
//             setError(input, "");
//             return;
//         }

//         const chip = event.target.closest("[data-code]");
//         if (chip) {
//             applyCoupon(chip.dataset.code);
//             return;
//         }

//         if (event.target.closest("[data-remove-coupon]")) {
//             state.coupon = null;
//             renderSummary();
//             setCouponMessage("Coupon removed.", "", false);
//         }
//     });

//     $("coBarBtn").addEventListener("click", function () {
//         const primary = root.querySelector('.co-panel[data-panel="' + state.step + '"] [data-primary]');
//         if (primary) primary.click();
//     });

//     $("coCouponForm").addEventListener("submit", function (event) {
//         event.preventDefault();
//         applyCoupon($("coCouponInput").value);
//     });

//     root.addEventListener("change", function (event) {
//         const target = event.target;

//         if (target.name === "payMethod") {
//             state.method = target.value;
//             applyMethod();
//             renderSummary();
//         } else if (target.name === "tenure") {
//             state.tenure = Number(target.value);
//         } else if (target.name === "nb") {
//             $("nbError").classList.remove("is-visible");
//         } else if (target.id === "coTerms") {
//             $("termsError").classList.remove("is-visible");
//         }
//     });

//     states.forEach(function (name) {
//         const option = document.createElement("option");
//         option.value = name;
//         option.textContent = name;
//         $("fState").appendChild(option);
//     });

//     banks.forEach(function (name) {
//         const option = document.createElement("option");
//         option.value = name;
//         option.textContent = name;
//         $("emiBank").appendChild(option);
//     });

//     $("coBanks").innerHTML = banks.map(function (name) {
//         return '<label class="co-bank"><input type="radio" name="nb" value="' + name + '"><span><i class="fa-solid fa-building-columns"></i>' + name + "</span></label>";
//     }).join("");

//     Object.keys(rules).forEach(function (id) {
//         const input = $(id);
//         if (!input) return;
//         input.addEventListener("blur", function () {
//             if (input.value.trim() !== "" || input.closest(".co-field").classList.contains("is-invalid")) validateField(id);
//         });
//         input.addEventListener("input", function () {
//             if (input.closest(".co-field").classList.contains("is-invalid")) validateField(id);
//         });
//         input.addEventListener("change", function () {
//             if (input.tagName === "SELECT") validateField(id);
//         });
//     });

//     $("fPhone").addEventListener("input", function (event) {
//         event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
//     });

//     $("fPincode").addEventListener("input", function (event) {
//         event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
//         const hint = $("pinHint");
//         hint.textContent = /^[1-9]\d{5}$/.test(event.target.value) ? "Delivery available. Estimated by " + deliveryDate(4) : "";
//     });

//     $("cardNumber").addEventListener("input", function (event) {
//         const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
//         event.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
//         $("cardBrand").textContent = cardBrand(digits);
//     });

//     $("cardExpiry").addEventListener("input", function (event) {
//         let digits = event.target.value.replace(/\D/g, "").slice(0, 4);
//         if (digits.length === 1 && Number(digits) > 1) digits = "0" + digits;
//         event.target.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
//     });

//     $("cardCvv").addEventListener("input", function (event) {
//         event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
//     });

//     $("upiId").addEventListener("input", function (event) {
//         event.target.value = event.target.value.replace(/\s/g, "");
//     });

//     $("coDetailsForm").addEventListener("submit", function (event) {
//         event.preventDefault();
//         goTo(3);
//     });

//     function placeOrder() {
//         if (state.busy || !cart.count()) return;

//         if (!validateDetails()) {
//             showStep(2);
//             validateDetails();
//             return;
//         }

//         if (!validatePayment()) {
//             showStep(3);
//             validatePayment();
//             return;
//         }

//         if (!$("coTerms").checked) {
//             const line = $("termsError");
//             line.textContent = "Please accept the terms to place your order";
//             line.classList.add("is-visible");
//             return;
//         }

//         state.busy = true;

//         const orderId = "STK" + Date.now().toString().slice(-8) + Math.floor(10 + Math.random() * 90);
//         const overlay = $("coOverlay");
//         const bar = $("coOverlayBar");

//         $("coOverlayId").textContent = "ORDER ID · " + orderId;
//         $("coOverlayTitle").textContent = "Processing your order";
//         $("coOverlayText").textContent = "Verifying your details. Please do not refresh or close this page.";
//         bar.style.width = "12%";
//         overlay.hidden = false;
//         document.body.style.overflow = "hidden";

//         setTimeout(function () {
//             $("coOverlayText").textContent = state.method === "cod" ? "Confirming your cash on delivery order." : "Securing your payment with your bank.";
//             bar.style.width = "55%";
//         }, 900);

//         setTimeout(function () {
//             $("coOverlayText").textContent = "Confirming your order and reserving stock.";
//             bar.style.width = "85%";
//         }, 1900);

//         setTimeout(function () {
//             $("coOverlayTitle").textContent = "Order placed";
//             $("coOverlayText").textContent = "Thank you. Taking you to the next page.";
//             bar.style.width = "100%";
//             party(window.innerWidth / 2, window.innerHeight / 2, 1.2);
//         }, 2800);

//         setTimeout(function () {
//             cart.clear();
//             ["fName", "fPhone", "fEmail", "fAddr1", "fAddr2", "fLandmark", "fPincode", "fCity", "fState", "upiId", "cardNumber", "cardName", "cardExpiry", "cardCvv"].forEach(function (id) {
//                 $(id).value = "";
//             });
//             window.location.href = "error.html";
//         }, 3700);
//     }

//     window.addEventListener("stackly:cart-updated", function () { renderAll(false); });
//     window.addEventListener("pageshow", function () { renderAll(false); });

//     if (hasGsap && !reduceMotion && typeof ScrollTrigger !== "undefined") {
//         gsap.registerPlugin(ScrollTrigger);
//         gsap.from(".co-heading > *, .co-steps", {
//             y: 28,
//             opacity: 0,
//             duration: 0.7,
//             stagger: 0.08,
//             ease: "power3.out",
//             clearProps: "all",
//             scrollTrigger: { trigger: ".co-heading", start: "top 88%" }
//         });
//     }

//     applyMethod();
//     renderAll(true);
//     showStep(1, false);
// });
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

    const section = document.querySelector(".stackly-cart-hero");

    if (!section) return;

    if (section.dataset.initialized === "true") return;

    section.dataset.initialized = "true";

    const countElement = section.querySelector("#cartHeroCount");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function updateHeroCount() {
        if (!window.StacklyCart || !countElement) return;
        countElement.textContent = window.StacklyCart.count();
    }

    updateHeroCount();

    window.addEventListener("pageshow", updateHeroCount);

    window.addEventListener("stackly:cart-updated", updateHeroCount);

    window.addEventListener("storage", function (event) {
        if (event.key === "stacklyStoreCart" || event.key === null) {
            updateHeroCount();
        }
    });

    if (reducedMotion || typeof gsap === "undefined") return;

    const eyebrow = section.querySelector(".cart-hero-eyebrow");
    const breadcrumb = section.querySelector(".cart-hero-breadcrumb");
    const title = section.querySelector(".cart-hero-title");
    const description = section.querySelector(".cart-hero-description");
    const actions = section.querySelector(".cart-hero-actions");
    const information = section.querySelector(".cart-hero-information");
    const visual = section.querySelector(".cart-hero-visual");
    const bottom = section.querySelector(".cart-hero-bottom-line");

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set([eyebrow, breadcrumb, title, description, actions, information], { y: 30, autoAlpha: 0 });
    gsap.set(visual, { x: 45, autoAlpha: 0, scale: 0.94 });
    gsap.set(bottom, { y: 15, autoAlpha: 0 });

    timeline
        .to(eyebrow, { y: 0, autoAlpha: 1, duration: 0.6 })
        .to(breadcrumb, { y: 0, autoAlpha: 1, duration: 0.55 }, "-=0.35")
        .to(title, { y: 0, autoAlpha: 1, duration: 0.9 }, "-=0.3")
        .to(description, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.45")
        .to(actions, { y: 0, autoAlpha: 1, duration: 0.65 }, "-=0.35")
        .to(information, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.3")
        .to(visual, { x: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.85")
        .to(bottom, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.3");

    gsap.to(".cart-orbit-two", { rotation: 360, duration: 35, repeat: -1, ease: "none" });
    gsap.to(".cart-orbit-one", { scale: 1.1, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".cart-floating-card-top", { y: -7, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".cart-floating-card-bottom", { y: 7, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        const stage = section.querySelector(".cart-visual-stage");
        const circle = section.querySelector(".cart-visual-circle");

        stage.addEventListener("pointermove", function (event) {
            const rect = stage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(circle, { x: x * 12, y: y * 12, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        });

        stage.addEventListener("pointerleave", function () {
            gsap.to(circle, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        });

    }

});


document.addEventListener("DOMContentLoaded", function () {

    const root = document.getElementById("cartItems");

    if (!root || !window.StacklyCart) return;

    const cart = window.StacklyCart;
    const hasGsap = typeof gsap !== "undefined";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wishlistKey = "stacklyStoreWishlist";
    const palette = ["#9872B5", "#B49ACD", "#D3B16F", "#69BFC0", "#B35E83", "#4D9A75", "#FFFFFF"];

    const states = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
        "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
        "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal"
    ];

    const banks = [
        "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
        "Yes Bank", "Bank of Baroda", "IDFC FIRST Bank"
    ];

    const coupons = {
        STACKLY10: { type: "percent", value: 10, max: 15000, min: 50000, label: "10% off up to ₹15,000" },
        WELCOME5: { type: "percent", value: 5, max: 8000, min: 0, label: "5% off up to ₹8,000" },
        MEGA2000: { type: "flat", value: 2000, max: 2000, min: 100000, label: "₹2,000 off above ₹1,00,000" }
    };

    const COD_FEE = 99;
    const COD_LIMIT = 100000;
    const tenures = [3, 6, 9, 12];

    const state = { step: 1, coupon: null, method: "upi", tenure: 6, busy: false };

    const $ = function (id) { return document.getElementById(id); };
    const money = cart.formatPrice;

    const rules = {
        fName: function (v) { return /^[A-Za-z][A-Za-z .'-]{2,59}$/.test(v) ? "" : "Enter your full name (letters only, at least 3 characters)"; },
        fPhone: function (v) { return /^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number"; },
        fEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address"; },
        fAddr1: function (v) { return v.length >= 8 ? "" : "Enter your house number, building and street"; },
        fPincode: function (v) { return /^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit pincode"; },
        fCity: function (v) { return /^[A-Za-z][A-Za-z .'-]{1,}$/.test(v) ? "" : "Enter your city"; },
        fState: function (v) { return v ? "" : "Select your state"; },
        upiId: function (v) { return /^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(v) ? "" : "Enter a valid UPI ID, for example name@okaxis"; },
        cardNumber: function (v) {
            const d = v.replace(/\s/g, "");
            return /^\d{13,19}$/.test(d) && luhn(d) ? "" : "Enter a valid card number";
        },
        cardName: function (v) { return /^[A-Za-z][A-Za-z .'-]{2,}$/.test(v) ? "" : "Enter the name printed on your card"; },
        cardExpiry: function (v) { return validExpiry(v) ? "" : "Enter a valid expiry date (MM/YY)"; },
        cardCvv: function (v) { return /^\d{3,4}$/.test(v) ? "" : "Enter the 3 or 4 digit CVV"; },
        emiBank: function (v) { return v ? "" : "Select your card bank"; }
    };

    const detailIds = ["fName", "fPhone", "fEmail", "fAddr1", "fPincode", "fCity", "fState"];

    function luhn(number) {
        let sum = 0;
        let alt = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = Number(number[i]);
            if (alt) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            alt = !alt;
        }
        return sum % 10 === 0;
    }

    function validExpiry(value) {
        const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
        if (!match) return false;
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const now = new Date();
        const end = new Date(year, month, 0, 23, 59, 59);
        return end >= now && year <= now.getFullYear() + 20;
    }

    function cardBrand(digits) {
        if (/^4/.test(digits)) return "VISA";
        if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
        if (/^3[47]/.test(digits)) return "AMEX";
        if (/^(60|65|81|82|508)/.test(digits)) return "RUPAY";
        return "";
    }

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    function deliveryDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    }

    let toastTimer;

    function toast(title, message, type) {
        const box = $("coToast");
        const icons = { success: "fa-check", info: "fa-minus", warn: "fa-triangle-exclamation", heart: "fa-heart" };

        $("coToastTitle").textContent = title;
        $("coToastMessage").textContent = message || "";
        $("coToastIcon").className = "fa-solid " + (icons[type] || icons.success);
        box.className = "co-toast is-visible toast-" + (type || "success");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            box.classList.remove("is-visible");
        }, 2800);
    }

    function party(x, y, power) {
        if (typeof confetti !== "function" || reduceMotion) return;
        const origin = { x: x / window.innerWidth, y: y / window.innerHeight };
        const base = { origin: origin, colors: palette, zIndex: 6000, ticks: 200, gravity: 1.05, disableForReducedMotion: true };
        confetti(Object.assign({}, base, { particleCount: Math.round(60 * power), spread: 80, startVelocity: 40 }));
        confetti(Object.assign({}, base, { particleCount: Math.round(30 * power), spread: 120, startVelocity: 26, scalar: 0.8, shapes: ["circle"] }));
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

    function totals() {
        const items = cart.get();
        const subtotal = cart.subtotal();
        const mrp = items.reduce(function (sum, item) {
            return sum + Math.max(Number(item.oldPrice || 0), Number(item.price)) * Number(item.quantity);
        }, 0);
        const productDiscount = Math.max(0, mrp - subtotal);
        let couponDiscount = 0;

        if (state.coupon) {
            const coupon = coupons[state.coupon];
            if (coupon && subtotal >= coupon.min) {
                couponDiscount = coupon.type === "percent"
                    ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.max)
                    : coupon.value;
            } else {
                state.coupon = null;
            }
        }

        const payable = subtotal - couponDiscount;
        const codFee = state.method === "cod" ? COD_FEE : 0;
        const total = payable + codFee;
        const gst = Math.round(payable * 18 / 118);

        return {
            count: cart.count(),
            subtotal: subtotal,
            mrp: mrp,
            productDiscount: productDiscount,
            couponDiscount: couponDiscount,
            payable: payable,
            codFee: codFee,
            total: total,
            gst: gst
        };
    }

    function itemHTML(item) {
        const qty = Number(item.quantity);
        const price = Number(item.price);
        const old = Number(item.oldPrice || 0);
        const stock = Number(item.stock || 0);
        const off = old > price ? Math.round((1 - price / old) * 100) : 0;
        const icon = String(item.id).indexOf("LP") === 0 ? "fa-laptop" : "fa-computer";
        const id = esc(item.id);
        const stockLine = stock <= 3
            ? '<span class="co-stock low"><i class="fa-solid fa-fire"></i>Only ' + stock + " left in stock</span>"
            : '<span class="co-stock"><i class="fa-solid fa-circle-check"></i>In stock</span>';

        return '<article class="co-item" data-item="' + id + '">' +
            '<div class="co-item-img"><img src="' + esc(item.image) + '" alt="' + esc(item.name) + '" loading="lazy">' +
            '<div class="co-fallback"><i class="fa-solid ' + icon + '"></i><span>STACKLY</span></div></div>' +
            '<div class="co-item-body">' +
            '<span class="co-item-cat">' + esc(String(item.category || "").toUpperCase()) + " SERIES</span>" +
            '<h4 class="co-item-name">' + esc(item.name) + "</h4>" +
            '<div class="co-item-specs">' + (item.specs || []).map(function (spec) { return "<span>" + esc(spec) + "</span>"; }).join("") + "</div>" +
            stockLine +
            '<span class="co-delivery"><i class="fa-solid fa-truck-fast"></i>Free delivery by ' + deliveryDate(4) + "</span>" +
            '<div class="co-item-actions">' +
            '<button type="button" data-act="wish" data-id="' + id + '"><i class="fa-regular fa-heart"></i>Save for later</button>' +
            '<button type="button" data-act="remove" data-id="' + id + '"><i class="fa-regular fa-trash-can"></i>Remove</button>' +
            "</div></div>" +
            '<div class="co-item-side">' +
            '<div class="co-price"><strong>' + money(price) + "</strong>" +
            (old > price ? "<s>" + money(old) + "</s><em>" + off + "% off</em>" : "") + "</div>" +
            '<div class="co-qty" role="group" aria-label="Quantity">' +
            '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease quantity"><i class="fa-solid fa-' + (qty === 1 ? "trash-can" : "minus") + '"></i></button>' +
            "<strong>" + qty + "</strong>" +
            '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase quantity"' + (qty >= stock ? " disabled" : "") + '><i class="fa-solid fa-plus"></i></button></div>' +
            '<div class="co-line-total">Item total<b>' + money(price * qty) + "</b></div>" +
            "</div></article>";
    }

    function bindImages(container) {
        container.querySelectorAll("img").forEach(function (img) {
            const markMissing = function () {
                if (img.parentElement) img.parentElement.classList.add("image-missing");
            };
            img.addEventListener("error", markMissing, { once: true });
            if (img.complete && img.naturalWidth === 0) markMissing();
        });
    }

    function renderList(animate) {
        const items = cart.get();
        const count = cart.count();

        $("coItemCount").textContent = count + (count === 1 ? " item" : " items");
        $("coList").innerHTML = items.map(itemHTML).join("");
        bindImages($("coList"));

        if (animate && hasGsap && !reduceMotion && items.length) {
            gsap.from("#coList .co-item", { y: 24, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", clearProps: "all" });
        }
    }

    function renderMini() {
        $("coMini").innerHTML = cart.get().map(function (item) {
            return '<div class="co-mini-item"><div class="co-mini-img"><img src="' + esc(item.image) + '" alt=""><b>' + item.quantity + "</b></div>" +
                '<span class="co-mini-name">' + esc(item.name) + "</span>" +
                '<span class="co-mini-price">' + money(Number(item.price) * Number(item.quantity)) + "</span></div>";
        }).join("");
    }

    function renderCouponChips() {
        const subtotal = cart.subtotal();
        $("coCouponChips").innerHTML = Object.keys(coupons).map(function (code) {
            const coupon = coupons[code];
            const applied = state.coupon === code;
            return '<button type="button" data-code="' + code + '" class="' + (applied ? "is-applied" : "") + '" title="' + esc(coupon.label) + '"' +
                (subtotal < coupon.min ? ' style="opacity:.55"' : "") + ">" + code + "</button>";
        }).join("");
    }

    function renderTenures(t) {
        const base = t.payable;
        $("coTenures").innerHTML = tenures.map(function (months) {
            return '<label class="co-tenure"><input type="radio" name="tenure" value="' + months + '"' + (state.tenure === months ? " checked" : "") + ">" +
                "<span><strong>" + months + " months</strong><small>" + money(Math.round(base / months)) + "/month</small></span></label>";
        }).join("");
    }

    function renderSummary() {
        const t = totals();
        const rows = [];

        rows.push(["Price (" + t.count + " item" + (t.count === 1 ? "" : "s") + ")", money(t.mrp), ""]);
        if (t.productDiscount) rows.push(["Product discount", "− " + money(t.productDiscount), "is-green"]);
        if (t.couponDiscount) rows.push(["Coupon (" + state.coupon + ")", "− " + money(t.couponDiscount), "is-green"]);
        rows.push(["Delivery charges", "FREE", "is-green"]);
        if (t.codFee) rows.push(["COD handling fee", money(t.codFee), ""]);
        rows.push(["Includes GST (18%)", money(t.gst), "is-muted"]);

        $("coLines").innerHTML = rows.map(function (row) {
            return '<div class="' + row[2] + '"><dt>' + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
        }).join("");

        $("coTotal").textContent = money(t.total);
        $("coBarTotal").textContent = money(t.total);

        const saved = t.productDiscount + t.couponDiscount;
        $("coSave").textContent = saved > 0 ? "You will save " + money(saved) + " on this order" : "";
        $("coEmiHint").textContent = t.payable > 0 ? "No-cost EMI from " + money(Math.round(t.payable / 12)) + "/month" : "";
        $("coPlaceLabel").textContent = "Place order · " + money(t.total);

        renderMini();
        renderCouponChips();
        renderTenures(t);

        const codBlocked = t.subtotal > COD_LIMIT;
        const codBox = $("codMethod");
        const codInput = codBox.querySelector("input");

        codBox.classList.toggle("is-disabled", codBlocked);
        codInput.disabled = codBlocked;
        $("codNote").textContent = codBlocked
            ? "Not available for orders above ₹1,00,000"
            : "Pay when your order arrives. A ₹99 handling fee applies.";

        if (codBlocked && state.method === "cod") {
            state.method = "upi";
            root.querySelector('input[name="payMethod"][value="upi"]').checked = true;
            applyMethod();
            renderSummary();
        }
    }

    function applyMethod() {
        root.querySelectorAll(".co-method").forEach(function (box) {
            const on = box.dataset.method === state.method;
            box.classList.toggle("is-selected", on);
            const body = box.querySelector(".co-method-body");
            if (body) body.hidden = !on;
        });
    }

    function setCouponMessage(text, kind, withRemove) {
        const box = $("coCouponMsg");
        box.className = "co-coupon-msg" + (kind ? " " + kind : "");
        box.innerHTML = esc(text) + (withRemove ? '<button type="button" data-remove-coupon>Remove</button>' : "");
    }

    function applyCoupon(raw) {
        const code = String(raw || "").trim().toUpperCase();
        const coupon = coupons[code];
        const subtotal = cart.subtotal();

        if (!code) {
            setCouponMessage("Enter a coupon code to apply.", "bad");
            return;
        }

        if (!coupon) {
            setCouponMessage("This coupon code is not valid.", "bad");
            return;
        }

        if (subtotal < coupon.min) {
            setCouponMessage("Add " + money(coupon.min - subtotal) + " more to use " + code + ".", "bad");
            return;
        }

        state.coupon = code;
        $("coCouponInput").value = "";
        renderSummary();
        const t = totals();
        setCouponMessage(code + " applied. You saved " + money(t.couponDiscount) + ".", "ok", true);
        toast("Coupon applied", code + " saved you " + money(t.couponDiscount) + ".", "success");
    }

    function setError(input, message) {
        const wrap = input.closest(".co-field");
        if (!wrap) return !message;
        wrap.classList.toggle("is-invalid", !!message);
        const slot = wrap.querySelector(".co-error");
        if (slot) slot.textContent = message;
        return !message;
    }

    function validateField(id) {
        const input = $(id);
        return setError(input, rules[id](input.value.trim()));
    }

    function focusFirstInvalid() {
        const bad = root.querySelector(".co-field.is-invalid input, .co-field.is-invalid select");
        if (bad) bad.focus();
    }

    function validateDetails() {
        let ok = true;
        detailIds.forEach(function (id) {
            if (!validateField(id)) ok = false;
        });
        if (!ok) focusFirstInvalid();
        return ok;
    }

    function validatePayment() {
        let ok = true;
        if (state.method === "upi") {
            ok = validateField("upiId");
        } else if (state.method === "card") {
            ["cardNumber", "cardName", "cardExpiry", "cardCvv"].forEach(function (id) {
                if (!validateField(id)) ok = false;
            });
        } else if (state.method === "netbanking") {
            const chosen = root.querySelector('input[name="nb"]:checked');
            const line = $("nbError");
            line.textContent = chosen ? "" : "Select your bank to continue";
            line.classList.toggle("is-visible", !chosen);
            ok = !!chosen;
        } else if (state.method === "emi") {
            ok = validateField("emiBank");
        }
        if (!ok) focusFirstInvalid();
        return ok;
    }

    function getDetails() {
        const type = root.querySelector('input[name="addrType"]:checked');
        return {
            name: $("fName").value.trim(),
            phone: $("fPhone").value.trim(),
            email: $("fEmail").value.trim(),
            address1: $("fAddr1").value.trim(),
            address2: $("fAddr2").value.trim(),
            landmark: $("fLandmark").value.trim(),
            pincode: $("fPincode").value.trim(),
            city: $("fCity").value.trim(),
            state: $("fState").value,
            type: type ? type.value : "Home"
        };
    }

    function paymentLabel() {
        if (state.method === "upi") return "UPI · " + $("upiId").value.trim();
        if (state.method === "card") {
            const digits = $("cardNumber").value.replace(/\s/g, "");
            const brand = cardBrand(digits);
            return (brand ? brand + " card" : "Card") + " ending " + digits.slice(-4);
        }
        if (state.method === "netbanking") {
            const chosen = root.querySelector('input[name="nb"]:checked');
            return "Net banking · " + (chosen ? chosen.value : "");
        }
        if (state.method === "emi") return "No-cost EMI · " + $("emiBank").value + " · " + state.tenure + " months";
        return "Cash on delivery";
    }

    function renderReview() {
        const d = getDetails();
        const t = totals();
        const address = [d.address1, d.address2, d.landmark ? "Near " + d.landmark : "", d.city + ", " + d.state + " - " + d.pincode].filter(Boolean).map(esc).join("<br>");

        $("coReview").innerHTML =
            '<div class="co-review-block"><header><h4>Delivering to · ' + esc(d.type) + '</h4><button type="button" data-goto="2">EDIT</button></header>' +
            "<p><strong>" + esc(d.name) + "</strong><br>" + address + "<br>+91 " + esc(d.phone) + " · " + esc(d.email) + "</p></div>" +
            '<div class="co-review-block"><header><h4>Payment</h4><button type="button" data-goto="3">EDIT</button></header>' +
            "<p>" + esc(paymentLabel()) + "</p></div>" +
            '<div class="co-review-block"><header><h4>Items (' + t.count + ')</h4><button type="button" data-goto="1">EDIT</button></header>' +
            cart.get().map(function (item) {
                return '<div class="co-review-row"><span>' + esc(item.name) + " × " + item.quantity + "</span><b>" + money(Number(item.price) * Number(item.quantity)) + "</b></div>";
            }).join("") +
            '<div class="co-review-row"><span>Estimated delivery</span><b>' + deliveryDate(4) + "</b></div></div>";
    }

    function updateSteps() {
        root.querySelectorAll(".co-step").forEach(function (button) {
            const n = Number(button.dataset.step);
            button.classList.toggle("is-active", n === state.step);
            button.classList.toggle("is-done", n < state.step);
            if (n === state.step) button.setAttribute("aria-current", "step");
            else button.removeAttribute("aria-current");
        });
    }

    function updateBar() {
        const bar = $("coBar");
        const hasItems = cart.count() > 0;
        bar.classList.toggle("is-visible", hasItems);

        const primary = root.querySelector('.co-panel[data-panel="' + state.step + '"] [data-primary]');
        $("coBarBtn").innerHTML = primary ? primary.innerHTML : "";
    }

    function showStep(n, animate) {
        state.step = n;

        root.querySelectorAll(".co-panel").forEach(function (panel) {
            panel.hidden = Number(panel.dataset.panel) !== n;
        });

        if (n === 4) renderReview();

        updateSteps();
        updateBar();

        const panel = root.querySelector('.co-panel[data-panel="' + n + '"]');

        if (animate !== false) {
            const top = $("coSteps").getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });

            if (hasGsap && !reduceMotion && panel) {
                gsap.fromTo(panel, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "all" });
            }
        }
    }

    function validateStep(n) {
        if (n === 1) {
            if (!cart.count()) {
                toast("Your cart is empty", "Add a product to continue.", "warn");
                return false;
            }
            return true;
        }
        if (n === 2) return validateDetails();
        if (n === 3) return validatePayment();
        return true;
    }

    function goTo(target) {
        if (!cart.count()) return;

        if (target <= state.step) {
            showStep(target);
            return;
        }

        for (let s = state.step; s < target; s++) {
            if (!validateStep(s)) {
                if (s !== state.step) {
                    showStep(s);
                    validateStep(s);
                }
                return;
            }
        }

        showStep(target);
    }

    function renderAll(animate) {
        const count = cart.count();
        const empty = count === 0;

        root.classList.toggle("is-empty", empty);
        $("coEmpty").hidden = !empty;

        if (empty) {
            state.step = 1;
            state.coupon = null;
            $("coBar").classList.remove("is-visible");
            return;
        }

        renderList(animate);
        renderSummary();
        updateSteps();
        updateBar();

        if (state.step === 4) renderReview();
    }

    function removeItem(id, name) {
        const card = $("coList").querySelector('[data-item="' + id + '"]');

        const finish = function () {
            cart.remove(id);
            toast("Removed from cart", name + " was removed.", "info");
        };

        if (card && hasGsap && !reduceMotion) {
            gsap.to(card, { x: -40, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: finish });
        } else {
            finish();
        }
    }

    $("coList").addEventListener("click", function (event) {
        const button = event.target.closest("[data-act]");

        if (!button || button.disabled) return;

        const id = button.dataset.id;
        const item = cart.get().find(function (entry) { return String(entry.id) === String(id); });

        if (!item) return;

        const act = button.dataset.act;

        if (act === "inc") {
            if (item.quantity + 1 > item.stock) {
                toast("Stock limit reached", "Only " + item.stock + " units are available.", "warn");
                return;
            }
            cart.updateQuantity(id, item.quantity + 1);
        } else if (act === "dec") {
            if (item.quantity <= 1) removeItem(id, item.name);
            else cart.updateQuantity(id, item.quantity - 1);
        } else if (act === "remove") {
            removeItem(id, item.name);
        } else if (act === "wish") {
            const list = getWishlist();
            if (list.indexOf(item.id) === -1) list.push(item.id);
            saveWishlist(list);
            cart.remove(id);
            toast("Saved for later", item.name + " is in your wishlist.", "heart");
        }
    });

    $("coClear").addEventListener("click", function () {
        if (!cart.count()) return;
        if (window.confirm("Remove all items from your cart?")) {
            cart.clear();
            toast("Cart cleared", "All items were removed.", "info");
        }
    });

    $("coSteps").addEventListener("click", function (event) {
        const button = event.target.closest("[data-step]");
        if (button) goTo(Number(button.dataset.step));
    });

    root.addEventListener("click", function (event) {
        if (event.target.closest("[data-next]")) {
            goTo(state.step + 1);
            return;
        }

        if (event.target.closest("[data-back]")) {
            showStep(Math.max(1, state.step - 1));
            return;
        }

        if (event.target.closest("[data-place]")) {
            placeOrder();
            return;
        }

        const jump = event.target.closest("[data-goto]");
        if (jump) {
            showStep(Number(jump.dataset.goto));
            return;
        }

        const suffix = event.target.closest("[data-suffix]");
        if (suffix) {
            const input = $("upiId");
            const value = input.value.split("@")[0];
            input.value = value + suffix.dataset.suffix;
            input.focus();
            setError(input, "");
            return;
        }

        const chip = event.target.closest("[data-code]");
        if (chip) {
            applyCoupon(chip.dataset.code);
            return;
        }

        if (event.target.closest("[data-remove-coupon]")) {
            state.coupon = null;
            renderSummary();
            setCouponMessage("Coupon removed.", "", false);
        }
    });

    $("coBarBtn").addEventListener("click", function () {
        const primary = root.querySelector('.co-panel[data-panel="' + state.step + '"] [data-primary]');
        if (primary) primary.click();
    });

    $("coCouponForm").addEventListener("submit", function (event) {
        event.preventDefault();
        applyCoupon($("coCouponInput").value);
    });

    root.addEventListener("change", function (event) {
        const target = event.target;

        if (target.name === "payMethod") {
            state.method = target.value;
            applyMethod();
            renderSummary();
        } else if (target.name === "tenure") {
            state.tenure = Number(target.value);
        } else if (target.name === "nb") {
            $("nbError").classList.remove("is-visible");
        } else if (target.id === "coTerms") {
            $("termsError").classList.remove("is-visible");
        }
    });

    states.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        $("fState").appendChild(option);
    });

    banks.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        $("emiBank").appendChild(option);
    });

    $("coBanks").innerHTML = banks.map(function (name) {
        return '<label class="co-bank"><input type="radio" name="nb" value="' + name + '"><span><i class="fa-solid fa-building-columns"></i>' + name + "</span></label>";
    }).join("");

    Object.keys(rules).forEach(function (id) {
        const input = $(id);
        if (!input) return;
        input.addEventListener("blur", function () {
            if (input.value.trim() !== "" || input.closest(".co-field").classList.contains("is-invalid")) validateField(id);
        });
        input.addEventListener("input", function () {
            if (input.closest(".co-field").classList.contains("is-invalid")) validateField(id);
        });
        input.addEventListener("change", function () {
            if (input.tagName === "SELECT") validateField(id);
        });
    });

    $("fPhone").addEventListener("input", function (event) {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
    });

    $("fPincode").addEventListener("input", function (event) {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
        const hint = $("pinHint");
        hint.textContent = /^[1-9]\d{5}$/.test(event.target.value) ? "Delivery available. Estimated by " + deliveryDate(4) : "";
    });

    $("cardNumber").addEventListener("input", function (event) {
        const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
        event.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
        $("cardBrand").textContent = cardBrand(digits);
    });

    $("cardExpiry").addEventListener("input", function (event) {
        let digits = event.target.value.replace(/\D/g, "").slice(0, 4);
        if (digits.length === 1 && Number(digits) > 1) digits = "0" + digits;
        event.target.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
    });

    $("cardCvv").addEventListener("input", function (event) {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
    });

    $("upiId").addEventListener("input", function (event) {
        event.target.value = event.target.value.replace(/\s/g, "");
    });

    $("coDetailsForm").addEventListener("submit", function (event) {
        event.preventDefault();
        goTo(3);
    });

    function placeOrder() {
        if (state.busy || !cart.count()) return;

        if (!validateDetails()) {
            showStep(2);
            validateDetails();
            return;
        }

        if (!validatePayment()) {
            showStep(3);
            validatePayment();
            return;
        }

        if (!$("coTerms").checked) {
            const line = $("termsError");
            line.textContent = "Please accept the terms to place your order";
            line.classList.add("is-visible");
            return;
        }

        state.busy = true;

        const orderId = "STK" + Date.now().toString().slice(-8) + Math.floor(10 + Math.random() * 90);
        const overlay = $("coOverlay");
        const bar = $("coOverlayBar");

        $("coOverlayId").textContent = "ORDER ID · " + orderId;
        $("coOverlayTitle").textContent = "Processing your order";
        $("coOverlayText").textContent = "Verifying your details. Please do not refresh or close this page.";
        bar.style.width = "12%";
        overlay.hidden = false;
        document.body.style.overflow = "hidden";

        setTimeout(function () {
            $("coOverlayText").textContent = state.method === "cod" ? "Confirming your cash on delivery order." : "Securing your payment with your bank.";
            bar.style.width = "55%";
        }, 900);

        setTimeout(function () {
            $("coOverlayText").textContent = "Confirming your order and reserving stock.";
            bar.style.width = "85%";
        }, 1900);

        setTimeout(function () {
            $("coOverlayTitle").textContent = "Order placed";
            $("coOverlayText").textContent = "Thank you. Taking you to the next page.";
            bar.style.width = "100%";
            party(window.innerWidth / 2, window.innerHeight / 2, 1.2);
        }, 2800);

        setTimeout(function () {
            cart.clear();
            ["fName", "fPhone", "fEmail", "fAddr1", "fAddr2", "fLandmark", "fPincode", "fCity", "fState", "upiId", "cardNumber", "cardName", "cardExpiry", "cardCvv"].forEach(function (id) {
                $(id).value = "";
            });
            window.location.href = "error.html";
        }, 3700);
    }

    window.addEventListener("stackly:cart-updated", function () { renderAll(false); });
    function resetOverlay() {
        state.busy = false;
        $("coOverlay").hidden = true;
        $("coOverlayBar").style.width = "0";
        $("coOverlayTitle").textContent = "Processing your order";
        $("coOverlayText").textContent = "Please do not refresh or close this page.";
        $("coOverlayId").textContent = "";
        document.body.style.overflow = "";
    }

    window.addEventListener("pageshow", function () {
        resetOverlay();
        state.step = 1;
        state.coupon = null;
        $("coTerms").checked = false;
        renderAll(false);
        showStep(1, false);
    });

    if (hasGsap && !reduceMotion && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from(".co-heading > *, .co-steps", {
            y: 28,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: ".co-heading", start: "top 88%" }
        });
    }

    applyMethod();
    renderAll(true);
    showStep(1, false);
});