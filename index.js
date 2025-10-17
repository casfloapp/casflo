// PERBAIKAN: Semua path impor sekarang menggunakan './' untuk menandakan path relatif.
import MainPage from './src/pages/MainPage.js';
import WalletPage from './src/pages/WalletPage.js';
import CreatePage from './src/pages/CreatePage.js';

const routes = {
    '/': MainPage,
    '/wallet': WalletPage,
    '/create': CreatePage
};

const router = async () => {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
        console.error("Elemen #app tidak ditemukan!");
        return;
    }

    const path = location.pathname;
    const page = routes[path] || routes['/'];

    appContainer.innerHTML = await page.render();
    await page.after_render();
};

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.href.startsWith(location.origin)) {
            e.preventDefault();
            const newPath = new URL(link.href).pathname;
            if (newPath !== location.pathname) {
                history.pushState(null, '', newPath);
                router();
            }
        }
    });
    router();
});