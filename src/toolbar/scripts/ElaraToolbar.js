// test

// constructor: ElaraToolbar
function ElaraToolbar() {
    // Elements
    this.toolbarElement = null;

    // Items
    this.zones = []; // ElaraToolbarZone
    this.tray = [];
}

// Bind to an element and initialize
ElaraToolbar.prototype.bind = function (elementSelector, windowManager) {
    // Query for the taskbar element and clear it
    this.toolbarElement = document.querySelector(elementSelector);    
    this.toolbarElement.innerHTML = '';

    var zonesContainer = document.createElement('div');
    zonesContainer.classList.add('sys-toolbar-buttons');
    this.toolbarElement.appendChild(zonesContainer);
}

// Add a toolbar zone.
// zone should have type ElaraToolbarZone
ElaraToolbar.prototype.addZone = function(zone) {
    this.zones.push(zone);
    this.renderMenu();
}

ElaraToolbar.prototype.renderMenu = function() {    
    // Get the zones container element and clear it
    var zonesContainer = this.toolbarElement.querySelector('.sys-toolbar-buttons');
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

ElaraToolbar.prototype.constructSeperator = function() {
    var seperator = document.createElement('div');
    seperator.className = 'sys-seperator';
    return seperator;
}

ElaraToolbar.prototype.constructorDropdownButton = function(dropdownMenu) {
    var dropdownButton = document.createElement('div');
    var button = document.createElement('div');
    var items = document.createElement('div');

    dropdownButton.className = 'sys-dropdown-button';

    button.className = 'sys-button';
    button.innerText = dropdownMenu.title;

    items.className = 'sys-dropdown-items';

    var self = this;
    button.addEventListener('click', function () {
        self.open(dropdownButton, dropdownMenu);
    });

    dropdownButton.appendChild(button);
    dropdownButton.appendChild(items);

    return dropdownButton;          
}

ElaraToolbar.prototype.constructButton = function(button) {
    
    var buttonElement = document.createElement('div');
    buttonElement.className = 'sys-menu-button';

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
        icon.className = 'sys-button-icon-container';
        icon.appendChild(svgUtil.createSvgElement(button.icon, 16, 16));
        buttonElement.appendChild(icon);
    }

    var label = document.createElement('div');
    label.className = 'sys-menu-button-label';
    label.innerText = button.title;
    buttonElement.appendChild(label);            

    return buttonElement;    
}

ElaraToolbar.prototype.open = function(dropdownButton, dropdownMenu) {
    if (dropdownButton.classList.contains('opened')) {
        dropdownButton.classList.remove('opened');
    }
    else {
        // Close all menu's
        this.close();

        dropdownButton.classList.add('opened');
        var buttons = dropdownButton.querySelector('.sys-dropdown-items');
        var items = dropdownMenu.items;
        for (var i = 0; i < items.length; i++) {
            var button = this.constructButton(items[i]);
            buttons.appendChild(button);
        }
    }
}

ElaraToolbar.prototype.close = function() {
    var buttons = this.toolbarElement.querySelectorAll('.sys-dropdown-button');
    for (var i = 0; i < buttons.length; i++) {
        var items = buttons[i].querySelectorAll('.sys-dropdown-items');
        for (var j = 0; j < items.length; j++) {
            items[j].innerHTML = '';
        }
        buttons[i].classList.remove('opened');
    }      
}

ElaraToolbar.prototype.renderTray = function() {
    // TODO
}