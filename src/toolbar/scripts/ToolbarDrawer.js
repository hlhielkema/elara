// constructor: ToolbarDrawer
function ToolbarDrawer(parent, title, height) {
    this.parent = parent;
    this.title = title;
    this.height = height; // optional
    
    //
    this.drawerButton = null;
    this.drawer = null;
}

ToolbarDrawer.prototype.construct = function() {
    // Create the elements
    var drawerButton = document.createElement('div');
    var button = document.createElement('div');
    var drawer = document.createElement('div');

    // Add the classes
    drawerButton.className = 'elara-drawer-button';
    button.className = 'elara-button';
    drawer.className = 'elara-drawer';

    // Set the title
    button.innerText = this.title;

    // Combine the elemnent
    drawerButton.appendChild(button);
    drawerButton.appendChild(drawer);

    // Store references to the elements
    this.drawerButton = drawerButton;
    this.drawer = drawer;

    // Set the drawer height if defined
    if (this.height !== null && this.height !== undefined) {
        drawer.style.height = this.height;
    }

    // Bind the button click
    var self = this;
    button.addEventListener('click', function () {
        self.open();
    });

    return drawerButton;   
}

ToolbarDrawer.prototype.open = function() {
    if (this.drawerButton.classList.contains('opened')) {
        // Close the menu if it's clicked again
        this.close();
    }
    else {
        // Close all menu's
        this.parent.closeAll();

        // Invoke the open callback if set
        if (this.openCallback !== null) {
            this.openCallback(this.drawer);
        }        

        // Add the "opened" class to show the drawer
        this.drawerButton.classList.add('opened');        
    }
}

ToolbarDrawer.prototype.close = function() {
    if (this.drawerButton.classList.contains('opened')) {       
        this.drawerButton.classList.remove('opened');
    }
}

ToolbarDrawer.prototype.bind = function(openCallback) {
    this.openCallback = openCallback;
}

export default ToolbarDrawer;