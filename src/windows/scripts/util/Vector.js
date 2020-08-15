function ComplexValue(value) {
    const self = this;
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
        throw new Error('Invalid value');
    }

    self.raw = function raw() {
        return self.value;
    };

    self.getPx = function getPx() {
        if (self.unit === 'px') {
            return self.number;
        }

        throw new Error('The value does not have the unit: px.');
    };

    self.cssValue = function cssValue() {
        return self.number + self.unit;
    };
}

// constructor: Vector2
function Vector2(x, y) {
    const self = this;
    self.x = x;
    self.y = y;
}

// constructor: Vector3
function Vector3(x, y, z) {
    const self = this;
    self.x = x;
    self.y = y;
    self.z = z;
}

export { ComplexValue, Vector2, Vector3 };
