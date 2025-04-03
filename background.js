chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.local.get({ visitedSites: [] }, (data) => {
      let sites = data.visitedSites;
      sites.push({ url: tab.url, time: new Date().toISOString() });

      chrome.storage.local.set({ visitedSites: sites });
    });
  }
});

