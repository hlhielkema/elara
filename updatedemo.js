const fs = require('fs');
const path = require('path');
const ncp = require('ncp');

function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

// Delete the docs directory
deleteFolderRecursive('docs');

// Create the docs and dist directory
fs.mkdirSync('docs');
fs.mkdirSync('docs/dist');

// Copy shared demo files
ncp.ncp('demo/shared', 'docs', (err) => {
    if (err) {
        throw err;
    }
});

// Copy dist files
ncp.ncp('dist', 'docs/dist', (err) => {
    if (err) {
        throw err;
    }
});
