function ComplexValue(value) {
    var self = this;
    self.value = value;
    self.unit = null;
    self.number = null;

    if (Number.isInteger(value)) {
        self.unit = 'px';
        self.number = value;
    }
    else if (Number(value) === value && value % 1 !== 0) { // = float
        self.unit = 'px';
        self.number = Math.floor(value);
    }
    else if (value.endsWith('px')) {
        self.unit = 'px';
        self.number = +value.substring(0, value.length - 2);
    }
    else if (value.endsWith('%')) {
        self.unit = '%';
        self.number = +value.substring(0, value.length - 1);
    }
    else {
        throw 'Invalid value';
    }

    self.raw = function () {
        return self.value;
    }

    self.getPx = function () {
        if (self.unit === 'px') {
            return self.number;
        }
        else {
            throw 'The value does not have the unit: px.';
        }
    }
}

// constructor: Vector2
function Vector2(x, y) {
    var self = this;
    self.x = x;
    self.y = y;        
}

// constructor: Vector3
function Vector3(x, y, z) {
    var self = this;
    self.x = x;
    self.y = y;
    self.z = z;
}