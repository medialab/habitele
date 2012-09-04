chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) { chrome.tabs.update(tab.id, { selected: true } ) });
window.close();
