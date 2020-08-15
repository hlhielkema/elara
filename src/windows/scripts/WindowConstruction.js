// constructor: WindowConstruction
function WindowConstruction() { }

// Construct the window
WindowConstruction.prototype.window = function () {
    // Create the title bar
    const titleBar = this.titleBar();

    // Create the content container
    const content = this.content();

    // Create the window element
    const window = document.createElement('div');
    const windowVisible = document.createElement('div');
    const windowOverlay = document.createElement('div');

    // Set the window class
    window.className = 'elara-window';
    windowVisible.className = 'elara-window-visible';
    windowOverlay.className = 'elara-window-overlay';

    // Combine the elements
    window.appendChild(windowVisible);
    windowVisible.appendChild(titleBar);
    windowVisible.appendChild(content);
    windowVisible.appendChild(windowOverlay);

    // Return the created window
    return window;
};

// Construct the title bar
WindowConstruction.prototype.titleBar = function () {
    // Create the elements
    const titleBar = document.createElement('div');
    const title = document.createElement('div');
    const iconContainer = document.createElement('div');

    // Set the classes
    titleBar.className = 'elara-title-bar';
    title.className = 'elara-title';
    iconContainer.className = 'elara-icon-container';

    // Create the control box
    const controlBox = this.controlbox();

    // Combine the element
    titleBar.appendChild(iconContainer);
    titleBar.appendChild(title);
    titleBar.appendChild(controlBox);

    return titleBar;
};

// Construct the control box
WindowConstruction.prototype.controlbox = function () {
    // Create the elements
    const minimize = document.createElement('div');
    const maximize = document.createElement('div');
    const close = document.createElement('div');
    const controlBox = document.createElement('div');

    // Set the classes
    minimize.className = 'elara-control-button minimize';
    maximize.className = 'elara-control-button maximize';
    close.className = 'elara-control-button close';
    controlBox.className = 'elara-control-box';

    // Add the button elements to the control box element
    controlBox.appendChild(minimize);
    controlBox.appendChild(maximize);
    controlBox.appendChild(close);

    // Return the control box element
    return controlBox;
};

// Constuct the content container
WindowConstruction.prototype.content = function () {
    // Create the element
    const content = document.createElement('div');

    // Set the class
    content.className = 'elara-window-content';

    // Return the content element
    return content;
};

export default WindowConstruction;
