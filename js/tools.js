/* ============ TOOLS PAGE ============ */
function generateCommand() {
    const item = document.getElementById('toolItem').value;
    const ench = document.getElementById('toolEnch').value;
    const output = `/give @p ${item}{Enchantments:[${ench.split(',').map(e => {let [n,l]=e.trim().split(' '); return `{id:"${n}",lvl:${l}}`}).join(',')}]} 1`;
    document.getElementById('toolOutput').textContent = output;
}