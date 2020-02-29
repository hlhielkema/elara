import TileViewItem from "./TileViewItem.js";
import MouseDragDropTracker from "../../shared/scripts/MouseDragDropTracker.js"

// constructor: TileView
function TileView() {
    this.selector = null;
    this.items = [];
    this.engine = new MouseDragDropTracker();

    // Settings
    this.settings = {
        grid: {
            enforce: true,
            tile: {
                height: 96,
                width: 96,
                margin: 16
            }            
        }
    }
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
    this.updatePositions();
    this.construct();
};

// Update the positions of the tiles to show them in a line from top to bottom
TileView.prototype.updatePositions = function() {    
    for (var i = 0; i < this.items.length; i++) {   
        var position = this.translateGridToScreen(0, i);
        this.items[i].x = position.x;
        this.items[i].y = position.y;
    }
};

// Translate grid coordinates to screen coordinates
TileView.prototype.translateGridToScreen = function(x, y) {
    var grid = this.settings.grid;
    return {
        x: ((grid.tile.width + (grid.tile.margin * 2)) * x) + grid.tile.margin,
        y: ((grid.tile.height + (grid.tile.margin * 2)) * y) + grid.tile.margin
    }
};

// Translate screen coordinates to the nearest grid coordinates.
TileView.prototype.translateScreenToGrid = function(x, y) {
    var grid = this.settings.grid;
    return {
        x: +Math.round((x - grid.tile.margin) / (grid.tile.width + (grid.tile.margin * 2))),
        y: +Math.round((y - grid.tile.margin) / (grid.tile.height + (grid.tile.margin * 2)))
    }
}

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