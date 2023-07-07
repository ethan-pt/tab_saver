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

    location.reload();
}

tabForm.addEventListener('submit', tabSubmit);

chrome.storage.sync.get().then((result) => {
    if (Object.keys(result).length) {
        const table = document.querySelector('table');

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('title', 'Delete group')
        deleteBtn.innerHTML = 'Delete';

        const dropDnDiv = document.createElement('div');
        const dropBtn = document.createElement('button');
        const dropContent = document.createElement('div');
        dropDnDiv.setAttribute('class', 'dropdown');
        dropBtn.setAttribute('class', 'dropbtn');
        dropContent.setAttribute('class', 'dropdown-content')
        dropDnDiv.appendChild(dropBtn);
        dropDnDiv.appendChild(dropContent);

        for (const [title, group] of Object.entries(result)) {
            for (const [key, value] of Object.entries(group)) {
                const tabItem = document.createElement('a');
                tabItem.setAttribute('href', value);
                tabItem.setAttribute('target', '_blank');
                tabItem.innerHTML = key;

                dropContent.appendChild(tabItem);
            }

            deleteBtn.addEventListener('click', () => {
                chrome.storage.sync.remove(title);

                location.reload();
            });

            dropBtn.innerHTML = title;
            dropBtn.addEventListener('click', () => {
                for (const url of Object.values(group)) {
                chrome.tabs.create({'url': url});
                }
            });

            const row = table.insertRow();
            row.insertCell(0).appendChild(dropDnDiv);
            row.insertCell(1).appendChild(deleteBtn);
        }

    } else {
        const textNode = document.createTextNode('No tab groups found.');
        document.body.appendChild(textNode);
    }
});