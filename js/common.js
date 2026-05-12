/* ============ DATA STORE ============ */
const STORAGE_KEY = 'mcHubData';
let appData = { mods: [], resources: [], shaders: [] };
let currentUser = JSON.parse(localStorage.getItem('mcUser') || 'null');

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) appData = JSON.parse(stored);
}
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* ============ USER DATA MANAGEMENT ============ */
const USERS_KEY = 'mcHubUsers';
let users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');

function saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getUserData(username) {
    return users[username] || {};
}
function updateUserData(username, updates) {
    if (!users[username]) users[username] = {};
    Object.assign(users[username], updates);
    saveUsers();
}

// Get popular users (top 3 by uploaded items)
function getPopularUsers() {
    const counts = {};
    const allItems = [...appData.mods, ...appData.resources, ...appData.shaders];
    allItems.forEach(item => {
        if (item.author) {
            counts[item.author] = (counts[item.author] || 0) + 1;
        }
    });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(([name]) => name);
}

function renderPopularUsers() {
    const container = document.getElementById('popularUsersContainer');
    if (!container) return;
    const popular = getPopularUsers();
    container.innerHTML = '';
    if (popular.length === 0) {
        container.innerHTML = '<p style="color:#666;">No creators yet. Be the first!</p>';
        return;
    }
    popular.forEach(username => {
        const user = getUserData(username);
        const avatarSrc = user.avatar || '';
        const div = document.createElement('div');
        div.className = 'user-circle';
        div.onclick = () => navigateTo('profile', { username });
        div.innerHTML = `
            ${avatarSrc ? `<img src="${avatarSrc}" class="avatar">` : `<div class="avatar">👤</div>`}
            <span class="username">${escapeHtml(username)}</span>
        `;
        container.appendChild(div);
    });
}

/* ============ PARTICLES ============ */
function createBgParticles() {
    const container = document.getElementById('floatingParticles');
    for (let i = 0; i < 35; i++) {
        const p = document.createElement('div');
        p.className = 'floating-particle';
        const size = Math.random() * 8 + 2;
        p.style.width = size + 'px'; p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = -(Math.random() * 120) + 'px';
        p.style.background = `rgba(${120 + Math.random()*80}, ${60 + Math.random()*100}, ${180 + Math.random()*75}, ${Math.random()*0.5 + 0.2})`;
        p.style.animationDuration = (Math.random() * 30 + 20) + 's';
        p.style.animationDelay = Math.random() * 25 + 's';
        container.appendChild(p);
    }
}

/* ============ NAVIGATION ============ */
let currentPage = 'home';
let navigationHistory = ['home'];
let currentDetailItem = null, currentDetailType = null;

function navigateTo(page, data) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(page + 'Page');
    if (!target) return;
    target.classList.add('active');
    currentPage = page;

    if (page === 'home') {
        navigationHistory = ['home'];
        updateStats();
        renderPopularUsers();
    } else {
        if (!navigationHistory.includes(page)) navigationHistory.push(page);
        if (page === 'mods' || page === 'resource' || page === 'shader') {
            const cat = page === 'mods' ? 'mods' : (page === 'resource' ? 'resources' : 'shaders');
            renderCategory(cat);
            filterCategory(cat);
        } else if (page === 'detail' && data) {
            currentDetailItem = data.item;
            currentDetailType = data.type;
            renderDetailPage(data.item, data.type);
        } else if (page === 'profile' && data && data.username) {
            renderProfilePage(data.username);
        } else if (page === 'tools') {
            // nothing
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBackFromDetail() {
    navigationHistory = navigationHistory.filter(p => p !== 'detail' && p !== 'profile' && p !== 'tools');
    const prev = navigationHistory[navigationHistory.length-1] || 'home';
    navigateTo(prev);
}

/* ============ AUTH ============ */
function toggleAuth() {
    if (currentUser) {
        currentUser = null;
        localStorage.removeItem('mcUser');
        document.getElementById('authBtn').textContent = '👤 Account';
    } else {
        document.getElementById('authModal').classList.add('active');
    }
}
function closeAuthModal() { document.getElementById('authModal').classList.remove('active'); }
function login() {
    const user = document.getElementById('authUser').value.trim();
    if (!user) return alert('Enter username');
    currentUser = { name: user };
    localStorage.setItem('mcUser', JSON.stringify(currentUser));
    if (!users[user]) {
        users[user] = { bio: '', avatar: '' };
        saveUsers();
    }
    document.getElementById('authBtn').textContent = `👋 ${user}`;
    closeAuthModal();
    updateStats();
}

/* ============ INIT ============ */
function init() {
    createBgParticles();
    loadData();
    updateStats();
    renderCategory('mods');
    renderCategory('resources');
    renderCategory('shaders');
    if (currentUser) document.getElementById('authBtn').textContent = `👋 ${currentUser.name}`;
}

// Escape HTML utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy IP utility
function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => alert('IP copied!'));
}