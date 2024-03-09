// gets tab groups from chrome storage
function getSavedTabGroups() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('tabGroups', (result) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                resolve(result['tabGroups'] || []);
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
        let tabGroups = data || [];
        
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

            location.reload();
        });
    });
}

function deleteGroup(tabGroup) {
    getSavedTabGroups().then((data) => {
        let tabGroups = data || [];
        
        tabGroups = tabGroups.filter(group => {
            return JSON.stringify(group) !== JSON.stringify(tabGroup);
        });

        chrome.storage.sync.set({ 'tabGroups': tabGroups }, () => {
            console.log(`group ${tabGroup['title']} deleted.`);

            location.reload();
        });
    });
}

// gets tabs assigned to specified group
function getTabsByGroup(groupId) {
    chrome.tabs.query({ groupId: groupId }, (tabs) => {
        return tabs || [];
    });
}

// add open tab groups to active groups div
getOpenTabGroups().then(openGroups => {
    const activeGroups = document.getElementById('active-groups');

    const colorsDict = {
        'grey': '#DADCE0',
        'blue': '#8AB4F8',
        'red':'#F28B82',
        'yellow':'#FDD663',
        'green': '#81C995',
        'pink': '#FF8BCB',
        'purple': '#C58AF9',
        'cyan': '#78D9EC',
        'orange': '#FCAD70'
    }

    if (openGroups.length) {
        for (let i = 0; i < openGroups.length; i++) {
            let group = openGroups[i];
    
            let groupTitle = document.createElement('p')
            groupTitle.classList.add('group-title');
            groupTitle.style.backgroundColor = colorsDict[group['color']];
            groupTitle.innerHTML = group['title'];
    
            let groupSubmit = document.createElement('div');
            groupSubmit.classList.add('add-button');
            groupSubmit.title = 'Save';
            groupSubmit.onclick = (event) => {
                group['tabs'] = getTabsByGroup(group['id']);
                saveGroup(group);
            };
            groupSubmit.innerHTML = '<strong>+</strong>';
    
            // div to wrap individual groups
            let groupDiv = document.createElement('div');
            groupDiv.classList.add('tab-group');
    
            groupDiv.appendChild(groupTitle);
            groupDiv.appendChild(groupSubmit);
            
            activeGroups.appendChild(groupDiv);
        }
    } else {
        // add text if no tab groups found
        const noGroups = document.createElement('p');
        noGroups.innerHTML = 'No tab groups found. Try adding one by right clicking on a tab and selecting \'Add tab to new group\'';
        activeGroups.appendChild(noGroups);
    }
});


// dropdown buttons logic
const collList = document.getElementsByClassName('collapsible');
for (let i = 0; i < collList.length; i++) {
    collList[i].addEventListener('click', () => {
        collList[i].classList.toggle("active");
        let content = collList[i].nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
}
