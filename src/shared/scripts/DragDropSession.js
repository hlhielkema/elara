// constructor: DragDropSession
// e:
//    document mousedown event arguments.
// events:
//    {
//       init: function (session) { ... },
//       transform: function (session, dx, dy, x, y, first, completed) { ... }
//    }
function DragDropSession(e, events) {
    this.target = e.target;
    this.initialPageX = e.pageX;
    this.initialPageY = e.pageY;
    this.first = true;
    this.transform = events.transform;
}

// Store the initial position
DragDropSession.prototype.setInitialPosition = function setInitialPosition(x, y) {
    this.initialX = x;
    this.initialY = y;
};

// Store the initial size
DragDropSession.prototype.setInitialSize = function setInitialSize(width, height) {
    this.initialWidth = width;
    this.initialHeight = height;
};

// Set the horizontal movement action mode.
// hmode/vmode: 'none' | 'resize' | 'move'
DragDropSession.prototype.setTransformMode = function setHorizontalMode(hmode, vmode) {
    this.hmode = hmode;
    this.vmode = vmode;
};

// Attach a controller to the session
DragDropSession.prototype.setController = function setController(controller) {
    this.controller = controller;
};

// Attach an inner target to the session
DragDropSession.prototype.setInnerTarget = function setInnerTarget(innerTarget) {
    this.innerTarget = innerTarget;
};

export default DragDropSession;
