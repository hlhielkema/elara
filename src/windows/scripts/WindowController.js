import { Vector2, Vector3, ComplexValue } from './util/Vector.js';
import WindowManagerEvent from "./util/WindowManagerEvent.js";
import WINDOW_SNAP_AREAS from "./configuration/WINDOW_SNAP_AREAS.js"
import svgUtil from "../../shared/scripts/SvgUtil.js"

// constructor: WindowController
function WindowController(id) {        
    this.id = id;    
    this.nonRelativeDimensions = null;

    // Window settings
    this.icon = null;
    this.title = null;

    // Window dimensions
    // Use this.applyDimensions() to apply the dimensions on the window element.
    this.position = new Vector3(new ComplexValue(0), new ComplexValue(0), new ComplexValue(0));
    this.size = new Vector2(new ComplexValue(0), new ComplexValue(0));

    // Window state
    // Use this.applyState() to apply the state on the window element.
    this.state = {
        hidden: false,
        relative: false,
        moving: false,
        resizing: false,
        focus: false,
        stashed: false,
        allowMinimize: true,
        allowMaximize: true,
        allowClose: true,
        alwaysOnTop: false,
    }    
    
    // Window element
    this.windowElement = null;

    // Events
    this.events = {
        closed: new WindowManagerEvent(this),
        focus: new WindowManagerEvent(this),
        lostFocus: new WindowManagerEvent(this),
    }
}

// Apply the dimensions from this.position and this.size on the window element.
WindowController.prototype.applyDimensions = function () {
    if (this.windowElement !== null) {
        this.windowElement.style['left'] = this.position.x.cssValue();
        this.windowElement.style['top'] = this.position.y.cssValue();
        this.windowElement.style['z-index'] = this.position.z.raw();
        this.windowElement.style['width'] = this.size.x.cssValue();
        this.windowElement.style['height'] = this.size.y.cssValue();
    }
}

// Apply the states from this.state on the window element
WindowController.prototype.applyState = function () {
    var controller = this;
    function applySingleState(stateName, className, invert) {
        if (controller.state[stateName] !== invert) {
            if (!controller.windowElement.classList.contains(className)) {
                controller.windowElement.classList.add(className);
            }            
        }
        else {
            if (controller.windowElement.classList.contains(className)) {
                controller.windowElement.classList.remove(className);
            }
        }
    }

    if (this.windowElement !== null) {        
        applySingleState('hidden', 'elara-window-hidden', false);
        applySingleState('relative', 'elara-window-relative', false);
        applySingleState('moving', 'elara-window-moving', false);
        applySingleState('resizing', 'elara-window-resizing', false);
        applySingleState('focus', 'elara-window-focus', false);
        applySingleState('stashed', 'elara-window-stashed', false);
        applySingleState('allowMinimize', 'elara-window-disable-minimize', true);
        applySingleState('allowMaximize', 'elara-window-disable-maximize', true);
        applySingleState('allowClose', 'elara-window-disable-close', true);
        applySingleState('alwaysOnTop', 'elara-window-always-on-top', false);
    }
}

// Set the relative state of the window
WindowController.prototype.setRelative = function (relative) {
    if (this.state.relative != relative) {
        this.state.relative = relative;
        this.applyState();
        if (relative) {
            this.setNonRelativeDimensions(this.position.x.raw(), this.position.y.raw(), this.size.x.raw(), this.size.y.raw());
        }
        else {
            this.restoreNonRelativeDimensions();
        }
    }
}  

// Show the window
WindowController.prototype.show = function () {    
    this.state.hidden = false;
    this.applyState();
}

// Minimize the window
WindowController.prototype.minimize = function () {
    this.state.hidden = true;
    this.applyState();
    if (this.hasFocus()) {
        // Invoke the lost-focus event
        this.events.lostFocus.invoke();        
    }   
}

// Set the title of the window
WindowController.prototype.setTitle = function (title) {
    this.title = title;
    this.windowElement.querySelector('.elara-title').innerText = title;
};

// Get the title of the window
WindowController.prototype.getTitle = function () {
    return this.title;
};

// Get the content container element of the window
WindowController.prototype.getContentContainer = function () {
    return this.windowElement.querySelector('.elara-window-content');
}

// Toggle if the window is maximized
WindowController.prototype.toggleMaximize = function () {
    if (this.state.relative) {
        this.setRelative(false);
    }
    else {
        this.resize('fullscreen');
    }
}

// Get the (unique) id of the window
WindowController.prototype.getId = function () {
    return this.id;
}

// Get the window element
WindowController.prototype.getWindow = function () {
    return this.windowElement;
}

// Bind a window element to the controller.
// Don't call this function multiple times on one controller.
WindowController.prototype.bindWindowElement = function (window) {    
    // Add the click event listeners
    var controller = this;
    window.querySelector('.elara-control-button.minimize').addEventListener('click', function () { controller.minimize() });
    window.querySelector('.elara-control-button.maximize').addEventListener('click', function () { controller.maximize() });
    window.querySelector('.elara-control-button.close').addEventListener('click', function () { controller.close() });
    window.querySelector('.elara-title-bar').addEventListener('dblclick', function () { controller.toggleMaximize() });

    // Add the controller id to the window div
    window.setAttribute('data-controller-id', this.getId());

    // Store the window element and apply the dimensions and states
    this.windowElement = window;
    this.applyDimensions();
    this.applyState();
}

// Maximize the window
WindowController.prototype.maximize = function () {
    this.resize('fullscreen');
};

// Close the window
WindowController.prototype.close = function () {
    // Remove the element from the DOM
    this.windowElement.parentElement.removeChild(this.windowElement);

    // Invoke the closed event
    this.events.closed.invoke();    
}

// Get the icon of the window
WindowController.prototype.getIcon = function () {
    return this.icon;
}

// Set the icon of the window.
// The value should be a path to a SVG image.
WindowController.prototype.setIcon = function (icon) {
    if (this.icon !== icon) {
        this.icon = icon;

        var iconContainer = this.windowElement.querySelector('.elara-icon-container');
        iconContainer.innerHTML = '';
        iconContainer.appendChild(svgUtil.createSvgElement(this.icon, 16, 16))
    }
}

// Set the non-relative dimensions of the window
WindowController.prototype.setNonRelativeDimensions = function (x, y, width, height) {
    if (x === null) {
        this.nonRelativeDimensions = null;
    }
    else {
        this.nonRelativeDimensions = {
            x: x,
            y: y,
            width: width,
            height: height,
        }
    }
};

// Restore the non-relative size
WindowController.prototype.restoreNonRelativeSize = function () {
    if (this.nonRelativeDimensions !== null) {
        this.resize(this.nonRelativeDimensions.width, this.nonRelativeDimensions.height);
        this.nonRelativeDimensions = null;
    }
}

// Restore the non-relative position
WindowController.prototype.restoreNonRelativePosition = function () {
    if (this.nonRelativeDimensions !== null) {
        this.move(this.nonRelativeDimensions.x, this.nonRelativeDimensions.y);
        this.nonRelativeDimensions = null;
    }
}

// Restore the non-relative dimensions(position and size) of the window
WindowController.prototype.restoreNonRelativeDimensions = function () {
    if (this.nonRelativeDimensions !== null) {
        var dim = this.nonRelativeDimensions;
        this.move(dim.x, dim.y);
        this.resize(dim.width, dim.height);
        this.nonRelativeDimensions = null;
    }
}

// Get if the window is focussed
WindowController.prototype.hasFocus = function () {
    return this.windowElement.classList.contains('elara-window-focus');
}

// Focus the window
WindowController.prototype.focus = function () {
    // Invoke the focus event
    this.events.focus.invoke();
}

// Toggle the focus state of the window.
// This function is used by the taskbar.
WindowController.prototype.focusFromTaskbar = function () {
    if (this.hasFocus()) {
        this.minimize();
    }
    else {
        this.show();
        this.focus();
    }
}    

// Move the window
WindowController.prototype.move = function (x, y) {   
    this.position.x = new ComplexValue(x);
    this.position.y = new ComplexValue(y);
    this.state.hidden = false;
    this.applyDimensions();    
    this.applyState();    
}

// Resize the window
// This function support two ways of using it.
// Examples:
// - controller.resize('fullscreen');
// - controller.resize('300px', '180px');
WindowController.prototype.resize = function (width, height) {
    if (typeof width === 'string') {
        // The snap-area name is stored in the with parameter
        var relative = width;

        // Active the non-relative mode
        this.setRelative(true);
        
        // Get the dimensions for the snap-area
        var dimensions = WINDOW_SNAP_AREAS[relative];

        // Update the dimensions
        this.position.x = new ComplexValue(dimensions.left);
        this.position.y = new ComplexValue(dimensions.top);
        this.size.x = new ComplexValue(dimensions.width);
        this.size.y = new ComplexValue(dimensions.height);

        // Apply the dimensions
        this.applyDimensions();   
    }
    else {
        // Update the size
        this.size.x = new ComplexValue(width);
        this.size.y = new ComplexValue(height);

        // Apply the dimensions
        this.applyDimensions();           
    }
}

// Stash the window
WindowController.prototype.stash = function () {
    this.state.stashed = true;
    this.applyState();
}

// Resume(unstash) the window
WindowController.prototype.resume = function () {
    this.state.stashed = false;
    this.applyState();
}

// Set if minimizing the window is allowed
WindowController.prototype.setAllowMinimize = function(allowMinimize) {
    if (this.state.allowMinimize !== allowMinimize) {
        this.state.allowMinimize = allowMinimize;
        this.applyState();
    }    
}

// Set if maximizing the window is allowed
WindowController.prototype.setAllowMaximize = function(allowMaximize) {
    if (this.state.allowMaximize !== allowMaximize) {
        this.state.allowMaximize = allowMaximize;
        this.applyState();
    }
}

// Set if closing the window is allowed
WindowController.prototype.setAllowClose = function(allowClose) {
    if (this.state.allowClose !== allowClose) {
        this.state.allowClose = allowClose;
        this.applyState();
    }
}

// Set if the window should always be on top
WindowController.prototype.setAlwaysOnTop = function(alwaysOnTop) {
    if (this.state.alwaysOnTop !== alwaysOnTop) {
        this.state.alwaysOnTop = alwaysOnTop;
        this.applyState();
    }
}

export default WindowController;