import svgUtil from '../../shared/scripts/SvgUtil.js';

// constructor: Taskbar
function Taskbar() {
    // Taskbar DIV element
    this.taskbarElement = null;

    // Owner window manager
    this.windowManager = null;
}

// Bind to an element and initialize
Taskbar.prototype.bind = function (elementSelector, windowManager) {
    // Query for the taskbar element and clear it
    this.taskbarElement = document.querySelector(elementSelector);
    this.taskbarElement.innerHTML = '';

    // Store the window manager
    this.windowManager = windowManager;

    // Create and add the buttons container element
    const windowButtons = document.createElement('div');
    windowButtons.classList.add('elara-windows');
    this.taskbarElement.appendChild(windowButtons);

    // Create a handler for changes that invokes the update function
    const self = this;
    const changeHandler = function () {
        self.update();
    };

    // Subscribe to changes in the selected window set
    this.windowManager.windowSetCollection.events.selectedChanged.subscribe(changeHandler);

    // Subscribe on changes in the window set collection
    this.windowManager.windowSetCollection.events.added.subscribe((owner, set) => {
        // Subcribe to focus changes of the window set
        set.events.focusChanged.subscribe(changeHandler);
        set.events.changed.subscribe(changeHandler);
    });
    this.windowManager.windowSetCollection.events.removed.subscribe((owner, set) => {
        // Unsubcribe from focus changes of the window set
        set.events.focusChanged.unsubscribe(changeHandler);
        set.events.changed.unsubscribe(changeHandler);
    });

    // Bind to the sets that are already in the collection
    for (let i = 0; i < this.windowManager.windowSetCollection.count(); i++) {
        const set = this.windowManager.windowSetCollection.getAt(i);

        // Subcribe to focus changes of the window set
        set.events.focusChanged.subscribe(changeHandler);
        set.events.changed.subscribe(changeHandler);
    }
};

// Update the buttons of the taskbar
Taskbar.prototype.update = function () {
    // Get the window buttons container DIV
    const windowButtons = this.taskbarElement.querySelector('.elara-windows');

    // Clear the window buttons container DIV
    windowButtons.innerHTML = '';

    // Get the (ordered) controller of the active controller set
    const orderedControllers = this.windowManager.getActiveControllerSet().getOrdered();

    // Loop through the ordered controllers
    for (let i = 0; i < orderedControllers.length; i++) {
        const controller = orderedControllers[i];

        // Create the elements
        const button = document.createElement('div');
        const label = document.createElement('span');

        // Set the button class
        button.className = 'elara-window-button';

        // Set the text of the window title label
        label.innerText = controller.getTitle();

        // Get the icon element
        const icon = svgUtil.createSvgElement(controller.getIcon(), 16, 16);

        // Combine the elements of the button
        button.appendChild(icon);
        button.appendChild(label);

        // Add the button to the window buttons element
        windowButtons.appendChild(button);

        // Add a 'window-focus' class for the button of the focussed window
        if (controller.state.focus) {
            button.classList.add('window-focus');
        }

        // Bind the button click event
        button.addEventListener('click', () => {
            controller.focusFromTaskbar();
        });
    }
};

export default Taskbar;
