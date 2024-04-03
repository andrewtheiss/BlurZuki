chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: 'https://blur.io/collection/azuki' });
    chrome.tabs.create({ url: 'https://blur.io/collection/beanzofficial' });
    chrome.tabs.create({ url: 'https://blur.io/collection/azukielementals' });
});
