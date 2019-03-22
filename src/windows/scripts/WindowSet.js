// constructor: WindowSet
function WindowSet() {
    this.controllers = []; // ordered by z-index
    this.orderedControllers = []; // ordered by add order
    this.focus = null;

    this.events = {
        changed: new WindowManagerEvent(this),
        focusChanged: new WindowManagerEvent(this),
    }
}

WindowSet.prototype.add = function (controller) {
    this.controllers.push(controller);
    this.orderedControllers.push(controller);
   
    // Remove the controller from the collection when the window was closed
    var collection = this;
    controller.events.closed.subscribe(function () {        
        // Remove the controller from the collection
        collection.remove(controller);

        // Invoke the changed event
        collection.events.changed.invoke();        
    });

    controller.events.focus.subscribe(function () {
        collection.setFocus(controller);        
    });

    controller.events.lostFocus.subscribe(function () {
        collection.resetFocus();
    });

    // Invoke the changed event
    this.events.changed.invoke();
}

// Get a window controller by its identifier
WindowSet.prototype.get = function (controllerId) {
    controllerId = +controllerId;
    for (var i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].getId() == controllerId) {
            return this.controllers[i];
        }
    }
    return null;
}

// Stash the windows of all controllers in this collection
WindowSet.prototype.stash = function () {
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].stash();
    }
}

// Resume(undo stash) the windows of all controllers in this collection
WindowSet.prototype.resume = function () {
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].resume();
    }
}

// Remove a controller
WindowSet.prototype.remove = function (controller) {
    // Find the index of the controller
    var index = this.controllers.indexOf(controller);
    if (index === -1)
        throw 'Window controller not found.';

    // Find the index of the controller in the ordered collection
    var orderedIndex = this.orderedControllers.indexOf(controller);
    if (orderedIndex === -1)
        throw 'Window controller not found.';

    // Remove the controller
    this.controllers.splice(index, 1);
    this.orderedControllers.splice(orderedIndex, 1);

    // Invoke the changed event
    this.events.changed.invoke();
}

WindowSet.prototype.getOrdered = function () {
    return this.orderedControllers;
}

WindowSet.prototype.getMaximumForPositionZ = function () {    
    // Loop through the controllers and get the max depth index
    var max = -1;
    for (var i = 0; i < this.controllers.length; i++) {
        var index = this.controllers[i].position.z;
        if (index > max)
            max = index;
    };
    return max;
}

WindowSet.prototype.setFocus = function (controller) {
    // Set the focussed window
    this.focus = controller;
    
    // Order the controllers in such a way that the parameter controller ends last            
    this.controllers.sort(function (a, b) {
        if (a == controller) { return 1; }
        else if (b == controller) { return -1; }
        return a.position.z - b.position.z;
    });

    // Apply a increasing z-index in the order of the array
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].position.z = new ComplexValue(i);
        this.controllers[i].applyDimensions();
    };

    // Update the focus state
    var changed = false;
    for (var i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].state.focus) {
            this.controllers[i].state.focus = false;
            this.controllers[i].applyState();
            changed = true;
        }
    };
    if (!controller.state.focus) {
        controller.state.focus = true;
        controller.applyState();
        changed = true;
    }

    if (changed) {
        // Invoke the focus-changed event
        this.events.focusChanged.invoke();
    }    
}

WindowSet.prototype.resetFocus = function (controller) {
    // Reset the focus
    this.focus = null;
    
    // Update the focus state
    var changed = false;
    for (var i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].state.focus) {            
            this.controllers[i].state.focus = false;
            this.controllers[i].applyState();
            changed = true;
        }
    };    

    if (changed) {
        // Invoke the focus-changed event
        this.events.focusChanged.invoke();
    }
}

WindowSet.prototype.getCurrentFocus = function (controller) {
    return this.focus;
}

// --------- LAYOUT ---------

WindowSet.prototype.cascade = function () {    
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
        this.controllers[i].move(100 + (i * 50), 100 + (i * 50));
    }
};

WindowSet.prototype.minimizeAll = function () {    
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].minimize();
    }
};

WindowSet.prototype.showAll = function () {    
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
    }
};

WindowSet.prototype.maximizeAll = function () {    
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
        this.controllers[i].maximize();
    }
};

WindowSet.prototype.split = function () {    
    for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].show();
    }
    var count = this.controllers.length;
    if (count === 0) {
        return;
    }

    if (count === 1) {
        this.controllers[0].resize('fullscreen');
    }
    else if (count === 2) {
        this.controllers[0].resize('left');
        this.controllers[1].resize('right');
    }
    else if (count === 3) {
        this.controllers[0].resize('top-left');
        this.controllers[1].resize('top-right');
        this.controllers[2].resize('bottom');
    }
    else if (count > 3) {
        var reversedControllers = this.controllers.reverse();
        reversedControllers[0].resize('top-left');
        reversedControllers[1].resize('top-right');
        reversedControllers[2].resize('bottom-left');
        reversedControllers[3].resize('bottom-right');
        for (var i = 4; i < count; i++) {
            reversedControllers[i].hide();
        }
    }
};