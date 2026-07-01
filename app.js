// ----------------------------------------------------
// GitLearn Main JavaScript
// Features: Hash Routing, LocalStorage Progress, Dark Mode, 
// Live Sidebar Search, Code Copier, Error Accordion
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
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const markReadBtn = document.getElementById("markReadBtn");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");

    // All topics list in order
    const topicsOrder = [
        "vcs", "git-vs-github", "git-stages", "git-setup", "subsequent-push", 
        "important-commands", "branches", "merge-conflict", "fork-clone-pr", 
        "keyboard-shortcuts", "beginner-errors", "github-pages", "gitignore"
    ];

    // Local Storage keys
    const THEME_KEY = "git_learn_theme";
    const PROGRESS_KEY = "git_learn_progress";

    // Initialize Settings
    let completedTopics = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
    let currentTopic = "";

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

    menuToggleBtn.addEventListener("click", toggleSidebar);
    sidebarOverlay.addEventListener("click", toggleSidebar);

    // 3. SPA Routing (Hash Change Router)
    function router() {
        const hash = window.location.hash.substring(1) || "vcs";
        const targetId = `sec-${hash}`;
        
        // Find if target section exists
        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            currentTopic = hash;
            
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
            
            // Update Prev/Next buttons
            updateNavControls();

            // Update bottom "Mark as Read" state
            updateMarkReadBtnState();
        } else {
            // Fallback to default
            window.location.hash = "vcs";
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

    // 4. Navigation Controls (Next / Prev)
    function updateNavControls() {
        const currentIndex = topicsOrder.indexOf(currentTopic);
        
        // Previous Button
        if (currentIndex > 0) {
            prevBtn.style.visibility = "visible";
        } else {
            prevBtn.style.visibility = "hidden";
        }

        // Next Button
        if (currentIndex < topicsOrder.length - 1) {
            nextBtn.style.visibility = "visible";
        } else {
            nextBtn.style.visibility = "hidden";
        }
    }

    prevBtn.addEventListener("click", () => {
        const currentIndex = topicsOrder.indexOf(currentTopic);
        if (currentIndex > 0) {
            window.location.hash = topicsOrder[currentIndex - 1];
        }
    });

    nextBtn.addEventListener("click", () => {
        const currentIndex = topicsOrder.indexOf(currentTopic);
        if (currentIndex < topicsOrder.length - 1) {
            window.location.hash = topicsOrder[currentIndex + 1];
        }
    });

    // 5. Progress Tracking System
    function initProgress() {
        // Apply checkmark states based on saved completed topics
        completedTopics.forEach(topicId => {
            const chk = document.getElementById(`chk-${topicId}`);
            if (chk) chk.checked = true;
            
            const link = document.querySelector(`.sidebar-link[data-id="${topicId}"]`);
            if (link) link.classList.add("completed-link");
        });
        calculateProgress();
    }

    window.toggleProgress = function(event, topicId) {
        // Prevent click event from bubbing up to the sidebar link which triggers routing
        event.stopPropagation();
        
        const chk = document.getElementById(`chk-${topicId}`);
        const link = document.querySelector(`.sidebar-link[data-id="${topicId}"]`);
        
        if (chk.checked) {
            if (!completedTopics.includes(topicId)) {
                completedTopics.push(topicId);
            }
            if (link) link.classList.add("completed-link");
        } else {
            completedTopics = completedTopics.filter(id => id !== topicId);
            if (link) link.classList.remove("completed-link");
        }
        
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedTopics));
        calculateProgress();
        updateMarkReadBtnState();
    };

    function calculateProgress() {
        const total = topicsOrder.length;
        const completedCount = completedTopics.length;
        const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
    }

    function updateMarkReadBtnState() {
        const isRead = completedTopics.includes(currentTopic);
        if (isRead) {
            markReadBtn.classList.add("completed");
            markReadBtn.innerHTML = '<i class="fa-solid fa-square-check"></i> পড়া সম্পন্ন হয়েছে';
        } else {
            markReadBtn.classList.remove("completed");
            markReadBtn.innerHTML = '<i class="fa-regular fa-square-check"></i> পড়া শেষ হয়েছে';
        }
    }

    markReadBtn.addEventListener("click", () => {
        const chk = document.getElementById(`chk-${currentTopic}`);
        const link = document.querySelector(`.sidebar-link[data-id="${currentTopic}"]`);
        
        if (!completedTopics.includes(currentTopic)) {
            completedTopics.push(currentTopic);
            if (chk) chk.checked = true;
            if (link) link.classList.add("completed-link");
        } else {
            completedTopics = completedTopics.filter(id => id !== currentTopic);
            if (chk) chk.checked = false;
            if (link) link.classList.remove("completed-link");
        }

        localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedTopics));
        calculateProgress();
        updateMarkReadBtnState();
    });

    window.resetAllProgress = function() {
        if (confirm("আপনি কি নিশ্চিত যে আপনার সমস্ত অগ্রগতি রিসেট করতে চান?")) {
            completedTopics = [];
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedTopics));
            
            // Uncheck all boxes and remove styles
            topicsOrder.forEach(topicId => {
                const chk = document.getElementById(`chk-${topicId}`);
                if (chk) chk.checked = false;
                
                const link = document.querySelector(`.sidebar-link[data-id="${topicId}"]`);
                if (link) link.classList.remove("completed-link");
            });

            calculateProgress();
            updateMarkReadBtnState();
        }
    };

    // 6. Live Sidebar Search Filter
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

    // 7. Code Copy Functionality
    window.copyCode = function(buttonElement) {
        const pre = buttonElement.parentElement.nextElementSibling;
        const codeElement = pre.querySelector("code");
        
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.innerText)
                .then(() => {
                    // Update Button State
                    buttonElement.innerHTML = '<i class="fa-solid fa-check" style="color: var(--primary-green);"></i> Copied!';
                    buttonElement.style.borderColor = "var(--primary-green)";
                    buttonElement.style.color = "var(--primary-green)";
                    
                    // Reset Button after 2s
                    setTimeout(() => {
                        buttonElement.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                        buttonElement.style.borderColor = "";
                        buttonElement.style.color = "";
                    }, 2000);
                })
                .catch(err => {
                    console.error("Could not copy text: ", err);
                    alert("Copy failed. Please manually select and copy.");
                });
        }
    };

    // 8. Error Accordion Toggle Logic
    const errorHeaders = document.querySelectorAll(".error-header");
    errorHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const parent = header.parentElement;
            parent.classList.toggle("open");
        });
    });

    // Initial Execution
    initTheme();
    initProgress();
    router();
});
