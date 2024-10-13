chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed and ready!");
  });
  
  chrome.action.onClicked.addListener((tab) => {
    // Ensure the content script is executed only on YouTube pages
    if (tab.url.includes('youtube.com')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    }
  });
  