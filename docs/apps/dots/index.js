// Options
var dotStyle = 'circle'; // 'circle' or 'rect'
var edgeMethod = 'round' // "ceil", "floor" or "round"
var colors = [ '#55007F', '#FF007F', '#305D87', '#D2A700', '#55FFFF', '#C000C0', '#247B68', '#CFD8DC' ];
var dotWidth = 6;
var dotHeight = 6;
var dotMarginX = 6;
var dotMarginY = 6;
var scale = 3;
var tresholdMultiplier = 0.6; // Visible threshold. Default = 0.8; Set to 10000 to show all dots.
var excludeRange = 4; // Number of elements from the center that are always visible

// Render the background
function render() {    
    // Get the canvas element
    var canvas = document.getElementById("main");

    // Resize the canvas to fit the whole window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get the render context
    var ctx = canvas.getContext("2d");

    // Get the total widht and height from the canvas
    var totalWidth = canvas.width;
    var totalHeight = canvas.height;
    
    // Calculate the number of items that fit on the x and y axis
    var countX = Math.floor((totalWidth + dotMarginX) / (dotWidth + dotMarginX));
    var countY = Math.floor((totalHeight + dotMarginY) / (dotHeight + dotMarginY));

    // Calculate the center X and Y
    var centerX = Math.round(countX / 2);
    var centerY = Math.round(countY / 2);    
    
    // Calculate the maximal possible distance from the center
    var maxDist = Math.sqrt((centerX * centerX) + (centerY * centerY));
     
    for (var x = 0; x < countX; x++) {            
        for (var y = 0; y < countY; y++) {        
            // Calculate the distance from the center
            var dist = Math.sqrt(Math.pow(Math.abs(centerX - x), 2) + Math.pow(Math.abs(centerY - y), 2));            

            // Determine if the dot should be visible
            var show = true;
            if (dist >= excludeRange) {                   
                if (maxDist === dist) {
                    dist -= 0.1;
                }   
                var treshold = ((maxDist - dist) / maxDist) * tresholdMultiplier;                                             
                show = Math.random() < treshold;             
            }         

            if (show) {                
                // Determine which color to use from the color array
                var color = colors[+Math[edgeMethod]((dist % (colors.length * scale)) / scale)]                
    
                // Calculate the target 
                var xCoor = (x * (dotWidth + dotMarginX)) + dotMarginX;
                var yCoor = (y * (dotHeight + dotMarginY)) + dotMarginY;            
                    
                // Set the fill style
                ctx.fillStyle = color;

                if (dotStyle === 'rect') {
                    // Draw the rectangle
                    ctx.fillRect(xCoor, yCoor, dotWidth, dotHeight);
                }
                else if (dotStyle === 'circle') {
                    // Draw the circle
                    ctx.beginPath();
                    ctx.arc(xCoor, yCoor, dotWidth / 2, 0, 2 * Math.PI);
                    ctx.fill();
                }                
            }
        }

    }
}

// Render the background
render();

// Render the background again when the size of the contain window changes
window.addEventListener('resize', render, false);

// Render every 300ms
setInterval(render, 300);