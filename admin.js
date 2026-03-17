import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// DOM Elements
const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

const productForm = document.getElementById("product-form");
const productListEl = document.getElementById("product-list");
const toastEl = document.getElementById("toast");

// Form inputs
const titleInput = document.getElementById("p-title");
const priceInput = document.getElementById("p-price");
const unitInput = document.getElementById("p-unit");
const imageInput = document.getElementById("p-image-url");
const imagePreview = document.getElementById("image-preview");
const categoryInputs = document.querySelectorAll('input[name="category"]');
const availableInput = document.getElementById("p-available");
const docIdInput = document.getElementById("doc-id");
const saveBtn = document.getElementById("save-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formTitle = document.getElementById("form-title");

let currentProducts = [];

// Toast notification function
function showToast(message, type = "success") {
    toastEl.textContent = message;
    toastEl.className = "toast show " + type;
    setTimeout(() => { toastEl.className = "toast"; }, 3000);
}

// ─── AUTHENTICATION ──────────────────────────────────────────

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        logoutBtn.classList.remove("hidden");
        loadProducts();
    } else {
        // User is signed out
        authSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
        logoutBtn.classList.add("hidden");
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    
    try {
        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        emailInput.value = "";
        passwordInput.value = "";
    } catch (error) {
        console.error(error);
        loginError.textContent = "Помилка входу: " + error.message;
    }
});

logoutBtn.addEventListener("click", () => signOut(auth));


// ─── PRODUCTS CRUD ──────────────────────────────────────────

async function loadProducts() {
    productListEl.innerHTML = '<div style="text-align:center; padding:20px;">Завантаження...</div>';
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        currentProducts = [];
        querySnapshot.forEach((doc) => {
            currentProducts.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort alphabetically
        currentProducts.sort((a, b) => a.title.localeCompare(b.title));
        renderProductList();
    } catch (error) {
        console.error("Error loadProducts:", error);
        productListEl.innerHTML = '<div style="color:red; padding:20px;">Помилка завантаження бази даних. Перевірте правила безпеки Firestore.</div>';
    }
}

function renderProductList() {
    productListEl.innerHTML = "";
    if (currentProducts.length === 0) {
        productListEl.innerHTML = "<div>Товарів ще немає.</div>";
        return;
    }

    currentProducts.forEach(product => {
        const isAvailable = product.available !== false; // Default to true if undefined
        const categories = product.categories || [];
        const unit = product.unit === 'pcs' ? 'шт' : 'кг';
        
        const card = document.createElement("div");
        card.className = "admin-product-card" + (isAvailable ? "" : " unavailable");
        
        card.innerHTML = `
            <img src="${product.image}" class="admin-img-preview" alt="фото" onerror="this.src='Олімп логотип.png'">
            <div class="admin-product-info">
                <div style="font-weight: bold; font-size: 1.1em; color: white;">${product.title} ${!isAvailable ? '(Немає)' : ''}</div>
                <div style="color: var(--accent-gold);">${product.price} грн / ${unit}</div>
                <div style="font-size: 0.8em; color: #999; margin-top: 4px;">Категорії: ${categories.join(', ')}</div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-edit" data-id="${product.id}">Редагувати</button>
                <button class="btn-delete" data-id="${product.id}">Видалити</button>
            </div>
        `;
        productListEl.appendChild(card);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", (e) => editProduct(e.target.dataset.id));
    });
    
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => deleteProductConf(e.target.dataset.id));
    });
}

// ─── FORM HANDLING (ADD & EDIT) ──────────────────────────────────

// Preview image when URL is entered
imageInput.addEventListener("input", function() {
    const url = this.value.trim();
    if (url) {
        imagePreview.src = url;
        imagePreview.style.display = "block";
    } else {
        imagePreview.style.display = "none";
    }
});

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = "Збереження...";
    
    try {
        let imageUrl = imageInput.value.trim();
        
        if (!imageUrl) {
            // Default image if empty
            imageUrl = "Олімп логотип.png";
        }
        
        // Gather selected categories
        const selectedCategories = ['all']; // Ensure 'all' is always there
        categoryInputs.forEach(cb => {
            if (cb.checked) selectedCategories.push(cb.value);
        });

        const productData = {
            title: titleInput.value.trim(),
            price: Number(priceInput.value),
            unit: unitInput.value,
            image: imageUrl,
            categories: selectedCategories,
            available: availableInput.checked
        };
        
        const editingId = docIdInput.value;
        
        if (editingId) {
            // Update existing
            await updateDoc(doc(db, "products", editingId), productData);
            showToast("Товар успішно оновлено!");
        } else {
            // Add new
            await addDoc(collection(db, "products"), productData);
            showToast("Новий товар успішно додано!");
        }
        
        resetForm();
        loadProducts();
    } catch (error) {
        console.error("Save error:", error);
        showToast("Помилка збереження: " + error.message, "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Зберегти товар";
    }
});

function editProduct(id) {
    const product = currentProducts.find(p => p.id === id);
    if (!product) return;
    
    formTitle.textContent = "Редагування товару";
    docIdInput.value = product.id;
    titleInput.value = product.title;
    priceInput.value = product.price;
    unitInput.value = product.unit || 'kg';
    imageInput.value = product.image || '';
    availableInput.checked = product.available !== false;
    
    // Categories
    const cats = product.categories || [];
    categoryInputs.forEach(cb => cb.checked = cats.includes(cb.value));
    
    // Image preview
    if (product.image) {
        imagePreview.src = product.image;
        imagePreview.style.display = "block";
    } else {
        imagePreview.style.display = "none";
    }
    
    saveBtn.textContent = "Оновити товар";
    cancelEditBtn.classList.remove("hidden");
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
    productForm.reset();
    docIdInput.value = "";
    imageInput.value = "";
    imagePreview.style.display = "none";
    formTitle.textContent = "Додати новий товар";
    saveBtn.textContent = "Зберегти товар";
    cancelEditBtn.classList.add("hidden");
    // Default categories unchecked except 'all' which is hardcoded in the push logic
}

async function deleteProductConf(id) {
    if (confirm("Ви впевнені, що хочете видалити цей товар? Цю дію не можна скасувати.")) {
        try {
            await deleteDoc(doc(db, "products", id));
            showToast("Товар видалено");
            loadProducts();
        } catch (error) {
            console.error("Delete error:", error);
            showToast("Помилка видалення", "error");
        }
    }
}


// ─── MIGRATION SCRIPT (DEV TOOL) ──────────────────────────────────
// This button allows fast bootstrapping of the DB parsing existing files

document.getElementById("migrate-btn").addEventListener("click", async () => {
    if (!confirm("Увага! Це завантажить всі старі товари з файлу в базу даних. Використовуйте лише один раз при налаштуванні. Продовжити?")) return;
    
    const logEl = document.getElementById("migrate-log");
    const testFiles = ["Барабуля г.к 480 грн.jpg", "Биток копчений 455грн.jpg", "Биток сирокопчений 470 грн.jpg", "Вирізка копчена 480 грн.jpg", "Вирізка сирокопчена 490 грн.jpg", "Вомер х.к 350 грн.jpg", "Вуха різані в соусі 410 грн.jpg", "Гомілки копчені 170 грн.jpg", "Джерки 1250 грн.jpg", "Дорадо х.к 750 грн.jpg", "Кабаноси сушені 800 грн.jpg", "Ковбаса  450 грн..jpg", "Ковбаса Рубана Свино-яловича 450 грн.jpg", "Ковбаса Сервілат 400 грн..jpg", "Ковбаса Шахтарська 450 грн..jpg", "Ковбаса домашня 450 грн.jpg", "Ковбаса куряча філейна 400 грн.jpg", "Консерва короп з овочами 155 грн.jpg", "Крило куряче копчене 235 грн.jpg", "Мойва копчена 400 грн.jpg", "Морський окунь г.к  450 грн.jpg", "Намазка з сала 90 грн.jpg", "Ошийок копчений 480 грн..jpg", "Ошийок сирокопчений 490 грн.jpg", "Паштет печінковий  125 грн.jpg", "Паштет рибний 100грн.jpg", "Перепілка копчена 450 грн.jpg", "Підчеревина копчена 360 грн.jpg", "Ребро копчене 380 грн.jpg", "Рулет зі свинин копчений 380 грн.jpg", "Сайра х.к 400 грн.jpg", "Серце куряче копчене 450 грн.jpg", "Скумбрія х.к 630 грн.jpg", "Ставрида копчена 400 грн.jpg", "Стегно куряче 260 грн.jpg", "Тушонка куряча  100 грн.jpg", "Філе куряче 350 грн.jpg", "Шиї курячі 165грн.jpg", "кілька в томаті з овочами 120 грн.jpg", "салака х.к 230 грн.jpg", "хребет копчений 225 грн.jpg"];
    
    logEl.innerHTML = "Обробка...";
    
    for (let filename of testFiles) {
        let cleanName = filename.replace(/\.(jpg|jpeg|png)$/i, "").replace(/\./g, "").trim();
        let priceMatch = cleanName.match(/(\d+)\s*грн/i);
        let price = 0;
        let title = cleanName;

        if (priceMatch) {
            price = parseInt(priceMatch[1], 10);
            title = cleanName.replace(priceMatch[0], "").trim();
            title = title.replace(/[-_,]+$/, "").trim();
        }
        if (title.length > 0) title = title.charAt(0).toUpperCase() + title.slice(1);

        let titleLower = title.toLowerCase();
        let categories = ['all'];
        let unit = 'kg';

        if (titleLower.includes('консерва') || titleLower.includes('паштет') || titleLower.includes('тушонка') || titleLower.includes('кілька') || titleLower.includes('намазка')) unit = 'pcs';
        if (titleLower.includes('барабуля') || titleLower.includes('вомер') || titleLower.includes('дорадо') || titleLower.includes('мойва') || titleLower.includes('окунь') || titleLower.includes('сайра') || titleLower.includes('скумбрія') || titleLower.includes('ставрида') || titleLower.includes('кілька') || titleLower.includes('салака') || titleLower.includes('рибний')) categories.push('fish');
        if (titleLower.includes('биток') || titleLower.includes('вирізка') || titleLower.includes('вуха') || titleLower.includes('ковбаса') || titleLower.includes('ошийок') || titleLower.includes('підчеревина') || titleLower.includes('ребро') || titleLower.includes('рулет') || titleLower.includes('намазка з сала') || titleLower.includes('кабаноси') || titleLower.includes('печінковий')) categories.push('pork');
        if (titleLower.includes('гомілки') || titleLower.includes('куряча') || titleLower.includes('куряче') || titleLower.includes('курячі') || titleLower.includes('перепілка') || titleLower.includes('стегно') || titleLower.includes('серце') || titleLower.includes('крило')) categories.push('chicken');
        if (titleLower.includes('яловича')) categories.push('beef');
        if (titleLower.includes('джерки') || titleLower.includes('кабаноси') || titleLower.includes('вуха') || titleLower.includes('барабуля') || titleLower.includes('вомер') || titleLower.includes('мойва')) categories.push('beer');

        const productData = {
            title: title,
            price: price,
            unit: unit,
            image: filename,
            categories: categories,
            available: true
        };

        try {
            await addDoc(collection(db, "products"), productData);
            logEl.innerHTML += `<br>Додано: ${title}`;
        } catch (e) {
            logEl.innerHTML += `<br><span style="color:red">Помилка: ${title} - ${e.message}</span>`;
        }
    }
    logEl.innerHTML += "<br><b>Міграція завершена!</b> Обновіть сторінку, якщо список не оновився.";
    loadProducts();
});
