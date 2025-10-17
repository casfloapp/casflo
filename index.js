// Berkat aturan di wrangler.toml, semua file ini diimpor sebagai teks mentah (string)
// Ini adalah cara yang aman untuk membungkus aset Anda ke dalam Worker.
import indexHtml from './index.html';
import appJS from './src/App.js';
import mainPageJS from './src/pages/MainPage.js';
import walletPageJS from './src/pages/WalletPage.js';
import createPageJS from './src/pages/CreatePage.js';

// Peta sederhana untuk semua aset kita yang akan disajikan ke browser.
// Kuncinya adalah path URL, nilainya adalah konten file dan tipe kontennya.
const assets = {
  '/': { content: indexHtml, type: 'text/html;charset=UTF-8' },
  '/index.html': { content: indexHtml, type: 'text/html;charset=UTF-8' },
  '/src/App.js': { content: appJS, type: 'application/javascript' },
  '/src/pages/MainPage.js': { content: mainPageJS, type: 'application/javascript' },
  '/src/pages/WalletPage.js': { content: walletPageJS, type: 'application/javascript' },
  '/src/pages/CreatePage.js': { content: createPageJS, type: 'application/javascript' },
};

export default {
  /**
   * Fungsi fetch ini adalah titik masuk utama untuk setiap permintaan ke Worker Anda.
   * @param {Request} request - Objek permintaan yang masuk.
   * @returns {Response} - Objek respons yang akan dikirim kembali ke browser.
   */
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Langkah 1: Cek apakah browser meminta file aset yang kita kenali (misalnya, /src/App.js)
    if (assets[path]) {
      const asset = assets[path];
      // Jika ya, kirim konten file tersebut dengan tipe media yang benar.
      return new Response(asset.content, { headers: { 'Content-Type': asset.type } });
    }

    // Langkah 2: Jika path tidak ada di peta aset (misal: pengguna mengakses /wallet atau /create),
    // kita berikan index.html utama. Ini disebut "SPA Fallback".
    // Router di sisi klien (App.js) kemudian akan membaca URL dan menampilkan halaman yang benar.
    return new Response(assets['/'].content, { headers: { 'Content-Type': assets['/'].type } });
  }
};