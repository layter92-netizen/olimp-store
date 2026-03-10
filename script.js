document.addEventListener("DOMContentLoaded", () => {
    // List of product image filenames
    // When adding a new product, just add its filename here:
    const productFiles = [
        "Барабуля г.к 480 грн.jpg",
        "Биток копчений 455грн.jpg",
        "Биток сирокопчений 470 грн.jpg",
        "Вирізка копчена 480 грн.jpg",
        "Вирізка сирокопчена 490 грн.jpg",
        "Вомер х.к 350 грн.jpg",
        "Вуха різані в соусі 410 грн.jpg",
        "Гомілки копчені 170 грн.jpg",
        "Джерки 1250 грн.jpg",
        "Дорадо х.к 750 грн.jpg",
        "Кабаноси сушені 800 грн.jpg",
        "Ковбаса  450 грн..jpg",
        "Ковбаса Рубана Свино-яловича 450 грн.jpg",
        "Ковбаса Сервілат 400 грн..jpg",
        "Ковбаса Шахтарська 450 грн..jpg",
        "Ковбаса домашня 450 грн.jpg",
        "Ковбаса куряча філейна 400 грн.jpg",
        "Консерва короп з овочами 155 грн.jpg",
        "Крило куряче копчене 235 грн.jpg",
        "Мойва копчена 400 грн.jpg",
        "Морський окунь г.к  450 грн.jpg",
        "Намазка з сала 90 грн.jpg",
        "Ошийок копчений 480 грн..jpg",
        "Ошийок сирокопчений 490 грн.jpg",
        "Паштет печінковий  125 грн.jpg",
        "Паштет рибний 100грн.jpg",
        "Перепілка копчена 450 грн.jpg",
        "Підчеревина копчена 360 грн.jpg",
        "Ребро копчене 380 грн.jpg",
        "Рулет зі свинин копчений 380 грн.jpg",
        "Сайра х.к 400 грн.jpg",
        "Серце куряче копчене 450 грн.jpg",
        "Скумбрія х.к 630 грн.jpg",
        "Ставрида копчена 400 грн.jpg",
        "Стегно куряче 260 грн.jpg",
        "Тушонка куряча  100 грн.jpg",
        "Філе куряче 350 грн.jpg",
        "Шиї курячі 165грн.jpg",
        "кілька в томаті з овочами 120 грн.jpg",
        "салака х.к 230 грн.jpg",
        "хребет копчений 225 грн.jpg"
    ];

    // Automatically parse the filename to extract the name and price
    const products = productFiles.map(filename => {
        // Remove file extension and replace double spaces
        let cleanName = filename.replace(/\.(jpg|jpeg|png)$/i, "").replace(/\./g, "").trim();

        // Find the price (numbers before word "грн")
        // Example matches: "480 грн", "455грн", "450  грн"
        let priceMatch = cleanName.match(/(\d+)\s*грн/i);
        let price = 0;
        let title = cleanName;

        if (priceMatch) {
            price = parseInt(priceMatch[1], 10);
            // Remove the price text from the title
            title = cleanName.replace(priceMatch[0], "").trim();
            // Remove any trailing hyphens or commas
            title = title.replace(/[-_,]+$/, "").trim();
        }

        // Capitalize first letter of title for aesthetics
        if (title.length > 0) {
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        return {
            title: title,
            image: filename,
            price: price
        };
    });

    // Add categories to products
    products.forEach(product => {
        let titleLower = product.title.toLowerCase();
        let categories = ['all']; // Every product belongs to 'all'

        // Determine unit (kg or pcs)
        if (titleLower.includes('консерва') || titleLower.includes('паштет') ||
            titleLower.includes('тушонка') || titleLower.includes('кілька') ||
            titleLower.includes('намазка')) {
            product.unit = 'pcs';
        } else {
            product.unit = 'kg';
        }

        // Rule-based categorization
        if (titleLower.includes('барабуля') || titleLower.includes('вомер') || titleLower.includes('дорадо') ||
            titleLower.includes('мойва') || titleLower.includes('окунь') || titleLower.includes('сайра') ||
            titleLower.includes('скумбрія') || titleLower.includes('ставрида') || titleLower.includes('кілька') ||
            titleLower.includes('салака') || titleLower.includes('рибний')) {
            categories.push('fish');
        }

        if (titleLower.includes('биток') || titleLower.includes('вирізка') || titleLower.includes('вуха') ||
            titleLower.includes('ковбаса') || titleLower.includes('ошийок') || titleLower.includes('підчеревина') ||
            titleLower.includes('ребро') || titleLower.includes('рулет') || titleLower.includes('намазка з сала') ||
            titleLower.includes('кабаноси') || titleLower.includes('печінковий')) {
            categories.push('pork');
        }

        if (titleLower.includes('гомілки') || titleLower.includes('куряча') || titleLower.includes('куряче') ||
            titleLower.includes('курячі') || titleLower.includes('перепілка') || titleLower.includes('стегно') ||
            titleLower.includes('серце') || titleLower.includes('крило')) {
            categories.push('chicken');
        }

        if (titleLower.includes('яловича')) {
            categories.push('beef');
        }

        // Add 'beer' category for specific items
        if (titleLower.includes('джерки') || titleLower.includes('кабаноси') || titleLower.includes('вуха') ||
            titleLower.includes('барабуля') || titleLower.includes('вомер') || titleLower.includes('мойва')) {
            categories.push('beer');
        }

        product.categories = categories;
    });

    const productGrid = document.getElementById("product-grid");
    const cartCountEl = document.querySelector(".cart-count");

    // Cart Elements
    const cartOverlay = document.getElementById("cart-overlay");
    const cartIcon = document.querySelector(".cart-icon");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalPriceEl = document.getElementById("cart-total-price");
    const checkoutForm = document.getElementById("checkout-form");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let cart = [];

    // Generate product cards function
    function renderProducts(filterCategory = 'all') {
        productGrid.innerHTML = ''; // Clear grid

        const filteredProducts = products.filter(product => product.categories.includes(filterCategory));

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1;">В цій категорії поки немає товарів.</p>';
            return;
        }

        filteredProducts.forEach((product, index) => {
            // Find original index for cart functionality
            const originalIndex = products.findIndex(p => p.title === product.title);

            const card = document.createElement("div");
            card.className = "product-card animate-in";
            // Reduce animation delay to make it snappier when filtering
            card.style.animationDelay = `${(index % 10) * 0.03}s`;

            const unitLabel = product.unit === 'pcs' ? 'шт' : 'кг';

            let selectionControl = '';
            if (product.unit === 'pcs') {
                selectionControl = `
                    <div class="quantity-selector">
                        <input type="number" class="item-qty" value="1" min="1" max="50" step="1" id="qty-${originalIndex}">
                        <span>шт</span>
                    </div>
                `;
            } else {
                let options = '';
                for (let w = 0.1; w <= 2.0; w += 0.1) {
                    let weight = w.toFixed(1);
                    let selected = (weight === "1.0") ? "selected" : "";
                    options += `<option value="${weight}" ${selected}>${weight} кг</option>`;
                }
                selectionControl = `
                    <div class="quantity-selector">
                        <select class="item-qty" id="qty-${originalIndex}">
                            ${options}
                        </select>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="price-row">
                        <span class="price-placeholder">~${product.price} грн / ${unitLabel}</span>
                    </div>
                    <div class="product-action">
                        ${selectionControl}
                        <button class="add-to-cart" data-index="${originalIndex}">В кошик</button>
                    </div>
                </div>
            `;

            productGrid.appendChild(card);
        });

        // Re-attach event listeners to new buttons
        attachAddToCartListeners();
    }

    // Initial render
    renderProducts();

    // Filter Button Logic
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove("active"));
            // Add active class to clicked
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");
            renderProducts(filterValue);
        });
    });

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            const itemSum = item.price * item.amount;
            total += itemSum;

            const amountDisplay = item.unit === 'pcs' ? `${item.amount} шт.` : `${item.amount.toFixed(1)} кг`;

            const cartItemEl = document.createElement("div");
            cartItemEl.className = "cart-item";
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${amountDisplay} x ~${item.price} грн = ~${Math.round(itemSum)} грн</div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });

        cartCountEl.textContent = cart.length;
        cartTotalPriceEl.textContent = `~${Math.round(total)} грн`;

        // Attach remove events
        document.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const itemIndex = e.target.getAttribute("data-index");
                cart.splice(itemIndex, 1);
                updateCartUI();
            });
        });
    }

    // Add to cart functionality
    function attachAddToCartListeners() {
        document.querySelectorAll(".add-to-cart").forEach(btn => {
            // Remove existing listeners to prevent duplicates if function called multiple times
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll(".add-to-cart").forEach(btn => {
            btn.addEventListener("click", function () {
                const productIndex = this.getAttribute("data-index");
                const product = products[productIndex];

                // Check if already in cart
                const qtyInput = document.getElementById(`qty-${productIndex}`);
                const amount = parseFloat(qtyInput.value) || 1;

                const existingItem = cart.find(i => i.title === product.title);
                if (existingItem) {
                    existingItem.amount += amount;
                } else {
                    cart.push({ ...product, amount: amount });
                }

                updateCartUI();

                // Animation for button
                const originalText = this.textContent;
                this.textContent = "Додано!";
                this.style.background = "var(--accent-gold)";
                this.style.color = "var(--bg-dark)";

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = "transparent";
                    this.style.color = "var(--accent-gold)";
                }, 1000);

                // Cart bounce animation
                cartCountEl.parentElement.style.transform = "scale(1.3)";
                setTimeout(() => {
                    cartCountEl.parentElement.style.transform = "scale(1)";
                }, 200);
            });
        });
    }

    // Cart Modal Toggles
    cartIcon.addEventListener("click", () => {
        cartOverlay.classList.add("active");
    });

    closeCartBtn.addEventListener("click", () => {
        cartOverlay.classList.remove("active");
    });

    cartOverlay.addEventListener("click", (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove("active");
        }
    });

    // Form Submission (Web3Forms Integration)
    const submitBtn = document.getElementById("submit-btn");
    const formResult = document.getElementById("form-result");

    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Ваш кошик порожній. Додайте товари перед оформленням замовлення.");
            return;
        }

        let totalOrderSum = 0;
        let orderList = cart.map(item => {
            const itemSum = Math.round(item.price * item.amount);
            totalOrderSum += itemSum;
            const amountDisplay = item.unit === 'pcs' ? `${item.amount} шт.` : `${item.amount.toFixed(1)} кг`;
            return `- ${item.title}: ${amountDisplay} x ~${item.price} грн = ~${itemSum} грн`;
        });

        orderList.push(`\nЗагальна сума (орієнтовно): ~${totalOrderSum} грн`);

        document.getElementById("orderDetails").value = orderList.join("\n");

        const formData = new FormData(checkoutForm);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        const json = JSON.stringify(object);

        submitBtn.textContent = "Обробка...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            });

            const jsonResponse = await response.json();

            if (response.status === 200) {
                formResult.style.display = "block";
                formResult.style.color = "#4BB543";
                formResult.textContent = "Дякуємо! Ваше замовлення успішно відправлено.";

                // Clear cart
                cart = [];
                updateCartUI();
                checkoutForm.reset();

                setTimeout(() => {
                    formResult.style.display = "none";
                    cartOverlay.classList.remove("active");
                    submitBtn.textContent = "Відправити замовлення";
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                console.log(response);
                formResult.style.display = "block";
                formResult.style.color = "#ff4d4d";
                formResult.textContent = "❌ Помилка: " + jsonResponse.message;
                submitBtn.textContent = "Відправити замовлення";
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.log(error);
            formResult.style.display = "block";
            formResult.style.color = "#ff4d4d";
            formResult.textContent = "❌ Сталася помилка. Перевірте з'єднання з інтернетом.";
            submitBtn.textContent = "Відправити замовлення";
            submitBtn.disabled = false;
        }
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
