class NftInjector {
    constructor(data) {
        this.data = data;
    }

    updateDomWithAveragePoints(container, averagePoints, detailedText) {
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
    
    // Add common methods used across all subclasses...
}

console.log('NftInjector.js loaded');