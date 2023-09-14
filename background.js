// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('Twitter Data Enhancer installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        fetch(request.url)
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => sendResponse({error: error.message}));
        return true;  // Important to return true to indicate the response is sent asynchronously
    }
});
