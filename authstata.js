// authState.js

// التحقق من حالة تسجيل الدخول
document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");

    // لو الزول ما مسجل دخول، يمنعو من صفحات الإضافة والتحرير
    const protectedPages = ["add.html", "edit.html"];

    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage) && !user) {
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
        return;
    }

    // لو داير تورّي اسم المستخدم فوق (اختياري)
    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay && user) {
        userDisplay.textContent = `مرحباً ${user}`;
        <script type="module" src="authState.js"></script>
    }
});
