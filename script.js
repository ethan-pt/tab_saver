const currTab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
const tabs = await chrome.tabs.query({ currentWindow: true });

let tabsDict = {};
for (const tab of tabs) {
    tabsDict[tab.title] = tab.url;
}

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