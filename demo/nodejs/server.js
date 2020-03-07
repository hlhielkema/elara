const fs = require('fs'), 
      http = require('http'),
      path = require('path');

// Settings
const hostname = '127.0.0.1';
const port = 3000;
const logNotFound = false;
const logUnkownMimeType = false;

// Construct the disk paths
const demoPath = path.normalize(path.join(__dirname, '..'));
const sharedPath = path.normalize(path.join(demoPath, 'shared'));
const distPath =  path.normalize(path.join(demoPath, '..', 'dist'));
const indexPath = path.join(sharedPath, 'index.html');

// Construct the /dist/ url prefix
const distPathPrefix = path.sep + 'dist' + path.sep;

// MIME-type look-up table
const mimeTypeTable = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
};

// Log the paths
console.log();
console.log('Routes:')
console.log('"/"       ->: ' + indexPath);
console.log('"/dist/*" ->: ' + distPath);
console.log('"/*"      ->: ' + sharedPath);
console.log();

// Determine the filename from the URL
function resolvePath(url) {    
    // Redirect the base URL to the index file
    if (url === '/') {
        return indexPath;
    }

    // Replace "/"" by "\" on Window
    var filename = path.normalize(url);
    if (path.sep !== '/') {        
        filename = filename.split('/').join(path.sep);        
    }

    // Redirect /dist/* requests to the dist directory where elara is stored.
    if (filename.startsWith(distPathPrefix)) {
        return path.join(distPath, filename.substring(distPathPrefix.length - 1));
    }  

    // Redirect all other file to the shared directory
    return path.join(sharedPath, filename);
}

// Get the MIME-type for the filename
function getMimeType(filename) {
    // Get the extension from the filename as lowercase
    var ext = path.extname(filename).toLowerCase();    

    // Try to fetch the MIME-type from the look-up table
    if (ext in mimeTypeTable) {
        return mimeTypeTable[ext];
    }

    // Optional: log the not found error
    if (logUnkownMimeType) {
        console.log('Error: no MIME-type found for extension: ' + ext);                
    }

    // Fallback to "text/plain"
    return 'text/plain';    
}

const server = http.createServer((req, res) => {   
    // Get the filename for the URL
    const filename = resolvePath(req.url);

    fs.readFile(filename, function (err, data) {    
        if (err) {

            // Optional: log the not found error
            if (logNotFound) {
                console.log('[404] Error: file not found');
                console.log('- URL: ' + req.url);
                console.log('- Filename: ' + filename);

                // Debug with:
                // console.log(JSON.stringify(err))
            }

            // Write a 404 error
            res.writeHead(404);
            res.end('Content not found');

            return;
        }

        // Write the content type (MIME-type)
        res.setHeader("Content-Type", getMimeType(filename));

        // Status = OK (200)
        res.writeHead(200);

        // Write the file data
        res.end(data);
    });
});

server.listen(port, hostname, () => {
  console.log(`Elara demo server running at http://${hostname}:${port}/`);
  console.log();
});