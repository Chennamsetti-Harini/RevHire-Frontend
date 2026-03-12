const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('spec.ts')) {
            callback(dirPath);
        }
    });
}

walkDir('src/app', function (filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('isEmployer: signal(')) {
        content = content.replace(/isEmployer: signal\((false|true)\)/g, "isEmployer: () => $1");
        changed = true;
    }

    if (content.includes('isJobSeeker: signal(')) {
        content = content.replace(/isJobSeeker: signal\((false|true)\)/g, "isJobSeeker: () => $1");
        changed = true;
    }

    // also fix register countdown timer
    if (filePath.includes('register.component.spec.ts')) {
        content = content.replace('describe(\'countdown timer\', () => {', 'describe(\'countdown timer\', () => { \n beforeEach(() => { jasmine.clock().uninstall(); jasmine.clock().install(); }); \n afterEach(() => { jasmine.clock().uninstall(); });');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
});
