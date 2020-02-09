// constructor: ToolbarZone
function ToolbarZone(name) {
    this.name = name;
    this.dataSource = null;
}

ToolbarZone.prototype.getMenus = function() {
    if (this.dataSource === null) {
        return [
            {
                title: '[' + this.name + ']',
                items: [ ]
            }
        ];
    }    
    else {
        return this.dataSource();
    }
};

ToolbarZone.prototype.setDataSource = function(dataSource) {
    this.dataSource = dataSource;
}

export default ToolbarZone;