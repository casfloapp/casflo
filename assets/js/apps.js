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
    const toggleLoading = (form, isLoading) => {
        const button = form.querySelector('button[type="submit"]');
        if (!button) return;
        let spinner = button.querySelector('.loading-spinner');
        if (!spinner) {
            spinner = document.createElement('span');
            spinner.className = 'loading-spinner hidden h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent';
            button.prepend(spinner);
        }
        const buttonText = button.querySelector('span:not(.loading-spinner)');
        
        button.disabled = isLoading;
        spinner.classList.toggle('hidden', !isLoading);
        buttonText?.classList.toggle('hidden', isLoading);
    };
    const displayMessage = (containerId, message, type = 'error') => {
        const container = document.getElementById(containerId);
        if (container) {
            container.textContent = message || `Terjadi kesalahan. Silakan coba lagi.`;
            container.className = type === 'error' 
                ? 'my-2 p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-950 dark:text-red-400'
                : 'my-2 p-3 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-950 dark:text-green-400';
            container.classList.remove('hidden');
        }
    };
    const clearMessages = (formId) => {
        const errorDiv = document.getElementById(`${formId}-error`);
        if (errorDiv) errorDiv.classList.add('hidden');
    };

    // API Handlers (Fungsi untuk interaksi API) - Tetap Sama
    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        clearMessages('register');
        toggleLoading(form, true);
        const fullName = form.querySelector('#full-name').value;
        const email = form.querySelector('#email-address').value; 
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#repeat-password').value;
        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, confirmPassword })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message);
            localStorage.setItem('emailForVerification', email);
            history.pushState(null, '', '/two-step');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            displayMessage('register-error', error.message);
        } finally {
            toggleLoading(form, false);
        }
    };
    const handleVerify = async (e) => {
        e.preventDefault();
        const form = e.target;
        clearMessages('verify');
        toggleLoading(form, true);
        const email = localStorage.getItem('emailForVerification');
        const otpInputs = form.querySelectorAll('.js-auto-input-change input');
        const code = Array.from(otpInputs).map(input => input.value).join('');
        try {
            const response = await fetch(`${apiUrl}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message);
            displayMessage('verify-success', 'Verifikasi berhasil! Mengarahkan ke halaman login...', 'success');
            localStorage.removeItem('emailForVerification');
            setTimeout(() => {
                history.pushState(null, '', '/login');
                window.dispatchEvent(new PopStateEvent('popstate'));
            }, 2000);
        } catch (error) {
            displayMessage('verify-error', error.message);
        } finally {
            toggleLoading(form, false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        clearMessages('login');
        toggleLoading(form, true);
        const email = form.querySelector('#email-address').value;
        const password = form.querySelector('#password').value;
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message);
            localStorage.setItem('sessionToken', result.data.sessionToken);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            displayMessage('login-error', error.message);
        } finally {
            toggleLoading(form, false);
        }
    };
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    // --- [BARU] Fungsi untuk menangani callback dari Google ---
    const handleAuthCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            localStorage.setItem('sessionToken', token);
            // Ambil data user setelah mendapatkan token
            try {
                const response = await fetch(`${apiUrl}/auth/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (!response.ok) throw new Error('Gagal mengambil data pengguna.');
                localStorage.setItem('user', JSON.stringify(result.data));
                
                // Arahkan ke dashboard setelah semua data disimpan
                history.pushState(null, '', '/dashboard');
                window.dispatchEvent(new PopStateEvent('popstate'));

            } catch (err) {
                console.error(err);
                sessionStorage.setItem('loginError', 'Gagal memuat data pengguna setelah login.');
                history.pushState(null, '', '/login');
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
        } else if (error) {
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
                    window.location.href = `${apiUrl}/auth/google`;
                });
            }

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
