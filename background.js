
// console.log('i am background script');
// console.log(this);

chrome.runtime.onInstalled.addListener(() => {
    //chrome.tabs.create({ url: 'https://blur.io/collection/azuki' });
    chrome.tabs.create({ url: 'https://blur.io/collection/beanzofficial' });
    //chrome.tabs.create({ url: 'https://blur.io/collection/azukielementals' });
});
// const targetUrl = 'https://blur.io/collection/azuki';

// chrome.action.onClicked.addListener(async (tab) => {
//     alert('Background script is running!');
//     if (tab.url.startsWith(targetUrl)) {
//       // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//       const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//       // Next state will always be the opposite
//       const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  
//       // Set the action badge to the next state
//       await chrome.action.setBadgeText({
//         tabId: tab.id,
//         text: nextState,
//       });
//     }
//   });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log('message received');
    // console.log(request);
    // console.log(sender);
    // console.log(sendResponse);
    // console.log('message received');
    // console.log(request);
    // console.log(sender);
    // console.log(sendResponse);
    // if (request.nftItems) {
    //     console.log('message received');
    //     console.log(request.nftItems);
    //     console.log(sender);
    //     console.log(sendResponse);
    // }
    // sendResponse({message: 'message received'});
});