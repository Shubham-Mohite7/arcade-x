class AuthManager {
    constructor() {
        this.setupEventListeners();
        this.auth = firebase.auth();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    }

    checkAuthState() {
        this.auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                localStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                }));
                if (window.location.pathname.includes('auth.html')) {
                    window.location.href = 'index.html';
                }
            } else {
                // User is signed out
                localStorage.removeItem('currentUser');
                if (!window.location.pathname.includes('auth.html')) {
                    window.location.href = 'auth.html';
                }
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            // Authentication successful, redirect handled by onAuthStateChanged
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            // Create user
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            // Update profile with name
            await userCredential.user.updateProfile({
                displayName: name
            });
            // Authentication successful, redirect handled by onAuthStateChanged
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleLogout() {
        try {
            await this.auth.signOut();
            // Redirect handled by onAuthStateChanged
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const activeForm = document.querySelector('.auth-form.active');
        activeForm.insertBefore(errorDiv, activeForm.firstChild);

        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize authentication
const authManager = new AuthManager();