// =================================================================
// KODE ASLI DARI TEMA ANDA (TETAP SAMA)
// =================================================================
const effect = document.querySelector('.effect');
const buttons = document.querySelectorAll('.navbar button:not(.plus)');
buttons.forEach(button => {
    button.addEventListener('click', e => {
        const x = e.target.offsetLeft;
        buttons.forEach(btn => {
            btn.classList.remove('active');
        })
        e.target.classList.add('active');
        anime({
            targets: '.effect',
            left: `${x}px`,
            opacity: '1',
            duration: 600
        })
    })
});

// =================================================================
// KODE INTEGRASI API CASFLO (Disesuaikan untuk Alur Redirect)
// =================================================================
window.App = (() => {
    // Konfigurasi Global
    const apiUrl = 'https://api.casflo.id/api/v1';

    // Helper Functions (Fungsi Bantuan) - Tetap Sama
    const toggleLoading = (form, isLoading) => { /* ... (kode sama seperti sebelumnya) ... */ };
    const displayMessage = (containerId, message, type = 'error') => { /* ... (kode sama seperti sebelumnya) ... */ };
    const clearMessages = (formId) => { /* ... (kode sama seperti sebelumnya) ... */ };

    // --- [DIHAPUS] Fungsi Google Sign-In (GSI) tidak lagi diperlukan ---
    // const handleGoogleSignIn = async (...) => {};
    // const initializeGoogleSignIn = () => {};

    // API Handlers (Fungsi untuk interaksi API)
    const handleRegister = async (e) => { /* ... (kode sama seperti sebelumnya) ... */ };
    const handleVerify = async (e) => { /* ... (kode sama seperti sebelumnya) ... */ };
    const handleLogin = async (e) => { /* ... (kode sama seperti sebelumnya) ... */ };
    const handleLogout = (e) => { /* ... (kode sama seperti sebelumnya) ... */ };

    // --- [BARU] Fungsi untuk menangani callback dari Google ---
    const handleAuthCallback = () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            // Jika ada token, simpan dan arahkan ke dashboard
            localStorage.setItem('sessionToken', token);
            // Anda bisa tambahkan fetch ke /users/me di sini untuk mendapatkan data user
            // lalu simpan ke localStorage juga.
            history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } else if (error) {
            // Jika ada error dari backend, tampilkan di halaman login
            // Simpan error sementara, arahkan ke login, lalu tampilkan
            sessionStorage.setItem('loginError', 'Login via Google gagal. Silakan coba lagi.');
            history.pushState(null, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    // --- [DIUBAH] Fungsi initPage diperbarui untuk alur redirect ---
    const initPage = (pageName) => {
        if (pageName === 'login' || pageName === 'create-account') {
            document.getElementById('login-form')?.addEventListener('submit', handleLogin);
            document.getElementById('register-form')?.addEventListener('submit', handleRegister);
            
            // Logika baru untuk tombol Google
            const googleButton = document.getElementById('google-signin-btn');
            if (googleButton) {
                googleButton.addEventListener('click', () => {
                    // Langsung arahkan ke backend untuk memulai proses redirect
                    window.location.href = `${apiUrl}/auth/google`;
                });
            }

            // Tampilkan pesan error jika ada dari proses callback
            const loginError = sessionStorage.getItem('loginError');
            if (loginError) {
                displayMessage('login-error', loginError);
                sessionStorage.removeItem('loginError');
            }

        } else if (pageName === 'two-step') {
            const email = localStorage.getItem('emailForVerification');
            const emailDisplay = document.getElementById('verify-email-display');
            if(emailDisplay) emailDisplay.textContent = email || 'email Anda';
            document.getElementById('verify-form')?.addEventListener('submit', handleVerify);
        } else if (pageName === 'dashboard') {
            const user = JSON.parse(localStorage.getItem('user'));
            const userNameSpan = document.getElementById('user-name-dashboard');
            if(userNameSpan) userNameSpan.textContent = user?.full_name || 'Pengguna';
        } else if (pageName === 'auth/callback') {
            // Tangani halaman callback
            handleAuthCallback();
        }
        
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
    };

    return {
        initPage
    };
})();
