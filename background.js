// URL Parameters Safari Extension - Background Script

// This background script handles any background tasks for the extension
// For this extension, most work is done in the popup

browser.runtime.onInstalled.addListener(() => {
  console.log('URL Parameters extension installed');
});

// Handle messages from popup if needed
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getActiveTabUrl') {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        if (tabs.length > 0) {
          sendResponse({ url: tabs[0].url });
        } else {
          sendResponse({ url: null });
        }
      })
      .catch(error => {
        console.error('Error getting active tab:', error);
        sendResponse({ url: null, error: error.message });
      });
    return true; // Indicates async response
  }
});
