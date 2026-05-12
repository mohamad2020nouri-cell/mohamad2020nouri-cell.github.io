/* ============ USER PROFILE LOGIC ============ */
let viewingUser = null;

function renderProfilePage(username) {
    viewingUser = username;
    const user = getUserData(username);
    document.getElementById('profileUsername').textContent = username;
    document.getElementById('profileBio').textContent = user.bio || 'No bio yet.';
    const avatarImg = document.getElementById('profileAvatar');
    const avatarPlaceholder = document.getElementById('profileAvatarPlaceholder');
    if (user.avatar) {
        avatarImg.src = user.avatar;
        avatarImg.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        avatarPlaceholder.style.display = 'flex';
    }

    const editBtn = document.getElementById('editProfileBtn');
    if (currentUser && currentUser.name === username) {
        editBtn.classList.remove('hidden');
    } else {
        editBtn.classList.add('hidden');
    }

    const userMods = getAllUserMods(username);
    const grid = document.getElementById('userModsGrid');
    grid.innerHTML = '';
    if (userMods.length === 0) {
        grid.innerHTML = '<p class="no-items-msg">This user hasn\'t uploaded any mods yet.</p>';
    } else {
        userMods.forEach(item => {
            // pass category via custom property
            const card = createCard(item, item._cat);
            grid.appendChild(card);
        });
    }
}

function getAllUserMods(username) {
    const results = [];
    ['mods','resources','shaders'].forEach(cat => {
        (appData[cat] || []).forEach(item => {
            if (item.author === username) {
                results.push({ ...item, _cat: cat });
            }
        });
    });
    return results;
}

// Trigger edit profile
function openEditProfile() {
    const newBio = prompt('Enter new bio:', (getUserData(currentUser.name) || {}).bio || '');
    if (newBio !== null) {
        updateUserData(currentUser.name, { bio: newBio });
        renderProfilePage(currentUser.name);
    }
    // Trigger hidden file input for avatar
    const fileInput = document.getElementById('avatarFileInput');
    if (fileInput) fileInput.click();
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        updateUserData(currentUser.name, { avatar: e.target.result });
        renderProfilePage(currentUser.name);
    };
    reader.readAsDataURL(file);
}