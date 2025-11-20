/* ------------------------------
   نظام إدارة المنشورات الكامل
   تخزين – إضافة – تعديل – حذف – عرض
   يعمل بالكامل بـ localStorage
------------------------------ */

// جلب المنشورات من التخزين
function getPosts() {
    return JSON.parse(localStorage.getItem("posts") || "[]");
}

// حفظ المنشورات
function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// عرض كل المنشورات في posts.html
if (document.getElementById("postsList")) {
    let posts = getPosts();
    let container = document.getElementById("postsList");

    if (posts.length === 0) {
        container.innerHTML = `<div class="empty-box">لا توجد منشورات</div>`;
    } else {
        container.innerHTML = posts.map((post, i) => `
            <div class="post-card">
                <img src="${post.image}" class="post-img">
                <h3>${post.title}</h3>
                <p class="post-date">${post.date}</p>
                <a class="view-btn" href="post.html?id=${i}">عرض</a>
            </div>
        `).join("");
    }
}

// عرض منشور واحد داخل post.html
if (window.location.pathname.includes("post.html")) {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    let posts = getPosts();
    let post = posts[id];

    if (!post) {
        document.getElementById("postView").innerHTML =
            `<div class="empty-box">المنشور غير موجود</div>`;
    } else {
        document.getElementById("postView").innerHTML = `
            <h2>${post.title}</h2>
            <img src="${post.image}" class="post-img-large">
            <p>${post.content}</p>
            <p class="post-date">📅 ${post.date}</p>

            <a class="edit-btn" href="edit-post.html?id=${id}">تعديل</a>
            <button class="delete-btn" onclick="deletePost(${id})">حذف</button>
        `;
    }
}

// إضافة منشور جديد add-post.html
if (window.location.pathname.includes("add-post.html")) {
    document.getElementById("addPostForm").addEventListener("submit", (e) => {
        e.preventDefault();

        let title = document.getElementById("title").value;
        let content = document.getElementById("content").value;
        let imageInput = document.getElementById("image").files[0];

        if (!imageInput) return alert("الرجاء اختيار صورة");

        let reader = new FileReader();
        reader.onload = function () {
            let posts = getPosts();

            posts.push({
                title,
                content,
                image: reader.result,
                date: new Date().toLocaleDateString()
            });

            savePosts(posts);
            window.location.href = "posts.html";
        };
        reader.readAsDataURL(imageInput);
    });
}

// تعديل منشور edit-post.html
if (window.location.pathname.includes("edit-post.html")) {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    let posts = getPosts();
    let post = posts[id];

    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;

    document.getElementById("editPostForm").addEventListener("submit", (e) => {
        e.preventDefault();

        post.title = document.getElementById("title").value;
        post.content = document.getElementById("content").value;

        let imageInput = document.getElementById("image").files[0];

        if (imageInput) {
            let reader = new FileReader();
            reader.onload = function () {
                post.image = reader.result;
                savePosts(posts);
                window.location.href = "post.html?id=" + id;
            };
            reader.readAsDataURL(imageInput);
        } else {
            savePosts(posts);
            window.location.href = "post.html?id=" + id;
        }
    });
}

// حذف منشور
function deletePost(id) {
    if (confirm("هل تريد حذف المنشور؟")) {
        let posts = getPosts();
        posts.splice(id, 1);
        savePosts(posts);
        window.location.href = "posts.html";
    }
}
