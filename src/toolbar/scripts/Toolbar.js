import ToolbarDrawer from './ToolbarDrawer';
import ToolbarDropdownMenu from './ToolbarDropdownMenu';
import ToolbarSeperator from './ToolbarSeperator';

// constructor: Toolbar
function Toolbar() {
    this.toolbarElement = null;
    this.items = [];
    this.autoUpdate = true;
    this.pendingConstruct = false;
}

Toolbar.prototype.suspendLayout = function suspendLayout() {
    this.autoUpdate = false;
};

Toolbar.prototype.resumeLayout = function resumeLayout() {
    this.autoUpdate = true;
    if (this.pendingConstruct) {
        this.construct();
    }
};

Toolbar.prototype.constructIfEnabled = function constructIfEnabled() {
    if (this.autoUpdate) {
        this.construct();
    }
    else {
        this.pendingConstruct = true;
    }
};

// Bind to an element and initialize
Toolbar.prototype.bind = function bind(elementSelector) {
    // Query for the taskbar element and clear it
    this.toolbarElement = document.querySelector(elementSelector);
    this.toolbarElement.innerHTML = '';

    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('elara-toolbar-buttons');
    this.toolbarElement.appendChild(itemsContainer);
};

Toolbar.prototype.construct = function construct() {
    //
    this.pendingConstruct = false;

    // Get the zones container element and clear it
    const itemsContainer = this.toolbarElement.querySelector('.elara-toolbar-buttons');
    itemsContainer.innerHTML = '';

    for (let i = 0; i < this.items.length; i++) {
        const elements = this.items[i].construct();
        if (Array.isArray(elements)) {
            for (let j = 0; j < elements.length; j++) {
                itemsContainer.appendChild(elements[j]);
            }
        }
        else if (elements !== null && elements !== undefined) {
            itemsContainer.appendChild(elements);
        }
    }
};

// Close all items
Toolbar.prototype.closeAll = function closeAll() {
    for (let i = 0; i < this.items.length; i++) {
        this.items[i].close();
    }
};

// Add a seperator
Toolbar.prototype.addSeperator = function addSeperator() {
    this.items.push(new ToolbarSeperator());
    this.constructIfEnabled();
};

// Add a dropdown menu
Toolbar.prototype.addDropDownMenu = function addDropDownMenu(title, items) {
    this.items.push(new ToolbarDropdownMenu(this, title, items));
    this.constructIfEnabled();
};

// Add a drawer
Toolbar.prototype.addDrawer = function addDrawer(title, height) {
    const drawer = new ToolbarDrawer(this, title, height);
    this.items.push(drawer);
    this.constructIfEnabled();
    return drawer;
};

export default Toolbar;
