class BeanzInjector extends NftInjector {
    constructor(data) {
        super();
        
        // Set local variables
        this.beanzData = data;
        this.checkContentTimeout = null;
        this.checkContentTimeoutDuration = 250;
        console.log(this.beanzData);

        // Bind methods to ensure 'this' context is maintained.  Gross.
        this.pollForNftItems = this.pollForNftItems.bind(this);
        this.checkForNewItems = this.checkForNewItems.bind(this);
        this.extractBeanNumber = this.extractBeanNumber.bind(this);
        this.handleNftItems = this.handleNftItems.bind(this);
        this.getBeanzCostById = this.getBeanzCostById.bind(this);
        this.calculateAveragePointsPerBean = this.calculateAveragePointsPerBean.bind(this);
        this.getBeanPointValueById = this.getBeanPointValueById.bind(this);

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
            if (this.beanzData) {
                this.handleNftItems(this.beanzData);
            }
        }
    }

    // Grab bean Id number
    // Function to extract Bean number from the given HTML
    extractBeanNumber(item) {
        // Find the img element that has an alt attribute containing "Bean #"
        const imgElement = item.querySelector('img[alt^="Bean #"]');
        if (imgElement) {
            // Extract the number from the alt attribute
            const beanNumberElement = imgElement.alt.match(/Bean #(\d+)/);
            
            if (beanNumberElement && beanNumberElement.length) {
                const beanNumber = beanNumberElement[1];
                //console.log('Bean number from image alt:', beanNumber);
                return beanNumber;
            }
        }

        // If the number is not found in the img element, try to find it in a link or title
        const linkElement = document.querySelector('.Link__StyledRouterLink-sc-1xumirv-0.hsrcZD');
        if (linkElement) {
            // Extract the number from the text content
            const beanNumberElement = linkElement.textContent.match(/Bean #(\d+)/);
            
            if (beanNumberElement && beanNumberElement.length) {
                const beanNumber = beanNumberElement[1];
                console.log('Bean number from link text:', beanNumber);
                return beanNumber;
            }
        }

        // If no number is found, return a default value or null
        //console.log('No Bean number found');
    }
    
    getBeanzCostById(item) {
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

    calculateAveragePointsPerBean(cost, beanPointValue) {
        return Math.round((beanPointValue / cost)*100, 2)/100;
    }

    getBeanPointValueById(beanzData, beanzId) {
        return beanzData[beanzId]?.data?.totalScore;
    }

    handleNftItems(beanzData) {
        const nftItems = document.querySelectorAll('[class^="NftDetailsGallery__Root-"]');
        // For each item, update the DOM with the average points per bean
        //console.log(nftItems);
        for (const item of nftItems) {
            const beanNumber = this.extractBeanNumber(item);
            //console.log(beanNumber);
            if (beanNumber) {
                const beanzPointValue = this.getBeanPointValueById(beanzData, beanNumber);
                const beanzCost = this.getBeanzCostById(item);
                if (beanzPointValue) {
                    const averagePointsPerBean = this.calculateAveragePointsPerBean(beanzCost, beanzPointValue);
                    this.updateDomWithAveragePoints(item, averagePointsPerBean, 'Detailed text goes here...');
                }
            }
        }
    }
}