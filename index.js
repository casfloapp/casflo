import layout from './layout.html';
import appJS from './src/App.js';
import mainPageJS from './src/pages/MainPage.js';
import walletPageJS from './src/pages/WalletPage.js';
import createPageJS from './src/pages/CreatePage.js';

const staticAssets = {
  '/src/App.js': { content: appJS, type: 'application/javascript' },
  '/src/pages/MainPage.js': { content: mainPageJS, type: 'application/javascript' },
  '/src/pages/WalletPage.js': { content: walletPageJS, type: 'application/javascript' },
  '/src/pages/CreatePage.js': { content: createPageJS, type: 'application/javascript' },
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Jika browser meminta file JS, layani file tersebut
    if (staticAssets[path]) {
      const asset = staticAssets[path];
      return new Response(asset.content, {
        headers: { 'Content-Type': asset.type },
      });
    }

    // Untuk semua permintaan halaman lain, layani cangkang HTML utama
    return new Response(layout, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }
};