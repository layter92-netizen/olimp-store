document.addEventListener("DOMContentLoaded", () => {
    // List of products populated dynamically from folder contents
    const products = [
        { title: "Балик 2", image: "Балик 2.jpg", price: 350 },
        { title: "Балик 3", image: "Балик 3.jpg", price: 350 },
        { title: "Балик", image: "Балик.jpg", price: 350 },
        { title: "Ковбаса 1", image: "Ковбаса 1.jpg", price: 250 },
        { title: "Ковбаса 2", image: "Ковбаса 2.jpg", price: 250 },
        { title: "Ковбаса преміум", image: "Ковбаса преміум.jpg", price: 300 },
        { title: "Копчений хребет", image: "Копчений хребет.jpg", price: 150 },
        { title: "Мойва", image: "Мойва.jpg", price: 180 },
        { title: "Паштет", image: "Паштет.jpg", price: 120 },
        { title: "Перепілка", image: "Перепілка.jpg", price: 200 },
        { title: "Сало копченне", image: "Сало копченне.jpg", price: 200 },
        { title: "Свинні вушка", image: "Свинні вушка.jpg", price: 160 },
        { title: "Тушонка з скумбрії", image: "Тушонка з скумбрії.jpg", price: 140 },
        { title: "Тушонка куряча", image: "Тушонка куряча.jpg", price: 120 },
        { title: "Тушонка свинна", image: "Тушонка свинна.jpg", price: 130 },
        { title: "Шиї копченні", image: "Шиї копченні.jpg", price: 110 },
        { title: "Салака копчена", image: "алака коп.jpg", price: 150 },
        { title: "Вирізка копчена", image: "вирізка копчена.jpg", price: 380 },
        { title: "Вомер 2", image: "вомер 2.jpg", price: 220 },
        { title: "Вомер", image: "вомер.jpg", price: 220 },
        { title: "Ковбаса 3", image: "ковбаса 3.jpg", price: 250 },
        { title: "Ковбаса 4", image: "ковбаса 4.jpg", price: 250 },
        { title: "Крило копчене", image: "крило копчене.jpg", price: 140 },
        { title: "Кілечко ковбаски", image: "кілечко ковбаски.jpg", price: 240 },
        { title: "Морський окунь копчений", image: "морський окунь коп..jpg", price: 280 },
        { title: "Намазка", image: "намазка.jpg", price: 100 },
        { title: "Нога куряча копчена", image: "нога куряча коп..jpg", price: 160 },
        { title: "Паштет 1", image: "паштет 1.jpg", price: 120 },
        { title: "Ребро копчене", image: "ребро копчене.jpg", price: 210 },
        { title: "Риба копчена 1", image: "риба коп 1.jpg", price: 260 },
        { title: "Риба копченна", image: "риба копченна.jpg", price: 260 },
        { title: "Рулет 2", image: "рулет 2.jpg", price: 290 },
        { title: "Рулет", image: "рулет.jpg", price: 290 },
        { title: "Салака", image: "салака.jpg", price: 150 },
        { title: "Сало", image: "сало.jpg", price: 190 },
        { title: "Серця курячі копчені", image: "серця курячі коп.jpg", price: 180 },
        { title: "Сиров'ялене м'ясо", image: "сировялене мясо.jpg", price: 400 },
        { title: "Сирокопчений балик", image: "сирокопчений балик.jpg", price: 420 },
        { title: "Скумбрія копчена", image: "скумбрія коп.jpg", price: 230 },
        { title: "Сосиски копчені", image: "сосиски коп.jpg", price: 190 },
        { title: "Тушонка з коропа", image: "тушонка з коропа.jpg", price: 130 },
        { title: "Тушонка товстолоб", image: "тушонка товстолоб.jpg", price: 140 }
    ];

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

        // populate hidden order field
        let orderList = cart.map(item => `- ${item.title}: ${item.quantity} шт.`).join("\n");
        document.getElementById("orderDetails").value = orderList;

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
