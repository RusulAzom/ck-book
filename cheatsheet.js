// ----------------------------------------------------
// CK Book Cheat Sheet Page JavaScript
// Features: Hash Routing, Dark Mode, Lightbox Preview,
// Live Sidebar Search, Mobile Drawer Toggle
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const body = document.body;
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const topicSearchInput = document.getElementById("topicSearch");
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const contentSections = document.querySelectorAll(".content-section");
    
    // Lightbox Elements
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");

    // Local Storage keys
    const THEME_KEY = "git_learn_theme";

    // 1. Theme Toggle System
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === "light") {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    themeToggleBtn.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem(THEME_KEY, "light");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            localStorage.setItem(THEME_KEY, "dark");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // 2. Mobile Navigation Drawer Toggle
    function toggleSidebar() {
        sidebar.classList.toggle("open");
        sidebarOverlay.classList.toggle("open");
    }

    if (menuToggleBtn) menuToggleBtn.addEventListener("click", toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

    // 3. SPA Routing (Hash Change Router)
    function router() {
        const hash = window.location.hash.substring(1) || "html-cheatsheet";
        const targetId = `sec-${hash}`;
        
        // Find if target section exists
        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            // Hide all sections, show active
            contentSections.forEach(sec => sec.classList.remove("active"));
            activeSection.classList.add("active");

            // Update sidebar links active class
            sidebarLinks.forEach(link => {
                const linkId = link.getAttribute("data-id");
                if (linkId === hash) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            // Scroll main view to top
            window.scrollTo(0, 0);
        } else {
            // Fallback to default
            window.location.hash = "html-cheatsheet";
        }
    }

    window.addEventListener("hashchange", () => {
        router();
        // Close sidebar on mobile after clicking link
        if (window.innerWidth <= 992) {
            sidebar.classList.remove("open");
            sidebarOverlay.classList.remove("open");
        }
    });

    // 4. Live Sidebar Search Filter
    topicSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        sidebarLinks.forEach(link => {
            const text = link.querySelector(".link-text").textContent.toLowerCase();
            if (text.includes(query)) {
                link.style.display = "flex";
            } else {
                link.style.display = "none";
            }
        });
    });

    // 5. Lightbox Modal Preview System
    window.openLightbox = function(imgSrc, captionText) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText;
        lightboxModal.classList.add("open");
        body.style.overflow = "hidden"; // Prevent scrolling behind lightbox
    };

    window.closeLightbox = function() {
        lightboxModal.classList.remove("open");
        body.style.overflow = ""; // Re-enable scrolling
        // Clear src after fade transition
        setTimeout(() => {
            if (!lightboxModal.classList.contains("open")) {
                lightboxImg.src = "";
            }
        }, 300);
    };

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener("click", closeLightbox);
    }

    // Close lightbox on click outside the image
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightboxModal.classList.contains("open")) {
            closeLightbox();
        }
    });

    // Initial Execution
    initTheme();
    router();
});
