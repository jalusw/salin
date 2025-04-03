function savePageContent() {
  chrome.storage.local.get({ trackingEnabled: false }, (data) => {
    if (data.trackingEnabled) {
      let pageHtml = document.documentElement.outerHTML;
      let pageUrl = window.location.href;

      chrome.storage.local.get({ savedPages: [] }, (data) => {
        let pages = data.savedPages;
        pages.push({ url: pageUrl, html: pageHtml, time: new Date().toISOString() });

        chrome.storage.local.set({ savedPages: pages });
      });
    }
  });
}

window.addEventListener("load", savePageContent);

