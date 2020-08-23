import WindowSetCollection from './WindowSetCollection';
import WindowMovement from './WindowMovement';
import WindowConstruction from './WindowConstruction';
import WindowController from './WindowController';
import WINDOW_DOCK_ZONES from './configuration/WINDOW_DOCK_ZONES';
import WINDOW_SNAP_AREAS from './configuration/WINDOW_SNAP_AREAS';

// constructor: WindowManager
function WindowManager() {
    // Windows container element
    this.windowContainer = null;

    // Window set collection
    this.windowSetCollection = new WindowSetCollection(this);

    // Add the first window set
    this.windowSetCollection.add();
    this.windowSetCollection.selectAt(0);

    // Systems
    this.dragging = new WindowMovement(this);
    this.construct = new WindowConstruction();

    // Create unique ID's for the window controller.
    // The id will increase after each get.
    let windowIdCounter = 1;
    this.getNextId = function getNextId() {
        windowIdCounter += 1;
        return windowIdCounter;
    };
}

// Bind to an element and initialize
WindowManager.prototype.bind = function bind(elementSelector) {
    // Query for the window container element and clear it
    this.windowContainer = document.querySelector(elementSelector);

    // Create and add the drag overlay element
    const dragOverlay = document.createElement('div');
    dragOverlay.classList.add('window-drag-overlay');
    this.windowContainer.appendChild(dragOverlay);

    // Initialize the window dragging engine
    this.dragging.init();
};

// Get a controller by its unique id
WindowManager.prototype.getController = function getController(controllerId) {
    const count = this.windowSetCollection.count();
    for (let i = 0; i < count; i++) {
        const controller = this.windowSetCollection.getAt(i).get(controllerId);
        if (controller !== null) {
            return controller;
        }
    }
    return null;
};

// Get the active controller set
WindowManager.prototype.getActiveControllerSet = function getActiveControllerSet() {
    // Return the selected window set
    return this.windowSetCollection.getSelected();
};

// Create a new window in the current controller collection with an iframe in it
WindowManager.prototype.createIFrameWindow = function createIFrameWindow(source, customOptions) {
    // Create the window
    const controller = this.createWindow(customOptions);

    // Get the content container
    const content = controller.getContentContainer();

    // Create the iframe and set its source
    const iframe = document.createElement('iframe');
    iframe.src = source;

    // Add the iframe to the content container
    content.appendChild(iframe);

    // Use the title of the page as the title of the window
    iframe.onload = function onload() {
        if (iframe.contentDocument !== null) {
            controller.setTitle(iframe.contentDocument.title);
        }
    };

    // Attach the iframe to the controller for easy access
    controller.iframe = iframe;

    // Update the hasIframe state of the controller.
    // This will result in some special event handling for focus.
    controller.setContainsIframe(true);

    // Return the new window controller
    return controller;
};

// Create a new window in the current controller collection
WindowManager.prototype.createWindow = function createWindow(customOptions) {
    // Create the window controller
    const controller = new WindowController(this.getNextId());

    // Default options
    const options = {
        title: '-',
        size: {
            width: 600,
            height: 400,
        },
        location: {
            x: 100,
            y: 100,
        },
        icon: null, // path to SVG image
        allowMinimize: true,
        allowMaximize: true,
        allowClose: true,
        alwaysOnTop: false,
        allowDocking: true,
        allowResizing: true,
    };

    // Apply the custom options on the default options
    const customOptionsKeys = Object.keys(customOptions);
    const customOptionsValues = Object.values(customOptions);
    for (let i = 0; i < customOptionsKeys.length; i += 1) {
        options[customOptionsKeys[i]] = customOptionsValues[i];
    }

    // Create the window element
    const window = this.construct.window();

    // Bind the window to the controller
    controller.bindWindowElement(window);

    // Set the position, size, icon and title of the window
    controller.move(options.location.x, options.location.y);
    controller.resize(options.size.width, options.size.height);
    controller.setIcon(options.icon);
    controller.setTitle(options.title);

    // Set the allow states
    controller.setAllowMinimize(options.allowMinimize);
    controller.setAllowMaximize(options.allowMaximize);
    controller.setAllowClose(options.allowClose);
    controller.setAlwaysOnTop(options.alwaysOnTop);
    controller.setAllowDocking(options.allowDocking);
    controller.setAllowResizing(options.allowResizing);

    // Add the window element to the windows container
    this.windowContainer.appendChild(window);

    // Get the active window controller set
    const activeCollection = this.getActiveControllerSet();

    // Store the controller
    activeCollection.add(controller);

    // Focus the window
    controller.focus();

    // Return the window controller
    return controller;
};

// Get the suggested docking zone for a cursor position
WindowManager.prototype.getSuggestedDocking = function getSuggestedDocking(cursorX, cursorY) {
    // Get the dimensions of the window container rectangle
    const container = this.windowContainer.getBoundingClientRect();

    // Get the relative screen position in the range 0 to 100(%).
    let x = Math.round(((cursorX - container.left) / container.width) * 100);
    let y = Math.round(((cursorY - container.top) / container.height) * 100);

    // Ensure that the x and y are in the 0 to 100 range
    x = Math.min(Math.max(x, 0), 100);
    y = Math.min(Math.max(y, 0), 100);

    // Try to match a docking suggestion zone
    const dockings = WINDOW_DOCK_ZONES;
    for (let i = 0; i < dockings.length; i++) {
        const d = dockings[i];
        if (x >= d.left && x <= d.right && y >= d.top && y <= d.bottom) {
            return d.name;
        }
    }
    return null;
};

// Render a suggested docking area
WindowManager.prototype.renderSuggestedDocking = function renderSuggestedDocking(cursorX, cursorY) {
    // Get the suggested docking for the current cursor position
    const docking = this.getSuggestedDocking(cursorX, cursorY);

    // Get the preview element
    let preview = this.windowContainer.querySelector('.window-drag-overlay .dock-preview');

    if (docking !== null) {
        if (preview === null) {
            // Create the preview element
            preview = document.createElement('div');
            preview.classList.add('dock-preview');
            preview.appendChild(document.createElement('div'));

            // Add the preview element to the drag overlay element
            this.windowContainer.querySelector('.window-drag-overlay').appendChild(preview);
        }

        // Show the preview
        preview.style.display = 'block';

        // Set the dimension of the preview
        const dimensions = WINDOW_SNAP_AREAS[docking];
        preview.style.top = dimensions.top;
        preview.style.left = dimensions.left;
        preview.style.width = dimensions.width;
        preview.style.height = dimensions.height;
    }
    else if (preview !== null) {
        // Hide the preview
        preview.style.display = 'none';
    }
};

// Get the size of the window container
WindowManager.prototype.getWindowContainerRect = function getWindowContainerRect() {
    // Get the dimensions of the window container rectangle
    return this.windowContainer.getBoundingClientRect();
};

export default WindowManager;
