
// Elements of UI
//----------------------------------------------
const option_activate = document.getElementById('switch_activate');
const option_highlight = document.getElementById('radio_highlight');
const option_transparent = document.getElementById('radio_transparent');
const option_hide = document.getElementById('radio_hide');
const engine_google = document.getElementById('checkbox_google');
const engine_bing = document.getElementById('checkbox_bing');
const engine_duckduckgo = document.getElementById('checkbox_duckduckgo');
const button_addPoop = document.getElementById('button_poop');
const button_settings = document.getElementById('button_settings');


// Listeners
//----------------------------------------------
option_activate.addEventListener('change', () => {
  saveStatus();
});
option_highlight.addEventListener('change', () => {
  saveStatus();
});
option_transparent.addEventListener('change', () => {
  saveStatus();
});
option_hide.addEventListener('change', () => {
  saveStatus();
});
engine_google.addEventListener('change', () => {
  saveStatus();
});
engine_bing.addEventListener('change', () => {
  saveStatus();
});
engine_duckduckgo.addEventListener('change', () => {
  saveStatus();
});
button_addPoop.addEventListener('click', () => {
  addPoopToList();
});
button_settings.addEventListener('click', () => {
    
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else { // for old browser
    window.open(chrome.runtime.getURL('options.html'));
  }
  
});


// Load options from chrome.sync.sync 
// change to sync to synchronise across all plateforms, limited to 100ko
//----------------------------------------------
function loadData() {
chrome.storage.sync.get(['option_activate', 'option_highlight', 'option_transparent',
'option_hide', 'engine_google', 'engine_bing', 'engine_duckduckgo'], (result) => {

    console.log("- data loaded");
    
     // Update UI
    option_activate.checked = result.option_activate || false;
    option_highlight.checked = result.option_highlight || false;
    option_transparent.checked = result.option_transparent || false;
    option_hide.checked = result.option_hide || false;
    engine_google.checked = result.engine_google || false;
    engine_bing.checked = result.engine_bing || false;
    engine_duckduckgo.checked = result.engine_duckduckgo || false; 
  
    console.log("- UI updated");
    
    });
}


// Save options to chrome.sync.sync
// change to sync to synchronise across all plateforms, limited to 100ko
//----------------------------------------------
function saveStatus() {
    
    let settings = {
        option_activate: option_activate.checked,
        option_highlight: option_highlight.checked,
        option_transparent: option_transparent.checked,
        option_hide: option_hide.checked,
        engine_google: engine_google.checked,
        engine_bing: engine_bing.checked,
        engine_duckduckgo: engine_duckduckgo.checked
    };
    
    // Update UI
    option_activate.checked = settings.option_activate || false;
    option_highlight.checked = settings.option_highlight || false;
    option_transparent.checked = settings.option_transparent || false;
    option_hide.checked = settings.option_hide || false;
    engine_google.checked = settings.engine_google || false;
    engine_bing.checked = settings.engine_bing || false;
    engine_duckduckgo.checked = settings.engine_duckduckgo || false;
    
    console.log("- UI updated");
    
    chrome.storage.sync.set(settings, () => {
        console.log("- data saved");
    });

}


// Add poop website to poop list when clicking the poop button
//----------------------------------------------
function addPoopToList() {
    
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        
        if (tabs[0] && tabs[0].url) {
            
            const url = tabs[0].url;
            const domain = cleanUrl(url);
    
            const result = await chrome.storage.sync.get(['blockedDomains']);
            let blockedDomains = result.blockedDomains || [];
    
            if (!blockedDomains.includes(domain)) {
                blockedDomains.push(domain);
                await chrome.storage.sync.set({ blockedDomains });
      
                // Notification
                chrome.action.setBadgeText({ text: '💩', tabId: tabs[0].id });
                setTimeout(() => {
                    chrome.action.setBadgeText({ text: '', tabId: tabs[0].id });
                }, 3000);
            }
    
            console.log("- poop list :");
  	        console.log(blockedDomains);
  	       
  	  }
  	  else {
  	     console.log("- no url found from tab..."); 
  	  }
    
    });
}

function cleanUrl(url) {
    let domain = new URL(url);
    domain = domain.hostname;
    domain = domain.replace(/^www\./, '');
    return domain;
}

// Init
//----------------------------------------------
loadData();



