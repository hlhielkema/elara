import Taskbar from "./taskbar/scripts/Taskbar.js";
import ElaraToolbar from "./toolbar/scripts/ElaraToolbar.js";
import ElaraToolbarZone from  "./toolbar/scripts/ElaraToolbarZone.js";
import WindowManager from "./windows/scripts/WindowManager.js";

window.WindowManager = WindowManager;
window.Taskbar = Taskbar;
window.ElaraToolbar = ElaraToolbar;
window.ElaraToolbarZone = ElaraToolbarZone;

import "./util/_reset.min.css";
import "./windows/styles/_windows.min.css";
import "./toolbar/styles/_toolbar.min.css";
import "./taskbar/styles/_taskbar.min.css";