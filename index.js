import layout from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        let pageContent;
        switch (path) {
            case '/':
                pageContent = mainContent;
                break;
            case '/wallet':
                pageContent = walletContent;
                break;
            default:
                return new Response('Halaman tidak ditemukan', { status: 404 });
        }

        // Cek jika ini permintaan dari SPA
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            return new Response(pageContent, { headers: { 'Content-Type': 'text/html' } });
        }

        // Jika bukan, kirim halaman lengkap dengan layout
        const finalHtml = layout.replace('{{PAGE_CONTENT}}', pageContent);
        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};