// constructor: WindowSetCollection
function WindowSetCollection() {
    this.sets = [];
    this.selected = null;
    this.events = {
        selectedChanged: new WindowManagerEvent(this),
        added: new WindowManagerEvent(this),
        removed: new WindowManagerEvent(this),
    }
}

WindowSetCollection.prototype.getSelected = function () {
    return this.selected;
}

WindowSetCollection.prototype.getAt = function (index) {
    return this.sets[index];
}

WindowSetCollection.prototype.add = function () {
    var set = new WindowSet();
    this.sets.push(set);

    // Invoke the added event
    this.events.added.invoke(set);   
    
    
}

WindowSetCollection.prototype.select = function (set) {
    if (this.sets.indexOf(set) === -1) {
        throw 'Set not found';
    }
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = set;
    this.selected.resume();
    this.events.selectedChanged.invoke();
}

WindowSetCollection.prototype.selectAt = function (index) {
    if (this.selected !== null) {
        this.selected.stash();
    }
    this.selected = this.sets[index];
    this.selected.resume();
    this.events.selectedChanged.invoke();
}

WindowSetCollection.prototype.count = function () {
    return this.sets.length;
}