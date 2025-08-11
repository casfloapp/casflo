// /assets/js/router.js - History API-based Router Cerdas

const reinitializeThemeScripts = (pageName) => {
    // Panggil fungsi inisialisasi dari tema (scripts.js)
    if (window.MainApp && typeof window.MainApp.Custom.init === 'function') {
        console.log("Re-initializing theme scripts...");
        window.MainApp.Custom.init();
    } else {
        console.warn("Theme initialization function (MainApp.Custom.init) not found.");
    }

    // Panggil fungsi inisialisasi dari API kita (apps.js)
    if (window.App && typeof window.App.initPage === 'function') {
        console.log(`Initializing page-specific scripts for: ${pageName}`);
        window.App.initPage(pageName);
    } else {
        console.warn("KasKita API initialization function (App.initPage) not found.");
    }
};

const routeHandler = async () => {
    const token = localStorage.getItem('sessionToken');
    let path = window.location.pathname;
    
    // Logika Redirect
    if (token && (path === '/login' || path === '/create-account' || path === '/two-step' || path === '/')) {
        history.replaceState(null, '', '/dashboard');
        path = '/dashboard';
    } else if (!token && !['/login', '/create-account', '/two-step'].includes(path)) {
        history.replaceState(null, '', '/login');
        path = '/login';
    }
    
    // Tampilkan/sembunyikan layout utama vs layout auth
    const appContainer = document.getElementById('app-container');
    const authContainer = document.getElementById('auth-container');
    const navbar = document.getElementById('navbar');
    const isAuthPage = ['/login', '/create-account', '/two-step'].includes(path);

    if (appContainer) appContainer.style.display = isAuthPage ? 'none' : 'block';
    if (navbar) navbar.style.display = isAuthPage ? 'none' : 'block';

    const pageName = path.substring(1) || 'login';
    // Ganti nama file agar konsisten
    const filePath = `/module/${pageName.replace(/_/g, '-')}.html`; 
    const contentDiv = isAuthPage ? authContainer : document.getElementById("content");

    if (contentDiv) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`File not found: ${filePath}`);
            
            contentDiv.innerHTML = await response.text();
            document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | KasKita`;
            
            reinitializeThemeScripts(pageName);

        } catch (error) {
            console.error("Error fetching page: ", error);
            contentDiv.innerHTML = "<h2>404 - Halaman Tidak Ditemukan</h2>";
        }
    }
};

// Mencegat klik pada link
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (link) {
        e.preventDefault();
        const url = link.getAttribute('href');
        if (url !== window.location.pathname) {
            history.pushState({ path: url }, '', url);
            routeHandler();
        }
    }
});

// Event untuk tombol back/forward browser
window.addEventListener("popstate", routeHandler);

// Panggil saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", routeHandler);
