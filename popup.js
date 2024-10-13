document.getElementById('asc-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "sortVideos", order: "asc" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            alert("This extension only works on YouTube pages.");
          } else {
            console.log("Message sent successfully!");
            window.close(); // Close the popup after sorting
          }
        });
      } else {
        alert("This extension only works on YouTube pages.");
      }
    });
  });
  
  document.getElementById('desc-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "sortVideos", order: "desc" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            alert("This extension only works on YouTube pages.");
          } else {
            console.log("Message sent successfully!");
            window.close(); // Close the popup after sorting
          }
        });
      } else {
        alert("This extension only works on YouTube pages.");
      }
    });
  });
  