import layout from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

// Impor file JS sebagai teks mentah
import navScript from './utils/navigation.js';
import appScript from './static/app.js';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Rute untuk file JavaScript
        if (path === '/utils/navigation.js') {
            return new Response(navScript, { headers: { 'Content-Type': 'application/javascript' } });
        }
        if (path === '/static/app.js') {
            return new Response(appScript, { headers: { 'Content-Type': 'application/javascript' } });
        }

        // Logika routing halaman
        let pageContent;
        if (path === '/') {
            pageContent = mainContent;
        } else if (path === '/wallet') {
            pageContent = walletContent;
        } else {
            return new Response('Halaman tidak ditemukan', { status: 404 });
        }
        
        const finalHtml = layout.replace('{{PAGE_CONTENT}}', pageContent);
        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};