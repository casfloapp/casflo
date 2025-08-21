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
        console.warn("Casflo API initialization function (App.initPage) not found.");
    }
};

const routeHandler = async () => {
    // --- Logika untuk menangani callback Google secara khusus ---
    if (window.location.pathname === '/auth/callback') {
        if (window.App && typeof window.App.initPage === 'function') {
            window.App.initPage('auth/callback');
        }
        return; 
    }

    const token = localStorage.getItem('sessionToken');
    let path = window.location.pathname;
    
    // Logika Redirect
    if (token && ['/login', '/create-account', '/two-step', '/'].includes(path)) {
        history.replaceState(null, '', '/dashboard');
        path = '/dashboard';
    } else if (!token && !['/login', '/create-account', '/two-step', '/auth/callback'].includes(path)) {
        history.replaceState(null, '', '/login');
        path = '/login';
    }
    
    // Tampilkan/sembunyikan layout
    const appContainer = document.getElementById('app-container');
    const authContainer = document.getElementById('auth-container');
    const isAuthPage = ['/login', '/create-account', '/two-step'].includes(path);

    if (appContainer) appContainer.style.display = isAuthPage ? 'none' : 'block';
    if (authContainer) authContainer.style.display = isAuthPage ? 'block' : 'none';

    const pageName = path.substring(1) || 'login';
    // [PERBAIKAN] Menggunakan path folder '/pages/' agar konsisten
    const filePath = `/pages/${pageName.replace(/_/g, '-')}.html`; 
    const contentDiv = isAuthPage ? authContainer : document.getElementById("content");

    if (contentDiv) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`File not found: ${filePath}`);
            contentDiv.innerHTML = await response.text();
            document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ')} | Casflo`;
            reinitializeThemeScripts(pageName);
        } catch (error) {
            console.error("Error fetching page: ", error);
            contentDiv.innerHTML = `<div class="p-10 text-center"><h2>404 - Halaman Tidak Ditemukan</h2><p>Halaman yang Anda cari tidak ada.</p><a href="/login" data-link class="text-blue-600">Kembali ke Login</a></div>`;
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
