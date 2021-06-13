import ToolbarDrawer from './ToolbarDrawer';
import ToolbarDropdownMenu from './ToolbarDropdownMenu';
import ToolbarSeperator from './ToolbarSeperator';

// constructor: Toolbar
function Toolbar() {
    this.toolbarElement = null;
    this.items = [];
    this.autoUpdate = true;
    this.pendingConstruct = false;
    this.imageBasePath = 'img/menu';
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
    const menu = new ToolbarDropdownMenu(this, title, items);
    this.items.push(menu);
    this.constructIfEnabled();
    return menu;
};

// Add a drawer
Toolbar.prototype.addDrawer = function addDrawer(title, height) {
    const drawer = new ToolbarDrawer(this, title, height);
    this.items.push(drawer);
    this.constructIfEnabled();
    return drawer;
};

// Add a windows menu.
// This is a build-in implementation of dropdown menu to manage the windows.
// windows should be an instance of type Elara.WindowManager.
Toolbar.prototype.addWindowsMenu = function addWindowsMenu(windows) {
    // Create the initial menu items list and add the drop menu
    const items = this.createWindowsMenuItems(windows);
    const menu = this.addDropDownMenu('Windows', items);

    // Create a listener for the change event of the window set collection
    const self = this;
    const updateItems = function updateItems() {
        // Update the menu items
        menu.updateItems(self.createWindowsMenuItems(windows));

        // Contruct the menu again
        self.constructIfEnabled();
    };

    // Bind the change event o fthe window set collection.
    // This will cause the menu to update when a set is added or removed.
    windows.windowSetCollection.events.added.subscribe(updateItems);
    windows.windowSetCollection.events.removed.subscribe(updateItems);
};

// Create menu items for a windows menu.
// This is for a build-in implementation of dropdown menu to manage the windows.
// windows should be an instance of type Elara.WindowManager.
Toolbar.prototype.createWindowsMenuItems = function createWindowsMenuItems(windows) {
    const items = [];

    // Create function which will apply a layout function to the active controller set
    function createLayoutFn(name) {
        return function applyLayout() {
            windows.getActiveControllerSet()[name]();
        };
    }

    // Layouts
    const windowLayouts = windows.windowSetCollection.getLayouts(this.imageBasePath);
    for (let i = 0; i < windowLayouts.length; i++) {
        const fn = createLayoutFn(windowLayouts[i].name);
        items.push({
            title: windowLayouts[i].title,
            icon: windowLayouts[i].icon,
            click() {
                fn();

                // Cancel closing the menu
                return true;
            },
        });
    }

    // Add expose button
    items.push({
        title: 'Expose',
        icon: `${this.imageBasePath}/split-windows.svg`,
        click() {
            windows.toggleExpose();
            // Close the menu
            return false;
        },
    });

    // Available workspaces
    for (let j = 0; j < windows.windowSetCollection.count(); j++) {
        const index = j;
        items.push({
            title: `Workspace ${j + 1}`,
            icon: `${this.imageBasePath}/workspace.svg`,
            click() {
                windows.windowSetCollection.selectAt(index);

                // Cancel closing the menu
                return true;
            },
        });
    }

    // Add workspace button
    items.push({
        title: 'Add workspace',
        icon: `${this.imageBasePath}/add-workspace.svg`,
        click() {
            windows.windowSetCollection.add();
            windows.windowSetCollection.selectAt(windows.windowSetCollection.count() - 1);

            // Cancel closing the menu
            return true;
        },
    });

    return items;
};

// Add a workspaces drawer.
// This is a build-in implementation of dropdown menu to manage the windows.
// windows should be an instance of type Elara.WindowManager.
Toolbar.prototype.addWorkspacesDrawer = function addWorkspacesDrawer(windows) {
    const workspacesDrawer = this.addDrawer('Workspaces');

    function renderPreviews(drawerElement, callback) {
        // Create the preview elements
        const previews = windows.windowSetCollection.createPreviews(280, 180, callback);

        // Update the content of the drawer
        // eslint-disable-next-line no-param-reassign
        drawerElement.innerHTML = '';
        for (let i = 0; i < previews.length; i++) {
            drawerElement.appendChild(previews[i]);
        }
    }

    workspacesDrawer.bind((drawerElement) => {
        // Workspace click callback
        const callback = function callback(index, doubleClick) {
            // Select the clicked workspace
            windows.windowSetCollection.selectAt(index);

            if (doubleClick) {
                // Close the drawer on double clicks
                workspacesDrawer.close();
            }
            else {
                // Update the previews because the selected workspace changed
                renderPreviews(drawerElement, callback);
            }
        };

        // Perform the initial previews update
        renderPreviews(drawerElement, callback);
    });
};

export default Toolbar;
