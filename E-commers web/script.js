/* =====================================================
   MARKETFLOW FRONTEND
===================================================== */


/* =====================================================
   SAMPLE MARKETPLACE DATA
===================================================== */

const products = [

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
        date: 5
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
        date: 10
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
        date: 1
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
        date: 3
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
        date: 20
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
        date: 8
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
        date: 6
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
        date: 15
    }

];


/* =====================================================
   APPLICATION STATE
===================================================== */

let cart =
    JSON.parse(localStorage.getItem("marketflow_cart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("marketflow_wishlist")) || [];

let users =
    JSON.parse(localStorage.getItem("marketflow_users")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("marketflow_current_user")) || null;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const productsGrid =
    document.getElementById("productsGrid");

const productCount =
    document.getElementById("productCount");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const verifiedFilter =
    document.getElementById("verifiedFilter");

const fairPriceFilter =
    document.getElementById("fairPriceFilter");

const sortProducts =
    document.getElementById("sortProducts");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalContent =
    document.getElementById("modalContent");


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(list = products) {

    productsGrid.innerHTML = "";

    productCount.textContent =
        `${list.length} product${list.length !== 1 ? "s" : ""}`;


    if (list.length === 0) {

        productsGrid.innerHTML = `
            <div class="empty-products">
                <h3>No products found</h3>
                <p>
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }


    list.forEach(product => {

        const isWishlisted =
            wishlist.includes(product.id);

        const card = document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                ${
                    product.badge
                        ? `<span class="product-badge">
                            ${product.badge}
                           </span>`
                        : ""
                }

                <button
                    class="wishlist ${isWishlisted ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>

                <span>
                    ${product.emoji}
                </span>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-seller">

                    ${product.seller}

                    ${
                        product.verified
                            ? " ✓"
                            : ""
                    }

                </div>

                <div class="product-bottom">

                    <div>

                        <div class="product-price">
                            $${product.price.toFixed(2)}
                        </div>

                        <div class="rating">
                            ⭐ ${product.rating}
                            (${product.reviews})
                        </div>

                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        productsGrid.appendChild(card);

    });

}


/* =====================================================
   SEARCH + FILTER
===================================================== */

function applyFilters() {

    let filtered = [...products];


    const search =
        searchInput.value.toLowerCase().trim();


    if (search) {

        filtered = filtered.filter(product =>

            product.name.toLowerCase().includes(search) ||

            product.category.toLowerCase().includes(search) ||

            product.seller.toLowerCase().includes(search)

        );

    }


    const category =
        categoryFilter.value;


    if (category !== "all") {

        filtered =
            filtered.filter(
                product =>
                    product.category === category
            );

    }


    const minimum =
        parseFloat(minPrice.value);

    const maximum =
        parseFloat(maxPrice.value);


    if (!isNaN(minimum)) {

        filtered =
            filtered.filter(
                product =>
                    product.price >= minimum
            );

    }


    if (!isNaN(maximum)) {

        filtered =
            filtered.filter(
                product =>
                    product.price <= maximum
            );

    }


    if (verifiedFilter.checked) {

        filtered =
            filtered.filter(
                product =>
                    product.verified
            );

    }


    if (fairPriceFilter.checked) {

        filtered =
            filtered.filter(
                product =>
                    product.fairPrice
            );

    }


    const ratingFilters =
        [...document.querySelectorAll(".rating-filter:checked")];


    if (ratingFilters.length > 0) {

        const minimumRating =
            Math.max(
                ...ratingFilters.map(
                    checkbox =>
                        Number(checkbox.value)
                )
            );

        filtered =
            filtered.filter(
                product =>
                    product.rating >= minimumRating
            );

    }


    switch (sortProducts.value) {

        case "price-low":

            filtered.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            filtered.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            filtered.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "newest":

            filtered.sort(
                (a, b) =>
                    a.date - b.date
            );

            break;

    }


    renderProducts(filtered);

}


/* =====================================================
   CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            p => p.id === productId
        );

    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    showNotification(
        `${product.name} added to cart`
    );

}


function saveCart() {

    localStorage.setItem(
        "marketflow_cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    cartCount.textContent = total;

}


/* =====================================================
   WISHLIST
===================================================== */

function toggleWishlist(productId) {

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(
                id => id !== productId
            );

    } else {

        wishlist.push(productId);

    }


    localStorage.setItem(
        "marketflow_wishlist",
        JSON.stringify(wishlist)
    );


    updateWishlistCount();

    applyFilters();

}


function updateWishlistCount() {

    wishlistCount.textContent =
        wishlist.length;

}


/* =====================================================
   CART MODAL
===================================================== */

function openCart() {

    let total = 0;

    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });


    modalContent.innerHTML = `

        <h2>Your Cart</h2>

        <p>
            ${cart.length}
            different product${cart.length !== 1 ? "s" : ""}
        </p>

        ${
            cart.length === 0

            ?

            `
                <div style="
                    text-align:center;
                    padding:30px 0;
                ">
                    🛒
                    <h3>Your cart is empty</h3>
                </div>
            `

            :

            `

                <div class="cart-items">

                    ${cart.map(item => `

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            padding:12px 0;
                            border-bottom:1px solid #eee;
                        ">

                            <div>

                                <strong>
                                    ${item.name}
                                </strong>

                                <div style="
                                    font-size:13px;
                                    color:#777;
                                ">
                                    ${item.quantity} ×
                                    $${item.price.toFixed(2)}
                                </div>

                            </div>

                            <strong>
                                $${(
                                    item.price *
                                    item.quantity
                                ).toFixed(2)}
                            </strong>

                        </div>

                    `).join("")}

                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin-top:20px;
                    font-size:20px;
                    font-weight:bold;
                ">

                    <span>Total</span>

                    <span>
                        $${total.toFixed(2)}
                    </span>

                </div>

                <button
                    class="modal-submit"
                    onclick="checkout()"
                >
                    Proceed to Checkout
                </button>

            `
        }

    `;

    openModal();

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!currentUser) {

        closeModal();

        openRegister("buyer");

        showNotification(
            "Please create an account before checkout."
        );

        return;
    }


    modalContent.innerHTML = `

        <h2>Secure Checkout</h2>

        <p>
            Your payment will be placed into escrow
            until delivery is verified.
        </p>

        <div class="form-group">

            <label>Delivery Address</label>

            <input
                id="checkoutAddress"
                placeholder="Enter your delivery address"
            >

        </div>

        <div class="form-group">

            <label>Payment Method</label>

            <select id="paymentMethod">

                <option>Marketplace Wallet</option>

                <option>Card Payment</option>

                <option>Mobile Money</option>

            </select>

        </div>

        <button
            class="modal-submit"
            onclick="placeOrder()"
        >
            🔐 Place Secure Order
        </button>

    `;

}


/* =====================================================
   ORDER
===================================================== */

function placeOrder() {

    const address =
        document.getElementById(
            "checkoutAddress"
        ).value.trim();


    if (!address) {

        showNotification(
            "Please enter your delivery address."
        );

        return;
    }


    const order = {

        id:
            "MF-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            ),

        user:
            currentUser.email,

        items:
            [...cart],

        address,

        status:
            "ESCROW_HELD",

        created:
            new Date().toISOString()

    };


    localStorage.setItem(
        "marketflow_last_order",
        JSON.stringify(order)
    );


    cart = [];

    saveCart();


    modalContent.innerHTML = `

        <div style="text-align:center">

            <div style="
                font-size:55px;
                margin-bottom:15px;
            ">
                🔐
            </div>

            <h2>Order Protected</h2>

            <p>
                Order <strong>${order.id}</strong>
                has been created.
            </p>

            <p>
                Your payment is currently held in
                escrow and will be released after
                verified delivery.
            </p>

            <button
                class="modal-submit"
                onclick="closeModal(); scrollToTracking();"
            >
                Track My Order
            </button>

        </div>

    `;

}


/* =====================================================
   AUTHENTICATION
===================================================== */

function openRegister(type = "buyer") {

    modalContent.innerHTML = `

        <h2>
            Create your account
        </h2>

        <p>
            Join MarketFlow as a
            ${type === "seller" ? "merchant" : "buyer"}.
        </p>

        <div class="form-group">

            <label>Full Name</label>

            <input
                id="registerName"
                placeholder="Your name"
            >

        </div>

        <div class="form-group">

            <label>Email</label>

            <input
                id="registerEmail"
                type="email"
                placeholder="you@example.com"
            >

        </div>

        <div class="form-group">

            <label>Password</label>

            <input
                id="registerPassword"
                type="password"
                placeholder="Create a password"
            >

        </div>

        <button
            class="modal-submit"
            onclick="registerUser('${type}')"
        >
            Create Account
        </button>

        <p style="
            text-align:center;
            margin-top:15px;
            font-size:13px;
        ">
            Already registered?

            <button
                style="
                    border:none;
                    background:none;
                    color:#635bff;
                    font-weight:bold;
                "
                onclick="openLogin()"
            >
                Login
            </button>

        </p>

    `;

    openModal();

}


function registerUser(type) {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();

    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    if (!name || !email || !password) {

        showNotification(
            "Please complete all fields."
        );

        return;
    }


    if (
        users.some(
            user =>
                user.email === email
        )
    ) {

        showNotification(
            "An account with this email already exists."
        );

        return;
    }


    const user = {

        id:
            Date.now(),

        name,

        email,

        password,

        role: type

    };


    users.push(user);


    localStorage.setItem(
        "marketflow_users",
        JSON.stringify(users)
    );


    currentUser = user;


    localStorage.setItem(
        "marketflow_current_user",
        JSON.stringify(currentUser)
    );


    modalContent.innerHTML = `

        <div style="text-align:center">

            <div style="
                font-size:50px;
            ">
                🎉
            </div>

            <h2>
                Welcome to MarketFlow
            </h2>

            <p>
                Your ${type} account has been created.
            </p>

            <button
                class="modal-submit"
                onclick="closeModal(); updateAccountButton();"
            >
                Continue
            </button>

        </div>

    `;

}


function openLogin() {

    modalContent.innerHTML = `

        <h2>Welcome back</h2>

        <p>
            Login to your MarketFlow account.
        </p>

        <div class="form-group">

            <label>Email</label>

            <input
                id="loginEmail"
                type="email"
            >

        </div>

        <div class="form-group">

            <label>Password</label>

            <input
                id="loginPassword"
                type="password"
            >

        </div>

        <button
            class="modal-submit"
            onclick="loginUser()"
        >
            Login
        </button>

        <p style="
            text-align:center;
            margin-top:15px;
        ">

            New here?

            <button
                style="
                    border:none;
                    background:none;
                    color:#635bff;
                    font-weight:bold;
                "
                onclick="openRegister('buyer')"
            >
                Create account
            </button>

        </p>

    `;

    openModal();

}


function loginUser() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        showNotification(
            "Invalid email or password."
        );

        return;
    }


    currentUser = user;


    localStorage.setItem(
        "marketflow_current_user",
        JSON.stringify(user)
    );


    closeModal();

    updateAccountButton();

    showNotification(
        `Welcome back, ${user.name}!`
    );

}


function updateAccountButton() {

    const button =
        document.getElementById(
            "accountButton"
        );


    if (currentUser) {

        button.textContent =
            currentUser.name.split(" ")[0];

    } else {

        button.textContent =
            "Account";

    }

}


/* =====================================================
   ACCOUNT
===================================================== */

function openAccount() {

    if (!currentUser) {

        openLogin();

        return;

    }


    modalContent.innerHTML = `

        <h2>
            ${currentUser.name}
        </h2>

        <p>
            ${currentUser.email}
        </p>

        <div style="
            background:#f8fafc;
            padding:15px;
            border-radius:10px;
            margin:20px 0;
        ">

            <strong>Account type</strong>

            <div>
                ${currentUser.role}
            </div>

        </div>

        <button
            class="modal-submit"
            onclick="logout()"
        >
            Logout
        </button>

    `;

    openModal();

}


function logout() {

    currentUser = null;

    localStorage.removeItem(
        "marketflow_current_user"
    );

    closeModal();

    updateAccountButton();

    showNotification(
        "You have been logged out."
    );

}


/* =====================================================
   MODAL
===================================================== */

function openModal() {

    modalOverlay.classList.add("active");

}


function closeModal() {

    modalOverlay.classList.remove("active");

}


modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === modalOverlay
        ) {
            closeModal();
        }

    }
);


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(message) {

    const notification =
        document.createElement("div");


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.right =
        "25px";

    notification.style.background =
        "#111827";

    notification.style.color =
        "white";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.2)";

    notification.style.zIndex =
        "10000";

    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => notification.remove(),
        3000
    );

}


/* =====================================================
   RESET FILTERS
===================================================== */

function resetFilters() {

    searchInput.value = "";

    categoryFilter.value = "all";

    minPrice.value = "";

    maxPrice.value = "";

    verifiedFilter.checked = false;

    fairPriceFilter.checked = false;


    document
        .querySelectorAll(".rating-filter")
        .forEach(
            checkbox =>
                checkbox.checked = false
        );


    sortProducts.value =
        "featured";


    applyFilters();

}


/* =====================================================
   NAVIGATION
===================================================== */

function scrollToMarketplace() {

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToTracking() {

    document
        .getElementById("tracking")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   EVENT LISTENERS
===================================================== */

searchInput.addEventListener(
    "input",
    applyFilters
);

categoryFilter.addEventListener(
    "change",
    applyFilters
);

minPrice.addEventListener(
    "input",
    applyFilters
);

maxPrice.addEventListener(
    "input",
    applyFilters
);

verifiedFilter.addEventListener(
    "change",
    applyFilters
);

fairPriceFilter.addEventListener(
    "change",
    applyFilters
);

sortProducts.addEventListener(
    "change",
    applyFilters
);


document
    .querySelectorAll(".rating-filter")
    .forEach(
        checkbox =>
            checkbox.addEventListener(
                "change",
                applyFilters
            )
    );


document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("accountButton")
    .addEventListener(
        "click",
        openAccount
    );


document
    .getElementById("wishlistButton")
    .addEventListener(
        "click",
        () => {

            const wished =
                products.filter(
                    product =>
                        wishlist.includes(
                            product.id
                        )
                );

            renderProducts(wished);

            document
                .getElementById("marketplace")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        () => {

            applyFilters();

            scrollToMarketplace();

        }
    );


/* =====================================================
   INITIALIZATION
===================================================== */

renderProducts();

updateCartCount();

updateWishlistCount();

updateAccountButton();