import layout from './templates/layout.html';
import mainContent from './templates/main.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Routing sederhana: jika path adalah halaman utama, tampilkan main
        if (path === '/') {
            // Gabungkan layout dengan konten main
            const finalHtml = layout.replace('{{PAGE_CONTENT}}', mainContent);

            return new Response(finalHtml, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            });
        }

        // Untuk semua path lain, kembalikan halaman "Not Found"
        return new Response('Halaman tidak ditemukan', { status: 404 });
    }
};