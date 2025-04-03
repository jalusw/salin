document.addEventListener("DOMContentLoaded", () => {
  let toggleButton = document.getElementById("toggle-tracking");
  let clearButton = document.getElementById("clear-storage");
  let pageList = document.getElementById("page-list");

  // Load tracking status
  chrome.storage.local.get({ trackingEnabled: false }, (data) => {
    toggleButton.textContent = data.trackingEnabled ? "Stop Tracking" : "Start Tracking";
  });

  // Toggle tracking
  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get({ trackingEnabled: false }, (data) => {
      let newState = !data.trackingEnabled;
      chrome.storage.local.set({ trackingEnabled: newState }, () => {
        toggleButton.textContent = newState ? "Stop Tracking" : "Start Tracking";
      });
    });
  });

  // Load saved pages
  function loadSavedPages() {
    pageList.innerHTML = ""; // Clear existing list
    chrome.storage.local.get(["savedPages"], (data) => {
      if (data.savedPages && data.savedPages.length > 0) {
        data.savedPages.forEach((entry, index) => {
          let li = document.createElement("li");
          li.innerHTML = `
            <strong>${entry.time}</strong>: 
            <a href="#" data-index="${index}">${entry.url}</a>
            <button class="copy-btn" data-index="${index}">Copy HTML</button>
          `;
          pageList.appendChild(li);
        });

        // Add event listeners to links
        document.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", (event) => {
            event.preventDefault();
            let index = event.target.getAttribute("data-index");
            let savedHtml = data.savedPages[index].html;
            let newWindow = window.open();
            newWindow.document.write(savedHtml);
          });
        });

        // Add event listeners to copy buttons
        document.querySelectorAll(".copy-btn").forEach((btn) => {
          btn.addEventListener("click", (event) => {
            let index = event.target.getAttribute("data-index");
            let copiedHtml = data.savedPages[index].html;
            navigator.clipboard.writeText(copiedHtml).then(() => {
              alert("HTML copied to clipboard!");
            });
          });
        });
      } else {
        pageList.innerHTML = "<p>No pages saved.</p>";
      }
    });
  }

  // Clear storage
  clearButton.addEventListener("click", () => {
    chrome.storage.local.set({ savedPages: [] }, () => {
      pageList.innerHTML = "<p>Data cleared!</p>";
    });
  });

  loadSavedPages();
});
