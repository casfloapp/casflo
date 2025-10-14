import layout from '../templates/layout.html';
import mainContent from '../templates/main.html';
import walletContent from '../templates/wallet.html'; // Impor konten wallet

export async function handlePageRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    let pageContent;

    // Tentukan konten mana yang akan digunakan berdasarkan path
    if (path === '/wallet') {
        pageContent = walletContent;
    } else {
        pageContent = mainContent; // Default ke halaman utama
    }

    // Gabungkan layout dengan konten yang sesuai
    const finalHtml = layout.replace('{{PAGE_CONTENT}}', pageContent);

    return new Response(finalHtml, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
}