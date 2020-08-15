// constructor: WindowConstruction
function WindowConstruction() { }

// Construct the window
WindowConstruction.prototype.window = function window() {
    // Create the title bar
    const titleBar = this.titleBar();

    // Create the content container
    const content = this.content();

    // Create the window element
    const windowElement = document.createElement('div');
    const windowVisible = document.createElement('div');
    const windowOverlay = document.createElement('div');

    // Set the window class
    windowElement.className = 'elara-window';
    windowVisible.className = 'elara-window-visible';
    windowOverlay.className = 'elara-window-overlay';

    // Combine the elements
    windowElement.appendChild(windowVisible);
    windowVisible.appendChild(titleBar);
    windowVisible.appendChild(content);
    windowVisible.appendChild(windowOverlay);

    // Return the created window
    return windowElement;
};

// Construct the title bar
WindowConstruction.prototype.titleBar = function titleBar() {
    // Create the elements
    const titleBarElement = document.createElement('div');
    const title = document.createElement('div');
    const iconContainer = document.createElement('div');

    // Set the classes
    titleBarElement.className = 'elara-title-bar';
    title.className = 'elara-title';
    iconContainer.className = 'elara-icon-container';

    // Create the control box
    const controlBox = this.controlbox();

    // Combine the element
    titleBarElement.appendChild(iconContainer);
    titleBarElement.appendChild(title);
    titleBarElement.appendChild(controlBox);

    return titleBarElement;
};

// Construct the control box
WindowConstruction.prototype.controlbox = function controlbox() {
    // Create the elements
    const minimize = document.createElement('div');
    const maximize = document.createElement('div');
    const close = document.createElement('div');
    const controlBoxElement = document.createElement('div');

    // Set the classes
    minimize.className = 'elara-control-button minimize';
    maximize.className = 'elara-control-button maximize';
    close.className = 'elara-control-button close';
    controlBoxElement.className = 'elara-control-box';

    // Add the button elements to the control box element
    controlBoxElement.appendChild(minimize);
    controlBoxElement.appendChild(maximize);
    controlBoxElement.appendChild(close);

    // Return the control box element
    return controlBoxElement;
};

// Constuct the content container
WindowConstruction.prototype.content = function content() {
    // Create the element
    const contentElement = document.createElement('div');

    // Set the class
    contentElement.className = 'elara-window-content';

    // Return the content element
    return contentElement;
};

export default WindowConstruction;
