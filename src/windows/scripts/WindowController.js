import { Vector2, Vector3, ComplexValue } from './util/Vector';
import WindowManagerEvent from './util/WindowManagerEvent';
import WINDOW_SNAP_AREAS from './configuration/WINDOW_SNAP_AREAS';
import svgUtil from '../../shared/scripts/SvgUtil';

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
        allowDocking: true,
        allowResizing: true,
        containsIframe: false,
    };

    // Window element
    this.windowElement = null;

    // Events
    this.events = {
        closed: new WindowManagerEvent(this),
        focus: new WindowManagerEvent(this),
        lostFocus: new WindowManagerEvent(this),
    };
}

// Apply the dimensions from this.position and this.size on the window element.
WindowController.prototype.applyDimensions = function applyDimensions() {
    if (this.windowElement !== null) {
        this.windowElement.style.left = this.position.x.cssValue();
        this.windowElement.style.top = this.position.y.cssValue();
        this.windowElement.style['z-index'] = this.position.z.raw();
        this.windowElement.style.width = this.size.x.cssValue();
        this.windowElement.style.height = this.size.y.cssValue();
    }
};

// Apply the states from this.state on the window element
WindowController.prototype.applyState = function applyState() {
    const controller = this;
    function applySingleState(stateName, className, invert) {
        if (controller.state[stateName] !== invert) {
            if (!controller.windowElement.classList.contains(className)) {
                controller.windowElement.classList.add(className);
            }
        }
        else if (controller.windowElement.classList.contains(className)) {
            controller.windowElement.classList.remove(className);
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
        applySingleState('allowResizing', 'elara-window-resizable', false);
        applySingleState('containsIframe', 'elara-iframe-window', false);
    }
};

// Set the relative state of the window
WindowController.prototype.setRelative = function setRelative(relative) {
    if (this.state.relative !== relative) {
        this.state.relative = relative;
        this.applyState();
        if (relative) {
            const x = this.position.x.raw();
            const y = this.position.y.raw();
            const width = this.size.x.raw();
            const height = this.size.y.raw();

            this.setNonRelativeDimensions(x, y, width, height);
        }
        else {
            this.restoreNonRelativeDimensions();
        }
    }
};

// Show the window
WindowController.prototype.show = function show() {
    this.state.hidden = false;
    this.applyState();
};

// Minimize the window
WindowController.prototype.minimize = function minimize() {
    this.state.hidden = true;
    this.applyState();
    if (this.hasFocus()) {
        // Invoke the lost-focus event
        this.events.lostFocus.invoke();
    }
};

// Set the title of the window
WindowController.prototype.setTitle = function setTitle(title) {
    this.title = title;
    this.windowElement.querySelector('.elara-title').innerText = title;
};

// Get the title of the window
WindowController.prototype.getTitle = function getTitle() {
    return this.title;
};

// Get the content container element of the window
WindowController.prototype.getContentContainer = function getContentContainer() {
    return this.windowElement.querySelector('.elara-window-content');
};

// Toggle if the window is maximized
WindowController.prototype.toggleMaximize = function toggleMaximize() {
    if (this.state.relative) {
        this.setRelative(false);
    }
    else {
        this.resize('fullscreen');
    }
};

// Get the (unique) id of the window
WindowController.prototype.getId = function getId() {
    return this.id;
};

// Get the window element
WindowController.prototype.getWindow = function getWindow() {
    return this.windowElement;
};

// Bind a window element to the controller.
// Don't call this function multiple times on one controller.
WindowController.prototype.bindWindowElement = function bindWindowElement(window) {
    // Add the click event listeners
    const controller = this;
    window.querySelector('.elara-control-button.minimize').addEventListener('click', () => {
        controller.minimize();
    });
    window.querySelector('.elara-control-button.maximize').addEventListener('click', () => {
        controller.maximize();
    });
    window.querySelector('.elara-control-button.close').addEventListener('click', () => {
        controller.close();
    });
    window.querySelector('.elara-title-bar').addEventListener('dblclick', () => {
        // Ignore the double click if maximizing the window is not allowed
        if (controller.state.allowMaximize) {
            controller.toggleMaximize();
        }
    });

    // Add the controller id to the window div
    window.setAttribute('data-controller-id', this.getId());

    // Store the window element and apply the dimensions and states
    this.windowElement = window;
    this.applyDimensions();
    this.applyState();
};

// Maximize the window
WindowController.prototype.maximize = function maximize() {
    this.resize('fullscreen');
};

// Close the window
WindowController.prototype.close = function close() {
    // Remove the element from the DOM
    this.windowElement.parentElement.removeChild(this.windowElement);

    // Invoke the closed event
    this.events.closed.invoke();
};

// Get the icon of the window
WindowController.prototype.getIcon = function getIcon() {
    return this.icon;
};

// Set the icon of the window.
// The value should be a path to a SVG image.
WindowController.prototype.setIcon = function setIcon(icon) {
    if (this.icon !== icon) {
        this.icon = icon;

        const iconContainer = this.windowElement.querySelector('.elara-icon-container');
        iconContainer.innerHTML = '';
        iconContainer.appendChild(svgUtil.createSvgElement(this.icon, 16, 16));
    }
};

// Set the non-relative dimensions of the window
// eslint-disable-next-line max-len
WindowController.prototype.setNonRelativeDimensions = function setNonRelativeDimensions(x, y, width, height) {
    if (x === null) {
        this.nonRelativeDimensions = null;
    }
    else {
        this.nonRelativeDimensions = {
            x,
            y,
            width,
            height,
        };
    }
};

// Restore the non-relative size
WindowController.prototype.restoreNonRelativeSize = function restoreNonRelativeSize() {
    if (this.nonRelativeDimensions !== null) {
        this.resize(this.nonRelativeDimensions.width, this.nonRelativeDimensions.height);
        this.nonRelativeDimensions = null;
    }
};

// Restore the non-relative position
WindowController.prototype.restoreNonRelativePosition = function restoreNonRelativePosition() {
    if (this.nonRelativeDimensions !== null) {
        this.move(this.nonRelativeDimensions.x, this.nonRelativeDimensions.y);
        this.nonRelativeDimensions = null;
    }
};

// Restore the non-relative dimensions(position and size) of the window
WindowController.prototype.restoreNonRelativeDimensions = function restoreNonRelativeDimensions() {
    if (this.nonRelativeDimensions !== null) {
        const dim = this.nonRelativeDimensions;
        this.move(dim.x, dim.y);
        this.resize(dim.width, dim.height);
        this.nonRelativeDimensions = null;
    }
};

// Get if the window is focussed
WindowController.prototype.hasFocus = function hasFocus() {
    return this.windowElement.classList.contains('elara-window-focus');
};

// Focus the window
WindowController.prototype.focus = function focus() {
    // Invoke the focus event
    this.events.focus.invoke();

    // Focus the iframe.
    // This is needed for 'pollForIFrameFocus' to work properly.
    const iframe = this.windowElement.querySelector('iframe');
    if (iframe !== null && iframe !== document.activeElement) {
        // Focus and unfocus the IFrane to prevent switching back to the previous window.
        // Not using 'blur' will lock the value of document.activeElement.
        iframe.focus();
        iframe.blur();
    }
};

// Toggle the focus state of the window.
// This function is used by the taskbar.
WindowController.prototype.focusFromTaskbar = function focusFromTaskbar() {
    if (this.hasFocus()) {
        this.minimize();
    }
    else {
        this.show();
        this.focus();
    }
};

// Move the window
WindowController.prototype.move = function move(x, y) {
    this.position.x = new ComplexValue(x);
    this.position.y = new ComplexValue(y);
    this.state.hidden = false;
    this.applyDimensions();
    this.applyState();
};

// Resize the window
// This function support two ways of using it.
// Examples:
// - controller.resize('fullscreen');
// - controller.resize('300px', '180px');
WindowController.prototype.resize = function resize(width, height) {
    if (typeof width === 'string') {
        // The snap-area name is stored in the with parameter
        const relative = width;

        // Active the non-relative mode
        this.setRelative(true);

        // Get the dimensions for the snap-area
        const dimensions = WINDOW_SNAP_AREAS[relative];

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
};

// Ensure that the windows is inside the allowed bounds
WindowController.prototype.ensureBounds = function ensureBounds(width, height) {
    let changes = false;
    const titlebarHeight = 40;

    // Map complex values to pixels
    const xPx = this.position.x.convertToPx(width);
    const yPx = this.position.y.convertToPx(height);
    const wPx = this.size.x.convertToPx(width);
    const hPx = this.size.y.convertToPx(height);

    // Ensure that the window does not go to far to the left
    if (xPx < 0) {
        this.position.x = new ComplexValue(0);
        changes = true;
    }

    // Ensure that the window does not go to far to the right
    else if (xPx + wPx > width) {
        this.position.x = new ComplexValue(Math.max(width - wPx, 0));
        changes = true;
    }

    // Ensure that the window does not go to far to the top
    if (yPx < 0) {
        this.position.y = new ComplexValue(0);
        changes = true;
    }

    // Ensure that the window does not go to far to the bottom
    else if (yPx + titlebarHeight > height) {
        this.position.y = new ComplexValue(Math.max(height - hPx, 0));
        changes = true;
    }

    // Update the dimensions if anything was changed
    if (changes) {
        this.applyDimensions();
    }
};

// Stash the window
WindowController.prototype.stash = function stash() {
    this.state.stashed = true;
    this.applyState();
};

// Resume(unstash) the window
WindowController.prototype.resume = function resume() {
    this.state.stashed = false;
    this.applyState();
};

// Set if the window is focussed
WindowController.prototype.setFocus = function setFocus(focus) {
    if (this.state.focus !== focus) {
        this.state.focus = focus;
        this.applyState();
    }
};

// Set if the window is moving
WindowController.prototype.setMoving = function setMoving(moving) {
    if (this.state.moving !== moving) {
        this.state.moving = moving;
        this.applyState();
    }
};

// Set if the window is resizing
WindowController.prototype.setResizing = function setResizing(resizing) {
    if (this.state.resizing !== resizing) {
        this.state.resizing = resizing;
        this.applyState();
    }
};

// Set if minimizing the window is allowed
WindowController.prototype.setAllowMinimize = function setAllowMinimize(allowMinimize) {
    if (this.state.allowMinimize !== allowMinimize) {
        this.state.allowMinimize = allowMinimize;
        this.applyState();
    }
};

// Set if maximizing the window is allowed
WindowController.prototype.setAllowMaximize = function setAllowMaximize(allowMaximize) {
    if (this.state.allowMaximize !== allowMaximize) {
        this.state.allowMaximize = allowMaximize;
        this.applyState();
    }
};

// Set if closing the window is allowed
WindowController.prototype.setAllowClose = function setAllowClose(allowClose) {
    if (this.state.allowClose !== allowClose) {
        this.state.allowClose = allowClose;
        this.applyState();
    }
};

// Set if the window should always be on top
WindowController.prototype.setAlwaysOnTop = function setAlwaysOnTop(alwaysOnTop) {
    if (this.state.alwaysOnTop !== alwaysOnTop) {
        this.state.alwaysOnTop = alwaysOnTop;
        this.applyState();
    }
};

// Set if docking the window is allowed
WindowController.prototype.setAllowDocking = function setAllowDocking(allowDocking) {
    if (this.state.allowDocking !== allowDocking) {
        this.state.allowDocking = allowDocking;
        this.applyState();
    }
};

// Set if resizing is allowed
WindowController.prototype.setAllowResizing = function setAllowResizing(allowResizing) {
    if (this.state.allowResizing !== allowResizing) {
        this.state.allowResizing = allowResizing;
        this.applyState();
    }
};

// Set if resizing is allowed
WindowController.prototype.setContainsIframe = function setContainsIframe(containsIframe) {
    if (this.state.containsIframe !== containsIframe) {
        this.state.containsIframe = containsIframe;
        this.applyState();
    }
};

export default WindowController;
