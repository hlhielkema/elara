import WindowManagerEvent from './util/WindowManagerEvent.js';
import { ComplexValue } from './util/Vector.js';

// constructor: WindowSet
function WindowSet() {
    this.controllers = []; // ordered by z-index
    this.orderedControllers = []; // ordered by add order
    this.focus = null;

    this.events = {
        changed: new WindowManagerEvent(this),
        focusChanged: new WindowManagerEvent(this),
    };
}

// Add a window (controller) to the window set
WindowSet.prototype.add = function (controller) {
    this.controllers.push(controller);
    this.orderedControllers.push(controller);

    // Remove the controller from the collection when the window was closed
    const collection = this;
    controller.events.closed.subscribe(() => {
        // Remove the controller from the collection
        collection.remove(controller);

        // Invoke the changed event
        collection.events.changed.invoke();
    });

    controller.events.focus.subscribe(() => {
        collection.setFocus(controller);
    });

    controller.events.lostFocus.subscribe(() => {
        collection.resetFocus();
    });

    // Invoke the changed event
    this.events.changed.invoke();
};

// Get a window controller by its identifier.
// Returns null if not found.
WindowSet.prototype.get = function (controllerId) {
    controllerId = +controllerId;
    for (let i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].getId() == controllerId) {
            return this.controllers[i];
        }
    }
    return null;
};

// Stash the windows of all controllers in this collection
WindowSet.prototype.stash = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].stash();
    }
};

// Resume(undo stash) the windows of all controllers in this collection
WindowSet.prototype.resume = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].resume();
    }
};

// Remove a controller
WindowSet.prototype.remove = function (controller) {
    // Find the index of the controller
    const index = this.controllers.indexOf(controller);
    if (index === -1) throw 'Window controller not found.';

    // Find the index of the controller in the ordered collection
    const orderedIndex = this.orderedControllers.indexOf(controller);
    if (orderedIndex === -1) throw 'Window controller not found.';

    // Remove the controller
    this.controllers.splice(index, 1);
    this.orderedControllers.splice(orderedIndex, 1);

    // Invoke the changed event
    this.events.changed.invoke();
};

// Get the window controllers in the order of them being added
WindowSet.prototype.getOrdered = function () {
    return this.orderedControllers;
};

WindowSet.prototype.getMaximumForPositionZ = function () {
    // Loop through the controllers and get the max depth index
    let max = -1;
    for (let i = 0; i < this.controllers.length; i++) {
        const index = this.controllers[i].position.z;
        if (index > max) max = index;
    }
    return max;
};

WindowSet.prototype.setFocus = function (controller) {
    // Set the focussed window
    this.focus = controller;

    // Order the controllers in such a way that the parameter controller ends last
    this.controllers.sort((a, b) => {
        if (a == controller) { return 1; } if (b == controller) { return -1; }
        return a.position.z - b.position.z;
    });

    // Apply a increasing z-index in the order of the array
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].position.z = new ComplexValue(i);
        this.controllers[i].applyDimensions();
    }

    // Update the focus state
    let changed = false;
    for (var i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].state.focus) {
            this.controllers[i].state.focus = false;
            this.controllers[i].applyState();
            changed = true;
        }
    }
    if (!controller.state.focus) {
        controller.state.focus = true;
        controller.applyState();
        changed = true;
    }

    if (changed) {
        // Invoke the focus-changed event
        this.events.focusChanged.invoke();
    }
};

// Remove the focus state for all windows
WindowSet.prototype.resetFocus = function () {
    // Reset the focus
    this.focus = null;

    // Update the focus state
    let changed = false;
    for (let i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].state.focus) {
            this.controllers[i].state.focus = false;
            this.controllers[i].applyState();
            changed = true;
        }
    }

    if (changed) {
        // Invoke the focus-changed event
        this.events.focusChanged.invoke();
    }
};

// Get the focussed window (controller)
WindowSet.prototype.getCurrentFocus = function () {
    return this.focus;
};

// Export the dimensions for all windows in the set
WindowSet.prototype.exportDimensions = function () {
    const result = [];
    for (let i = 0; i < this.controllers.length; i++) {
        const controller = this.controllers[i];
        result.push({
            id: controller.id,
            title: controller.title,
            x: controller.position.x,
            y: controller.position.y,
            width: controller.size.x,
            height: controller.size.y,
        });
    }
    return result;
};

// Create a preview element for the window set
WindowSet.prototype.createPreview = function (title, targetWidth, targetHeight, containerWidth, containerHeight) {
    // Map px/% positions to positions in the target dimensions
    const map = function (val, container, target) {
        if (val.unit == 'px') {
            return `${Math.round((val.number / container) * target)}px`;
        }
        if (val.unit == '%') {
            return `${Math.round((val.number / 100) * target)}px`;
        }

        throw 'Not supported';
    };

    // Create the elements
    const element = document.createElement('div');
    const titleOvelayElement = document.createElement('div');

    // Add the classes
    element.classList.add('elera-window-set-preview');
    titleOvelayElement.classList.add('title-overlay');

    // Apply the target size on the set preview container
    element.style.width = `${targetWidth}px`;
    element.style.height = `${targetHeight}px`;

    // Set the set title
    titleOvelayElement.innerText = title;

    // Loop through the window controllers
    for (let i = 0; i < this.controllers.length; i++) {
        // Get the window controller
        const controller = this.controllers[i];

        // Create the window element
        const windowElement = document.createElement('div');
        windowElement.classList.add('window');

        // Set the dimensions of the window element
        windowElement.style.left = map(controller.position.x, containerWidth, targetWidth);
        windowElement.style.top = map(controller.position.y, containerHeight, targetHeight);
        windowElement.style.width = map(controller.size.x, containerWidth, targetWidth);
        windowElement.style.height = map(controller.size.y, containerHeight, targetHeight);

        // Add the window element to the set preview container
        element.appendChild(windowElement);
    }

    // Add the title overlay element to the set preview container
    element.appendChild(titleOvelayElement);

    // Return the new set preview container element
    return element;
};

// --------- LAYOUT ---------

WindowSet.prototype.cascade = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
        this.controllers[i].move(100 + (i * 50), 100 + (i * 50));
    }
};

WindowSet.prototype.minimizeAll = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].minimize();
    }
};

WindowSet.prototype.showAll = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
    }
};

WindowSet.prototype.maximizeAll = function () {
    for (let i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
        this.controllers[i].maximize();
    }
};

WindowSet.prototype.split = function () {
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
    }
    const count = this.controllers.length;
    if (count === 0) {
        return;
    }

    if (count === 1) {
        this.controllers[0].resize('fullscreen');
    } else if (count === 2) {
        this.controllers[0].resize('left');
        this.controllers[1].resize('right');
    } else if (count === 3) {
        this.controllers[0].resize('top-left');
        this.controllers[1].resize('top-right');
        this.controllers[2].resize('bottom');
    } else if (count > 3) {
        const reversedControllers = this.controllers.reverse();
        reversedControllers[0].resize('top-left');
        reversedControllers[1].resize('top-right');
        reversedControllers[2].resize('bottom-left');
        reversedControllers[3].resize('bottom-right');
        for (var i = 4; i < count; i++) {
            reversedControllers[i].hide();
        }
    }
};

export default WindowSet;
