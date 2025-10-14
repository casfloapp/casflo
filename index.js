import layout from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

// Impor file JS sebagai teks mentah untuk disajikan ke klien
import navScript from './utils/navigation.js';
import appScript from './static/app.js';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Rute untuk menyajikan file JavaScript
        if (path === '/utils/navigation.js') {
            return new Response(navScript, { headers: { 'Content-Type': 'application/javascript' } });
        }
        if (path === '/static/app.js') {
            return new Response(appScript, { headers: { 'Content-Type': 'application/javascript' } });
        }

        // Logika routing untuk halaman HTML
        let pageContent;
        if (path === '/') {
            pageContent = mainContent;
        } else if (path === '/wallet') {
            pageContent = walletContent;
        } else {
            // Jika path tidak cocok, bisa redirect ke halaman utama atau tampilkan 404
            pageContent = mainContent; // Redirect ke halaman utama untuk path lain
        }

        // Cek apakah ini permintaan dari SPA (fetch)
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            // Jika ya, kirim potongan kontennya saja
            return new Response(pageContent, {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        // Jika tidak (beban halaman penuh), kirim dengan layout lengkap
        const finalHtml = layout.replace('{{PAGE_CONTENT}}', pageContent);
        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};