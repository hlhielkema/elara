import svgUtil from "./util/SvgUtil.js";
import ToolbarZone from "./ToolbarZone.js";

// constructor: Toolbar
function Toolbar() {
    // Elements
    this.toolbarElement = null;

    // Items
    this.zones = []; // ToolbarZone
    this.tray = [];
}

// Bind to an element and initialize
Toolbar.prototype.bind = function (elementSelector, windowManager) {
    // Query for the taskbar element and clear it
    this.toolbarElement = document.querySelector(elementSelector);    
    this.toolbarElement.innerHTML = '';

    var zonesContainer = document.createElement('div');
    zonesContainer.classList.add('elara-toolbar-buttons');
    this.toolbarElement.appendChild(zonesContainer);
}

// Add a toolbar zone.
Toolbar.prototype.addZone = function(name) {
    var zone = new ToolbarZone(name);
    this.zones.push(zone);
    this.renderMenu();
    return zone;
}

Toolbar.prototype.renderMenu = function() {    
    // Get the zones container element and clear it
    var zonesContainer = this.toolbarElement.querySelector('.elara-toolbar-buttons');
    zonesContainer.innerHTML = '';

    var itemsAfterSeperator = false;
    for (var i = 0; i < this.zones.length; i++) {        
        // Get the menu's of the zone
        var menus = this.zones[i].getMenus();
        if (menus !== null && menus.length > 0) {
            // Add a seperator between the zones
            if (itemsAfterSeperator) {                        
                zonesContainer.appendChild(this.constructSeperator());                    
            }
            itemsAfterSeperator = true;               
            
            // Render the menu's
            for (var j = 0; j < menus.length; j++) {                        
                zonesContainer.appendChild(this.constructorDropdownButton(menus[j]));
            }
        }
    }
}

Toolbar.prototype.constructSeperator = function() {
    var seperator = document.createElement('div');
    seperator.className = 'elara-seperator';
    return seperator;
}

Toolbar.prototype.constructorDropdownButton = function(dropdownMenu) {
    var dropdownButton = document.createElement('div');
    var button = document.createElement('div');
    var items = document.createElement('div');

    dropdownButton.className = 'elara-dropdown-button';

    button.className = 'elara-button';
    button.innerText = dropdownMenu.title;

    items.className = 'elara-dropdown-items';

    var self = this;
    button.addEventListener('click', function () {
        self.open(dropdownButton, dropdownMenu);
    });

    dropdownButton.appendChild(button);
    dropdownButton.appendChild(items);

    return dropdownButton;          
}

Toolbar.prototype.constructButton = function(button) {
    
    var buttonElement = document.createElement('div');
    buttonElement.className = 'elara-menu-button';

    var self = this;
    buttonElement.addEventListener('click', function () {
        var result = button.click();
        if (result !== true) {
            // Close the menu's
            self.close();
        }
    });

    if (button.icon !== undefined) {

        var icon = document.createElement('div');
        icon.className = 'elara-button-icon-container';
        icon.appendChild(svgUtil.createSvgElement(button.icon, 16, 16));
        buttonElement.appendChild(icon);
    }

    var label = document.createElement('div');
    label.className = 'elara-menu-button-label';
    label.innerText = button.title;
    buttonElement.appendChild(label);            

    return buttonElement;    
}

Toolbar.prototype.open = function(dropdownButton, dropdownMenu) {
    if (dropdownButton.classList.contains('opened')) {
        dropdownButton.classList.remove('opened');
    }
    else {
        // Close all menu's
        this.close();

        dropdownButton.classList.add('opened');
        var buttons = dropdownButton.querySelector('.elara-dropdown-items');
        var items = dropdownMenu.items;
        for (var i = 0; i < items.length; i++) {
            var button = this.constructButton(items[i]);
            buttons.appendChild(button);
        }
    }
}

Toolbar.prototype.close = function() {
    var buttons = this.toolbarElement.querySelectorAll('.elara-dropdown-button');
    for (var i = 0; i < buttons.length; i++) {
        var items = buttons[i].querySelectorAll('.elara-dropdown-items');
        for (var j = 0; j < items.length; j++) {
            items[j].innerHTML = '';
        }
        buttons[i].classList.remove('opened');
    }      
}

Toolbar.prototype.renderTray = function() {
    // TODO
}

export default Toolbar;