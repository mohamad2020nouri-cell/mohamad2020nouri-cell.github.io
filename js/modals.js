/* ============ ADD MODAL ============ */
function openAddModal(type) {
    document.getElementById('addModal').classList.add('active');
    if (type) document.getElementById('addType').value = type;
}
function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    ['addName','addDesc','addImage','addFile','addAuthor','addVersion'].forEach(id => document.getElementById(id).value='');
}
function addItem() {
    const type = document.getElementById('addType').value;
    const cat = type === 'mod' ? 'mods' : (type === 'resource' ? 'resources' : 'shaders');
    const name = document.getElementById('addName').value.trim();
    const desc = document.getElementById('addDesc').value.trim();
    const author = document.getElementById('addAuthor').value.trim();
    const version = document.getElementById('addVersion').value.trim();
    const image = document.getElementById('addImage').value.trim();
    if (!name || !author) { alert('Name and Author required'); return; }
    appData[cat].push({
        id: Date.now().toString(), name, desc, author, version,
        image, date: new Date().toISOString().slice(0,10),
        averageRating: 0, ratings: [], comments: [], downloadUrl: '#'
    });
    saveData();
    closeAddModal();
    updateStats();
    if (currentPage === type+'s' || currentPage === type) renderCategory(cat);
}

/* ============ SUPPORT MODAL ============ */
function openSupportModal() { document.getElementById('supportModal').classList.add('active'); }
function closeSupportModal() {
    document.getElementById('supportModal').classList.remove('active');
    document.getElementById('supportName').value = '';
    document.getElementById('supportDesc').value = '';
}
function sendSupport() {
    const name = document.getElementById('supportName').value.trim();
    const desc = document.getElementById('supportDesc').value.trim();
    if (!name || !desc) { alert('Fill all fields'); return; }
    alert('Thank you, ' + name + '! Message sent.');
    closeSupportModal();
}

/* ============ AUTH TABS ============ */
function switchAuthTab(tab) {
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
    document.querySelectorAll('.auth-tab')[0].classList.toggle('active', tab === 'login');
    document.querySelectorAll('.auth-tab')[1].classList.toggle('active', tab === 'signup');
}

/* ============ SIGNUP ============ */
function handleSignup() {
    const username = document.getElementById('signupUsername').value.trim();
    const identity = document.getElementById('signupIdentity').value.trim();
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    
    if (!username || !identity || !password || !passwordConfirm) return alert('Please fill all fields!');
    if (username.length < 3) return alert('Username must be at least 3 characters!');
    if (password !== passwordConfirm) return alert('Passwords do not match!');
    if (password.length < 6) return alert('Password must be at least 6 characters!');
    if (users[username]) return alert('Username already exists!');
    
    for (let user in users) {
        if (users[user].identity === identity) return alert('Email/Phone already registered!');
    }
    
    users[username] = { identity, password, bio: '', avatar: '', createdAt: new Date().toISOString() };
    saveUsers();
    
    currentUser = { name: username };
    localStorage.setItem('mcUser', JSON.stringify(currentUser));
    document.getElementById('authBtn').textContent = username;
    alert('Account created successfully!');
    closeAuthModal();
    ['signupUsername','signupIdentity','signupPassword','signupPasswordConfirm'].forEach(id => document.getElementById(id).value = '');
}

/* ============ LOGIN ============ */
function handleLogin() {
    const identity = document.getElementById('loginIdentity').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!identity || !password) return alert('Please fill all fields!');
    
    let foundUser = null;
    for (let username in users) {
        if (users[username].identity === identity && users[username].password === password) {
            foundUser = username; break;
        }
    }
    
    if (!foundUser) return alert('Invalid email/phone or password!');
    
    currentUser = { name: foundUser };
    localStorage.setItem('mcUser', JSON.stringify(currentUser));
    document.getElementById('authBtn').textContent = foundUser;
    alert('Welcome back, ' + foundUser + '!');
    closeAuthModal();
    ['loginIdentity','loginPassword'].forEach(id => document.getElementById(id).value = '');
}

/* ============ ESC KEY ============ */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAddModal(); closeAuthModal(); closeSupportModal(); }
});
document.getElementById('addModal').addEventListener('click', e => { if (e.target === document.getElementById('addModal')) closeAddModal(); });
document.getElementById('authModal').addEventListener('click', e => { if (e.target === document.getElementById('authModal')) closeAuthModal(); });
document.getElementById('supportModal').addEventListener('click', e => { if (e.target === document.getElementById('supportModal')) closeSupportModal(); });