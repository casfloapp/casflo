import layout from './templates/layout.html';
import dashboardContent from './templates/dashboard.html';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Routing sederhana: jika path adalah halaman utama, tampilkan dashboard
        if (path === '/') {
            // Gabungkan layout dengan konten dashboard
            const finalHtml = layout.replace('{{PAGE_CONTENT}}', dashboardContent);

            return new Response(finalHtml, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            });
        }

        // Untuk semua path lain, kembalikan halaman "Not Found"
        return new Response('Halaman tidak ditemukan', { status: 404 });
    }
};