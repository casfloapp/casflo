import MainPage from './pages/MainPage.js';
import WalletPage from './pages/WalletPage.js';
import CreatePage from './pages/CreatePage.js';

const routes = {
    '/': MainPage,
    '/wallet': WalletPage,
    '/create': CreatePage
};

// Fungsi router utama di sisi klien
const router = async () => {
    const app = document.getElementById('app');
    if (!app) return;

    const path = location.pathname;
    const page = routes[path] || routes['/']; // Default ke halaman utama

    // Render HTML dan jalankan skrip halaman
    app.innerHTML = await page.render();
    await page.after_render();
};

// Event listener untuk navigasi SPA
window.addEventListener('popstate', router); // Untuk tombol back/forward browser
window.addEventListener('DOMContentLoaded', () => {
    // Tangani semua klik link internal agar tidak me-refresh halaman
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.href.startsWith(location.origin)) {
            e.preventDefault(); // Hentikan navigasi browser default
            const path = new URL(link.href).pathname;
            if (path !== location.pathname) {
                history.pushState(null, '', path); // Ubah URL di address bar
                router(); // Render halaman baru
            }
        }
    });
    router(); // Render halaman awal saat pertama kali dimuat
});

// Ekspor string kosong agar bisa diimpor oleh index.js
export default "";
