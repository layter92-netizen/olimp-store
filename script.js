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

    const productGrid = document.getElementById("product-grid");
    const cartCountEl = document.querySelector(".cart-count");

    // Cart Elements
    const cartOverlay = document.getElementById("cart-overlay");
    const cartIcon = document.querySelector(".cart-icon");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalPriceEl = document.getElementById("cart-total-price");
    const checkoutForm = document.getElementById("checkout-form");

    let cart = [];

    // Generate product cards
    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card animate-in";
        card.style.animationDelay = `${(index % 10) * 0.05}s`;

        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-action">
                    <button class="add-to-cart" data-index="${index}">В кошик</button>
                    <span class="price-placeholder" style="font-size:0.9rem; font-weight:normal;">~${product.price} грн</span>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            count += item.quantity;
            total += item.price * item.quantity;

            const cartItemEl = document.createElement("div");
            cartItemEl.className = "cart-item";
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.quantity} шт. x ~${item.price} грн</div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });

        cartCountEl.textContent = count;
        cartTotalPriceEl.textContent = `~${total} грн`;

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
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", function () {
            const productIndex = this.getAttribute("data-index");
            const product = products[productIndex];

            // Check if already in cart
            const existingItem = cart.find(i => i.title === product.title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
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
            const itemSum = item.price * item.quantity;
            totalOrderSum += itemSum;
            return `- ${item.title}: ${item.quantity} шт. x ~${item.price} грн = ~${itemSum} грн`;
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
