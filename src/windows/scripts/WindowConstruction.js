// constructor: WindowConstruction
function WindowConstruction() {
    var self = this;

    // Construct window
    self.window = function () {
        // Create the title bar
        var titleBar = self.titleBar();

        // Create the content container
        var content = self.content();

        // Create the window element
        var window = document.createElement('div');        
        var windowVisible = document.createElement('div');

        // Set the window class
        window.className = 'sys-window';        
        windowVisible.className = 'sys-window-visible';

        // Combine the elements
        window.appendChild(windowVisible);        
        windowVisible.appendChild(titleBar);
        windowVisible.appendChild(content);                

        // Return the created window
        return window;
    };

    // Construct title bar
    self.titleBar = function () {
        // Create the elements
        var titleBar = document.createElement('div');
        var title = document.createElement('div');
        var iconContainer = document.createElement('div');        

        // Set the classes
        titleBar.className = 'sys-title-bar';
        title.className = 'sys-title';
        iconContainer.className = 'sys-icon-container';        
        
        // Create the control box
        controlBox = self.controlbox();

        // Combine the element
        titleBar.appendChild(iconContainer);
        titleBar.appendChild(title);
        titleBar.appendChild(controlBox);        
   
        return titleBar;        
    };

    // Construct control box
    self.controlbox = function () {
        // Create the elements
        var minimize = document.createElement('div');
        var maximize = document.createElement('div');
        var close = document.createElement('div');
        var controlBox = document.createElement('div');

        // Set the classes
        minimize.className = 'sys-control-button minimize';
        maximize.className = 'sys-control-button maximize';
        close.className = 'sys-control-button close';
        controlBox.className = 'sys-control-box';
        
        // Add the button elements to the control box element
        controlBox.appendChild(minimize);
        controlBox.appendChild(maximize);
        controlBox.appendChild(close);

        // Return the control box element
        return controlBox;
    };

    // Construct content container
    self.content = function () {                
        // Create the element
        var content = document.createElement('div');

        // Set the class
        content.className = 'sys-window-content';

        // Return the content element
        return content;
    };
}