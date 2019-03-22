// constructor: WindowManagerEvent
function WindowManagerEvent(owner) {
    this.owner = owner;
    this.subscribers = [];
}

WindowManagerEvent.prototype.subscribe = function (listener) {
    this.subscribers.push(listener);
}

WindowManagerEvent.prototype.invoke = function (eventData) {
    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this.owner, eventData);
    }
}