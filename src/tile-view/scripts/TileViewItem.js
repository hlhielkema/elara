// constructor
function TileViewItem(parent, src) {
    // Basic options
    this.parent = parent;
    this.title = src.title;
    this.image = src.image;
    this.open = src.open;

    // States
    this.x = 0;
    this.y = 0;

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
        
    // Store the last constructed element
    this.element = element;

    // Apply the position
    this.applyPosition();

    // Bind the double click events
    imageElement.addEventListener('dblclick', this.open);
    titleElement.addEventListener('dblclick', this.open);

    // Start the drag/drop logic on the mouse down event
    var self = this;
    element.addEventListener('mousedown', function (e) { 
        self.startDragDrop(e);
    });

    // Return the new constructed tile view item
    return element;
}

// Apply the position on the element
TileViewItem.prototype.applyPosition = function() {
    // Set the position properties
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
}

// Start the drag/drop logic(from mousedown event)
TileViewItem.prototype.startDragDrop = function(e) {
    var self = this;
    this.parent.engine.start(e, {
        init: function (session) {
            // Store the initial tile position
            session.initialX = self.x;
            session.initialY = self.y;
        },
        transform: function (session, dx, dy, x, y, first, completed) {  
            // First transform          
            if (first) {                
                // Make sure that the movement animation is disabled
                if (self.element.classList.contains('animate-position')) {
                    self.element.classList.remove('animate-position');
                }                
            }

            // Update the position
            self.x = session.initialX + dx;
            self.y = session.initialY + dy;

            // Apply the new position
            self.applyPosition();

            // Last transform
            if (completed) {

                if (self.parent.settings.grid.enforce) {
                    // Get the nearest grid position for the current screen position
                    var gridPosition = self.parent.translateScreenToGrid(self.x, self.y);                

                    // Translate the grid position back to a screen position
                    var screenPosition = self.parent.translateGridToScreen(gridPosition.x, gridPosition.y);

                    // Update the position
                    self.x = screenPosition.x;
                    self.y = screenPosition.y;

                    // Enable the movement animation
                    self.element.classList.add('animate-position');
                    
                    // Apply the position (animated)
                    self.applyPosition();
                }
            }
        }
    });
}

export default TileViewItem;