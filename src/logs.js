const fs = require("fs");
const path = require("path");


const logFolder = 'logs';

const logFiles = [
    'commands',
];

const logFolderPath = path.join(__dirname,`../${logFolder}`);

if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath);
}

for (const file of logFiles) {
    const filePath = path.join(logFolderPath,`${file}.json`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,'{}')
    }
}