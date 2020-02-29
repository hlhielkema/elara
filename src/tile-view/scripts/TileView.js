import TileViewItem from "./TileViewItem.js";

// constructor: TileView
function TileView() {
    this.selector = null;
    this.items = [];
}

// Bind the tile view to a container
TileView.prototype.bind = function(selector) {
    this.selector = selector;
};

// Update the items of the tile view
TileView.prototype.update = function(items) {
    this.items = [];
    for (var i = 0; i < items.length; i++) {        
        this.items.push(new TileViewItem(this, items[i]));
    }
    this.construct();
};

// Construct the tile view
TileView.prototype.construct = function() {
    // Get the container
    var container = document.querySelector(this.selector);

    // Clear the container    
    container.innerHTML = '';

    // Add the items
    for (var i = 0; i < this.items.length; i++) {
        container.appendChild(this.items[i].construct());
    }
};

export default TileView;