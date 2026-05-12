/* ============ ADD MODAL ============ */
function openAddModal(type) {
    document.getElementById('addModal').classList.add('active');
    if (type) document.getElementById('addType').value = type;
    document.getElementById('addName').focus();
}
function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    ['addName','addDesc','addImage','addFile','addAuthor','addVersion'].forEach(id => document.getElementById(id).value = '');
}
function addItem() {
    const type = document.getElementById('addType').value;
    const name = document.getElementById('addName').value.trim();
    const desc = document.getElementById('addDesc').value.trim();
    const author = document.getElementById('addAuthor').value.trim();
    const version = document.getElementById('addVersion').value.trim();
    const image = document.getElementById('addImage').value.trim();
    if (!name || !author) { alert('Fill required fields'); return; }
    const cat = type === 'mod' ? 'mods' : (type === 'resource' ? 'resources' : 'shaders');
    const newItem = {
        id: Date.now().toString(),
        name, desc, author, version,
        image: image || '',
        date: new Date().toISOString().slice(0,10),
        averageRating: 0, ratings: [], comments: [], downloadUrl: '#'
    };
    appData[cat].push(newItem);
    saveData();
    closeAddModal();
    updateStats();
    if (currentPage === type + 's') renderCategory(cat);
}

// Escape key listeners and overlay clicks
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAddModal();
        closeAuthModal();
    }
});
document.getElementById('addModal').addEventListener('click', function(e) {
    if (e.target === this) closeAddModal();
});
document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});