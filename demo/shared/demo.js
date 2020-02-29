// Available window layouts
var ELARA_WINDOW_LAYOUTS = [
    {
        title: 'Cascade Windows',
        name: 'cascade',
        icon: 'img/feather/layers.svg'
    },
    {
        title: 'Split Windows',
        name: 'split',
        icon: 'img/feather/grid.svg'
    },
    {
        title: 'Maximize All Windows',
        name: 'maximizeAll',
        icon: 'img/feather/maximize.svg'
    },
    {
        title: 'Minimize All Windows',
        name: 'minimizeAll',
        icon: 'img/feather/minimize.svg'
    },
    {
        title: 'Show All Windows',
        name: 'showAll',
        icon: 'img/feather/menu.svg'
    }
];

function initLauncherZone(toolbar, windows) {    
    var launcherZone = toolbar.addZone('launcher');

    launcherZone.setDataSource(function () {
        var items = [];

        items.push({
            'title': 'Welcome',
            'icon': 'img/feather/triangle.svg',
            'click': function () {                
                openWelcome();
            }
        });

        items.push({
            'title': 'Layers.js',
            'icon': 'img/feather/layers.svg',
            'click': function () {
                openLayersJs();
            }
        });        

        items.push({
            'title': 'Domotica dashboard',
            'icon': 'img/feather/grid.svg',
            'click': function () {
                openDashboard();
            }
        });        

        items.push({
            'title': 'PowerShell',
            'icon': 'img/feather/terminal.svg',
            'click': function () {
                openPowerShell();
            }
        });        

        items.push({
            'title': 'Picture viewer',
            'icon': 'img/feather/image.svg',
            'click': function () {
                openPictureViewer();
            }
        });    

        items.push( {
            'title': 'Animated background',
            'icon': 'img/feather/zap.svg',
            'click': function () {
                openAnimatedBackground();
            }           
        });    
  
        return [
            {
                title: 'Applications',
                items: items
            }
        ];
    });
}

function initSystemZone(toolbar, windows)
{
    var systemZone = toolbar.addZone('system');    
    
    systemZone.setDataSource(function () {
        function createLayoutFn(name) {
            return function () {
                windows.getActiveControllerSet()[name]();
            };
        }
        var items = [];
        for (var i = 0; i < ELARA_WINDOW_LAYOUTS.length; i++) {
            let fn = createLayoutFn(ELARA_WINDOW_LAYOUTS[i].name);
            items.push({
                'title': ELARA_WINDOW_LAYOUTS[i].title,
                'icon': ELARA_WINDOW_LAYOUTS[i].icon,
                'click': function () {
                    fn();
                    return true; // cancel close
                }
            });
        }

        for (var j = 0; j < windows.windowSetCollection.count(); j++) {
            let index = j;
            items.push({
                'title': 'Workspace ' + (j + 1),
                'icon': 'img/feather/monitor.svg',
                'click': function () {
                    windows.windowSetCollection.selectAt(index);
                    return true;
                }
            });
        }
        items.push({
            'title': 'Add workspace',
            'icon': 'img/feather/plus-square.svg',
            'click': function () {
                windows.windowSetCollection.add();
                windows.windowSetCollection.selectAt(windows.windowSetCollection.count() - 1);
                return true;
            }
        });

        return [
            {
                title: 'Windows',
                items: items
            }
        ];
    });
}

function startFrame(source, title, options) {
    var windows = window.windows;
    if (options === undefined) {
        options = {
            title: title,
            size: {
                width: 1400,
                height:800,
            },
            icon: 'img/feather/circle.svg'
        };
    }

    var controller = windows.createIFrameWindow(source, options);

    controller.iframe.onload = function() {
        if (controller.iframe.contentDocument !== null) {
            // Set the title
            controller.setTitle(controller.iframe.contentDocument.title);

            // Try to read the desired icon from the meta element
            var iconMetaElement = controller.iframe.contentDocument.head.querySelector('meta[name=elara-icon]');
            if (iconMetaElement !== null) {
                var icon = iconMetaElement.content;        
                controller.setIcon(icon);
            }
        }
    }    

    controller.focus();
}

function startElaraDemo()
{
    // Create the window, taskbar and toolbar managers
    var windows = new Elara.WindowManager();
    var taskbar = new Elara.Taskbar();
    var toolbar = new Elara.Toolbar();
    var tileView = new Elara.TileView();

    window.windows = windows;

    // Bind the managers to the HTML elements
    windows.bind('.elara-window-container');
    taskbar.bind('.elara-taskbar', windows);
    toolbar.bind('.elara-toolbar', windows);
    tileView.bind('.elara-tile-view');
    
    // Add the second and third workspace
    windows.windowSetCollection.add();
    windows.windowSetCollection.add();
    
    // Initialize the menu's of the toolbar
    initLauncherZone(toolbar, windows);
    initSystemZone(toolbar, windows);

    // Render the toolbar
    // TODO: render menu when the zones changed. also support SuspendLayout/ResumeLayout.
    toolbar.renderMenu();

    //
    tileView.update([
        {
            title: 'Welcome',            
            image: 'img/feather/triangle.svg',
            open: openWelcome
        },
        {
            title: 'Dashboard',
            image: 'img/feather/grid.svg',
            open: openDashboard
        },
        {
            title: 'Layers.js',
            image: 'img/feather/layers.svg',
            open: openLayersJs
        },
        {
            title: 'Animated background',
            image: 'img/feather/zap.svg',
            open: openAnimatedBackground
        },
        {
            title: 'PowerShell',
            image: 'img/feather/terminal.svg',
            open: openPowerShell
        },  
        {
            title: 'Pictures',       
            image: 'img/feather/image.svg',
            open: openPictureViewer
        }
    ]);

    // Show the welcome page in a window
    openWelcome();
}

startElaraDemo();

function openWelcome() {
    startFrame('welcome/index.html', 'Welcome', {
        title: 'Welcome',
        size: {
            width: 800,
            height: 870
        },
        location: {
            x: 16,
            y: 16
        },
        icon: 'img/feather/triangle.svg'
    });
}

function openDashboard() {    
    startFrame('https://hlhielkema.github.io/domotica_dashboard_concept/', 'Dashboard', {
        title: 'Dashboard',
        size: {
            width: 1400,
            height:800,
        },
        icon: 'img/feather/grid.svg'
    });
}

function openLayersJs() {
    startFrame('https://hlhielkema.github.io/layers.js/', 'Layers.js', {
        title: 'Layers.js',
        size: {
            width: 1260,
            height:700,
        },
        icon: 'img/feather/layers.svg'
    });
}

function openAnimatedBackground() {    
    startFrame('https://hlhielkema.github.io/animation_playground/dots/index.html', 'Animated background', {
        title: 'Animated background',
        size: {
            width: 1260,
            height:700,
        },
        icon: 'img/feather/zap.svg'
    });
}

function openPowerShell() {
    startFrame('powershell_cli/index.html', 'PowerShell', {
        title: 'PowerShell',
        size: {
            width: 860,
            height:500,
        },
        icon: 'img/feather/terminal.svg'
    });
}

function openPictureViewer() {
    startFrame('picture_viewer/index.html', 'Pictures', {
        title: 'Pictures',
        size: {
            width: 1000,
            height:800,
        },
        icon: 'img/feather/image.svg'
    });
}