import layoutTemplate from './templates/layout.html';
import mainContent from './templates/main.html';
import walletContent from './templates/wallet.html';
import createContent from './templates/create.html';
import moreContent from './templates/more.html';
import analysisContent from './templates/analysis.html';

// Impor halaman autentikasi mandiri
import loginPage from './templates/login.html';
import createAccountPage from './templates/create-account.html';
import twoStepPage from './templates/two-step.html';
import authCallbackPage from './templates/auth-callback.html'; // Untuk login Google
import createWalletPage from './templates/create-wallet.html'; // <-- [BARU] Impor ini


export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (path === '/login') {
            return new Response(loginPage, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        }
        if (path === '/create-account') {
            return new Response(createAccountPage, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        }
        if (path === '/two-step') {
            return new Response(twoStepPage, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        }
        if (path === '/auth/callback') {
            return new Response(authCallbackPage, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        }
        if (path === '/create-wallet') {
            return new Response(createWalletPage, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
        }

        let pageContent;
        switch (path) {
            case '/':
                pageContent = mainContent;
                break;
            case '/wallet':
                pageContent = walletContent;
                break;
            case '/create':
                pageContent = createContent;
                break;
            case '/more':
                pageContent = moreContent;
                break;
            case '/analysis':
                pageContent = analysisContent;
                break;
            default:
                pageContent = mainContent;
                break;
        }

        // Untuk navigasi SPA, kirim hanya potongan kontennya
        if (request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
            return new Response(pageContent, { headers: { 'Content-Type': 'text/html' } });
        }

        // Untuk pemuatan halaman pertama kali, kirim seluruh layout
        const finalHtml = layoutTemplate.replace('{{PAGE_CONTENT}}', pageContent);

        return new Response(finalHtml, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    }
};