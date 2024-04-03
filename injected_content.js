//alert('hello, im the dom injected content script!')
var azukiData = null;

function handleNftItems(azukiData) {
    const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
    //chrome.runtime.sendMessage({nftItems: nftItems}, function(response) {
        // For each item, update the DOM with the average points per azuki
        //console.log(nftItems);
        for (const item of nftItems) {
            const azukiNumber = extractAzukiNumber(item);
            //console.log(azukiNumber);
            if (azukiNumber) {
                const azukiPointValue = getAzukiPointValueById(azukiData, azukiNumber);
                const azukiCost = getAzukiCostById(item);
                if (azukiPointValue) {
                    const averagePointsPerAzuki = calculateAveragePointsPerAzuki(azukiCost, azukiPointValue);
                    updateDomWithAveragePoints(item, averagePointsPerAzuki, 'Detailed text goes here...');
                }
            }
        }
   // });
}
function getAzukiCostById(item) {
    // Assuming 'item' is a parent element that contains the specific NFT details including price
    const priceElement = Array.from(item.querySelectorAll('dd > div'))[0];

    if (priceElement) {
        const price = parseFloat(priceElement.innerHTML);
        //console.log('Price:', price);
        return isNaN(price) ? null : price; // Return null if price is not a number
    } else {
        console.error('Price element not found');
        return null;
    }
}


function calculateAveragePointsPerAzuki(cost, azukiPointValue) {
    return Math.round((azukiPointValue / cost)*100, 2)/100;
}

function getAzukiPointValueById(azukiData, azukiId) {
    if (azukiId == 3692) {
        console.log('test');
    }
    return azukiData[azukiId]?.data?.totalScore;
}

// Poll the document for the desired elements
async function pollForNftItems() {
    const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
    if (nftItems.length > 0) {
        if (!azukiData) {
            azukiData = await loadAzukiData(handleNftItems);
        } else {
            handleNftItems(azukiData);
        }
    } else {
        setTimeout(pollForNftItems, 500); // Check again after 500ms
    }
}

// Grab azuki Id number
// Function to extract Azuki number from the given HTML
function extractAzukiNumber(item) {
    // Find the img element that has an alt attribute containing "Azuki #"
    const imgElement = item.querySelector('img[alt^="Azuki #"]');
    if (imgElement) {
        // Extract the number from the alt attribute
        const azukiNumber = imgElement.alt.match(/Azuki #(\d+)/)[1];
        //console.log('Azuki number from image alt:', azukiNumber);
        return azukiNumber;
    }

    // If the number is not found in the img element, try to find it in a link or title
    const linkElement = document.querySelector('.Link__StyledRouterLink-sc-1xumirv-0.hsrcZD');
    if (linkElement) {
        // Extract the number from the text content
        const azukiNumber = linkElement.textContent.match(/Azuki #(\d+)/)[1];
        console.log('Azuki number from link text:', azukiNumber);
        return azukiNumber;
    }

    // If no number is found, return a default value or null
    console.log('No Azuki number found');
}

// Function to load JSON data and store it in the global variable
function loadAzukiData(callback) {
    const url = chrome.runtime.getURL('azuki_points.json');
    fetch(url)
        .then(response => response.json())
        .then(data => {
            azukiData = data;  // Store the loaded JSON data in the global variable
            console.log('Azuki data loaded:', azukiData);
            callback(azukiData);
            return azukiData;
        })
        .catch();
}


function updateDomWithAveragePoints(container, averagePoints, detailedText) {
    // Find the image container where the overlay should be placed
    //const container = document.querySelector(`.NftDetailsGallery__Root-sc-7wv3ro-0.enXOon.grid-item-${id} .image`);
    container = container.querySelector('.image');
    if (container) {
        // Check if the overlay already exists
        let parent = container.parentNode.querySelector('.custom-blurzuki-overlay');

        if (!parent) {
            // Create the overlay element
            const overlay = document.createElement('div');
            overlay.classList.add('custom-blurzuki-overlay'); // Add class for future reference
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.right = '0';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            overlay.style.color = 'white';
            overlay.style.padding = '5px';
            overlay.style.borderRadius = '0 0 0 5px';
            overlay.style.cursor = 'help';

            // Set the text for the overlay
            overlay.textContent = `Pts/ETH: ${averagePoints}`;

            // Create the tooltip element for detailed text
            const tooltip = document.createElement('div');
            tooltip.style.visibility = 'hidden';
            tooltip.style.width = '200px';
            tooltip.style.backgroundColor = 'black';
            tooltip.style.color = '#fff';
            tooltip.style.textAlign = 'center';
            tooltip.style.borderRadius = '6px';
            tooltip.style.padding = '5px 0';
            tooltip.style.position = 'absolute';
            tooltip.style.zIndex = '1';
            tooltip.style.bottom = '125%';
            tooltip.style.left = '50%';
            tooltip.style.marginLeft = '-100px';
            tooltip.textContent = detailedText;

            // Show tooltip on hover
            overlay.onmouseover = () => tooltip.style.visibility = 'visible';
            overlay.onmouseout = () => tooltip.style.visibility = 'hidden';

            // Append the tooltip to the overlay, then the overlay to the container
            overlay.appendChild(tooltip);
            container.appendChild(overlay);
        }
    } else {
        console.log(`Container for ID ${container} not found.`);
    }
}

function main() {
    // Start polling after the document has loaded
    if (document.readyState === "complete") {
        pollForNftItems();
    } else {
        window.addEventListener('load', pollForNftItems);
    }
}

main();

let checkTimeout;
function checkForNewNftItems() {
  pollForNftItems();
  // Clear the previous timeout
  clearTimeout(checkTimeout);
  // Set a new timeout
  checkTimeout = setTimeout(checkForNewNftItems, 250);
}

  // Call once on page load as well
  checkForNewNftItems();