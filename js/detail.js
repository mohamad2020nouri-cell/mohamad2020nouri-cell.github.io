/* ============ DETAIL PAGE ============ */
function renderDetailPage(item, cat) {
    document.getElementById('detailTitle').textContent = item.name;
    document.getElementById('detailDesc').textContent = item.desc;
    document.getElementById('detailAuthor').textContent = item.author;
    document.getElementById('detailType').textContent = cat === 'mods' ? 'Mod' : (cat === 'resources' ? 'Resource Pack' : 'Shader');
    document.getElementById('detailVersion').textContent = item.version || 'N/A';
    document.getElementById('detailDate').textContent = item.date || new Date().toISOString().slice(0,10);

    // Gallery
    const imagesDiv = document.getElementById('detailImages');
    imagesDiv.innerHTML = '';
    if (item.image) {
        const img = document.createElement('img'); img.src = item.image; img.className = 'detail-image'; imagesDiv.appendChild(img);
    }
    const icon = cat === 'mods' ? '⚙️' : (cat === 'resources' ? '🎨' : '✨');
    for (let i = 0; i < 2; i++) {
        const div = document.createElement('div'); div.className = 'detail-image'; div.textContent = icon; imagesDiv.appendChild(div);
    }

    // Rating
    renderRating(item, cat);
    // Comments
    renderComments(item.id, cat);
    // Related
    const related = (appData[cat] || []).filter(i => i.id !== item.id).slice(0, 4);
    const relGrid = document.getElementById('relatedGrid');
    relGrid.innerHTML = '';
    related.forEach(r => relGrid.appendChild(createCard(r, cat)));

    // Download button reset
    const btn = document.getElementById('downloadBtn');
    if (btn) { btn.disabled = false; btn.textContent = 'Download (Wait 5s)'; }
    document.getElementById('downloadTimerText').textContent = '';
}

/* Rating */
function renderRating(item, cat) {
    const section = document.getElementById('ratingSection');
    const avg = item.averageRating || 0;
    const total = (item.ratings || []).length;
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star${i <= Math.round(avg) ? ' filled' : ''}" data-value="${i}" onclick="submitRating('${item.id}', '${cat}', ${i})">★</span>`;
    }
    section.innerHTML = `<div class="rating-stars">${starsHtml}</div><span class="rating-text">${avg > 0 ? `${avg} (${total} votes)` : 'No ratings yet'}</span>`;
}

function submitRating(itemId, cat, score) {
    const items = appData[cat];
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    item.ratings = item.ratings || [];
    item.ratings.push({ score, user: currentUser?.name || 'Guest' });
    const avg = (item.ratings.reduce((s,r) => s + r.score, 0) / item.ratings.length).toFixed(1);
    item.averageRating = parseFloat(avg);
    saveData();
    renderDetailPage(item, cat);
}

/* Comments */
function renderComments(itemId, cat) {
    const items = appData[cat];
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    item.comments = item.comments || [];
    const list = document.getElementById('commentList');
    list.innerHTML = item.comments.map(c => `
        <div class="comment">
            <strong>${escapeHtml(c.user)}</strong> (${c.date})<br>
            <p>${escapeHtml(c.text)}</p>
            <div class="comment-actions">
                <span onclick="alert('Reply not implemented')">Reply</span>
                <span>❤️ ${c.likes || 0}</span>
            </div>
        </div>`).join('');
}

function addComment() {
    if (!currentUser) return alert('Login to comment');
    const text = document.getElementById('commentInput').value.trim();
    if (!text) return;
    const item = currentDetailItem;
    if (!item) return;
    const cat = currentDetailType;
    const items = appData[cat];
    const idx = items.findIndex(i => i.id === item.id);
    if (idx === -1) return;
    items[idx].comments = items[idx].comments || [];
    items[idx].comments.push({ user: currentUser.name, text, date: new Date().toISOString().slice(0,10), likes: 0 });
    saveData();
    document.getElementById('commentInput').value = '';
    renderComments(item.id, cat);
}

/* Download Timer */
function startDownload() {
    const btn = document.getElementById('downloadBtn');
    if (!btn) return;
    btn.disabled = true;
    let count = 5;
    btn.textContent = `Wait ${count}s...`;
    const timerText = document.getElementById('downloadTimerText');
    timerText.textContent = 'Thank you for your patience!';
    const interval = setInterval(() => {
        count--;
        btn.textContent = `Wait ${count}s...`;
        if (count <= 0) {
            clearInterval(interval);
            btn.textContent = 'Download Now';
            btn.disabled = false;
            timerText.textContent = '';
            const link = document.createElement('a');
            link.href = '#';
            link.download = currentDetailItem?.name + '.zip';
            link.click();
        }
    }, 1000);
}