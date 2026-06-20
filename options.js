
// Parameters
//----------------------------------------------
const DATA_TAG = 'blockedDomains';
const dataDisplay = document.getElementById('dataDisplay');


// Load current data
//----------------------------------------------
async function loadData() {
    const result = await chrome.storage.sync.get(DATA_TAG);
    const data = result[DATA_TAG] || {};
    dataDisplay.value = JSON.stringify(data, null, 2);
}


// Exporting
//----------------------------------------------
document.getElementById('button_export').addEventListener('click', async () => {
    const result = await chrome.storage.sync.get(DATA_TAG);
    const data = result[DATA_TAG] || {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_PoopList.json';
    a.click();
    URL.revokeObjectURL(url);
});


// Importing
//----------------------------------------------
document.getElementById('button_import').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('input_file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

    const text = await file.text();
    const json = JSON.parse(text);
    await chrome.storage.sync.set({ [DATA_TAG]: json });
    await loadData();

    e.target.value = ''; // Input reset
});


// Erasing
//----------------------------------------------
document.getElementById('button_erase').addEventListener('click', async () => {
  if (!confirm('⚠️ Erase all websites inside the poop list ?')) return;

    await chrome.storage.sync.remove(DATA_TAG);
    await loadData();

});


// Init
//----------------------------------------------
loadData();

