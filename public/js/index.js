document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const body = document.querySelector(".main-body");
  if (header) {
    body.style.paddingTop = `${header.offsetHeight}px`;
  }

  const sidebar = document.getElementById("adminSidebar");
  const toggleBtn = document.getElementById("admin-sidebar-toggle");
  const closeBtn = document.getElementById("admin-sidebar-close");

  // Hiển thị sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("show");
    toggleBtn.classList.remove("show");
  });

  // Ẩn sidebar
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("show");
    toggleBtn.classList.add("show");
  });
});

window.addEventListener("scroll", function () {
  const button = document.getElementById("scrollToTop");
  if (window.scrollY > 300) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
});

document.getElementById("scrollToTop").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const searchInput = document.getElementById("searchInput");
const resultBox = document.getElementById("resultBox");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query.length > 0) {
    const response = await fetch(`/search?query=${query}`);
    const results = await response.json();
    console.log(results);

    if (results.length > 0) {
      resultBox.innerHTML = results
        .map(
          (item) =>
            `<a href="${item.link}" class="list-group-item list-group-item-action text-black">${item.name}</a>`
        )
        .join("");
      resultBox.style.display = "block";
    } else {
      resultBox.innerHTML =
        "<p class='text-muted text-black text-align-center'>Không có kết quả.</p>";
    }
  } else {
    resultBox.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!resultBox.contains(e.target) && e.target !== searchInput) {
    resultBox.style.display = "none";
  }
});
