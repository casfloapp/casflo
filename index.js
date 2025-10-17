export default {
  async fetch(request, env) {
    // env.ASSETS.fetch akan menangani penyajian file dari folder 'public'
    // yang telah kita tentukan di wrangler.toml.
    // Ini secara otomatis akan menangani routing untuk kita.
    // Jika path tidak ditemukan, ia akan secara otomatis menyajikan halaman 404
    // atau, yang lebih penting, menyajikan 'index.html' untuk rute yang tidak spesifik.
    return env.ASSETS.fetch(request);
  }
};