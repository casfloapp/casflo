// Berkat aturan di wrangler.toml, semua file ini diimpor sebagai teks mentah (string)
import indexHtml from 'index.html';
import appJS from 'src/App.js';
import mainPageJS from 'src/pages/MainPage.js';
import walletPageJS from 'src/pages/WalletPage.js';
import createPageJS from 'src/pages/CreatePage.js';

// Peta sederhana untuk semua aset kita yang akan disajikan ke browser
const assets = {
  '/': { content: indexHtml, type: 'text/html;charset=UTF-8' },
  '/index.html': { content: indexHtml, type: 'text/html;charset=UTF-8' },
  '/src/App.js': { content: appJS, type: 'application/javascript' },
  '/src/pages/MainPage.js': { content: mainPageJS, type: 'application/javascript' },
  '/src/pages/WalletPage.js': { content: walletPageJS, type: 'application/javascript' },
  '/src/pages/CreatePage.js': { content: createPageJS, type: 'application/javascript' },
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Cek apakah browser meminta file aset yang kita kenali
    if (assets[path]) {
      const asset = assets[path];
      return new Response(asset.content, { headers: { 'Content-Type': asset.type } });
    }

    // Jika path tidak ada di peta aset (misal: /wallet, /create),
    // kita berikan index.html utama. Ini adalah "SPA Fallback".
    return new Response(assets['/'].content, { headers: { 'Content-Type': assets['/'].type } });
  }
};