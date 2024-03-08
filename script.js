// gets tab groups from chrome storage
function getSavedTabGroups() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('tabGroups', (result) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                resolve(result || []);
            }
        });
    });
}

// gets open tab groups
function getOpenTabGroups() {
    return new Promise((resolve, reject) => {
        chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (result) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                resolve(result || []);
            }
        });
    });
}

chrome.storage.sync.get().then((result) => {

    // If tab groups in storage, display them. Else, display 'none found' message.
    if (Object.keys(result).length) {
        const table = document.querySelector('table');

        for (const [groupTitle, group] of Object.entries(result)) {

            // Create all of the elements to display tab groups
            const deleteGroup = document.createElement('button');
            deleteGroup.setAttribute('title', 'Delete group')
            deleteGroup.innerHTML = 'Delete';
            deleteGroup.addEventListener('click', () => {
                chrome.storage.sync.remove(groupTitle);

                location.reload();
            });

            const dropDnDiv = document.createElement('div');
            const dropBtn = document.createElement('button');
            const dropContent = document.createElement('div');
            dropDnDiv.setAttribute('class', 'dropdown');
            dropBtn.setAttribute('class', 'dropbtn');
            dropContent.setAttribute('class', 'dropdown-content')
            dropDnDiv.appendChild(dropBtn);
            dropDnDiv.appendChild(dropContent);

            // add tab to dropdown function
            function dropDnAdd(title, url) {
                const tabItem = document.createElement('a');
                tabItem.setAttribute('href', url);
                tabItem.setAttribute('target', '_blank');
                tabItem.innerHTML = title;
                
                dropContent.appendChild(tabItem);
            }

            // add new tab to group
            const addTab = document.createElement('a');
            addTab.setAttribute('href', '#');
            addTab.innerHTML = '&#x2b; Add current tab';

            dropContent.appendChild(addTab);

            addTab.addEventListener('click', () => {
                for (const tab of currTab) {
                    chrome.storage.sync.set(groupTitle[tab.title] = tab.url);
                }
            });

            // append tab links to dropdown list by group
            for (const [key, value] of Object.entries(group)) {
                dropDnAdd(key, value);
            }


            dropBtn.innerHTML = groupTitle;
            dropBtn.addEventListener('click', () => {
                for (const url of Object.values(group)) {
                chrome.tabs.create({'url': url});
                }
            });


    } else {
        const textNode = document.createElement('p');
        textNode.innerHTML = 'No tab groups found.';
        document.body.appendChild(textNode);
    }
});