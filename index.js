export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      // Langkah 1: Coba sajikan file yang diminta secara langsung.
      // Jika browser meminta '/src/App.js', fungsi ini akan menemukan dan menyajikannya
      // dari folder 'public' yang sudah di-upload.
      return await env.ASSETS.fetch(request);
    } catch (error) {
      // Langkah 2: Tangani "File Not Found".
      // Jika file tidak ditemukan (misalnya, pengguna navigasi ke '/wallet'),
      // `env.ASSETS.fetch` akan gagal. Ini adalah perilaku yang NORMAL untuk SPA.
      
      // Langkah 3: Sajikan Halaman Utama (SPA Fallback).
      // Sebagai gantinya, kita sajikan file `index.html` utama kita.
      // Router di sisi klien (src/App.js) kemudian akan membaca URL '/wallet'
      // dari address bar dan menampilkan halaman yang benar.
      const indexRequest = new Request(new URL('/', request.url));
      return env.ASSETS.fetch(indexRequest);
    }
  }
};