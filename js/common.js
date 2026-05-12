/* ============ DATA STORE ============ */
const STORAGE_KEY = 'mcHubData';
let appData = { mods: [], resources: [], shaders: [] };
let currentUser = JSON.parse(localStorage.getItem('mcUser') || 'null');

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        appData = JSON.parse(stored);
    } else {
        appData = {
            mods: [
                { id: 'm1', name: 'OptiFine HD', desc: 'Optimization and HD textures support.', author: 'sp614x', version: '1.20.4', image: '', date: '2026-05-01', averageRating: 4.5, ratings: [{score:5, user:'test'},{score:4, user:'ali'}], comments: [{user:'ali', text:'Great mod!', date:'2026-05-02', likes:2}], downloadUrl: '#' },
                { id: 'm2', name: 'Just Enough Items (JEI)', desc: 'View recipes and items easily.', author: 'mezz', version: '1.20.1', image: '', date: '2026-04-20', averageRating: 4.8, ratings: [{score:5, user:'test'}], comments: [], downloadUrl: '#' }
            ],
            resources: [
                { id: 'r1', name: 'Faithful 32x', desc: 'Classic resource pack with double resolution.', author: 'Vattic', version: '1.20.4', image: '', date: '2026-05-03', averageRating: 4.7, ratings: [{score:5, user:'reza'},{score:4, user:'test'}], comments: [{user:'reza', text:'My favorite!', date:'2026-05-04', likes:1}], downloadUrl: '#', resolution: '32x' },
                { id: 'r2', name: 'Default+ 16x', desc: 'Subtle improvements over vanilla.', author: 'seyler', version: '1.20.2', image: '', date: '2026-04-15', averageRating: 4.2, ratings: [], comments: [], downloadUrl: '#', resolution: '16x' }
            ],
            shaders: [
                { id: 's1', name: 'BSL Shaders', desc: 'Beautiful lighting and water effects.', author: 'capttatsu', version: '1.20.4', image: '', date: '2026-05-02', averageRating: 4.9, ratings: [{score:5, user:'mina'}], comments: [{user:'mina', text:'Amazing!', date:'2026-05-03', likes:3}], downloadUrl: '#' },
                { id: 's2', name: 'Sildurs Vibrant', desc: 'Vibrant colors and sun rays.', author: 'Sildur', version: '1.20.1', image: '', date: '2026-04-28', averageRating: 4.6, ratings: [], comments: [], downloadUrl: '#' }
            ]
        };
        saveData();
    }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); }

/* ============ USER DATA ============ */
const USERS_KEY = 'mcHubUsers';
let users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
function saveUsers() { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

/* ============ PARTICLES ============ */
function createBgParticles() {
    const container = document.getElementById('floatingParticles');
    for (let i = 0; i < 35; i++) {
        const p = document.createElement('div');
        p.className = 'floating-particle';
        p.style.width = (Math.random()*8+2)+'px'; p.style.height = p.style.width;
        p.style.left = Math.random()*100+'%';
        p.style.bottom = -(Math.random()*120)+'px';
        p.style.background = `rgba(${120+Math.random()*80},${60+Math.random()*100},${180+Math.random()*75},${Math.random()*0.5+0.2})`;
        p.style.animationDuration = (Math.random()*30+20)+'s';
        p.style.animationDelay = Math.random()*25+'s';
        container.appendChild(p);
    }
}

/* ============ NAVIGATION ============ */
let currentPage = 'home';
let navigationHistory = ['home'];
let currentDetailItem = null, currentDetailType = null;

function navigateTo(page, data) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page+'Page').classList.add('active');
    currentPage = page;
    if (page === 'home') {
        navigationHistory = ['home'];
        updateStats();
    } else {
        if (!navigationHistory.includes(page)) navigationHistory.push(page);
        if (page === 'mods' || page === 'resource' || page === 'shader') {
            const cat = page==='mods'?'mods':(page==='resource'?'resources':'shaders');
            renderCategory(cat); filterCategory(cat);
        } else if (page === 'detail' && data) {
            currentDetailItem = data.item; currentDetailType = data.type;
            renderDetailPage(data.item, data.type);
        }
    }
    window.scrollTo({top:0, behavior:'smooth'});
}

function goBackFromDetail() {
    navigationHistory = navigationHistory.filter(p => !['detail','profile','tools'].includes(p));
    navigateTo(navigationHistory[navigationHistory.length-1] || 'home');
}

/* ============ AUTH ============ */
function toggleAuth() {
    if (currentUser) {
        if (confirm(`Hello ${currentUser.name}!\nDo you want to log out?`)) {
            logout();
        }
    } else {
        document.getElementById('authModal').classList.add('active');
    }
}
function closeAuthModal() { document.getElementById('authModal').classList.remove('active'); }

function logout() {
    currentUser = null;
    localStorage.removeItem('mcUser');
    document.getElementById('authBtn').textContent = 'Account';
    alert('Logged out!');
    navigateTo('home');
}

/* ============ INIT ============ */
function init() {
    createBgParticles();
    loadData();
    updateStats();
    renderCategory('mods'); renderCategory('resources'); renderCategory('shaders');
    if (currentUser) document.getElementById('authBtn').textContent = currentUser.name;
}

function escapeHtml(text) {
    const div = document.createElement('div'); div.textContent = text; return div.innerHTML;
}