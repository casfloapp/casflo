import { Router } from 'itty-router';
import { handlePage } from './handlers/handlePage';
// Impor handler lain jika sudah dibuat
// import { handleApi } from './handlers/handleApi';

const router = Router();

// Rute utama untuk halaman
router.get('/', () => handlePage());

// Rute untuk API di masa depan
// router.get('/api/v1/transactions', handleApi);

// Fallback untuk request yang tidak cocok
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
    fetch: router.handle
};