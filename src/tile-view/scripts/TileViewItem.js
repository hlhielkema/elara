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
TileViewItem.prototype.construct = function construct() {
    // Create the elements
    const element = document.createElement('div');
    const titleElement = document.createElement('div');
    const imageContainerElement = document.createElement('div');
    const imageElement = document.createElement('img');

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
    const self = this;
    element.addEventListener('mousedown', (e) => {
        self.startDragDrop(e);
    });

    // Return the new constructed tile view item
    return element;
};

// Apply the position on the element
TileViewItem.prototype.applyPosition = function applyPosition() {
    // Set the position properties
    this.element.style.top = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
};

// Start the drag/drop logic(from mousedown event)
TileViewItem.prototype.startDragDrop = function startDragDrop(e) {
    const self = this;
    this.parent.engine.start(e, {
        init(session) {
            // Store the initial tile position
            session.setInitialPosition(self.x, self.y);
        },
        transform(session, dx, dy, x, y, first, completed) {
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
                    const gridPosition = self.parent.translateScreenToGrid(self.x, self.y);
                    const gridX = gridPosition.x;
                    const gridY = gridPosition.y;

                    // Translate the grid position back to a screen position
                    const screenPosition = self.parent.translateGridToScreen(gridX, gridY);

                    // Update the position
                    self.x = screenPosition.x;
                    self.y = screenPosition.y;

                    // Enable the movement animation
                    self.element.classList.add('animate-position');

                    // Apply the position (animated)
                    self.applyPosition();
                }
            }
        },
    });
};

export default TileViewItem;
