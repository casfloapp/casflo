// Tidak ada lagi import itty-router
import layout from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        let pageContent;

        // Logika routing manual menggunakan if/else
        if (path === '/') {
            pageContent = mainContent;
        } else if (path === '/wallet') {
            pageContent = walletContent;
        } else {
            // Jika path tidak cocok, kirim response 404 Not Found
            return new Response('Halaman tidak ditemukan', { status: 404 });
        }

        // Gabungkan layout dengan konten halaman yang sesuai
        const finalHtml = layout.replace('{{PAGE_CONTENT}}', pageContent);

        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};