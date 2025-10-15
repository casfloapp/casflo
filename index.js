// index.js

// Impor semua aset yang dibutuhkan sebagai teks mentah
import layoutTemplate from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Tentukan konten halaman berdasarkan URL
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

        // Cek jika ini permintaan dari SPA (hanya butuh potongan HTML)
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            return new Response(pageContent, { headers: { 'Content-Type': 'text/html' } });
        }

        // Jika ini permintaan halaman penuh, gabungkan semuanya
        let finalHtml = layoutTemplate
            .replace('{{PAGE_CONTENT}}', pageContent)

        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};