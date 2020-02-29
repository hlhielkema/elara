import "./shared/_reset.min.css";

import Taskbar from "./taskbar/Taskbar.js";
import Toolbar from "./toolbar/Toolbar.js";
import WindowManager from "./windows/Windows.js";
import TileView from "./tile-view/TileView.js";

window.Elara = {
    WindowManager,
    Taskbar,
    Toolbar,
    TileView
}