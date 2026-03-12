const fs = require('fs');
const lines = fs.readFileSync('test_output.log', 'utf8').split('\n');
const result = [];
let capturing = false;
for (const line of lines) {
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '').replace(/\x1b\[1A\x1b\[2K/g, '');
    if (cleanLine.includes('FAILED') && !cleanLine.includes('Executed')) {
        result.push(cleanLine);
    } else if (cleanLine.startsWith('Chrome 145.0') && !cleanLine.includes('Executed')) {
        result.push(cleanLine);
    } else if (cleanLine.match(/^\s+at /) || cleanLine.match(/^Error:/) || cleanLine.match(/^Expected/)) {
        result.push(cleanLine);
    }
}
fs.writeFileSync('true_failures.txt', result.join('\n'));
