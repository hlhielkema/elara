import ToolbarDrawer from "./ToolbarDrawer.js";
import ToolbarDropdownMenu from "./ToolbarDropdownMenu.js";
import ToolbarSeperator from "./ToolbarSeperator.js";

// constructor: Toolbar
function Toolbar() {    
    this.toolbarElement = null;
    this.items = [];
    this.autoUpdate = true;    
    this.pendingConstruct = false;    
}

Toolbar.prototype.suspendLayout = function() {
    this.autoUpdate = false;        
}

Toolbar.prototype.resumeLayout = function() {
    this.autoUpdate = true;     
    if (this.pendingConstruct)    {
        this.construct();
    }
}

Toolbar.prototype.constructIfEnabled = function() {
    if (this.autoUpdate) {
        this.construct();
    }
    else {
        this.pendingConstruct = true;        
    }
}

// Bind to an element and initialize
Toolbar.prototype.bind = function (elementSelector, windowManager) {
    // Query for the taskbar element and clear it
    this.toolbarElement = document.querySelector(elementSelector);    
    this.toolbarElement.innerHTML = '';

    var itemsContainer = document.createElement('div');
    itemsContainer.classList.add('elara-toolbar-buttons');
    this.toolbarElement.appendChild(itemsContainer);
}

Toolbar.prototype.construct = function() {    
    //
    this.pendingConstruct = false;

    // Get the zones container element and clear it
    var itemsContainer = this.toolbarElement.querySelector('.elara-toolbar-buttons');
    itemsContainer.innerHTML = '';

    for (var i = 0; i < this.items.length; i++) {
        var elements = this.items[i].construct();
        if (Array.isArray(elements)) {
            for (var j = 0; j < elements.length; j++) {
                itemsContainer.appendChild(elements[j]);
            }
        }
        else if (elements !== null && elements !== undefined) {
            itemsContainer.appendChild(elements);
        }
    }
}

// Close all items
Toolbar.prototype.closeAll = function() {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].close();
    }
}

// Add a seperator
Toolbar.prototype.addSeperator = function() {
    this.items.push(new ToolbarSeperator());
    this.constructIfEnabled();
}

// Add a dropdown menu
Toolbar.prototype.addDropDownMenu = function(title, items) {    
    this.items.push(new ToolbarDropdownMenu(this, title, items));
    this.constructIfEnabled();
}

// Add a drawer
Toolbar.prototype.addDrawer = function(title, height) {
    var drawer = new ToolbarDrawer(this, title, height);
    this.items.push(drawer);
    this.constructIfEnabled();
    return drawer;
}

export default Toolbar;