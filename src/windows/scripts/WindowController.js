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

    // Legacy:
    this.getMenuItems = function () {
        return [];
    }
}

// Apply the dimensions from this.position and this.size on the window element.
WindowController.prototype.applyDimensions = function () {
    if (this.windowElement !== null) {
        this.windowElement.style['left'] = this.position.x.raw();
        this.windowElement.style['top'] = this.position.y.raw();
        this.windowElement.style['z-index'] = this.position.z.raw();
        this.windowElement.style['width'] = this.size.x.raw();
        this.windowElement.style['height'] = this.size.y.raw();
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
        applySingleState('hidden', 'sys-window-hidden', false);
        applySingleState('relative', 'sys-window-relative', false);
        applySingleState('moving', 'sys-window-moving', false);
        applySingleState('resizing', 'sys-window-resizing', false);
        applySingleState('focus', 'sys-window-focus', false);
        applySingleState('stashed', 'sys-window-stashed', false);
        applySingleState('allowMinimize', 'sys-window-disable-minimize', true);
        applySingleState('allowMaximize', 'sys-window-disable-maximize', true);
        applySingleState('allowClose', 'sys-window-disable-close', true);
        applySingleState('alwaysOnTop', 'sys-window-always-on-top', false);
    }
}


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

WindowController.prototype.show = function () {    
    this.state.hidden = false;
    this.applyState();
}

WindowController.prototype.minimize = function () {
    this.state.hidden = true;
    this.applyState();
    if (this.hasFocus()) {
        // Invoke the lost-focus event
        this.events.lostFocus.invoke();        
    }   
}

WindowController.prototype.setTitle = function (title) {
    this.title = title;
    this.windowElement.querySelector('.sys-title').innerText = title;
};


WindowController.prototype.getTitle = function () {
    return this.title;
};

WindowController.prototype.getContentContainer = function () {
    return this.windowElement.querySelector('.sys-window-content');
}

WindowController.prototype.toggleMaximize = function () {
    if (this.state.relative) {
        this.setRelative(false);
    }
    else {
        this.resize('fullscreen');
    }
}

WindowController.prototype.getId = function () {
    return this.id;
}

WindowController.prototype.getWindow = function () {
    return this.windowElement;
}

WindowController.prototype.bindWindowElement = function (window) {    
    // Add the click event listeners
    var controller = this;
    window.querySelector('.sys-control-button.minimize').addEventListener('click', function () { controller.minimize() });
    window.querySelector('.sys-control-button.maximize').addEventListener('click', function () { controller.maximize() });
    window.querySelector('.sys-control-button.close').addEventListener('click', function () { controller.close() });
    window.querySelector('.sys-title-bar').addEventListener('dblclick', function () { controller.toggleMaximize() });

    // Add the controller id to the window div
    window.setAttribute('data-controller-id', this.getId());

    //
    this.windowElement = window;
    this.applyDimensions();
    this.applyState();
}

WindowController.prototype.maximize = function () {
    this.resize('fullscreen');
};

WindowController.prototype.close = function () {
    // Remove the element from the DOM
    this.windowElement.parentElement.removeChild(this.windowElement);

    // Invoke the closed event
    this.events.closed.invoke();    
}

WindowController.prototype.getIcon = function () {
    return this.icon;
}

WindowController.prototype.setIcon = function (icon) {
    if (this.icon !== icon) {
        this.icon = icon;

        var iconContainer = this.windowElement.querySelector('.sys-icon-container');
        iconContainer.innerHTML = '';
        iconContainer.appendChild(svgUtil.createSvgElement(this.icon, 16, 16))
    }
}

//--

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

WindowController.prototype.restoreNonRelativeSize = function () {
    if (this.nonRelativeDimensions !== null) {
        this.resize(this.nonRelativeDimensions.width, this.nonRelativeDimensions.height);
        this.nonRelativeDimensions = null;
    }
}

WindowController.prototype.restoreNonRelativePosition = function () {
    if (this.nonRelativeDimensions !== null) {
        this.move(this.nonRelativeDimensions.x, this.nonRelativeDimensions.y);
        this.nonRelativeDimensions = null;
    }
}

WindowController.prototype.restoreNonRelativeDimensions = function () {
    if (this.nonRelativeDimensions !== null) {
        var dim = this.nonRelativeDimensions;
        this.move(dim.x, dim.y);
        this.resize(dim.width, dim.height);
        this.nonRelativeDimensions = null;
    }
}

WindowController.prototype.hasFocus = function () {
    return this.windowElement.classList.contains('sys-window-focus');
}

WindowController.prototype.focus = function () {
    // Invoke the focus event
    this.events.focus.invoke();
}

WindowController.prototype.focusFromTaskbar = function () {
    if (this.hasFocus()) {
        this.minimize();
    }
    else {
        this.show();
        this.focus();
    }
}    

WindowController.prototype.move = function (x, y) {   
    this.position.x = new ComplexValue(x);
    this.position.y = new ComplexValue(y);
    this.state.hidden = false;
    this.applyDimensions();    
    this.applyState();    
}

WindowController.prototype.resize = function (width, height) {
    if (typeof width === 'string') {
        var relative = width;

        this.setRelative(true);
        
        var dimensions = WINDOW_SNAP_AREAS[relative];

        this.position.x = new ComplexValue(dimensions.left);
        this.position.y = new ComplexValue(dimensions.top);
        this.size.x = new ComplexValue(dimensions.width);
        this.size.y = new ComplexValue(dimensions.height);
        this.applyDimensions();   
    }
    else {
        this.size.x = new ComplexValue(width);
        this.size.y = new ComplexValue(height);
        this.applyDimensions();           
    }
}

WindowController.prototype.stash = function () {
    this.state.stashed = true;
    this.applyState();
}

WindowController.prototype.resume = function () {
    this.state.stashed = false;
    this.applyState();
}

//
WindowController.prototype.setAllowMinimize = function(allowMinimize) {
    if (this.state.allowMinimize !== allowMinimize) {
        this.state.allowMinimize = allowMinimize;
        this.applyState();
    }    
}

//
WindowController.prototype.setAllowMaximize = function(allowMaximize) {
    if (this.state.allowMaximize !== allowMaximize) {
        this.state.allowMaximize = allowMaximize;
        this.applyState();
    }
}

//
WindowController.prototype.setAllowClose = function(allowClose) {
    if (this.state.allowClose !== allowClose) {
        this.state.allowClose = allowClose;
        this.applyState();
    }
}

//
WindowController.prototype.setAlwaysOnTop = function(alwaysOnTop) {
    if (this.state.alwaysOnTop !== alwaysOnTop) {
        this.state.alwaysOnTop = alwaysOnTop;
        this.applyState();
    }
}
