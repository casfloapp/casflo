// =================================================================
// KODE ASLI DARI TEMA ANDA (JANGAN DIHAPUS)
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
// KODE INTEGRASI API CASFLO (Disesuaikan untuk SPA)
// =================================================================
window.App = (() => {
    // Konfigurasi Global
    const apiUrl = 'https://api.casflo.id/api/v1';
    const googleClientId = '39605099480-esqvcsucqacror5k3fkgpj84cnl8oddh.apps.googleusercontent.com'; // <-- GANTI DENGAN CLIENT ID ANDA

    // Helper Functions (Fungsi Bantuan)
    const toggleLoading = (form, isLoading, isGoogle = false) => {
        const button = isGoogle ? document.getElementById('google-signin-btn') : form.querySelector('button[type="submit"]');
        if (!button) return;
        
        let spinner = button.querySelector('.loading-spinner');
        if (!spinner) {
            spinner = document.createElement('span');
            spinner.className = 'loading-spinner hidden h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent';
            button.prepend(spinner);
        }
        const buttonText = button.querySelector('span:not(.loading-spinner)');
        
        button.disabled = isLoading;
        spinner.classList.toggle('hidden', !isLoading);
        if (buttonText) buttonText.style.opacity = isLoading ? '0' : '1';
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

    // --- [BARU] Fungsi untuk Google Sign-In ---
    const handleGoogleSignIn = async (credentialResponse) => {
        const form = document.getElementById('login-form') || document.getElementById('register-form');
        if (form) toggleLoading(form, true, true);

        try {
            const response = await fetch(`${apiUrl}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ googleToken: credentialResponse.credential })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message || 'Login via Google gagal.');
            
            localStorage.setItem('sessionToken', result.data.sessionToken);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            displayMessage('login-error', error.message);
            displayMessage('register-error', error.message);
        } finally {
            if (form) toggleLoading(form, false, true);
        }
    };

    const initializeGoogleSignIn = () => {
        if (typeof google === 'undefined') {
            console.error('Google Sign-In library not loaded. Pastikan script <script src="https://accounts.google.com/gsi/client" async defer></script> ada di index.html Anda.');
            return;
        }
        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleSignIn
        });
        
        const customButton = document.getElementById('google-signin-btn');
        if (customButton) {
            customButton.addEventListener('click', () => {
                google.accounts.id.prompt();
            });
        }
    };

    // API Handlers (Fungsi untuk interaksi API)
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

    // --- [DIUBAH] Fungsi initPage diperbarui untuk Google Sign-In ---
    const initPage = (pageName) => {
        if (pageName === 'login' || pageName === 'create-account') {
            document.getElementById('login-form')?.addEventListener('submit', handleLogin);
            document.getElementById('register-form')?.addEventListener('submit', handleRegister);
            initializeGoogleSignIn(); // Inisialisasi Google di kedua halaman
        } else if (pageName === 'two-step') {
            const email = localStorage.getItem('emailForVerification');
            const emailDisplay = document.getElementById('verify-email-display');
            if(emailDisplay) emailDisplay.textContent = email || 'email Anda';
            document.getElementById('verify-form')?.addEventListener('submit', handleVerify);
        } else if (pageName === 'dashboard') {
            const user = JSON.parse(localStorage.getItem('user'));
            const userNameSpan = document.getElementById('user-name-dashboard');
            if(userNameSpan) userNameSpan.textContent = user?.full_name || 'Pengguna';
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
