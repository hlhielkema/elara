function initLauncherZone(toolbar) {
    const items = [];

    items.push({
        title: 'Welcome',
        icon: 'img/feather/triangle.svg',
        click() {
            openWelcome();
        },
    });

    items.push({
        title: 'Layers.js',
        icon: 'img/feather/layers.svg',
        click() {
            openLayersJs();
        },
    });

    items.push({
        title: 'Domotica dashboard',
        icon: 'img/feather/grid.svg',
        click() {
            openDashboard();
        },
    });

    items.push({
        title: 'PowerShell',
        icon: 'img/feather/terminal.svg',
        click() {
            openPowerShell();
        },
    });

    items.push({
        title: 'Picture viewer',
        icon: 'img/feather/image.svg',
        click() {
            openPictureViewer();
        },
    });

    items.push({
        title: 'Animated background',
        icon: 'img/feather/zap.svg',
        click() {
            openAnimatedBackground();
        },
    });

    toolbar.addDropDownMenu('Applications', items);
}


function initWorkspacesDrawer(toolbar, windows) {
    const workspacesDrawer = toolbar.addDrawer('Workspaces');
    workspacesDrawer.bind((drawer) => {
        // Workspace click callback
        const callback = function (index, doubleClick) {
            // Select the clicked workspace
            windows.windowSetCollection.selectAt(index);

            if (doubleClick) {
                // Close the drawer on double clicks
                workspacesDrawer.close();
            } else {
                // Update the previews because the selected workspace changed
                updatePreviews();
            }
        };

        function updatePreviews() {
            // Create the preview elements
            const previews = windows.windowSetCollection.createPreviews(280, 180, callback);

            // Update the content of the drawer
            drawer.innerHTML = '';
            for (let i = 0; i < previews.length; i++) {
                drawer.appendChild(previews[i]);
            }
        }

        // Perform the initial previews update
        updatePreviews();
    });
}

function startFrame(source, title, options) {
    const { windows } = window;
    if (options === undefined) {
        options = {
            title,
            size: {
                width: 1400,
                height: 800,
            },
            icon: 'img/feather/circle.svg',
        };
    }

    const controller = windows.createIFrameWindow(source, options);
    controller.focus();
}

function updateTileViewItems(tileView) {
    tileView.update([
        {
            title: 'Welcome',
            image: 'img/feather/triangle.svg',
            open: openWelcome,
        },
        {
            title: 'Dashboard',
            image: 'img/feather/grid.svg',
            open: openDashboard,
        },
        {
            title: 'Layers.js',
            image: 'img/feather/layers.svg',
            open: openLayersJs,
        },
        {
            title: 'Animated background',
            image: 'img/feather/zap.svg',
            open: openAnimatedBackground,
        },
        {
            title: 'PowerShell',
            image: 'img/feather/terminal.svg',
            open: openPowerShell,
        },
        {
            title: 'Pictures',
            image: 'img/feather/image.svg',
            open: openPictureViewer,
        },
    ]);
}

function startElaraDemo() {
    // Create the window, taskbar and toolbar managers
    const windows = new Elara.WindowManager();
    const taskbar = new Elara.Taskbar();
    const toolbar = new Elara.Toolbar();
    const tileView = new Elara.TileView();

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
    toolbar.suspendLayout();
    initLauncherZone(toolbar);
    toolbar.addSeperator();
    toolbar.addWindowsMenu(windows);
    initWorkspacesDrawer(toolbar, windows);
    toolbar.resumeLayout();

    // Update the tile view items
    updateTileViewItems(tileView);

    // Show the welcome page in a window
    openWelcome();
}

startElaraDemo();

function openWelcome() {
    startFrame('welcome/index.html', 'Welcome', {
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
    });
}

function openDashboard() {
    startFrame('https://hlhielkema.github.io/domotica_dashboard_concept/', 'Dashboard', {
        title: 'Dashboard',
        size: {
            width: 1400,
            height: 800,
        },
        icon: 'img/feather/grid.svg',
    });
}

function openLayersJs() {
    startFrame('https://hlhielkema.github.io/layers.js/', 'Layers.js', {
        title: 'Layers.js',
        size: {
            width: 1260,
            height: 700,
        },
        icon: 'img/feather/layers.svg',
    });
}

function openAnimatedBackground() {
    startFrame('https://hlhielkema.github.io/animation_playground/dots/index.html', 'Animated background', {
        title: 'Animated background',
        size: {
            width: 1260,
            height: 700,
        },
        icon: 'img/feather/zap.svg',
    });
}

function openPowerShell() {
    startFrame('powershell_cli/index.html', 'PowerShell', {
        title: 'PowerShell',
        size: {
            width: 860,
            height: 500,
        },
        icon: 'img/feather/terminal.svg',
    });
}

function openPictureViewer() {
    startFrame('picture_viewer/index.html', 'Pictures', {
        title: 'Pictures',
        size: {
            width: 1000,
            height: 800,
        },
        icon: 'img/feather/image.svg',
    });
}
