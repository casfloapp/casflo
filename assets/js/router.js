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
    // --- [BARU] Logika untuk menangani callback Google secara khusus ---
    if (window.location.pathname === '/auth/callback') {
        // Ini adalah rute virtual, tidak perlu memuat HTML.
        // Cukup panggil fungsi handler-nya dari apps.js
        if (window.App && typeof window.App.initPage === 'function') {
            window.App.initPage('auth/callback');
        }
        return; // Hentikan eksekusi lebih lanjut untuk rute ini
    }

    // --- Logika yang sudah ada (tidak berubah) ---
    const token = localStorage.getItem('sessionToken');
    let path = window.location.pathname;
    
    if (token && ['/login', '/create-account', '/two-step', '/'].includes(path)) {
        history.replaceState(null, '', '/dashboard');
        path = '/dashboard';
    } else if (!token && !['/login', '/create-account', '/two-step'].includes(path)) {
        history.replaceState(null, '', '/login');
        path = '/login';
    }
    
    const appContainer = document.getElementById('app-container');
    const authContainer = document.getElementById('auth-container');
    const isAuthPage = ['/login', '/create-account', '/two-step'].includes(path);

    appContainer.style.display = isAuthPage ? 'none' : 'block';
    authContainer.style.display = isAuthPage ? 'block' : 'none';

    const pageName = path.substring(1) || 'login';
    const filePath = `/pages/${pageName}.html`; 
    const contentDiv = isAuthPage ? authContainer : document.getElementById("content");


};


// Event untuk tombol back/forward browser
window.addEventListener("popstate", routeHandler);

// Panggil saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", routeHandler);
