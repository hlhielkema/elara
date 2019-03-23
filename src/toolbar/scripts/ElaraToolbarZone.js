// constructor: ElaraToolbarZone
function ElaraToolbarZone(name) {
    this.name = name;
    this.dataSource = null;
}

ElaraToolbarZone.prototype.getMenus = function() {
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

ElaraToolbarZone.prototype.setDataSource = function(dataSource) {
    this.dataSource = dataSource;
}
