export default {
  async fetch(request) {
    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <title>Tes Deploy</title>
          <style>
              body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; }
              h1 { color: #333; }
          </style>
      </head>
      <body>
          <h1>Aplikasi Berhasil Di-deploy!</h1>
          <p>Worker berjalan dengan normal.</p>
      </body>
      </html>
    `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }
};