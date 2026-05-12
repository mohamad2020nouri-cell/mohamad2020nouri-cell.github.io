/* ============ CATEGORY LISTING ============ */
function renderCategory(cat) {
    const grid = document.getElementById(cat === 'mods' ? 'modsGrid' : (cat === 'resources' ? 'resourceGrid' : 'shaderGrid'));
    if (!grid) return;
    const items = appData[cat] || [];
    grid.innerHTML = items.length ? '' : '<p class="no-items-msg">No items yet.</p>';
    if (items.length) items.forEach(item => grid.appendChild(createCard(item, cat)));
}

function createCard(item, cat) {
    const card = document.createElement('div');
    card.className = 'mod-card';
    card.onclick = () => navigateTo('detail', { item, type: cat });
    const avg = item.averageRating || 0;
    const stars = Array.from({length:5}, (_,i) => i < Math.round(avg) ? '★' : '☆').join('');
    card.innerHTML = `
        ${item.image ? `<img src="${item.image}" class="mod-card-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
        <div class="mod-card-image" style="${item.image ? 'display:none;' : ''}">${cat === 'mods' ? '⚙️' : (cat === 'resources' ? '🎨' : '✨')}</div>
        <div class="mod-card-body">
            <div class="mod-card-title">${escapeHtml(item.name)}</div>
            <div class="mod-card-desc">${escapeHtml(item.desc)}</div>
        </div>
        <div class="mod-card-footer">
            <span>👤 ${escapeHtml(item.author)}</span>
            <div class="stars-small"><span>${stars}</span> ${avg}</div>
        </div>`;
    return card;
}

function filterCategory(cat) {
    const gridId = cat === 'mods' ? 'modsGrid' : (cat === 'resources' ? 'resourceGrid' : 'shaderGrid');
    const grid = document.getElementById(gridId);
    const searchInput = document.getElementById(cat + 'Search');
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const items = appData[cat] || [];
    let filtered = items;
    if (query) filtered = filtered.filter(i => i.name.toLowerCase().includes(query) || i.desc.toLowerCase().includes(query));
    if (cat === 'mods') {
        const verEl = document.getElementById('modVersionFilter');
        if (verEl && verEl.value) filtered = filtered.filter(i => i.version === verEl.value);
    }
    if (cat === 'resources') {
        const resEl = document.getElementById('resourceResolutionFilter');
        if (resEl && resEl.value) filtered = filtered.filter(i => i.resolution === resEl.value);
    }
    grid.innerHTML = filtered.length ? '' : '<p class="no-items-msg">No results.</p>';
    filtered.forEach(item => grid.appendChild(createCard(item, cat)));
}