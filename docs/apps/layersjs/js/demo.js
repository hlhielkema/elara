
function bindButtons(buttonQuery, callback)
{
    var buttons = document.querySelectorAll(buttonQuery);
    for (var i = 0; i < buttons.length; i++) {
        let button = buttons[i];        
        button.addEventListener('click', function() {
            updateActiveButton(buttonQuery, button);
            var value = button.dataset.value;
            callback(value);            
        });
    }
}

function updateActiveButton(buttonQuery, button) {
    var buttons = document.querySelectorAll(buttonQuery);
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] == button) {
            // Add the "active" class
            if (!buttons[i].classList.contains('active')) {
                buttons[i].classList.add('active')
            }
        }
        else {
            // Remove the "active" class
            if (buttons[i].classList.contains('active')) {
                buttons[i].classList.remove('active')
            }
        }
    }
}

var layersJs = new LayersJs('.layers-container');
layersJs.updateStateGroups({
    a: {
        a: true,
        b: true,
        c: true,
        d: true,
    },
    b: {
        a: false,
        b: true,
        c: true,
        d: true,
    },
    c: {
        a: false,
        b: false,
        c: true,
        d: true,
    },
    d: {
        a: false,
        b: false,
        c: false,
        d: true,
    },
    e: {
        a: true,
        b: false,
        c: true,
        d: true,
    },
});

bindButtons('.option-buttons.visible-layers .button', function(stateGroupName) {
    layersJs.applyStateGroup(stateGroupName);        
});

bindButtons('.option-buttons.animation-mode .button', function(animationMode) {
    layersJs.updateAnimationMode(animationMode)
});

layersJs.addDivLayers('d', {
    top: '192px',
    shape: {
        decorate: shape => shape.innerText = 'D',       
    }
});

layersJs.addDivLayers('c', {
    top: '128px',
    shape: [
        {
            class: 'half',
            decorate: shape => shape.innerText = 'C1', 
            background: '#d2d1e9',
            borderBackground: '#b2b1d8'
        },
        {
            class: 'half',
            decorate: shape => shape.innerText = 'C2',            
            background: '#607D8B',
            borderBackground: '#506975'
        }
    ]
});

layersJs.addDivLayers('b', {
    top: '64px',
    shape: {
        decorate: shape => shape.innerText = 'B',
        background: '#242f65',
        borderBackground: '#17264e'
    }
});

layersJs.addDivLayers('a', {    
    shape: [
        {
            class: 'quarter',
            decorate: shape => shape.innerText = 'A1', 
            color: '#999',
            background: '#2b2c34',
            borderBackground: '#000' 
        },
        {
            class: 'quarter',
            decorate: shape => shape.innerHTML = '👽',            
            background: '#009688',
            borderBackground: '#035049' 
        },
        {
            class: 'half',
            decorate: shape => shape.innerText = 'Layers.js',            
            background: '#009688',
            borderBackground: '#035049' 
        }
    ]
});

layersJs.applyStateGroup('a');