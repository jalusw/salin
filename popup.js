document.addEventListener("DOMContentLoaded", () => {
  let toggleButton = document.getElementById("toggle-tracking");

  // Load tracking status
  chrome.storage.local.get({ trackingEnabled: false }, (data) => {
    toggleButton.textContent = data.trackingEnabled ? "Stop Tracking" : "Start Tracking";
  });

  // Toggle tracking on button click
  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get({ trackingEnabled: false }, (data) => {
      let newState = !data.trackingEnabled;
      chrome.storage.local.set({ trackingEnabled: newState }, () => {
        toggleButton.textContent = newState ? "Stop Tracking" : "Start Tracking";
      });
    });
  });

  // Load saved pages
  chrome.storage.local.get(["savedPages"], (data) => {
    let pageList = document.getElementById("page-list");

    if (data.savedPages) {
      data.savedPages.forEach((entry, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${entry.time}</strong>: <a href="#" data-index="${index}">${entry.url}</a>`;
        pageList.appendChild(li);
      });

      document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          let index = event.target.getAttribute("data-index");
          let savedHtml = data.savedPages[index].html;
          let newWindow = window.open();
          newWindow.document.write(savedHtml);
        });
      });
    }
  });
});

