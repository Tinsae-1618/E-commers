/* =====================================================
   MARKETFLOW - COMPLETE E-COMMERCE & ESCROW ENGINE
   ===================================================== */

/* -----------------------------------------------------
   1. DEFAULT PRODUCTS DATABASE
----------------------------------------------------- */
const defaultProducts = [
    {
        id: 1,
        name: "Nova Wireless Headphones",
        category: "electronics",
        price: 89.99,
        seller: "NovaTech",
        rating: 4.8,
        reviews: 124,
        verified: true,
        fairPrice: true,
        emoji: "🎧",
        badge: "BEST SELLER",
        date: 5,
        stock: 45,
        description: "High-fidelity wireless sound with active noise cancellation and 30-hour battery life.",
        specs: ["Bluetooth 5.3", "ANC Technology", "USB-C Fast Charging", "Foldable Design"],
        reviewList: [
            { user: "Abebe K.", rating: 5, comment: "Amazing sound quality and fast shipping!" },
            { user: "Sara T.", rating: 4, comment: "Very comfortable for long work hours." }
        ]
    },
    {
        id: 2,
        name: "Urban Classic Sneakers",
        category: "fashion",
        price: 74.99,
        seller: "UrbanStep",
        rating: 4.6,
        reviews: 87,
        verified: true,
        fairPrice: true,
        emoji: "👟",
        badge: "POPULAR",
        date: 10,
        stock: 28,
        description: "Breathable, lightweight footwear engineered for daily urban commutes and street style.",
        specs: ["Memory Foam Insole", "Rubber Outsole", "Breathable Mesh Upper"],
        reviewList: [
            { user: "Yonas M.", rating: 5, comment: "Fits perfectly and looks super stylish." }
        ]
    },
    {
        id: 3,
        name: "Smart Home Hub",
        category: "electronics",
        price: 129.99,
        seller: "HomeTech",
        rating: 4.7,
        reviews: 63,
        verified: true,
        fairPrice: false,
        emoji: "🏠",
        badge: "NEW",
        date: 1,
        stock: 15,
        description: "Centralized smart automation hub with voice control and multi-device connectivity.",
        specs: ["Zigbee & Z-Wave", "Voice Assistant Compatible", "AES-128 Encryption"],
        reviewList: []
    },
    {
        id: 4,
        name: "Premium Coffee Beans",
        category: "food",
        price: 24.99,
        seller: "Mountain Coffee",
        rating: 4.9,
        reviews: 215,
        verified: true,
        fairPrice: true,
        emoji: "☕",
        badge: "TOP RATED",
        date: 3,
        stock: 120,
        description: "Single-origin organic Arabica beans roasted locally for rich aroma and smooth finish.",
        specs: ["100% Arabica", "Medium Dark Roast", "Ethically Sourced"],
        reviewList: [
            { user: "Dawit G.", rating: 5, comment: "Best coffee beans I have purchased online." }
        ]
    },
    {
        id: 5,
        name: "Minimalist Backpack",
        category: "fashion",
        price: 54.99,
        seller: "TravelCraft",
        rating: 4.5,
        reviews: 46,
        verified: false,
        fairPrice: true,
        emoji: "🎒",
        badge: "",
        date: 20,
        stock: 35,
        description: "Water-resistant commuter backpack with padded laptop compartment and hidden pockets.",
        specs: ["Fits 15.6 inch Laptop", "Water Resistant Fabric", "Anti-theft Pocket"],
        reviewList: []
    },
    {
        id: 6,
        name: "Fitness Smart Watch",
        category: "sports",
        price: 109.99,
        seller: "FitLife",
        rating: 4.4,
        reviews: 98,
        verified: true,
        fairPrice: true,
        emoji: "⌚",
        badge: "DEAL",
        date: 8,
        stock: 22,
        description: "Tracks heart rate, sleep quality, workout metrics, and smartphone notifications.",
        specs: ["SpO2 Sensor", "5 ATM Water Resistance", "7-Day Battery Life"],
        reviewList: []
    },
    {
        id: 7,
        name: "Organic Skin Care Set",
        category: "beauty",
        price: 39.99,
        seller: "PureSkin",
        rating: 4.8,
        reviews: 72,
        verified: true,
        fairPrice: true,
        emoji: "🧴",
        badge: "ORGANIC",
        date: 6,
        stock: 50,
        description: "All-natural botanical skincare cleanser, toner, and moisturizer kit.",
        specs: ["Dermatologist Tested", "100% Vegan", "Cruelty Free"],
        reviewList: []
    },
    {
        id: 8,
        name: "Modern Desk Lamp",
        category: "home",
        price: 45.99,
        seller: "BrightHome",
        rating: 4.3,
        reviews: 39,
        verified: false,
        fairPrice: true,
        emoji: "💡",
        badge: "",
        date: 15,
        stock: 19,
        description: "Adjustable LED desk lamp with touch dimming control and wireless phone charging pad.",
        specs: ["5 Color Modes", "Wireless Charging", "Auto Shut-off Timer"],
        reviewList: []
    }
];

/* -----------------------------------------------------
   2. APPLICATION STATE & PERSISTENCE
----------------------------------------------------- */
let customProducts = JSON.parse(localStorage.getItem("marketflow_custom_products")) || [];
let cart = JSON.parse(localStorage.getItem("marketflow_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("marketflow_wishlist")) || [];
let users = JSON.parse(localStorage.getItem("marketflow_users")) || [];
let currentUser = JSON.parse(localStorage.getItem("marketflow_current_user")) || null;
let orders = JSON.parse(localStorage.getItem("marketflow_orders")) || [];

function getAllProducts() {
    return [...defaultProducts, ...customProducts];
}

/* -----------------------------------------------------
   3. DOM ELEMENT REFERENCES
----------------------------------------------------- */
const productsGrid = document.getElementById("productsGrid");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const verifiedFilter = document.getElementById("verifiedFilter");
const fairPriceFilter = document.getElementById("fairPriceFilter");
const sortProducts = document.getElementById("sortProducts");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");

/* -----------------------------------------------------
   4. WALLET & USER STATE HELPERS
----------------------------------------------------- */
function ensureWallet(user) {
    if (!user) return null;
    if (!user.wallet) {
        user.wallet = {
            balance: 2500.00,       // Initial test balance in ETB
            frozenBalance: 0.00     // Balance frozen in active escrow orders
        };
    }
    return user;
}

function saveUserData() {
    if (!currentUser) return;
    
    currentUser = ensureWallet(currentUser);
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
        users[index] = currentUser;
    } else {
        users.push(currentUser);
    }
    
    localStorage.setItem("marketflow_users", JSON.stringify(users));
    localStorage.setItem("marketflow_current_user", JSON.stringify(currentUser));
}

function depositToWallet(amount) {
    if (!currentUser) {
        openLogin();
        return;
    }
    currentUser = ensureWallet(currentUser);
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
        showNotification("Please enter a valid deposit amount.", "error");
        return;
    }

    currentUser.wallet.balance += depositAmount;
    saveUserData();
    
    showNotification(`Successfully deposited ${depositAmount.toFixed(2)} ETB into your wallet!`, "success");
    openAccount();
}

/* -----------------------------------------------------
   5. CATALOG & PRODUCT RENDERING
----------------------------------------------------- */
function renderProducts(list = getAllProducts()) {
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    if (productCount) {
        productCount.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
    }

    if (list.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-products" style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">No products found</h3>
                <p style="color: #6b7280; max-width: 400px; margin: 0 auto 20px;">
                    We couldn't find anything matching your filters or search query.
                </p>
                <button class="modal-submit" style="width: auto; padding: 10px 20px;" onclick="resetFilters()">
                    Reset All Filters
                </button>
            </div>
        `;
        return;
    }

    list.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image" onclick="openProductDetails(${product.id})" style="cursor: pointer;">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                <button
                    class="wishlist ${isWishlisted ? "active" : ""}"
                    onclick="event.stopPropagation(); toggleWishlist(${product.id})"
                    aria-label="Toggle Wishlist"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>
                <span class="product-emoji" style="font-size: 64px; display: block; text-align: center; padding: 20px 0;">
                    ${product.emoji || "📦"}
                </span>
            </div>

            <div class="product-info">
                <div class="product-category" style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #635bff; letter-spacing: 0.5px;">
                    ${product.category}
                </div>

                <div class="product-name" onclick="openProductDetails(${product.id})" style="cursor: pointer; font-weight: 600; margin: 4px 0 8px;">
                    ${product.name}
                </div>

                <div class="product-seller" style="font-size: 13px; color: #6b7280; margin-bottom: 12px;">
                    Merchant: <strong>${product.seller}</strong>
                    ${product.verified ? ' <span style="color: #10b981; font-weight: bold;" title="Verified Merchant">✓ Verified</span>' : ""}
                </div>

                <div class="product-bottom" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <div>
                        <div class="product-price" style="font-size: 18px; font-weight: 700; color: #111827;">
                            ${product.price.toFixed(2)} ETB
                        </div>
                        <div class="rating" style="font-size: 13px; color: #f59e0b;">
                            ⭐ ${product.rating} <span style="color: #9ca3af;">(${product.reviews})</span>
                        </div>
                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                        title="Add to Shopping Cart"
                        style="width: 38px; height: 38px; border-radius: 50%; border: none; background: #635bff; color: white; font-size: 20px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"
                    >
                        +
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

/* -----------------------------------------------------
   6. SEARCH & ADVANCED FILTERS
----------------------------------------------------- */
function applyFilters() {
    let filtered = getAllProducts();

    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
    if (search) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.seller.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search))
        );
    }

    const category = categoryFilter ? categoryFilter.value : "all";
    if (category !== "all") {
        filtered = filtered.filter(product => product.category === category);
    }

    const minimum = minPrice ? parseFloat(minPrice.value) : NaN;
    const maximum = maxPrice ? parseFloat(maxPrice.value) : NaN;

    if (!isNaN(minimum)) {
        filtered = filtered.filter(product => product.price >= minimum);
    }

    if (!isNaN(maximum)) {
        filtered = filtered.filter(product => product.price <= maximum);
    }

    if (verifiedFilter && verifiedFilter.checked) {
        filtered = filtered.filter(product => product.verified);
    }

    if (fairPriceFilter && fairPriceFilter.checked) {
        filtered = filtered.filter(product => product.fairPrice);
    }

    const ratingFilters = [...document.querySelectorAll(".rating-filter:checked")];
    if (ratingFilters.length > 0) {
        const minimumRating = Math.max(...ratingFilters.map(checkbox => Number(checkbox.value)));
        filtered = filtered.filter(product => product.rating >= minimumRating);
    }

    if (sortProducts) {
        switch (sortProducts.value) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                filtered.sort((a, b) => a.date - b.date);
                break;
        }
    }

    renderProducts(filtered);
}

/* -----------------------------------------------------
   7. PRODUCT DETAILS MODAL
----------------------------------------------------- */
function openProductDetails(productId) {
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;

    const isWishlisted = wishlist.includes(product.id);

    modalContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <span style="font-size: 12px; font-weight: 700; color: #635bff; text-transform: uppercase;">
                        ${product.category}
                    </span>
                    <h2 style="font-size: 24px; margin: 4px 0 8px; font-weight: 700;">${product.name}</h2>
                    <div style="font-size: 14px; color: #6b7280;">
                        Sold by <strong>${product.seller}</strong>
                        ${product.verified ? ' <span style="color: #10b981;">✓ Verified Merchant</span>' : ""}
                    </div>
                </div>
                <div style="font-size: 50px;">${product.emoji || "📦"}</div>
            </div>

            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                ${product.description || "High quality product available with fast local delivery and escrow protection."}
            </p>

            ${product.specs && product.specs.length > 0 ? `
                <div>
                    <strong style="font-size: 14px; display: block; margin-bottom: 8px;">Key Specifications:</strong>
                    <ul style="padding-left: 20px; color: #4b5563; font-size: 14px; margin: 0;">
                        ${product.specs.map(spec => `<li style="margin-bottom: 4px;">${spec}</li>`).join("")}
                    </ul>
                </div>
            ` : ""}

            <div style="background: #f8fafc; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 24px; font-weight: 800; color: #111827;">${product.price.toFixed(2)} ETB</div>
                    <div style="font-size: 13px; color: #f59e0b;">⭐ ${product.rating} (${product.reviews} customer reviews)</div>
                </div>
                <div style="font-size: 13px; color: #059669; font-weight: 600;">
                    In Stock (${product.stock || 25} available)
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button
                    class="modal-submit"
                    style="flex: 2;"
                    onclick="addToCart(${product.id}); closeModal();"
                >
                    🛒 Add to Cart
                </button>
                <button
                    style="flex: 1; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-weight: 600; cursor: pointer;"
                    onclick="toggleWishlist(${product.id}); openProductDetails(${product.id});"
                >
                    ${isWishlisted ? "♥ Saved" : "♡ Wishlist"}
                </button>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 10px;">
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Customer Feedback</h4>
                ${product.reviewList && product.reviewList.length > 0 ? product.reviewList.map(r => `
                    <div style="border-bottom: 1px solid #f3f4f6; padding: 8px 0;">
                        <strong style="font-size: 13px;">${r.user}</strong> - <span style="color: #f59e0b;">⭐ ${r.rating}</span>
                        <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">"${r.comment}"</p>
                    </div>
                `).join("") : '<p style="font-size: 13px; color: #9ca3af;">No written reviews yet. Be the first to leave feedback after purchase!</p>'}
            </div>
        </div>
    `;

    openModal();
}

/* -----------------------------------------------------
   8. CART & WISHLIST MANAGERS
----------------------------------------------------- */
function addToCart(productId) {
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    showNotification(`${product.name} added to cart`, "success");
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        openCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    openCart();
}

function saveCart() {
    localStorage.setItem("marketflow_cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    if (!cartCount) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
}

function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showNotification("Item removed from wishlist", "info");
    } else {
        wishlist.push(productId);
        showNotification("Item added to wishlist", "success");
    }

    localStorage.setItem("marketflow_wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    applyFilters();
}

function updateWishlistCount() {
    if (!wishlistCount) return;
    wishlistCount.textContent = wishlist.length;
}

/* -----------------------------------------------------
   9. CART MODAL, WALLET CHECKOUT & ESCROW FREEZE
----------------------------------------------------- */
function openCart() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700;">Your Cart</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
            ${cart.length} distinct item${cart.length !== 1 ? "s" : ""} in order
        </p>

        ${cart.length === 0 ? `
            <div style="text-align:center; padding:40px 0;">
                <div style="font-size: 48px; margin-bottom: 10px;">🛒</div>
                <h3 style="font-size: 18px; font-weight: 600;">Your shopping cart is empty</h3>
                <p style="color: #9ca3af; font-size: 14px;">Explore the marketplace and discover great local deals.</p>
            </div>
        ` : `
            <div class="cart-items" style="max-height: 320px; overflow-y: auto; padding-right: 5px;">
                ${cart.map(item => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f3f4f6;">
                        <div style="flex: 1;">
                            <strong style="font-size: 15px; display: block;">${item.name}</strong>
                            <div style="font-size:13px; color:#6b7280; margin-top: 2px;">
                                ${item.price.toFixed(2)} ETB each
                            </div>
                        </div>

                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="display: flex; align-items: center; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;">
                                <button
                                    onclick="updateCartQuantity(${item.id}, -1)"
                                    style="border: none; background: #f3f4f6; padding: 4px 10px; cursor: pointer; font-weight: bold;"
                                >-</button>
                                <span style="padding: 0 10px; font-size: 14px; font-weight: 600;">${item.quantity}</span>
                                <button
                                    onclick="updateCartQuantity(${item.id}, 1)"
                                    style="border: none; background: #f3f4f6; padding: 4px 10px; cursor: pointer; font-weight: bold;"
                                >+</button>
                            </div>

                            <strong style="font-size: 15px; min-width: 80px; text-align: right;">
                                ${(item.price * item.quantity).toFixed(2)} ETB
                            </strong>

                            <button
                                onclick="removeFromCart(${item.id})"
                                style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;"
                                title="Remove Item"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:20px; padding-top: 15px; border-top: 2px solid #e5e7eb; font-size:20px; font-weight:bold;">
                <span>Total Amount:</span>
                <span style="color: #635bff;">${total.toFixed(2)} ETB</span>
            </div>

            <button class="modal-submit" onclick="checkout()" style="margin-top: 20px;">
                Proceed to Secure Checkout →
            </button>
        `}
    `;

    openModal();
}

function checkout() {
    if (!currentUser) {
        closeModal();
        openRegister("buyer");
        showNotification("Please log in or register before checking out.", "info");
        return;
    }

    currentUser = ensureWallet(currentUser);

    if (cart.length === 0) {
        showNotification("Your cart is empty.", "error");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasSufficientFunds = currentUser.wallet.balance >= total;

    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700;">Secure Escrow Checkout</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
            Your payment will be <strong>frozen in Escrow</strong> and credited to the seller only when you confirm receipt.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;">
                <span style="color: #4b5563;">Your Available Wallet Balance:</span>
                <strong style="color: ${hasSufficientFunds ? '#059669' : '#ef4444'};">${currentUser.wallet.balance.toFixed(2)} ETB</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <span>Total Escrow Amount:</span>
                <span style="color: #635bff;">${total.toFixed(2)} ETB</span>
            </div>
        </div>

        ${!hasSufficientFunds ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 15px;">
                ⚠️ <strong>Insufficient Wallet Balance!</strong> You need ${(total - currentUser.wallet.balance).toFixed(2)} ETB more to place this order.
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Top-Up Wallet Amount (ETB)</label>
                <div style="display: flex; gap: 8px;">
                    <input id="quickDepositInput" type="number" value="${(total - currentUser.wallet.balance).toFixed(2)}" style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                    <button class="modal-submit" style="width: auto; padding: 8px 15px; background: #10b981;" onclick="depositToWallet(document.getElementById('quickDepositInput').value); checkout();">
                        + Deposit & Retry
                    </button>
                </div>
            </div>
        ` : ""}

        <div class="form-group" style="margin-bottom: 15px;">
            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Delivery Address</label>
            <input
                id="checkoutAddress"
                type="text"
                placeholder="Street address, Sub-city, Addis Ababa"
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;"
            >
        </div>

        <button 
            class="modal-submit" 
            onclick="placeOrder()" 
            ${!hasSufficientFunds ? "disabled style='opacity: 0.5; cursor: not-allowed;'" : ""}
        >
            🔐 Lock ${total.toFixed(2)} ETB in Escrow & Place Order
        </button>
    `;
}

function placeOrder() {
    currentUser = ensureWallet(currentUser);
    const addressInput = document.getElementById("checkoutAddress");
    const address = addressInput ? addressInput.value.trim() : "";

    if (!address) {
        showNotification("Please enter a valid delivery address.", "error");
        return;
    }

    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (currentUser.wallet.balance < orderTotal) {
        showNotification("Insufficient balance to hold in Escrow.", "error");
        return;
    }

    // Freeze Funds: Available -> Frozen Escrow
    currentUser.wallet.balance -= orderTotal;
    currentUser.wallet.frozenBalance += orderTotal;
    saveUserData();

    const orderId = "MF-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
        id: orderId,
        buyerEmail: currentUser.email,
        buyerName: currentUser.name,
        items: [...cart],
        total: orderTotal,
        address,
        paymentMethod: "MarketFlow Escrow Wallet",
        status: "ESCROW_HELD",
        created: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    orders.unshift(newOrder);
    localStorage.setItem("marketflow_orders", JSON.stringify(orders));

    cart = [];
    saveCart();

    modalContent.innerHTML = `
        <div style="text-align:center; padding: 20px 0;">
            <div style="font-size:60px; margin-bottom:15px;">🔒</div>
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Payment Frozen in Escrow!</h2>
            <p style="font-size: 15px; color: #4b5563;">
                Order Ref: <strong>${newOrder.id}</strong>
            </p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 14px;">
                <strong>${orderTotal.toFixed(2)} ETB</strong> has been safely locked in smart escrow from your wallet. 
                The merchant will be notified to dispatch your package.
            </div>

            <button
                class="modal-submit"
                onclick="closeModal(); openOrderTracking('${newOrder.id}');"
            >
                📍 Track Order & Escrow Status
            </button>
        </div>
    `;
}

/* -----------------------------------------------------
   10. ORDER TRACKING & ESCROW RELEASE ENGINE
----------------------------------------------------- */
function openOrderTracking(orderId = null) {
    if (!currentUser) {
        openLogin();
        return;
    }

    const userOrders = orders.filter(o => o.buyerEmail === currentUser.email);

    if (userOrders.length === 0) {
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 30px 0;">
                <div style="font-size: 48px; margin-bottom: 10px;">📦</div>
                <h3 style="font-size: 18px; font-weight: 600;">No Active Escrow Orders</h3>
                <p style="color: #6b7280; font-size: 14px;">You haven't placed any orders with frozen escrow funds yet.</p>
            </div>
        `;
        openModal();
        return;
    }

    const currentOrder = orderId ? userOrders.find(o => o.id === orderId) || userOrders[0] : userOrders[0];

    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 5px;">Track Order & Escrow</h2>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">
            Order ID: <strong>${currentOrder.id}</strong> • Placed on ${currentOrder.created}
        </p>

        <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 10px;">
                <span style="color: #10b981;">1. Payment Escrowed ✓</span>
                <span style="color: ${currentOrder.status !== 'ESCROW_HELD' ? '#10b981' : '#f59e0b'};">2. Dispatched</span>
                <span style="color: ${currentOrder.status === 'DELIVERED' ? '#10b981' : '#9ca3af'};">3. Delivered</span>
            </div>
            <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: ${currentOrder.status === 'DELIVERED' ? '100%' : (currentOrder.status === 'DISPATCHED' ? '66%' : '33%')}; background: #635bff; transition: width 0.3s;"></div>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <strong style="font-size: 14px; display: block; margin-bottom: 8px;">Order Items:</strong>
            <div style="max-height: 120px; overflow-y: auto; background: #fafafa; padding: 10px; border-radius: 6px;">
                ${currentOrder.items.map(item => `
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span>${item.quantity}x ${item.name} (Seller: ${item.seller})</span>
                        <strong>${(item.price * item.quantity).toFixed(2)} ETB</strong>
                    </div>
                `).join("")}
            </div>
        </div>

        <div style="font-size: 13px; color: #4b5563; margin-bottom: 20px;">
            <strong>Delivery Address:</strong> ${currentOrder.address}
        </div>

        ${currentOrder.status !== "DELIVERED" ? `
            <button
                class="modal-submit"
                style="background: #10b981;"
                onclick="confirmDelivery('${currentOrder.id}')"
            >
                ✅ Confirm Package Received (Release Escrow to Seller)
            </button>
        ` : `
            <div style="background: #ecfdf5; color: #065f46; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; font-weight: 600;">
                ✓ Delivery Confirmed & Escrow Released
            </div>
        `}
    `;

    openModal();
}

function confirmDelivery(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === "DELIVERED") {
        showNotification("This order's escrow has already been released.", "info");
        return;
    }

    currentUser = ensureWallet(currentUser);

    // 1. Unfreeze buyer's locked escrow funds
    if (currentUser.wallet.frozenBalance >= order.total) {
        currentUser.wallet.frozenBalance -= order.total;
    } else {
        currentUser.wallet.frozenBalance = 0;
    }
    saveUserData();

    // 2. Transfer payment into respective seller wallets
    order.items.forEach(item => {
        const itemEarnings = item.price * item.quantity;
        const sellerUser = users.find(u => u.name === item.seller || u.email === item.seller);
        if (sellerUser) {
            ensureWallet(sellerUser);
            sellerUser.wallet.balance += itemEarnings;
        }
    });

    // 3. Complete order status
    order.status = "DELIVERED";
    localStorage.setItem("marketflow_orders", JSON.stringify(orders));
    localStorage.setItem("marketflow_users", JSON.stringify(users));

    showNotification("Delivery confirmed! Escrow funds released to merchant wallet.", "success");
    openOrderTracking(orderId);
}

/* -----------------------------------------------------
   11. AUTHENTICATION MODULE
----------------------------------------------------- */
function openRegister(type = "buyer") {
    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700;">Create Account</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
            Join MarketFlow as a ${type === "seller" ? "merchant" : "buyer"}.
        </p>

        <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Full Name / Store Name</label>
            <input id="registerName" type="text" placeholder="Your name or store name" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Email</label>
            <input id="registerEmail" type="email" placeholder="you@example.com" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Password</label>
            <input id="registerPassword" type="password" placeholder="Choose password" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
        </div>

        <button class="modal-submit" onclick="registerUser('${type}')">
            Create ${type === "seller" ? "Merchant" : "Buyer"} Account
        </button>

        <p style="text-align:center; margin-top:15px; font-size:13px; color: #6b7280;">
            Already have an account?
            <button style="border:none; background:none; color:#635bff; font-weight:bold; cursor:pointer;" onclick="openLogin()">
                Log In
            </button>
        </p>
    `;

    openModal();
}

function registerUser(type) {
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!name || !email || !password) {
        showNotification("Please complete all registration fields.", "error");
        return;
    }

    if (users.some(user => user.email === email)) {
        showNotification("An account with this email already exists.", "error");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: type,
        wallet: {
            balance: 2500.00,
            frozenBalance: 0.00
        }
    };

    users.push(newUser);
    localStorage.setItem("marketflow_users", JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem("marketflow_current_user", JSON.stringify(currentUser));

    closeModal();
    updateAccountButton();
    showNotification(`Welcome to MarketFlow, ${name}! 2,500 ETB test funds added to your wallet.`, "success");
}

function openLogin() {
    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700;">Welcome back</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Log in to your MarketFlow account.</p>

        <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Email</label>
            <input id="loginEmail" type="email" placeholder="you@example.com" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Password</label>
            <input id="loginPassword" type="password" placeholder="Enter password" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;">
        </div>

        <button class="modal-submit" onclick="loginUser()">Log In</button>

        <p style="text-align:center; margin-top:15px; font-size:13px; color: #6b7280;">
            New to MarketFlow?
            <button style="border:none; background:none; color:#635bff; font-weight:bold; cursor:pointer;" onclick="openRegister('buyer')">
                Create account
            </button>
        </p>
    `;

    openModal();
}

function loginUser() {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showNotification("Invalid email or password.", "error");
        return;
    }

    currentUser = ensureWallet(user);
    saveUserData();

    closeModal();
    updateAccountButton();
    showNotification(`Welcome back, ${user.name}!`, "success");
}

function updateAccountButton() {
    const button = document.getElementById("accountButton");
    if (!button) return;

    if (currentUser) {
        button.textContent = currentUser.name.split(" ")[0];
    } else {
        button.textContent = "Account";
    }
}

/* -----------------------------------------------------
   12. USER ACCOUNT & WALLET DASHBOARD
----------------------------------------------------- */
function openAccount() {
    if (!currentUser) {
        openLogin();
        return;
    }

    currentUser = ensureWallet(currentUser);

    modalContent.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 700;">Account & Escrow Wallet</h2>

        <div style="background:#f8fafc; padding:15px; border-radius:10px; margin: 15px 0; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 18px; font-weight: 700; color: #111827;">${currentUser.name}</div>
                    <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">${currentUser.email}</div>
                </div>
                <span style="font-size: 11px; padding: 4px 10px; background: #e0e7ff; color: #4338ca; border-radius: 20px; font-weight: 700; text-transform: uppercase;">
                    ${currentUser.role}
                </span>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #635bff 0%, #4338ca 100%); color: white; padding: 18px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(99, 91, 255, 0.25);">
            <div style="font-size: 12px; opacity: 0.85; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Available Wallet Balance</div>
            <div style="font-size: 28px; font-weight: 800; margin: 4px 0 12px;">${currentUser.wallet.balance.toFixed(2)} ETB</div>
            
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px;">
                <span>Locked in Active Escrows:</span>
                <strong>🔒 ${currentUser.wallet.frozenBalance.toFixed(2)} ETB</strong>
            </div>
        </div>

        <div style="background: #fafafa; border: 1px solid #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
            <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #374151;">Deposit Funds to Wallet</label>
            <div style="display: flex; gap: 8px;">
                <input id="depositInput" type="number" placeholder="Amount in ETB (e.g. 500)" style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                <button class="modal-submit" style="width: auto; padding: 8px 16px; background: #10b981;" onclick="depositToWallet(document.getElementById('depositInput').value)">
                    + Top Up
                </button>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <button class="modal-submit" style="background: #3b82f6;" onclick="openOrderTracking()">
                📦 View Order History & Escrow Status
            </button>

            ${currentUser.role === "seller" ? `
                <button class="modal-submit" style="background: #8b5cf6;" onclick="openAddProductModal()">
                    ➕ Add New Product for Sale
                </button>
            ` : `
                <button class="modal-submit" style="background: #f59e0b;" onclick="openRegister('seller')">
                    🏪 Upgrade to Merchant Account
                </button>
            `}
        </div>

        <button class="modal-submit" style="background: #ef4444;" onclick="logout()">
            Sign Out
        </button>
    `;

    openModal();
}

function openAddProductModal() {
    modalContent.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700;">Merchant Portal - List Product</h2>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 15px;">Add a new item to the MarketFlow store.</p>

        <div class="form-group" style="margin-bottom: 10px;">
            <label style="font-size: 12px; font-weight: 600;">Product Title</label>
            <input id="newProdName" type="text" placeholder="e.g. Leather Jacket" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label style="font-size: 12px; font-weight: 600;">Category</label>
                <select id="newProdCategory" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food</option>
                    <option value="home">Home</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                </select>
            </div>
            <div style="flex: 1;">
                <label style="font-size: 12px; font-weight: 600;">Price (ETB)</label>
                <input id="newProdPrice" type="number" placeholder="49.99" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label style="font-size: 12px; font-weight: 600;">Emoji Visual</label>
                <input id="newProdEmoji" type="text" placeholder="👕" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="flex: 1;">
                <label style="font-size: 12px; font-weight: 600;">Badge Label</label>
                <input id="newProdBadge" type="text" placeholder="NEW" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 15px;">
            <label style="font-size: 12px; font-weight: 600;">Description</label>
            <textarea id="newProdDesc" rows="3" placeholder="Item features..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
        </div>

        <button class="modal-submit" onclick="addNewProduct()">Publish Item</button>
    `;

    openModal();
}

function addNewProduct() {
    const name = document.getElementById("newProdName").value.trim();
    const category = document.getElementById("newProdCategory").value;
    const price = parseFloat(document.getElementById("newProdPrice").value);
    const emoji = document.getElementById("newProdEmoji").value.trim() || "🛍️";
    const badge = document.getElementById("newProdBadge").value.trim().toUpperCase();
    const description = document.getElementById("newProdDesc").value.trim();

    if (!name || isNaN(price) || price <= 0) {
        showNotification("Please provide a valid product name and price.", "error");
        return;
    }

    const createdProduct = {
        id: Date.now(),
        name,
        category,
        price,
        seller: currentUser ? currentUser.name : "Verified Merchant",
        rating: 5.0,
        reviews: 1,
        verified: true,
        fairPrice: true,
        emoji,
        badge,
        date: 0,
        stock: 10,
        description,
        specs: ["Verified Merchant Listing"],
        reviewList: []
    };

    customProducts.push(createdProduct);
    localStorage.setItem("marketflow_custom_products", JSON.stringify(customProducts));

    closeModal();
    applyFilters();
    showNotification("Product listed successfully on the marketplace!", "success");
}

function logout() {
    currentUser = null;
    localStorage.removeItem("marketflow_current_user");

    closeModal();
    updateAccountButton();
    showNotification("You have been logged out.", "info");
}

/* -----------------------------------------------------
   13. MODAL CONTROLLER & SYSTEM NOTIFICATIONS
----------------------------------------------------- */
function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.add("active");
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove("active");
    }
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", event => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");

    let bg = "#111827";
    if (type === "success") bg = "#10b981";
    if (type === "error") bg = "#ef4444";

    notification.style.position = "fixed";
    notification.style.bottom = "25px";
    notification.style.right = "25px";
    notification.style.background = bg;
    notification.style.color = "white";
    notification.style.padding = "14px 20px";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 10px 30px rgba(0,0,0,.2)";
    notification.style.zIndex = "10000";
    notification.style.fontWeight = "600";
    notification.style.fontSize = "14px";
    notification.style.transition = "all 0.3s ease";
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
/* -----------------------------------------------------
   SELL PRODUCT ROUTER & ACCOUNT UPGRADE
----------------------------------------------------- */

/**
 * Handles clicks on "+ Sell a Product" button across the navbar or hero sections.
 */
function openSellProduct() {
    // 1. If not logged in, prompt seller registration directly
    if (!currentUser) {
        showNotification("Please log in or create a merchant account to sell products.", "info");
        openRegister("seller");
        return;
    }

    // 2. If logged in as a Buyer, prompt quick account upgrade
    if (currentUser.role !== "seller") {
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <div style="font-size: 50px; margin-bottom: 10px;">🏪</div>
                <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Become a Merchant</h2>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                    Your account is currently set to <strong>Buyer</strong>. Upgrade to a Merchant account to start listing items on MarketFlow.
                </p>

                <button class="modal-submit" style="background: #8b5cf6; margin-bottom: 10px;" onclick="upgradeToSeller()">
                    🚀 Upgrade Account to Merchant
                </button>
                <button class="modal-submit" style="background: #9ca3af;" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        `;
        openModal();
        return;
    }

    // 3. If logged in as Seller, open product listing form directly
    openAddProductModal();
}

/**
 * Upgrades the current buyer user to a merchant role.
 */
function upgradeToSeller() {
    if (!currentUser) return;
    
    currentUser.role = "seller";
    saveUserData();
    
    showNotification("Account upgraded to Merchant! You can now list products.", "success");
    openAddProductModal();
}
/* -----------------------------------------------------
   14. UTILITIES & NAVIGATION
----------------------------------------------------- */
function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (minPrice) minPrice.value = "";
    if (maxPrice) maxPrice.value = "";
    if (verifiedFilter) verifiedFilter.checked = false;
    if (fairPriceFilter) fairPriceFilter.checked = false;

    document.querySelectorAll(".rating-filter").forEach(checkbox => checkbox.checked = false);

    if (sortProducts) sortProducts.value = "featured";

    applyFilters();
}

function scrollToMarketplace() {
    const marketplace = document.getElementById("marketplace");
    if (marketplace) {
        marketplace.scrollIntoView({ behavior: "smooth" });
    }
}

function scrollToTracking() {
    openOrderTracking();
}

/* -----------------------------------------------------
   15. EVENT LISTENERS INITIALIZATION
----------------------------------------------------- */
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (minPrice) minPrice.addEventListener("input", applyFilters);
if (maxPrice) maxPrice.addEventListener("input", applyFilters);
if (verifiedFilter) verifiedFilter.addEventListener("change", applyFilters);
if (fairPriceFilter) fairPriceFilter.addEventListener("change", applyFilters);
if (sortProducts) sortProducts.addEventListener("change", applyFilters);

document.querySelectorAll(".rating-filter").forEach(checkbox => {
    checkbox.addEventListener("change", applyFilters);
});

const cartBtn = document.getElementById("cartButton");
if (cartBtn) cartBtn.addEventListener("click", openCart);

const accountBtn = document.getElementById("accountButton");
if (accountBtn) accountBtn.addEventListener("click", openAccount);

const wishlistBtn = document.getElementById("wishlistButton");
if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
        const wished = getAllProducts().filter(product => wishlist.includes(product.id));
        renderProducts(wished);
        scrollToMarketplace();
    });
}

const searchBtn = document.getElementById("searchButton");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        applyFilters();
        scrollToMarketplace();
    });
}
// Connect navbar/hero "+ Sell a Product" button
const sellProductBtn = document.getElementById("sellProductBtn") || document.getElementById("sellButton");
if (sellProductBtn) {
    sellProductBtn.addEventListener("click", openSellProduct);
}
document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // YOUR EXISTING WEBSITE JS (Cart, Map, etc.)
  // ==========================================


  // ==========================================
  // ADMIN SYSTEM LOGIC
  // ==========================================
  const depositsTableBody = document.querySelector('#deposits tbody');
  const usersTableBody = document.querySelector('#users tbody');
  const activityFeed = document.querySelector('.activity-feed');

  const pendingDepositsValueEl = document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-value');
  const totalUserFundsValueEl = document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-value');
  const pendingSubtextEl = document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-sub');
  const pendingBadgeEl = document.querySelector('.sidebar-menu .badge-warning');

  const parseCurrency = (str) => parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
  // Updated Currency Formatter for ETB
const formatCurrency = (num) => {
  return 'ETB ' + Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  if (depositsTableBody) {
    depositsTableBody.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-action');
      if (!button) return;

      const row = button.closest('tr');
      const requestId = row.cells[0].innerText.trim();
      const userName = row.querySelector('.user-cell strong').innerText.trim();
      const userEmail = row.querySelector('.user-cell small').innerText.trim();
      const amountText = row.querySelector('.amount-cell').innerText.trim();
      const amount = parseCurrency(amountText);

      if (button.classList.contains('approve')) {
        handleApproveDeposit(row, requestId, userName, userEmail, amount);
      } else if (button.classList.contains('deny')) {
        handleDenyDeposit(row, requestId, userName, amount);
      }
    });
  }

  function handleApproveDeposit(row, requestId, userName, userEmail, amount) {
    let currentPending = parseCurrency(pendingDepositsValueEl.innerText);
    let currentTotalFunds = parseCurrency(totalUserFundsValueEl.innerText);

    currentPending = Math.max(0, currentPending - amount);
    currentTotalFunds += amount;

    pendingDepositsValueEl.innerText = formatCurrency(currentPending);
    totalUserFundsValueEl.innerText = formatCurrency(currentTotalFunds);

    decrementPendingCount();
    creditUserWallet(userName, amount);

    row.cells[7].innerHTML = `<span class="badge" style="background: #d1fae5; color: #10b981;"><i class="fa-solid fa-check"></i> Approved</span>`;
    row.style.opacity = '0.75';

    addActivityLog('approved', `Admin approved deposit of <strong>${formatCurrency(amount)}</strong> for <strong>${userName}</strong> (${requestId}).`);
  }

  function handleDenyDeposit(row, requestId, userName, amount) {
    let currentPending = parseCurrency(pendingDepositsValueEl.innerText);
    currentPending = Math.max(0, currentPending - amount);
    pendingDepositsValueEl.innerText = formatCurrency(currentPending);

    decrementPendingCount();

    row.cells[7].innerHTML = `<span class="badge" style="background: #fee2e2; color: #ef4444;"><i class="fa-solid fa-xmark"></i> Denied</span>`;
    row.style.opacity = '0.75';

    addActivityLog('denied', `Deposit request <strong>${requestId}</strong> (${formatCurrency(amount)}) for <strong>${userName}</strong> was <strong style="color:#ef4444;">denied</strong>.`);
  }

  function creditUserWallet(userName, amount) {
    if (!usersTableBody) return;
    const userRows = usersTableBody.querySelectorAll('tr');

    userRows.forEach((row) => {
      const nameEl = row.querySelector('strong');
      if (nameEl && nameEl.innerText.trim().toLowerCase() === userName.toLowerCase()) {
        const balanceCell = row.cells[2];
        let currentBalance = parseCurrency(balanceCell.innerText);
        currentBalance += amount;
        balanceCell.innerText = formatCurrency(currentBalance);

        balanceCell.style.transition = 'color 0.3s ease, font-weight 0.3s ease';
        balanceCell.style.color = '#10b981';
        balanceCell.style.fontWeight = 'bold';
        setTimeout(() => {
          balanceCell.style.color = '';
          balanceCell.style.fontWeight = '';
        }, 2000);
      }
    });
  }

  function decrementPendingCount() {
    if (pendingBadgeEl) {
      let count = parseInt(pendingBadgeEl.innerText) || 0;
      pendingBadgeEl.innerText = `${Math.max(0, count - 1)} Pending`;
    }
    if (pendingSubtextEl) {
      let count = parseInt(pendingSubtextEl.innerText) || 0;
      pendingSubtextEl.innerText = `${Math.max(0, count - 1)} requests awaiting verification`;
    }
  }

  function addActivityLog(type, htmlMessage) {
    if (!activityFeed) return;
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="feed-icon ${type === 'approved' ? 'approved' : 'deposit'}">
        <i class="fa-solid ${type === 'approved' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
      </div>
      <div class="feed-content">
        <p>${htmlMessage}</p>
        <span class="feed-time">Just now</span>
      </div>
    `;
    activityFeed.prepend(item);
  }
});
/* -----------------------------------------------------
   16. BOOTSTRAP APPLICATION
----------------------------------------------------- */
renderProducts();
updateCartCount();
updateWishlistCount();
updateAccountButton();
