// Window snap areas
const WINDOW_SNAP_AREAS = {
    fullscreen: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    'top-left': {
        top: 0,
        left: 0,
        width: '50%',
        height: '50%',
    },
    'top-right': {
        top: 0,
        left: '50%',
        width: '50%',
        height: '50%',
    },
    'bottom-left': {
        top: '50%',
        left: 0,
        width: '50%',
        height: '50%',
    },
    'bottom-right': {
        top: '50%',
        left: '50%',
        width: '50%',
        height: '50%',
    },
    left: {
        top: 0,
        left: 0,
        width: '50%',
        height: '100%',
    },
    right: {
        top: 0,
        left: '50%',
        width: '50%',
        height: '100%',
    },
    top: {
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
    },
    bottom: {
        top: '50%',
        left: 0,
        width: '100%',
        height: '50%',
    },
};

export default WINDOW_SNAP_AREAS;
