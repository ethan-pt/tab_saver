const tabs = await chrome.tabs.query({ currentWindow: true });

let tabsDict = {};
for (const tab of tabs) {
    tabsDict[tab.title] = tab.url;
}

const saveButton = document.getElementById('save-button');
saveButton.onclick = function() {
    chrome.storage.sync.set(tabsDict);
}