// constructor: WindowManagerEvent
function WindowManagerEvent(owner) {
    this.owner = owner;
    this.subscribers = [];
}

// Subscribe to the event.
// The listener should be a function with an owner and (optional) event data parameters.
WindowManagerEvent.prototype.subscribe = function subscribe(listener) {
    this.subscribers.push(listener);
};

// Unsubscribe from the event
WindowManagerEvent.prototype.unsubscribe = function unsubscribe(listener) {
    const index = this.subscribers.indexOf(listener);
    if (index !== -1) {
        this.subscribers.splice(index, 1);
    }
};

// Invoke the event
WindowManagerEvent.prototype.invoke = function invoke(eventData) {
    for (let i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this.owner, eventData);
    }
};

export default WindowManagerEvent;
