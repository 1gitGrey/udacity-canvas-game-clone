var Scenario = function(level) {

    var sceneMap = level.split(':');

    this.W = parseInt(sceneMap[0]);
    this.H = parseInt(sceneMap[1]);
    this.lanes = [];
    var laneMap = sceneMap[2].split(',');
    for (var i = 0; i < laneMap.length; i++) {
        this.lanes.push(parseInt(laneMap[i]))
    }
    this.components = sceneMap[3];

    if (sceneMap.length > 4) {
        this.allItems = sceneMap[4];
        this.initItems = this.allItems;

    }
};


Scenario.prototype.getComponent = function(row, col) {
    return this.components.charAt(row * this.W + col);

}



Scenario.prototype.setComponent = function(row, col, newComponent) {
    var index = row * this.W + col;
    this.components = this.components.substring(0, index) + newComponent + this.components.substring(index + 1);

}



Scenario.prototype.getItem = function(row, col) {
    return this.allItems === undefined ? Item.None : this.allItems.charAt(row * this.W + col);
};


Scenario.prototype.setItem = function(row, col, newItem) {
    if (this.allItems === undefined) {
        this.allItems = '';
        for (var i = 0; i < this.components.length; i++) {
            this.allItems += 'n';
        }
    }
    var index = row * this.W + col;
    this.allItems = this.allItems.substring(0, index) + newItem + this.allItems.substring(index + 1);
}



Scenario.prototype.delItem = function(row, col) {
    this.setItem(row, col, Item.None);

};

Scenario.prototype.resetItem = function() {
    this.allItems = this.initItems;

}
