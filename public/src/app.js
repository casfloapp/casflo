// Impor setiap modul halaman. Setiap modul berisi objek dengan fungsi .render() dan .after_render()
import MainPage from './pages/MainPage.js';
import WalletPage from './pages/WalletPage.js';
import CreatePage from './pages/CreatePage.js';

// Definisikan rute aplikasi Anda.
// Kuncinya adalah path URL, dan nilainya adalah modul halaman yang sesuai.
const routes = {
    '/': MainPage,
    '/wallet': WalletPage,
    '/create': CreatePage
};

/**
 * Fungsi router utama di sisi klien.
 * Fungsi ini yang bertanggung jawab untuk mengubah konten halaman tanpa me-refresh.
 */
const router = async () => {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
        console.error("Elemen #app tidak ditemukan!");
        return;
    }

    // Dapatkan path URL saat ini (misal: "/", "/wallet")
    const path = location.pathname;

    // Cari halaman yang cocok dengan path. Jika tidak ditemukan (misal: URL aneh),
    // gunakan halaman utama ('/') sebagai default.
    const page = routes[path] || routes['/'];

    // Langkah 1: Render HTML
    // Panggil fungsi .render() dari modul halaman untuk mendapatkan string HTML-nya.
    appContainer.innerHTML = await page.render();
    
    // Langkah 2: Jalankan Skrip Spesifik Halaman
    // Panggil fungsi .after_render() untuk menambahkan event listener atau
    // menjalankan logika lain yang dibutuhkan oleh halaman tersebut.
    await page.after_render();
};

// --- Event Listener untuk Navigasi SPA ---

// 1. Tangani saat pengguna menggunakan tombol back/forward di browser.
window.addEventListener('popstate', router);

// 2. Setup router saat halaman pertama kali dimuat.
window.addEventListener('DOMContentLoaded', () => {
    // 3. Tangani semua klik link internal agar tidak me-refresh halaman.
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');

        // Pastikan yang diklik adalah link internal (bukan link ke situs lain)
        if (link && link.href.startsWith(location.origin)) {
            e.preventDefault(); // Hentikan navigasi browser default
            const newPath = new URL(link.href).pathname;

            // Hanya navigasi jika path-nya berbeda
            if (newPath !== location.pathname) {
                // Ubah URL di address bar secara programmatic
                history.pushState(null, '', newPath);
                // Panggil router untuk me-render halaman baru
                router();
            }
        }
    });

    // Panggil router untuk pertama kalinya untuk me-render halaman awal.
    router();
});

// Ekspor string kosong agar bisa diimpor sebagai teks oleh index.js (Worker)
export default "";