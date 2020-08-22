const demoApps = [
    {
        id: 'welcome',
        title: 'Welcome',
        image: 'img/feather/triangle.svg',
        open: function open() {
            window.windows.createIFrameWindow('welcome/index.html', {
                title: 'Welcome',
                size: {
                    width: 800,
                    height: 870,
                },
                location: {
                    x: 16,
                    y: 16,
                },
                icon: 'img/feather/triangle.svg',
            }).focus();
        },
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        image: 'img/feather/grid.svg',
        open: function open() {
            window.windows.createIFrameWindow('https://hlhielkema.github.io/domotica_dashboard_concept/', {
                title: 'Dashboard',
                size: {
                    width: 1400,
                    height: 800,
                },
                icon: 'img/feather/grid.svg',
            }).focus();
        },
    },
    {
        id: 'layers.js',
        title: 'Layers.js',
        image: 'img/feather/layers.svg',
        open: function open() {
            window.windows.createIFrameWindow('https://hlhielkema.github.io/layers.js/', {
                title: 'Layers.js',
                size: {
                    width: 1260,
                    height: 700,
                },
                icon: 'img/feather/layers.svg',
            }).focus();
        },
    },
    {
        id: 'animated-background',
        title: 'Animated background',
        image: 'img/feather/zap.svg',
        open: function open() {
            window.windows.createIFrameWindow('https://hlhielkema.github.io/animation_playground/dots/index.html', {
                title: 'Animated background',
                size: {
                    width: 1260,
                    height: 700,
                },
                icon: 'img/feather/zap.svg',
            }).focus();
        },
    },
    {
        id: 'powershell',
        title: 'PowerShell',
        image: 'img/feather/terminal.svg',
        open: function open() {
            window.windows.createIFrameWindow('powershell_cli/index.html', {
                title: 'PowerShell',
                size: {
                    width: 860,
                    height: 500,
                },
                icon: 'img/feather/terminal.svg',
            }).focus();
        },
    },
    {
        id: 'picture-viewer',
        title: 'Pictures',
        image: 'img/feather/image.svg',
        open: function open() {
            window.windows.createIFrameWindow('picture_viewer/index.html', {
                title: 'Pictures',
                size: {
                    width: 1000,
                    height: 800,
                },
                icon: 'img/feather/image.svg',
            }).focus();
        },
    },
];

window.openDemoAppForId = function openDemoAppForId(id) {
    for (let i = 0; i < demoApps.length; i++) {
        if (demoApps[i].id === id) {
            demoApps[i].open();
            break;
        }
    }
};

function startElaraDemo() {
    // Create the window, taskbar and toolbar managers
    const windows = new window.Elara.WindowManager();
    const taskbar = new window.Elara.Taskbar();
    const toolbar = new window.Elara.Toolbar();
    const tileView = new window.Elara.TileView();

    // Used by the open function of demoApps
    window.windows = windows;

    // Bind the managers to the HTML elements
    windows.bind('.elara-window-container');
    taskbar.bind('.elara-taskbar', windows);
    toolbar.bind('.elara-toolbar', windows);
    tileView.bind('.elara-window-container .elara-tile-view');

    // Add the second and third workspace
    windows.windowSetCollection.add();
    windows.windowSetCollection.add();

    // Suspend updating the toolbar while we're initializing it
    toolbar.suspendLayout();

    // Add applications dropdown menu
    const appItems = [];
    for (let i = 0; i < demoApps.length; i++) {
        appItems.push({
            title: demoApps[i].title,
            icon: demoApps[i].image,
            click: demoApps[i].open,
        });
    }
    toolbar.addDropDownMenu('Applications', appItems);

    // Add a seperator
    toolbar.addSeperator();

    // Add build-in dropdown menu's for the windows
    toolbar.addWindowsMenu(windows);
    toolbar.addWorkspacesDrawer(windows);

    // Resume updating the toolbar
    toolbar.resumeLayout();

    // Update the tile view items
    tileView.update(demoApps);

    // Show the welcome page in a window
    window.openDemoAppForId('welcome');
}

startElaraDemo();
