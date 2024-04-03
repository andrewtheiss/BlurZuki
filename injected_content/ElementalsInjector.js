class ElementalsInjector extends NftInjector {
    constructor(data) {
        super();
        
        // Set local variables
        this.elementalsData = data;
        this.checkContentTimeout = null;
        this.checkContentTimeoutDuration = 250;
        console.log(this.elementalsData);

        // Bind methods to ensure 'this' context is maintained.  Gross.
        this.pollForNftItems = this.pollForNftItems.bind(this);
        this.checkForNewItems = this.checkForNewItems.bind(this);
        this.extractElementalNumber = this.extractElementalNumber.bind(this);
        this.handleNftItems = this.handleNftItems.bind(this);
        this.getElementalsCostById = this.getElementalsCostById.bind(this);
        this.calculateAveragePointsPerElemental = this.calculateAveragePointsPerElemental.bind(this);
        this.getElementalPointValueById = this.getElementalPointValueById.bind(this);

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
            if (this.elementalsData) {
                this.handleNftItems(this.elementalsData);
            }
        }
    }

    // Grab Elemental Id number
    // Function to extract Elemental number from the given HTML
    extractElementalNumber(item) {
        // Find the img element that has an alt attribute containing "Elemental #"
        const imgElement = item.querySelector('img[alt^="Elemental #"]');
        if (imgElement) {
            // Extract the number from the alt attribute
            const elementalNumberElement = imgElement.alt.match(/Elemental #(\d+)/);
            
            if (elementalNumberElement && elementalNumberElement.length) {
                const elementalNumber = elementalNumberElement[1];
                //console.log('Elemental number from image alt:', elementalNumber);
                return elementalNumber;
            }
        }

        // If the number is not found in the img element, try to find it in a link or title
        const linkElement = document.querySelector('.Link__StyledRouterLink-sc-1xumirv-0.hsrcZD');
        if (linkElement) {
            // Extract the number from the text content
            const elementalNumberElement = linkElement.textContent.match(/Elemental #(\d+)/);
            
            if (elementalNumberElement && elementalNumberElement.length) {
                const elementalNumber = elementalNumberElement[1];
                console.log('Elemental number from link text:', elementalNumber);
                return elementalNumber;
            }
        }

        // If no number is found, return a default value or null
        console.log('No Elemental number found');
    }
    
    getElementalsCostById(item) {
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

    calculateAveragePointsPerElemental(cost, elementalPointValue) {
        return Math.round((elementalPointValue / cost)*100, 2)/100;
    }

    getElementalPointValueById(elementalsData, elementalsId) {
        return elementalsData[elementalsId]?.data?.totalScore;
    }

    handleNftItems(elementalsData) {
        const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
        // For each item, update the DOM with the average points per Elemental
        //console.log(nftItems);
        for (const item of nftItems) {
            const elementalNumber = this.extractElementalNumber(item);
            //console.log(elementalNumber);
            if (elementalNumber) {
                const elementalsPointValue = this.getElementalPointValueById(elementalsData, elementalNumber);
                const elementalsCost = this.getElementalsCostById(item);
                if (elementalsPointValue) {
                    const averagePointsPerElemental = this.calculateAveragePointsPerElemental(elementalsCost, elementalsPointValue);
                    this.updateDomWithAveragePoints(item, averagePointsPerElemental, 'Detailed text goes here...');
                }
            }
        }
    }
}