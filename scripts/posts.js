/* posts.js – إدارة الإعلانات (منشورات) – كامل وجاهز */

// تحميل المنشورات من localStorage
function loadPosts() {
    return JSON.parse(localStorage.getItem("posts") || "[]");
}

// حفظ المنشورات
function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// الحصول على ID من رابط الصفحة
function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// عرض جميع المنشورات في posts.html
function displayAllPosts() {
    let container = document.getElementById("postsList");
    if (!container) return;

    let posts = loadPosts();
    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = `<p class="empty-box">لا توجد منشورات حالياً.</p>`;
        return;
    }

    posts.forEach(p => {
        let box = document.createElement("a");
        box.href = `post.html?id=${p.id}`;
        box.className = "post-item";

        box.innerHTML = `
            <h3>${p.title}</h3>
            <p class="meta">${p.date}</p>
        `;

        container.appendChild(box);
    });
}

// ----------------------------
//      إضافة منشور
// ----------------------------
function addPost() {
    let title = document.getElementById("postTitle").value.trim();
    let content = document.getElementById("postContent").value.trim();
    let image = document.getElementById("postImage").value;

    if (!title || !content) {
        alert("أكمل الحقول المطلوبة");
        return;
    }

    let posts = loadPosts();

    let newPost = {
        id: Date.now(),
        title,
        content,
        image,
        date: new Date().toLocaleString("ar")
    };

    posts.unshift(newPost); // نضيف أول القائمة
    savePosts(posts);

    alert("تم إضافة المنشور بنجاح!");
    window.location.href = "posts.html";
}

// ----------------------------
//     عرض منشور واحد
// ----------------------------
function displaySinglePost() {
    let titleBox = document.getElementById("postTitle");
    let contentBox = document.getElementById("postContent");
    let imgBox = document.getElementById("postImage");
    let editBtn = document.getElementById("editBtn");

    if (!titleBox) return;

    let posts = loadPosts();
    let id = getPostId();
    let post = posts.find(p => p.id == id);

    if (!post) {
        titleBox.innerText = "لم يتم العثور على المنشور";
        return;
    }

    titleBox.innerText = post.title;
    contentBox.innerHTML = post.content.replace(/\n/g, "<br>");

    if (post.image) {
        imgBox.src = post.image;
        imgBox.style.display = "block";
    }

    editBtn.onclick = () => {
        window.location.href = `edit-post.html?id=${post.id}`;
    };
}

// ----------------------------
//       تعديل منشور
// ----------------------------
function loadEditPost() {
    let titleInput = document.getElementById("postTitle");
    let contentInput = document.getElementById("postContent");
    let imgInput = document.getElementById("postImage");

    if (!titleInput) return;

    let posts = loadPosts();
    let id = getPostId();
    let post = posts.find(p => p.id == id);

    if (!post) {
        alert("المنشور غير موجود");
        return;
    }

    titleInput.value = post.title;
    contentInput.value = post.content;
    imgInput.value = post.image;
}

function saveEdit() {
    let title = document.getElementById("postTitle").value.trim();
    let content = document.getElementById("postContent").value.trim();
    let image = document.getElementById("postImage").value;

    let posts = loadPosts();
    let id = getPostId();
    let post = posts.find(p => p.id == id);

    post.title = title;
    post.content = content;
    post.image = image;

    savePosts(posts);
    alert("تم حفظ التعديلات");
    window.location.href = "posts.html";
}

// ----------------------------
//        حذف منشور
// ----------------------------
function deletePost() {
    let id = getPostId();
    let posts = loadPosts();

    let newList = posts.filter(p => p.id != id);
    savePosts(newList);

    alert("تم حذف المنشور");
    window.location.href = "posts.html";
}

// ----------------------------
//  تشغيل الصفحات تلقائياً
// ----------------------------

window.onload = () => {
    displayAllPosts();
    displaySinglePost();
    loadEditPost();
};
