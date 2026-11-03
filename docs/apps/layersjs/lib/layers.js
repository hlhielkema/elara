// layers.js
// Author: Hielke Hielkema
// Contact: hielkehielkema93@gmail.com

// constructor: LayersJs
function LayersJs(containerSelector) {
    this.containerSelector = containerSelector;
    this.stateGroups = null;
}

// Apply the states to a set of layers
LayersJs.prototype.applyStates = function(states) {
    // Query the layers
    // Layers can be <img> or <div.layer>
    var layers = document.querySelectorAll(this.containerSelector + '> img, ' + this.containerSelector + '> .layer');

    // Loop through the layers
    for (var i = 0; i < layers.length; i++) {

        // Get the layer id from the "data-layer" attribute.
        var layerId = layers[i].dataset.layer;

        // Determine if the layer should be visible
        var visible = states[layerId] === true;

        // Update the visible state for the layer
        this.updateClass(layers[i], 'visible', visible);
    }
};

// Update if a class is in the class list of an element.
LayersJs.prototype.updateClass = function(element, className, enabled) {
    if (enabled) {
        // Add the class
        if (!element.classList.contains(className)) {
            element.classList.add(className)
        }
    }
    else {
        // Remove the class
        if (element.classList.contains(className)) {
            element.classList.remove(className)
        }   
    }
};

// Update the state groups
LayersJs.prototype.updateStateGroups = function (stateGroups) {
    this.stateGroups = stateGroups;
};

// Update the states of a state group
LayersJs.prototype.applyStateGroup = function (stateGroupName) {
    // Retrieve the states for the state group name
    var states = this.stateGroups[stateGroupName];
    if (states === undefined) {
        throw '[Layers.js] State group with name \"' + stateGroupName + '\" is not found.';
    }        

    // Apply the states
    this.applyStates(states);
};

// Get the build-in animation modes
LayersJs.prototype.getAnimationModes = function() {
    return [
        'fade-down',
        'fade-right',
        'fade-up',
        'fade-left',
        'fade',
        'none'
    ];
};

// Update the animation mode
LayersJs.prototype.updateAnimationMode = function (animationMode) {
    // Animation modes are set using a "animation-*"" class.
    // This method will remove all old animation classes and add the new one.
    // The name of the animation class will be the animation mode name with a "animation-" prefix.

    // Get the class list of the layers container
    var container = document.querySelector(this.containerSelector);
    var classList = container.classList;

    // Loop through the classes
    for (var i = 0; i < classList.length; i++) {
        var className = classList[i];

        // Remove the class if it starts with 'animate-', which is the prefix for animation classes
        if (className.indexOf('animate-') === 0) {
            classList.remove(className);
            i--;
        }
    }

    // Add the new animation mode class
    classList.add('animate-' + animationMode);
};

// Add an image layer
LayersJs.prototype.addImageLayer = function(id, src) {
    // Create the element    
    var img = document.createElement('img');
    img.dataset.layer = id;
    img.src = src;

    // Append the new element to the container
    document.querySelector(this.containerSelector).appendChild(img);
}

// Add a div layer
LayersJs.prototype.addDivLayers = function(id, options) {
    // Create the element    
    var layer = document.createElement('div');
    layer.dataset.layer = id;
    layer.classList.add('layer');
    
    if (typeof(options) === 'object' &&  options.shape !== undefined) {        
        // Create the container for the shape
        var shapeContainer = document.createElement('div');
        shapeContainer.classList.add('generated-shape-container');

        // Render the box shape and add it to the container
        this.renderShape(options.shape, shapeContainer);

        // Option: distance from top
        if (options.top !== undefined && options.top !== null) {
            shapeContainer.style.marginTop = options.top;
        }

        // Add the shape container to the layer element
        layer.appendChild(shapeContainer);
    }

    // Append the new element to the container
    document.querySelector(this.containerSelector).appendChild(layer);

    // Return the div of the new layer.
    return layer;
}

// Render the box shape for a layer
LayersJs.prototype.renderShape = function(shapeOptions, containerElement) {    
    if (Array.isArray(shapeOptions)) {
        // Create multiple shapes if options is an array
        for (var i = 0; i < shapeOptions.length; i++) {
            this.renderShape(shapeOptions[i], containerElement);    
        }
    }
    else {
        // Create the element
        var shape = document.createElement('div');
        shape.classList.add('generated-shape');

        // Option:  Allow adding a class from the options
        if (typeof shapeOptions.class === 'string') {
            shape.classList.add(shapeOptions.class);
        }
    
        // Option: Allow changing the element from the options
        if (typeof shapeOptions.decorate === 'function') {
            shapeOptions.decorate(shape);
        }        

        // Option: background (color)
        if (typeof shapeOptions.background === 'string') {
            shape.style.background = shapeOptions.background;            
        }

        // Option: color
        if (typeof shapeOptions.color === 'string') {
            shape.style.color = shapeOptions.color;            
        }

        // Create the border elements
        var borderBottom = document.createElement('div');
        var borderLeft = document.createElement('div');    

        // Add the classes for the border elements
        borderBottom.classList.add('border', 'border-bottom');
        borderLeft.classList.add('border', 'border-left');    

        // Add the border elements
        shape.appendChild(borderBottom);
        shape.appendChild(borderLeft);

        // Option: border background (color)
        if (typeof shapeOptions.borderBackground === 'string') {
            borderBottom.style.background = shapeOptions.borderBackground;            
            borderLeft.style.background = shapeOptions.borderBackground;            
        }

        // Append the new shape to the container
        containerElement.appendChild(shape);
    }   
}