document.addEventListener("DOMContentLoaded", () => {
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

