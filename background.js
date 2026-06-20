
// Listener
//----------------------------------------------
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToPooplist",
    title: "Add to poop list",
    contexts: ["link"]
  });
});

// Message to content when url changed (for new search request, dynamic js)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.sendMessage(details.tabId, { 
      action: 'urlChanged',
      url: details.url 
    });
  }
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info && info.menuItemId === "addToPooplist") {

    const domain = cleanUrl(info.linkUrl);
    
    const result = await chrome.storage.sync.get(['blockedDomains']);
    let blockedDomains = result.blockedDomains || [];
    
    if (!blockedDomains.includes(domain)) {
      blockedDomains.push(domain);
      await chrome.storage.sync.set({ blockedDomains });
      
      // Sending message to content.js to update the page
      chrome.tabs.sendMessage(tab.id, { 
        action: 'domainBlocked',
        domain: domain,
        blockedDomains: blockedDomains
      });
      
      // Notification
      chrome.action.setBadgeText({ text: '💩', tabId: tab.id });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '', tabId: tab.id });
      }, 3000);
    }
    
    console.log("- poop list :");
  	console.log(blockedDomains);
  
  }
  
});


// Functions
//----------------------------------------------
function cleanUrl(url) {
    let domain = new URL(url);
    domain = domain.hostname;
    domain = domain.replace(/^www\./, '');
    return domain;
}
