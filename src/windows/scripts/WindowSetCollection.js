import WindowManagerEvent from './util/WindowManagerEvent';
import WindowSet from './WindowSet';

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
WindowSetCollection.prototype.getSelected = function getSelected() {
    return this.selected;
};

// Get the window set at a given index
WindowSetCollection.prototype.getAt = function getAt(index) {
    return this.sets[index];
};

// Add a window set
WindowSetCollection.prototype.add = function add() {
    const set = new WindowSet(this);
    this.sets.push(set);

    // Invoke the added event
    this.events.added.invoke(set);
};

// Select a window set
WindowSetCollection.prototype.select = function select(set) {
    if (this.sets.indexOf(set) === -1) {
        throw new Error('Set not found');
    }
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = set;
    this.selected.resume();
    this.events.selectedChanged.invoke();
};

// Select a window set at a given index
WindowSetCollection.prototype.selectAt = function selectAt(index) {
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = this.sets[index];
    this.selected.resume();
    this.events.selectedChanged.invoke();
};

// Get the number of window sets
WindowSetCollection.prototype.count = function count() {
    return this.sets.length;
};

// Export the dimensions for all windows of all window sets
WindowSetCollection.prototype.exportDimensions = function exportDimensions() {
    const result = [];
    for (let i = 0; i < this.sets.length; i++) {
        const set = this.sets[i];
        result.push({
            index: i,
            selected: this.selected === set,
            windows: set.exportDimensions(),
        });
    }
    return result;
};

// Create preview elements for all window sets
// eslint-disable-next-line max-len
WindowSetCollection.prototype.createPreviews = function createPreviews(targetWidth, targetHeight, callback) {
    // Create a click callback function
    const createCallback = function createCallback(index, doubleClick) {
        return function createCallbackInner() {
            callback(index, doubleClick);
        };
    };

    // Get the dimensions of the window container
    const { width, height } = this.parent.getWindowContainerRect();

    // Create an array to store the results
    const result = [];

    // Loop through the sets
    for (let i = 0; i < this.sets.length; i++) {
        // Determine the title of the set
        const title = `${i + 1}`;

        // Create the preview element
        const element = this.sets[i].createPreview(title, targetWidth, targetHeight, width, height);

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

// Get all available window layouts
WindowSetCollection.prototype.getLayouts = function getLayouts(imageBasePath) {
    return [
        {
            title: 'Cascade Windows',
            name: 'cascade',
            icon: `${imageBasePath}/cascade.svg`,
        },
        {
            title: 'Split Windows',
            name: 'split',
            icon: `${imageBasePath}/pause.svg`,
        },
        {
            title: 'Maximize All Windows',
            name: 'maximizeAll',
            icon: `${imageBasePath}/maximize.svg`,
        },
        {
            title: 'Minimize All Windows',
            name: 'minimizeAll',
            icon: `${imageBasePath}/minimize.svg`,
        },
        {
            title: 'Show All Windows',
            name: 'showAll',
            icon: `${imageBasePath}/show-all.svg`,
        },
    ];
};

export default WindowSetCollection;
