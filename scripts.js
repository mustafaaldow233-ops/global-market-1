/* scripts.js - تحكم كامل بالموقع */

// تحميل البيانات من API محلي
async function loadData() {
    try {
        const response = await fetch("./data/api_data.json");
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("خطأ في تحميل البيانات:", e);
        return null;
    }
}

/* -------------------------------
   نظام البحث Search System
-------------------------------- */
async function runSearch() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsBox = document.getElementById("searchResults");

    if (!query) {
        resultsBox.innerHTML = `<div class="empty-box">اكتب كلمة للبحث…</div>`;
        return;
    }

    const db = await loadData();

    if (!db) {
        resultsBox.innerHTML = `<div class="empty-box">فشل تحميل البيانات</div>`;
        return;
    }

    const allItems = [
        ...db.cars,
        ...db.hotels,
        ...db.flights,
        ...db.transport,
        ...db.business
    ];

    const results = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
        resultsBox.innerHTML = `<div class="empty-box">لا توجد نتائج</div>`;
        return;
    }

    resultsBox.innerHTML = results
        .map(item => `
            <div class="result-item">
                <h4>${item.title}</h4>
                <div class="meta">${item.country} • ${item.category}</div>
            </div>
        `)
        .join("");
}

/* -------------------------------
   تغيير اللغة Language Switch
-------------------------------- */
function switchLang(lang) {
    if (lang === "ar") {
        document.body.dir = "rtl";
        document.body.style.fontFamily = "'Noto Sans Arabic', sans-serif";
        localStorage.setItem("lang", "ar");
    } else {
        document.body.dir = "ltr";
        document.body.style.fontFamily = "Arial";
        localStorage.setItem("lang", "en");
    }
}

// تحميل اللغة المحفوظة
(function () {
    const saved = localStorage.getItem("lang");
    if (saved) switchLang(saved);
})();

/* -------------------------------
   تحميل الدول في القائمة
-------------------------------- */
async function loadCountries() {
    const countrySelect = document.getElementById("countrySelect");
    if (!countrySelect) return;

    const db = await loadData();
    if (!db) return;

    countrySelect.innerHTML = db.countries
        .map(c => `<option value="${c}">${c}</option>`)
        .join("");
}

loadCountries();
// -------------------------------
//  نظام الإعلانات – تخزين محلي
// -------------------------------

// تحميل الإعلانات
function loadAds() {
    return JSON.parse(localStorage.getItem("ads")) || [];
}

// حفظ الإعلانات
function saveAds(ads) {
    localStorage.setItem("ads", JSON.stringify(ads));
}

// إضافة إعلان جديد
function addAd(title, description, image) {
    const ads = loadAds();
    const newAd = {
        id: Date.now(),
        title,
        description,
        image,
        date: new Date().toLocaleDateString()
    };
    ads.push(newAd);
    saveAds(ads);
}

// تعديل إعلان
function updateAd(id, title, description, image) {
    const ads = loadAds();
    const updated = ads.map(ad =>
        ad.id === id ? { ...ad, title, description, image } : ad
    );
    saveAds(updated);
}

// حذف إعلان
function deleteAd(id) {
    const ads = loadAds().filter(ad => ad.id !== id);
    saveAds(ads);
}

// عرض الإعلانات في أي صفحة تستخدم هذا الكود
function displayAds(containerId) {
    const ads = loadAds();
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = ads.map(ad => `
        <div class="ad-card">
            <img src="${ad.image}" alt="" class="ad-img">
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            <small>${ad.date}</small>
        </div>
    `).join("");
        }
