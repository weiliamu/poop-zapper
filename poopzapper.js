
// Constants & Settings
//----------------------------------------------
const google_selector = '.GUyUUb, .MjjYud';
const bing_selector = '.b_algo, .mc_vtvc, .b_acf_card, .b_slidesContainer, [data-partnertag] > li';
const duckduckgo_selector = '.wLL07_0Xnd1QZpzpfR4W';
// Idea of new features : let the user chose the selector (through option UI)
let custom_selector = '.xxx';

// General status variable, initial state
//----------------------------------------------
let settings = {
  activate: false,
  highlight: false,
  transparent: false,
  hide: false,
  google: false,
  bing: false,
  duckduckgo: false,
  browser: "xxx",
  selector: 'xxx'
};

let poopList = [];


// Listener
//----------------------------------------------
chrome.storage.onChanged.addListener((changes) => {
    if (changes.option_activate || changes.option_highlight || changes.option_transparent || changes.option_hide || changes.engine_google || changes.engine_bing || changes.engine_duckduckgo ) {
        console.log("- data changed");
        updatePage();
    }
});

// Listening message from background when url changes (when new search request, dynamic js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'urlChanged') {
    console.log('- new URL detected 🔄');
    updatePage();
  }
  if (message.action === 'domainBlocked') {
    console.log('- new poop websites 💩🗒️');
    updatePage();
  } 
});


// Loading options from chrome.storage.sync.get
// change to sync to synchronise across all plateforms, limited to 100ko
//----------------------------------------------
function loadData() { // Promise-resolve is important here as the data have "a delay to arrive". If not present, there is a delay when pressing a button int the popup UI.
    return new Promise((resolve) => {
    chrome.storage.sync.get(['option_activate', 'option_highlight', 'option_transparent',
    'option_hide', 'engine_google', 'engine_bing', 'engine_duckduckgo', 'blockedDomains'], (result) => {
        
        settings.activate = result.option_activate;
        settings.highlight = result.option_highlight;
        settings.transparent = result.option_transparent;
        settings.hide = result.option_hide;
        settings.google = result.engine_google;
        settings.bing = result.engine_bing;
        settings.duckduckgo = result.engine_duckduckgo;
        settings.currentDomain = getCurrentDomain();
        settings.selector = getSelector(settings.currentDomain);
        poopList = result.blockedDomains || [];
        console.log("- data loaded");
        resolve();
    });
    });
}


// Magic Poop Functions 
//----------------------------------------------
async function updatePage() {
    
    let iNeedToFilter = false;
    await loadData(); // waiting for data to be updated and ready
    iNeedToFilter = testIfAcceptedSearchEngine();
    
    if(iNeedToFilter && settings.activate) {
        console.log("🧹 i need to filter");
        poopClearAll();
        if(settings.highlight) poopHighlight();
        if(settings.transparent) poopTransparent();
        if(settings.hide) poopHide();
    } else {
        console.log("💤 i do not need to filter");
        poopClearAll();
    }     
}

function getCurrentDomain() {
    const domain = window.location.hostname;
    
    if (domain.includes('google')) return 'google';
    if (domain.includes('bing')) return 'bing';
    if (domain.includes('duckduckgo')) return 'duckduckgo';
    return domain;

}

function testIfAcceptedSearchEngine() {
    const domain = settings.currentDomain;
    if((domain == "google") && settings.google) {
       return true;
    } else if((domain == "bing") && settings.bing) {
        return true;
    } else if((domain == "duckduckgo") && settings.duckduckgo) {
        return true;
    } else {
        return false;
    }
}

function getSelector(browser) {
	if(browser == "google") {
       return google_selector;
    } else if(browser == "bing") {
        return bing_selector;
    } else if(browser == "duckduckgo") {
        return duckduckgo_selector;
    } else {
        return "?";
    }
}

function getItems(cssSelector) {
	const resultRaw = document.querySelectorAll(cssSelector);
	let resultFiltered = [];
	
	// test if the webistes are on the poop list or not
	// tests by simply searching inside the innerHTML of the search result text.
	// this is not bad but can certainly be improved
	resultRaw.forEach(item => {
	    const text = item.innerHTML.toLowerCase();
    	poopList.forEach(website => {
    	    if(text.includes(website.toLowerCase())) {
    	       resultFiltered.push(item); 
    	    } 
    	});
	});
	
	return resultFiltered;
}

function poopHighlight() {
	const resultAll = getItems(settings.selector);
	resultAll.forEach(item => {
    	item.classList.add('item-highlight');
	});
	
	console.log("💩 highlight");
}

function poopTransparent() {
	const resultAll = getItems(settings.selector);
	resultAll.forEach(item => {
    	item.classList.add('item-transparent');
	});
	
	console.log("💩 tranparent");
}

function poopHide() {
	const resultAll = getItems(settings.selector);
	resultAll.forEach(item => {
    	item.classList.add('item-hide');
	});
	
	console.log("💩 hide");
}

function poopClearAll()
{
	const resultAll = getItems(settings.selector);
	resultAll.forEach(item => {
    	item.classList.remove('item-highlight');
    	item.classList.remove('item-transparent');
    	item.classList.remove('item-hide');
	});
	console.log("- all clear");
}

function cleanUrl(url) {
    let domain = new URL(url);
    domain = domain.hostname;
    domain = domain.replace(/^www\./, '');
    return domain;
}


// Init
//----------------------------------------------
updatePage();




