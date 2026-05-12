/* ============ HOME PAGE ============ */
function updateStats() {
    document.getElementById('totalMods').textContent = appData.mods.length;
    document.getElementById('totalResources').textContent = appData.resources.length;
    document.getElementById('totalShaders').textContent = appData.shaders.length;
    document.getElementById('modCount').textContent = appData.mods.length + ' items';
    document.getElementById('resourceCount').textContent = appData.resources.length + ' items';
    document.getElementById('shaderCount').textContent = appData.shaders.length + ' items';
}