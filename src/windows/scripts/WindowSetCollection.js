// constructor: WindowSetCollection
function WindowSetCollection() {
    this.sets = [];
    this.selected = null;
    this.events = {
        selectedChanged: new WindowManagerEvent(this)
    }
}

WindowSetCollection.prototype.getSelected = function () {
    return this.selected;
}

WindowSetCollection.prototype.add = function () {
    var collection = new WindowSet();
    this.sets.push(collection);

    collection.events.focusChanged.subscribe(function () {
        // Update the taskbar
        irelium.windows.taskbar.update();

        // Update the app menu in the toolbar
        irelium.toolbar.updateAppMenu();
    });

    collection.events.changed.subscribe(function () {
        // Update the taskbar
        irelium.windows.taskbar.update();

        // Update the app menu in the toolbar
        irelium.toolbar.updateAppMenu();
    });
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