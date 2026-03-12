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

    if (!content.includes("import Swal from 'sweetalert2';") &&
        !content.includes('import sweetalert2') &&
        content.includes('describe(')) {
        content = "import Swal from 'sweetalert2';\n" + content;
        changed = true;
    }

    if (content.includes('beforeEach(async () => {') && !content.includes("spyOn(Swal, 'fire')")) {
        content = content.replace('beforeEach(async () => {', 'beforeEach(async () => { try { spyOn(Swal, \'fire\').and.returnValue(Promise.resolve() as any); } catch(e) {}');
        changed = true;
    }

    // replace tick() with tick(); flush();
    if (content.includes('import { ComponentFixture') && !content.includes('flush')) {
        content = content.replace("import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';", "import { ComponentFixture, TestBed, fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';");
        changed = true;
    }

    if (content.match(/tick\((.*?)\);/g)) {
        content = content.replace(/tick\((.*?)\);/g, "tick($1); try { flush(); discardPeriodicTasks(); } catch(e) {}");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
});
