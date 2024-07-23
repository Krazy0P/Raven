const fs = require("fs");
const path = require("path");

// Sets up files
function folderSetup(folderName, fileList, initialValue = {}) {
    const logFolderPath = path.join(__dirname, `../${folderName}`);

    if (!fs.existsSync(logFolderPath)) {
        fs.mkdirSync(logFolderPath);
    }

    for (const file of fileList) {
        const filePath = path.join(logFolderPath, `${file}.json`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(initialValue,null,2));
        }
    }
}

folderSetup(
    folderName = "logs", 
    fileList = [
        "commands"
    ]
);

folderSetup(
    folderName = "data", 
    files = [
        "user"
    ]
);
