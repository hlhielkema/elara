// constructor: Rectangle
function Rectangle(x, y, width, height) {
    const self = this;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;

    self.bottom = function bottom() {
        return self.y + self.height;
    };

    self.right = function right() {
        return self.x + self.width;
    };

    self.contains = function contains(vector) {
        return vector.x >= self.x
               && vector.x <= self.right()
               && vector.y >= self.y
               && vector.y <= self.bottom();
    };
}

export default Rectangle;
