// constructor: WindowConstruction
function WindowConstruction() { }

// Construct the window
WindowConstruction.prototype.window = function() {
    // Create the title bar
    var titleBar = this.titleBar();

    // Create the content container
    var content = this.content();

    // Create the window element
    var window = document.createElement('div');        
    var windowVisible = document.createElement('div');
    var windowOverlay = document.createElement('div');

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
WindowConstruction.prototype.titleBar = function() {
    // Create the elements
    var titleBar = document.createElement('div');
    var title = document.createElement('div');
    var iconContainer = document.createElement('div');        

    // Set the classes
    titleBar.className = 'elara-title-bar';
    title.className = 'elara-title';
    iconContainer.className = 'elara-icon-container';        

    // Create the control box
    var controlBox = this.controlbox();

    // Combine the element
    titleBar.appendChild(iconContainer);
    titleBar.appendChild(title);
    titleBar.appendChild(controlBox);        

    return titleBar;   
};

// Construct the control box
WindowConstruction.prototype.controlbox = function() {
    // Create the elements
    var minimize = document.createElement('div');
    var maximize = document.createElement('div');
    var close = document.createElement('div');
    var controlBox = document.createElement('div');

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
WindowConstruction.prototype.content = function() {
    // Create the element
    var content = document.createElement('div');

    // Set the class
    content.className = 'elara-window-content';

    // Return the content element
    return content;
};

export default WindowConstruction;