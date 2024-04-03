class AzukiInjector extends NftInjector {
    constructor(data) {
        super();
        
        // Set local variables
        this.azukiData = data;
        this.checkContentTimeout = null;
        this.checkContentTimeoutDuration = 250;
        console.log(this.azukiData);

        // Bind methods to ensure 'this' context is maintained.  Gross.
        this.pollForNftItems = this.pollForNftItems.bind(this);
        this.checkForNewItems = this.checkForNewItems.bind(this);
        this.extractAzukiNumber = this.extractAzukiNumber.bind(this);
        this.handleNftItems = this.handleNftItems.bind(this);
        this.getAzukiCostById = this.getAzukiCostById.bind(this);
        this.calculateAveragePointsPerAzuki = this.calculateAveragePointsPerAzuki.bind(this);
        this.getAzukiPointValueById = this.getAzukiPointValueById.bind(this);

        // Start polling for NFT items
        this.pollForNftItems();
    }
    // Poll the document for the desired elements
    pollForNftItems() {
        // Preform the check
        this.checkForNewItems();
        // Clear the previous timeout
        clearTimeout(this.checkContentTimeout);
        // Set a new timeout
        this.checkContentTimeout = setTimeout(this.pollForNftItems, this.checkContentTimeoutDuration);
    }

    checkForNewItems() {
        const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
        if (nftItems.length > 0) {
            if (this.azukiData) {
                this.handleNftItems(this.azukiData);
            }
        }
    }

    // Grab azuki Id number
    // Function to extract Azuki number from the given HTML
    extractAzukiNumber(item) {
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
            const azukiNumberContent = linkElement.textContent.match(/Azuki #(\d+)/);
            
            if (azukiNumberContent && azukiNumberContent.length) {
                const azukiNumber = azukiNumberContent[1];
                console.log('Azuki number from link text:', azukiNumber);
                return azukiNumber;
            } else {
                        
                // If no number is found, return a default value or null
                //console.log('Not on azuki page');
            }
        }

        // If no number is found, return a default value or null
        //console.log('No Azuki number found');
    }
    
    getAzukiCostById(item) {
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

    calculateAveragePointsPerAzuki(cost, azukiPointValue) {
        return Math.round((azukiPointValue / cost)*100, 2)/100;
    }

    getAzukiPointValueById(azukiData, azukiId) {
        return azukiData[azukiId]?.data?.totalScore;
    }

    handleNftItems(azukiData) {
        const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
        // For each item, update the DOM with the average points per azuki
        //console.log(nftItems);
        for (const item of nftItems) {
            const azukiNumber = this.extractAzukiNumber(item);
            //console.log(azukiNumber);
            if (azukiNumber) {
                const azukiPointValue = this.getAzukiPointValueById(azukiData, azukiNumber);
                const azukiCost = this.getAzukiCostById(item);
                if (azukiPointValue) {
                    const averagePointsPerAzuki = this.calculateAveragePointsPerAzuki(azukiCost, azukiPointValue);
                    this.updateDomWithAveragePoints(item, averagePointsPerAzuki, 'Detailed text goes here...');
                }
            }
        }
    }
}