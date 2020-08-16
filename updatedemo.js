const fs = require('fs');

function copyFile(from, to) {
    fs.copyFile(from, to, (err) => {
        if (err) {
            throw err;
        }

        // eslint-disable-next-line no-console
        console.log(`${from} was copied to ${to}`);
    });
}

copyFile('dist/elara.js', 'docs/dist/elara.js');
copyFile('dist/elara.css', 'docs/dist/elara.css');
