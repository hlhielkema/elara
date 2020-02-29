// constructor
function TileViewItem(parent, src) {
    // Basic options
    this.parent = parent;
    this.title = src.title;
    this.image = src.image;
    this.open = src.open;

    // Inner states
    this.element = null;
}

// Construct the tile view item element
TileViewItem.prototype.construct = function() {
    // Create the elements
    var element = document.createElement('div');   
    var titleElement = document.createElement('div');
    var imageContainerElement = document.createElement('div');
    var imageElement = document.createElement('img');
    
    // Add the style classes
    element.classList.add('tile');
    titleElement.classList.add('title');
    imageContainerElement.classList.add('image-container');    
    
    // Set the title text
    titleElement.innerText = this.title;

    // Set the image source
    imageElement.src = this.image;

    // Combine the elements
    imageContainerElement.appendChild(imageElement);
    element.appendChild(imageContainerElement);
    element.appendChild(titleElement);
    
    // Bind the double click events
    imageElement.addEventListener('dblclick', this.open);
    titleElement.addEventListener('dblclick', this.open);

    // Store the last constructed element
    this.element = element;

    // Return the new constructed tile view item
    return element;
}

export default TileViewItem;