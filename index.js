import layout from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        let pageContent;

        if (path === '/') {
            pageContent = mainContent;
        } else if (path === '/wallet') {
            pageContent = walletContent;
        } else {
            return new Response('Halaman tidak ditemukan', { status: 404 });
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