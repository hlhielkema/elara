// constructor: ToolbarSeperator
function ToolbarSeperator() {

}

ToolbarSeperator.prototype.construct = function () {
    const seperator = document.createElement('div');
    seperator.className = 'elara-seperator';
    return seperator;
};

ToolbarSeperator.prototype.close = function () {
    // Do nothing
};

export default ToolbarSeperator;
