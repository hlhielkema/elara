// constructor: ToolbarSeperator
function ToolbarSeperator() {

}

ToolbarSeperator.prototype.construct = function construct() {
    const seperator = document.createElement('div');
    seperator.className = 'elara-seperator';
    return seperator;
};

ToolbarSeperator.prototype.close = function close() {
    // Do nothing
};

export default ToolbarSeperator;
