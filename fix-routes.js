const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('spec.ts')) {
            callback(path.join(dir, f));
        }
    });
}

walkDir('src/app', function (filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('provideRouter([])')) {
        content = content.replace(/provideRouter\(\[\]\)/g, "provideRouter([{ path: '**', redirectTo: '' }])");
        fs.writeFileSync(filePath, content);
    }
});
