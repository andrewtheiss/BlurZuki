class BlurZuki {
    constructor() {
        this.initialize();
    }

    async initialize() {
        this.AzukiInjector = await this.constructInjector('azuki');
        this.BeanzInjector = await this.constructInjector('beanz');
        this.ElementalsInjector = await this.constructInjector('elementals');
    }

    async constructInjector(type) {
        switch (type) {
            case 'azuki':
                let azukiData = await this.loadDataAndConstructInjector(
                    'injected_content/azuki_points.json', 
                    AzukiInjector
                    );
                return azukiData;
                break;
            case 'beanz':
                let beanzData = await this.loadDataAndConstructInjector(
                    'injected_content/beanz_points.json', 
                    BeanzInjector
                    );
                return beanzData;
                break;
            case 'elementals':
                let elementalsData = await this.loadDataAndConstructInjector(
                    'injected_content/elementals_points.json', 
                    ElementalsInjector
                    );
                return elementalsData;
                break;
        }
    }
       
    // Function to load JSON data and store it in a global variable
    async loadDataAndConstructInjector(dataLocation, classToInit) {
        try {
            const url = chrome.runtime.getURL(dataLocation);
            const response = await fetch(url);
            const data = await response.json();

            console.log('Azuki data loaded:', data);

            // Create an instance of classToInit with the loaded data
            return new classToInit(data);
        } catch (error) {
            console.error('Failed to load data:', error);
            // Handle the error appropriately
            return null; // Or throw an error, depending on your error handling strategy
        }
    }
}

const blurZuki = new BlurZuki();
console.log('blurZuki:', blurZuki);