// Untuk saat ini, karena Worker tidak bisa langsung membaca file sistem,
// kita akan "bundle" HTML-nya langsung ke dalam kode.
// Nanti saat deploy, Wrangler akan menanganinya.

import layout from '../templates/layout.html';
import mainPage from '../templates/main.html';

export async function handlePage() {
    // Gabungkan layout dengan konten halaman utama
    const finalHtml = layout.replace('{{content}}', mainPage);

    return new Response(finalHtml, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
        },
    });
}