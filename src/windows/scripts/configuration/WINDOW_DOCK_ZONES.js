// Window docking suggestion zones (in order).
// The name should match a area defined in WINDOW_SNAP_AREAS(WINDOW_SNAP_AREAS.js).
const WINDOW_DOCK_ZONES = [
    {
        left: 0,
        right: 1,
        top: 0,
        bottom: 1,
        name: 'top-left',
    },
    {
        left: 99,
        right: 100,
        top: 0,
        bottom: 1,
        name: 'top-right',
    },
    {
        left: 0,
        right: 1,
        top: 99,
        bottom: 100,
        name: 'bottom-left',
    },
    {
        left: 99,
        right: 100,
        top: 99,
        maxY: 100,
        name: 'bottom-right',
    },
    {
        left: 0,
        right: 100,
        top: 0,
        bottom: 1,
        name: 'fullscreen',
    },
    {
        left: 0,
        right: 1,
        top: 0,
        bottom: 100,
        name: 'left',
    },
    {
        left: 99,
        right: 100,
        top: 0,
        bottom: 100,
        name: 'right',
    },
    {
        left: 0,
        right: 100,
        top: 99,
        bottom: 100,
        name: 'bottom',
    },
];

export default WINDOW_DOCK_ZONES;
