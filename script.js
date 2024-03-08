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

// saves group to chrome storage
function saveGroup(tabGroup) {
    getSavedTabGroups().then((data) => {
        let tabGroups = data.tabGroups || [];
        
        // overwrites groups with matching titles if found, else adds new group
        let index = tabGroups.findIndex((group) => group['title'] === tabGroup['title']);
        if (index !== -1) {
            tabGroups[index] = tabGroup;
            
            console.log('group overwritten.');
        } else {
            tabGroups.push(tabGroup);

            console.log('new group created');
        }

        chrome.storage.sync.set({ 'tabGroups': tabGroups }, () => {
            console.log(`group ${tabGroup['title']} saved.`);
        });
    });
}

// gets tabs assigned to specified group
function getTabsByGroup(groupId) {
    chrome.tabs.query({ groupId: groupId }, (tabs) => {
        return tabs || [];
    });
}

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