// utils/navigation.js

// Impor fungsi inisialisasi dari app.js
import { initializePageEventListeners } from '../static/app.js';

/**
 * Fungsi utama untuk navigasi halaman secara dinamis (SPA)
 * @param {string} path - URL tujuan (e.g., '/wallet')
 */
export async function navigate(path) {
    try {
        const response = await fetch(path, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!response.ok) throw new Error('Halaman tidak dapat dimuat.');
        
        const newContent = await response.text();
        
        // Ganti konten di dalam wrapper
        document.getElementById('page-content-wrapper').innerHTML = newContent;
        // Perbarui URL di browser tanpa reload
        window.history.pushState({path: path}, '', path);

        // Jalankan kembali semua event listener untuk konten baru
        initializePageEventListeners();

    } catch (error) {
        console.error('Gagal navigasi:', error);
        // Jika gagal, lakukan navigasi biasa sebagai fallback
        window.location.href = path;
    }
};

/**
 * Handler untuk semua klik pada link navigasi
 */
export function handleNavClick(event) {
    event.preventDefault();
    const path = event.currentTarget.getAttribute('href');
    if (path && path !== window.location.pathname) {
        navigate(path);
    }
};