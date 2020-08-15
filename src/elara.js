import './shared/_reset.min.css';

import Taskbar from './taskbar/Taskbar';
import Toolbar from './toolbar/Toolbar';
import WindowManager from './windows/Windows';
import TileView from './tile-view/TileView';

window.Elara = {
    WindowManager,
    Taskbar,
    Toolbar,
    TileView,
};
