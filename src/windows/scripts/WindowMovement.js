import MouseDragDropTracker from "./util/MouseDragDropTracker.js"

function WindowMovement(windowManager) {
    var self = this;
    self.engine = new MouseDragDropTracker();

    self.onTitlebarGrab = function (e) {
        self.engine.start(e, {
            init: function (session) {
                session.window = session.target.closest('.elara-window');
                session.controller = windowManager.getController(session.window.getAttribute('data-controller-id'));;

                // Determine the initial position of the window inside its container
                var containerRect = windowManager.windowContainer.getBoundingClientRect();
                var windowRect = session.window.getBoundingClientRect();

                session.initialWindowLeft = windowRect.left - containerRect.left;
                session.initialWindowTop = windowRect.top - containerRect.top;
            },
            transform: function (session, dx, dy, x, y, first, completed) {
                if (first) {
                    // Add a class to the window container to indicate that dragging is active
                    windowManager.windowContainer.classList.add('window-dragging-active');

                    // Update the moving state
                    session.controller.state.moving = true;
                    session.controller.applyState();

                    // Focus the window
                    session.controller.focus();

                    // Get the window on top of the overlays
                    session.window.style['z-index'] = 2000;
                }

                var newX = session.initialWindowLeft + dx;
                var newY = session.initialWindowTop + dy;

                // Move the window to the new position
                session.controller.move(newX, newY);

                if (completed) {
                    var docking = windowManager.getSuggestedDocking(x, y);
                    if (docking != null) {
                        session.controller.resize(docking);
                    }
                    else {
                        // Move the window to the new position
                        session.controller.move(newX, newY);
                    }

                    // Remove the class from the window container that indicates that dragging is active
                    windowManager.windowContainer.classList.remove('window-dragging-active');

                    // Update the moving state
                    session.controller.state.moving = false;
                    session.controller.applyState();
                }
                else {
                    // Restore its non-relative size when moving the window
                    if (session.controller.state.relative) {
                        session.controller.setRelative(false);
                    }

                    // Render the docking suggestion
                    windowManager.renderSuggestedDocking(x, y);
                }
            }
        });
    }

    self.resizeZoneSize = 32;

    self.determineResizeCursor = function (hmode, vmode) {
        if ((hmode === 'resize' && vmode == 'resize') ||
            (hmode === 'move' && vmode == 'move')) {
            return 'nw-resize';
        }
        else if ((hmode === 'resize' && vmode == 'move') ||
                (hmode === 'move' && vmode == 'resize')) {
            return 'ne-resize';
        }
        else if (hmode !== 'none' && vmode === 'none') {
            return 'e-resize';
        }
        else if (hmode === 'none' && vmode !== 'none') {
            return 'n-resize';
        }
        else
            throw 'invalid input';
    }

    self.determineModes = function (onWindowX, onWindowY, realWidth, realHeight) {
        var zone = self.resizeZoneSize;
        var hmode = 'none';
        var vmode = 'none';
        if (onWindowX < 16) {
            hmode = 'move';
        }
        else if (realWidth - onWindowX < 16) {
            hmode = 'resize';
        }       
        if (onWindowY < 16) {
            vmode = 'move';
        }
        else if (realHeight - onWindowY < 16) {
            vmode = 'resize';
        }
        return {
            hmode: hmode,
            vmode: vmode
        }
    }
   
    self.onWindowGrab = function (e) {
        self.engine.start(e, {
            init: function (session) {
                session.window = session.target.closest('.elara-window');
                session.controller = windowManager.getController(session.window.getAttribute('data-controller-id'));;                                

                // Determine the initial position of the window inside its container
                var containerRect = windowManager.windowContainer.getBoundingClientRect();
                var windowRect = session.window.getBoundingClientRect();                

                //
                session.initialWindowX = windowRect.left - containerRect.left;
                session.initialWindowY = windowRect.top - containerRect.top;                
                session.initialWidth = session.controller.size.x.getPx(); // inner window width
                session.initialHeight = session.controller.size.y.getPx(); // inner window height

                //
                var onWindowX = e.pageX - windowRect.left;
                var onWindowY = e.pageY - windowRect.top;
                        
                var modes = self.determineModes(onWindowX, onWindowY, windowRect.width, windowRect.height);
                session.hmode = modes.hmode;
                session.vmode = modes.vmode;                
                session.window.style.cursor = self.determineResizeCursor(session.hmode, session.vmode);

            },
            transform: function (session, dx, dy, x, y, first, completed) {
                if (first) {
                    // Add a class to the window container to indicate that resize is active
                    windowManager.windowContainer.classList.add('window-resize-active');

                    // Update the resizing state
                    session.controller.state.resizing = true;
                    session.controller.applyState();

                    // Focus the window
                    session.controller.focus();

                    // Get the window on top of the overlays
                    session.window.style['z-index'] = 2000;
                }

                var rx = session.initialWindowX;
                var ry = session.initialWindowY;
                var rw = session.initialWidth;
                var rh = session.initialHeight;


                if (session.hmode === 'resize') {                    
                    rw += dx;                    
                }
                else if (session.hmode === 'move') {
                    rx += dx;                    
                    rw -= dx;
                }


                if (session.vmode === 'resize') {                    
                    rh += dy;
                }
                else if (session.vmode === 'move') {
                    ry += dy;
                    rh -= dy;
                }
                
                if (rw < 0)
                    rw = 0;
                if (rh < 0)
                    rh = 0;

                session.controller.move(rx, ry);
                session.controller.resize(rw, rh);

                if (completed) {
                    // Update the resizing state
                    session.controller.state.resizing = false;
                    session.controller.applyState();

                    // Remove the class from the window container that indicates that resize is active
                    windowManager.windowContainer.classList.remove('window-resize-active');
                }
            }

        });
    }

    // Initialize the window dragging engine
    self.init = function () {
        // Bind a mouse-down event on title bars of windows
        document.addEventListener('mousedown', function (e) {        
            // Move
            if (e.target.classList.contains('elara-title-bar') || e.target.classList.contains('elara-title')) {           
                self.onTitlebarGrab(e);
            }

            // Resize
            else if (e.target.classList.contains('elara-window')) {             
                self.onWindowGrab(e);                
            }

            else {
                // Try to find a window element in the click event path
                for (var i = 0; i < e.path.length; i++) {                    
                    if (e.path[i].classList !== undefined && e.path[i].classList.contains('elara-window')) {                        
                        // Get the controller of the window
                        var controller = windowManager.getController(e.path[i].getAttribute('data-controller-id'));
                        if (!controller.state.focus) {
                            // Focus the window
                            controller.focus();
                        }
                        return;
                    }
                }                
            }
        });        

        document.addEventListener('mousemove', function (e) {
            if (e.target.classList !== undefined && e.target.classList.contains('elara-window') && !self.engine.hasSession()) {                
                var window = e.target;
                var windowRect = window.getBoundingClientRect();
                var onWindowX = e.pageX - windowRect.left;
                var onWindowY = e.pageY - windowRect.top;
                var modes = self.determineModes(onWindowX, onWindowY, windowRect.width, windowRect.height);
                window.style.cursor = self.determineResizeCursor(modes.hmode, modes.vmode);        
            }            
        });
    };    
}

export default WindowMovement;