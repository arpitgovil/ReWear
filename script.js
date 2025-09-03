// Database simulation using localStorage
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('RenewFit') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('RenewFit') || 'null');
    }

    saveUsers() {
        localStorage.setItem('RenewFit', JSON.stringify(this.users));
    }

    saveCurrentUser() {
        localStorage.setItem('RenewFit', JSON.stringify(this.currentUser));
    }

    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            loginMethod: 'email'
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        this.saveCurrentUser();
        return user;
    }

    socialLogin(userData, provider) {
        let user = this.users.find(u => u.email === userData.email);

        if (!user) {
            user = {
                id: Date.now().toString(),
                ...userData,
                createdAt: new Date().toISOString(),
                loginMethod: provider
            };
            this.users.push(user);
            this.saveUsers();
        }

        this.currentUser = user;
        this.saveCurrentUser();
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('RenewFit');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize database
const db = new UserDatabase();

// Items data
const items = [{
    id: 0,
    title: "Premium Denim Jacket",
    description: "A timeless vintage denim jacket crafted from premium cotton. This classic piece features authentic vintage wash, quality hardware, and a perfect oversized fit. Ideal for layering and adds instant style to any outfit. Shows minimal wear and has been carefully maintained.",
    images: [
        "images/Denim Jacket 1.webp?auto=compress&cs=tinysrgb&w=800",
        "images/Denim Jacket 2.webp?auto=compress&cs=tinysrgb&w=800",
        "images/Denim Jacket 3.webp?auto=compress&cs=tinysrgb&w=800"
    ],
    tags: ["Denim", "Size M", "Excellent", "Vintage", "Unisex"],
    condition: "Excellent",
    seller: "Aayushi Singh",
    rating: 4.9
}, {
    id: 1,
    title: "Elegant Summer Dress",
    description: "Beautiful floral summer dress made from lightweight, breathable cotton blend. Features a flattering A-line silhouette with delicate floral patterns. Perfect for warm weather occasions, from casual outings to garden parties.",
    images: [
        "images/Summer Dress 1.avif?auto=compress&cs=tinysrgb&w=800",
        "images/Summer Dress 2.avif?auto=compress&cs=tinysrgb&w=800",
        "images/Summer Dress 3.avif?auto=compress&cs=tinysrgb&w=800"
    ],
    tags: ["Floral", "Size S", "Like New", "Cotton", "Summer"],
    condition: "Like New",
    seller: "Renaissa",
    rating: 4.8
}, {
    id: 2,
    title: "Leather Ankle Boots",
    description: "Premium brown leather ankle boots with excellent craftsmanship. Features genuine leather construction, comfortable cushioned sole, and timeless design. Perfect for both casual and semi-formal occasions.",
    images: [
        "images/Ankel Shoes 1.webp?auto=compress&cs=tinysrgb&w=800",
        "images/Ankle Shoes 2.webp?auto=compress&cs=tinysrgb&w=800"
    ],
    tags: ["Boots", "Size 9", "Good", "Leather", "Unisex"],
    condition: "Good",
    seller: "Ansh Arora",
    rating: 4.7
}, {
    id: 3,
    title: "Wool Sweater",
    description: "Cozy wool sweater perfect for cold weather. Made from high-quality merino wool with a classic fit. Features ribbed cuffs and hem for a comfortable fit. Excellent condition with no signs of wear.",
    images: [
        "images/Woolen Sweater 1.jpg?auto=compress&cs=tinysrgb&w=800",
        "images/Woolean Sweater 2.jpg?auto=compress&cs=tinysrgb&w=800"
    ],
    tags: ["Wool", "Size L", "Excellent", "Cozy", "Winter"],
    condition: "Excellent",
    seller: "Bhumika Singh",
    rating: 4.9
}];

// Show signup popup on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (!db.isLoggedIn()) {
        setTimeout(() => {
            showSignupPopup();
        }, 1000);
    } else {
        updateUIForLoggedInUser();
    }

    // Initialize scroll to top button
    initScrollToTop();
});

// Signup popup functions
function showSignupPopup() {
    const popup = document.getElementById('signupPopup');
    const content = document.getElementById('signupPopupContent');

    popup.classList.remove('hidden');
    popup.classList.add('flex');

    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeSignupPopup() {
    const popup = document.getElementById('signupPopup');
    const content = document.getElementById('signupPopupContent');

    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }, 300);
}

// Handle signup popup form
document.getElementById('signupPopupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    const buttonText = document.getElementById('popupSignupButtonText');
    const spinner = document.getElementById('popupSignupSpinner');

    buttonText.textContent = 'Creating Account...';
    spinner.classList.remove('hidden');

    setTimeout(() => {
        try {
            const user = db.register(userData);
            db.currentUser = user;
            db.saveCurrentUser();

            buttonText.textContent = 'Join RenewFit';
            spinner.classList.add('hidden');
            closeSignupPopup();
            showToast('Account created successfully! Welcome to RenewFit!', 'success');
            updateUIForLoggedInUser();
        } catch (error) {
            buttonText.textContent = 'Join RenewFit';
            spinner.classList.add('hidden');
            showToast(error.message, 'error');
        }
    }, 2000);
});

// Modal functions
function openModal(type) {
    if (type === 'login') {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('loginModal').classList.add('flex');
        setTimeout(() => {
            document.getElementById('loginModalContent').classList.remove('scale-95', 'opacity-0');
            document.getElementById('loginModalContent').classList.add('scale-100', 'opacity-100');
        }, 10);
    } else if (type === 'signup') {
        document.getElementById('signupModal').classList.remove('hidden');
        document.getElementById('signupModal').classList.add('flex');
        setTimeout(() => {
            document.getElementById('signupModalContent').classList.remove('scale-95', 'opacity-0');
            document.getElementById('signupModalContent').classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginContent = document.getElementById('loginModalContent');
    const signupContent = document.getElementById('signupModalContent');

    loginContent.classList.add('scale-95', 'opacity-0');
    loginContent.classList.remove('scale-100', 'opacity-100');
    signupContent.classList.add('scale-95', 'opacity-0');
    signupContent.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
        signupModal.classList.add('hidden');
        signupModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }, 300);
}

function switchToSignup() {
    closeModal();
    setTimeout(() => openModal('signup'), 300);
}

function switchToLogin() {
    closeModal();
    setTimeout(() => openModal('login'), 300);
}

// Password visibility toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    const buttonText = document.getElementById('loginButtonText');
    const spinner = document.getElementById('loginSpinner');

    buttonText.textContent = 'Signing In...';
    spinner.classList.remove('hidden');

    setTimeout(() => {
        try {
            const user = db.login(email, password);

            buttonText.textContent = 'Sign In';
            spinner.classList.add('hidden');
            closeModal();
            showToast('Successfully signed in!', 'success');
            updateUIForLoggedInUser();
        } catch (error) {
            buttonText.textContent = 'Sign In';
            spinner.classList.add('hidden');
            showToast(error.message, 'error');
        }
    }, 2000);
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: password
    };

    const buttonText = document.getElementById('signupButtonText');
    const spinner = document.getElementById('signupSpinner');

    buttonText.textContent = 'Creating Account...';
    spinner.classList.remove('hidden');

    setTimeout(() => {
        try {
            const user = db.register(userData);
            db.currentUser = user;
            db.saveCurrentUser();

            buttonText.textContent = 'Create Account';
            spinner.classList.add('hidden');
            closeModal();
            showToast('Account created successfully!', 'success');
            updateUIForLoggedInUser();
        } catch (error) {
            buttonText.textContent = 'Create Account';
            spinner.classList.add('hidden');
            showToast(error.message, 'error');
        }
    }, 2000);
});

// Social login functions
function loginWithGoogle() {
    // Simulate Google login
    setTimeout(() => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@gmail.com'
        };

        try {
            const user = db.socialLogin(userData, 'google');
            closeModal();
            showToast('Successfully signed in with Google!', 'success');
            updateUIForLoggedInUser();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }, 1000);
}

function loginWithFacebook() {
    // Simulate Facebook login
    setTimeout(() => {
        const userData = {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@facebook.com'
        };

        try {
            const user = db.socialLogin(userData, 'facebook');
            closeModal();
            showToast('Successfully signed in with Facebook!', 'success');
            updateUIForLoggedInUser();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }, 1000);
}

function signupWithGoogle() {
    loginWithGoogle();
}

function signupWithFacebook() {
    loginWithFacebook();
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const user = db.getCurrentUser();
    if (user) {
        // Update navigation buttons
        const loginBtn = document.querySelector('button[onclick="openModal(\'login\')"]');
        const signupBtn = document.querySelector('button[onclick="openModal(\'signup\')"]');

        if (loginBtn) {
            loginBtn.textContent = `Hi, ${user.firstName}`;
            loginBtn.onclick = null;
            loginBtn.addEventListener('click', showUserMenu);
        }

        if (signupBtn) {
            signupBtn.textContent = 'Logout';
            signupBtn.onclick = logout;
        }
    }
}

function showUserMenu() {
    // Show user menu dropdown (implement as needed)
    showToast('User menu coming soon!', 'success');
}

function logout() {
    db.logout();
    showToast('Successfully logged out!', 'success');
    location.reload();
}

// View item function
function viewItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        // Store item data in localStorage for the item page
        localStorage.setItem('selectedItem', JSON.stringify(item));
        // Navigate to item page
        window.location.href = 'itempage.html';
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMessage.textContent = message;

    if (type === 'success') {
        toastIcon.innerHTML = `
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                `;
    } else if (type === 'error') {
        toastIcon.innerHTML = `
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
    }

    toast.classList.remove('translate-x-full');

    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Close modals when clicking outside
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('signupModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('signupPopup').addEventListener('click', function(e) {
    if (e.target === this) closeSignupPopup();
});

// Close modals with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeSignupPopup();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
