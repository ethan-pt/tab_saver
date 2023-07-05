const tabs = await chrome.tabs.query({ currentWindow: true });

let tabsDict = {};
for (const tab of tabs) {
    tabsDict[tab.title] = tab.url;
}

const tabForm = document.querySelector('form');
const groupTitle = document.getElementById('group-title');
const groupDict = {}
function tabSubmit(event) {
    event.preventDefault();

    groupDict[groupTitle.value] = tabsDict;
    chrome.storage.sync.set(groupDict);

    tabForm.reset();
}

tabForm.addEventListener("submit", tabSubmit);