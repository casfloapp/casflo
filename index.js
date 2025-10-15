// index.js

// Impor semua aset yang dibutuhkan sebagai teks mentah
import layoutTemplate from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';
import cssContent from './static/style.css';
import jsContent from './utils/main.js';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // --- Rute untuk Aset Statis (CSS & JS) ---
        // Jika browser meminta file CSS, sajikan isinya
        if (path === '/static/style.css') {
            return new Response(cssContent, {
                headers: { 'Content-Type': 'text/css' },
            });
        }
        // Jika browser meminta file JS, sajikan isinya
        if (path === '/utils/main.js') {
            return new Response(jsContent, {
                headers: { 'Content-Type': 'application/javascript' },
            });
        }

        // --- Logika Routing Halaman HTML ---
        let pageContent;
        switch (path) {
            case '/':
                pageContent = mainContent;
                break;
            case '/wallet':
                pageContent = walletContent;
                break;
            default:
                // Jika halaman tidak ditemukan, redirect ke halaman utama
                return Response.redirect(new URL('/', request.url).toString(), 302);
        }

        // --- Logika Rendering ---
        // Cek jika ini permintaan dari SPA (fetch)
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            return new Response(pageContent, { headers: { 'Content-Type': 'text/html' } });
        }

        // Jika ini halaman penuh, kirim halaman lengkap (sudah termasuk link ke CSS & JS)
        const finalHtml = layoutTemplate.replace('{{PAGE_CONTENT}}', pageContent);
        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};