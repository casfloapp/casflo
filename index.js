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

        // --- Logika Routing Halaman ---
        let pageContent;
        switch (path) {
            case '/':
                pageContent = mainContent;
                break;
            case '/wallet':
                pageContent = walletContent;
                break;
            // Jika Anda ingin menambah halaman baru, cukup tambahkan di sini
            // case '/profile':
            //     pageContent = profileContent; // (setelah mengimpor profileContent)
            //     break;
            default:
                // Jika halaman tidak ditemukan, kita arahkan kembali ke halaman utama
                return Response.redirect(new URL('/', request.url).toString(), 302);
        }

        // --- Logika Rendering ---

        // Cek jika ini permintaan dari SPA (fetch dari front-end)
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            // Jika ya, kirim potongan konten HTML-nya saja
            return new Response(pageContent, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            });
        }

        // Jika ini permintaan halaman penuh (pertama kali dibuka atau refresh)
        // Gabungkan semuanya menjadi satu file HTML lengkap
        let finalHtml = layoutTemplate
            .replace('{{PAGE_CONTENT}}', pageContent)
            .replace('<style></style>', `<style>${cssContent}</style>`)
            .replace('<script></script>', `<script>${jsContent}</script>`);

        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};