import WindowManagerEvent from './util/WindowManagerEvent.js';
import WindowSet from './WindowSet.js';

// constructor: WindowSetCollection
function WindowSetCollection(parent) {
    this.parent = parent;
    this.sets = [];
    this.selected = null;
    this.events = {
        selectedChanged: new WindowManagerEvent(this),
        added: new WindowManagerEvent(this),
        removed: new WindowManagerEvent(this),
    };
}

// Get the selected window set
WindowSetCollection.prototype.getSelected = function () {
    return this.selected;
};

// Get the window set at a given index
WindowSetCollection.prototype.getAt = function (index) {
    return this.sets[index];
};

// Add a window set
WindowSetCollection.prototype.add = function () {
    const set = new WindowSet();
    this.sets.push(set);

    // Invoke the added event
    this.events.added.invoke(set);
};

// Select a window set
WindowSetCollection.prototype.select = function (set) {
    if (this.sets.indexOf(set) === -1) {
        throw 'Set not found';
    }
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = set;
    this.selected.resume();
    this.events.selectedChanged.invoke();
};

// Select a window set at a given index
WindowSetCollection.prototype.selectAt = function (index) {
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = this.sets[index];
    this.selected.resume();
    this.events.selectedChanged.invoke();
};

// Get the number of window sets
WindowSetCollection.prototype.count = function () {
    return this.sets.length;
};

// Export the dimensions for all windows of all window sets
WindowSetCollection.prototype.exportDimensions = function () {
    const result = [];
    for (let i = 0; i < this.sets.length; i++) {
        const set = this.sets[i];
        result.push({
            index: i,
            selected: this.selected == set,
            windows: set.exportDimensions(),
        });
    }
    return result;
};

// Create preview elements for all window sets
WindowSetCollection.prototype.createPreviews = function (targetWidth, targetHeight, callback) {
    // Create a click callback function
    const createCallback = function (index, doubleClick) {
        return function () {
            callback(index, doubleClick);
        };
    };

    // Get the dimensions of the window container
    const windowContainerRect = this.parent.getWindowContainerRect();

    // Create an array to store the results
    const result = [];

    // Loop through the sets
    for (let i = 0; i < this.sets.length; i++) {
        // Determine the title of the set
        const title = `${i + 1}`;

        // Create the preview element
        const element = this.sets[i].createPreview(title, targetWidth, targetHeight, windowContainerRect.width, windowContainerRect.height);

        // Bind the click events
        element.addEventListener('click', createCallback(i, false));
        element.addEventListener('dblclick', createCallback(i, true));

        // Add the "selected" class to the element if it's selected
        if (this.sets[i] === this.selected) {
            element.classList.add('selected');
        }

        // Add the set element to the result list
        result.push(element);
    }

    // Return the array with set preview elements
    return result;
};

export default WindowSetCollection;
